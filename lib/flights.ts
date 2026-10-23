import "server-only";
import { connection } from "next/server";
import { type Airport, all } from "./db";
import { cheapestFare, type FleetAircraft } from "./fare-rules";
import { type Flight, flightNumber, hasLeft, localNow } from "./flight-rules";

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
  const [aircraft, classes] = await Promise.all([
    all<Omit<FleetAircraft, "classes">>(
      "SELECT id, name, price_percent AS pricePercent, time_percent AS timePercent FROM aircraft ORDER BY name",
    ),
    all<{ aircraftId: number; id: number; name: string; capacity: number; pricePercent: number }>(
      `SELECT ac.aircraft_id AS aircraftId, c.id, c.name, ac.capacity, c.price_percent AS pricePercent
       FROM aircraft_capacity ac JOIN classes c ON c.id = ac.class_id
       ORDER BY c.price_percent, c.id`,
    ),
  ]);
  return aircraft
    .map((a) => ({
      ...a,
      classes: classes
        .filter((c) => c.aircraftId === a.id)
        .map(({ id, name, capacity, pricePercent }) => ({ id, name, capacity, pricePercent })),
    }))
    .filter((a) => a.classes.length > 0);
}
