import "server-only";
import { connection } from "next/server";
import { type AddonRow, type BookingLeg, bookingLegs } from "./booking-rules";
import { type Airport, all, type Executor } from "./db";
import { cheapestFare, type FleetAircraft } from "./fare-rules";
import { type Flight, flightNumber, hasLeft, localNow } from "./flight-rules";
import { type Params, parseSearch, type Search } from "./search";
import { type LegChoice, parseLegs } from "./trip";

type Row = {
  routeId: number;
  time: string;
  price: number;
  routeMinutes: number;
  fromTimezone: string;
  toTimezone: string;
  fromIata: string;
  fromName: string;
  fromCity: string;
  fromCountry: string;
  toIata: string;
  toName: string;
  toCity: string;
  toCountry: string;
};

// Sökningens två flygplatser, för sökformuläret på resultatsidan. null om någon inte finns.
export async function getAirportPair(from: string, to: string) {
  await connection();
  const airports = await all<Airport & { city: string }>(
    "SELECT id, name, iata, country, timezone, city FROM airports WHERE iata = ? OR iata = ?",
    [from, to],
  );
  const find = (iata: string) => airports.find((a) => a.iata === iata);
  const [fromAirport, toAirport] = [find(from), find(to)];
  return fromAirport && toAirport ? { from: fromAirport, to: toAirport } : null;
}

// Rutten mellan två flygplatser flygs vid samma tider varje dag (TRIP-010-R4).
// Avgångar som redan gått (lokal tid på avgångsflygplatsen) tas bort. "Från"-
// priset är det billigaste med ett plan som har plats för alla resenärer
// (TRIP-011-R9); finns inget sådant plan är det avgångens pris.
export async function findFlights(
  from: string,
  to: string,
  date: string,
  travellers: number,
  fleet: FleetAircraft[],
  now = new Date(),
): Promise<Flight[]> {
  await connection();
  const rows = await all<Row>(
    `SELECT r.id AS routeId, d.departure_time AS time, d.price, r.duration_minutes AS routeMinutes,
            f.timezone AS fromTimezone, t.timezone AS toTimezone,
            f.iata AS fromIata, f.name AS fromName, f.city AS fromCity, f.country AS fromCountry,
            t.iata AS toIata, t.name AS toName, t.city AS toCity, t.country AS toCountry
     FROM routes r
     JOIN airports f ON f.id = r.from_airport_id
     JOIN airports t ON t.id = r.to_airport_id
     JOIN route_departures d ON d.route_id = r.id
     WHERE f.iata = ? AND t.iata = ?
     ORDER BY d.departure_time`,
    [from, to],
  );
  if (rows.length === 0) return [];
  const local = localNow(rows[0].fromTimezone, now);
  return rows
    .map((r, i) => ({
      id: `${r.routeId}-${r.time}`,
      // Numret räknas före de avgångar som gått tas bort, så det är samma hela dagen.
      // Det ändras om rutten får fler eller färre avgångar: peka ut ett flyg med rutt och tid, inte numret.
      number: flightNumber(r.routeId, i + 1),
      date,
      time: r.time,
      price: r.price,
      fromPrice: cheapestFare(fleet, travellers, r.price) ?? r.price,
      routeMinutes: r.routeMinutes,
      from: { iata: r.fromIata, name: r.fromName, city: r.fromCity, country: r.fromCountry, timezone: r.fromTimezone },
      to: { iata: r.toIata, name: r.toName, city: r.toCity, country: r.toCountry, timezone: r.toTimezone },
    }))
    .filter((flight) => !hasLeft(flight, local));
}

// Alla plan med sina klasser, billigaste klassen först, för att välja plan och
// klasser (TRIP-011). Ett plan utan klasser går inte att flyga med och tas inte med.
export async function listFleet(): Promise<FleetAircraft[]> {
  await connection();
  return readFleet();
}

