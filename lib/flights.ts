import "server-only";
import { connection } from "next/server";
import { type Airport, all } from "./db";
import { type Flight, flightNumber, hasLeft, localNow } from "./flight-rules";

type Row = {
  routeId: number;
  time: string;
  price: number;
  timezone: string;
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
// Avgångar som redan gått (lokal tid på avgångsflygplatsen) tas bort.
export async function findFlights(from: string, to: string, date: string, now = new Date()): Promise<Flight[]> {
  await connection();
  const rows = await all<Row>(
    `SELECT r.id AS routeId, d.departure_time AS time, d.price, f.timezone,
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
  const local = localNow(rows[0].timezone, now);
  return rows
    .map((r, i) => ({
      id: `${r.routeId}-${r.time}`,
      // Numret räknas före de avgångar som gått tas bort, så det är samma hela dagen.
      // Det ändras om rutten får fler eller färre avgångar: peka ut ett flyg med rutt och tid, inte numret.
      number: flightNumber(r.routeId, i + 1),
      date,
      time: r.time,
      price: r.price,
      from: { iata: r.fromIata, name: r.fromName, city: r.fromCity, country: r.fromCountry },
      to: { iata: r.toIata, name: r.toName, city: r.toCity, country: r.toCountry },
    }))
    .filter((flight) => !hasLeft(flight, local));
}