// Som listFleet, och också i en transaktion (bokningen, TRIP-012-R8)
export async function readFleet(ex?: Executor): Promise<FleetAircraft[]> {
  // Efter varandra, inte samtidigt: en transaktion kör en fråga i taget
  const aircraft = await all<Omit<FleetAircraft, "classes">>(
    "SELECT id, name, price_percent AS pricePercent, time_percent AS timePercent FROM aircraft ORDER BY name",
    [],
    ex,
  );
  const classes = await all<{ aircraftId: number; id: number; name: string; capacity: number; pricePercent: number }>(
    `SELECT ac.aircraft_id AS aircraftId, c.id, c.name, ac.capacity, c.price_percent AS pricePercent
     FROM aircraft_capacity ac JOIN classes c ON c.id = ac.class_id
     ORDER BY c.price_percent, c.id`,
    [],
    ex,
  );
  return aircraft
    .map((a) => ({
      ...a,
      classes: classes
        .filter((c) => c.aircraftId === a.id)
        .map(({ id, name, capacity, pricePercent }) => ({ id, name, capacity, pricePercent })),
    }))
    .filter((a) => a.classes.length > 0);
}

// Tilläggen som går att köpa i varje klass på planen, för bokningen (TRIP-012-R3)
export async function readAddons(aircraftIds: number[], ex?: Executor): Promise<AddonRow[]> {
  return all<AddonRow>(
    `SELECT aca.aircraft_id AS aircraftId, aca.class_id AS classId, a.id, a.name, a.description, a.price
     FROM aircraft_class_addons aca JOIN addons a ON a.id = aca.addon_id
     WHERE aca.aircraft_id IN (SELECT value FROM json_each(?))
     ORDER BY a.name`,
    [JSON.stringify(aircraftIds)],
    ex,
  );
}

// Resan i adressen efter sökningen (TRIP-011, TRIP-012): sökningen, valen och
// de valda avgångarna och planen från databasen. Priserna och tiderna räknas
// alltid från databasen, aldrig från adressen.
export type Trip = { search: Search; legs: LegChoice[]; flights: Flight[]; fleet: FleetAircraft[] };

// Vad som är fel med resan i adressen: "address" när något saknas i den,
// "flight" när ett flyg inte finns eller redan har gått
export type TripProblem = { problem: "address" } | { problem: "flight"; search: Search };

export async function loadTrip(params: Params): Promise<Trip | TripProblem> {
  const search = parseSearch(params);
  const legs = search && parseLegs(params, search);
  const [airports, fleet] = search ? await Promise.all([getAirportPair(search.from, search.to), listFleet()]) : [];
  if (!search || !legs || !airports || !fleet) return { problem: "address" };

  // Utresan och hemresan
  const routes = [
    { from: search.from, to: search.to, date: search.outbound },
    { from: search.to, to: search.from, date: search.return },
  ];
  const flights = await Promise.all(
    legs.map(async (leg, i) => {
      const { from, to, date } = routes[i];
      const found = date ? await findFlights(from, to, date, search.travellers, fleet) : [];
      return found.find((f) => f.time === leg.time);
    }),
  );
  if (flights.some((f) => f === undefined)) return { problem: "flight", search };
  return { search, legs, flights: flights.filter((f) => f !== undefined), fleet };
}

// Resan för resenärerna och betalningen (TRIP-012): som loadTrip, och flygen
// med tilläggen som går att köpa i varje klass. "plan" när något flyg inte
// har ett plan eller alla inte har en klass.
export async function loadBookingTrip(
  params: Params,
): Promise<(Trip & { booking: BookingLeg[] }) | TripProblem | { problem: "plan"; trip: Trip }> {
  const trip = await loadTrip(params);
  if ("problem" in trip) return trip;
  const ids = trip.legs.flatMap((leg) => (leg.aircraftId === null ? [] : [leg.aircraftId]));
  const legs = bookingLegs(trip.search, trip.legs, trip.flights.map((f) => f.price), trip.fleet, await readAddons(ids));
  if (!legs) return { problem: "plan", trip };
  return { ...trip, booking: legs };
}
