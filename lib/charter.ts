import "server-only";
import { connection } from "next/server";
import { all, type Executor } from "./db";
import {
  type CharterChoice,
  type CharterSearch,
  type CharterTrip,
  chosenTrips,
  makeTrip,
  parseCharterSearch,
  parseChoice,
  runsOn,
  type Schedule,
  type Timetable,
} from "./charter-rules";
import { bookableRange, dateError, fromDateString } from "./dates";
import { DEPARTURE_AIRPORTS } from "./destinations";
import { localNow } from "./flight-rules";
import type { Params } from "./search";
import { getDestinationAirport } from "./travel";

// Datumen räknas i Sverige och Danmark, som har samma tid
const HOME_TIMEZONE = "Europe/Stockholm";

type Row = {
  id: string;
  airline: string;
  validFrom: string;
  validTo: string;
  departs: string;
  minutes: number;
  price: number;
  fromIata: string;
  fromCity: string;
  fromTimezone: string;
  toIata: string;
  toCity: string;
  toTimezone: string;
};

type Part = { timetable_id: string; value: string };

// Alla tidtabeller mellan två flygplatser, med veckodagar, flightnummer och
// byten. Ett fåtal rader per rutt; vilka som går en viss dag avgör runsOn (TRIP-014-R2, R3).
export async function readTimetables(from: string, to: string, ex?: Executor): Promise<Timetable[]> {
  const route = [from, to];
  // Efter varandra, inte samtidigt: en transaktion kör en fråga i taget
  const rows = await all<Row>(
    `SELECT t.id, t.airline, t.valid_from AS validFrom, t.valid_to AS validTo, t.departs,
            t.duration_minutes AS minutes, t.price,
            f.iata AS fromIata, f.city AS fromCity, f.timezone AS fromTimezone,
            a.iata AS toIata, a.city AS toCity, a.timezone AS toTimezone
     FROM charter_timetables t
     JOIN charter_airports f ON f.iata = t.from_airport
     JOIN charter_airports a ON a.iata = t.to_airport
     WHERE t.from_airport = ? AND t.to_airport = ?
     ORDER BY t.departs, t.id`,
    route,
    ex,
  );
  const ofRoute = "timetable_id IN (SELECT id FROM charter_timetables WHERE from_airport = ? AND to_airport = ?)";
  const days = await all<Part>(
    `SELECT timetable_id, weekday AS value FROM charter_timetable_days WHERE ${ofRoute}`, // nosemgrep: semgrep.sql-built-from-text
    route,
    ex,
  );
  const flights = await all<Part>(
    `SELECT timetable_id, flight_number AS value FROM charter_timetable_flights WHERE ${ofRoute} ORDER BY position`, // nosemgrep: semgrep.sql-built-from-text
    route,
    ex,
  );
  const stops = await all<Part & { city: string; timezone: string }>(
    `SELECT s.timetable_id, s.airport AS value, a.city, a.timezone
     FROM charter_timetable_stops s JOIN charter_airports a ON a.iata = s.airport
     WHERE s.${ofRoute} ORDER BY s.position`, // nosemgrep: semgrep.sql-built-from-text
    route,
    ex,
  );
  const by = <T extends Part>(list: T[]) => Map.groupBy(list, (p) => p.timetable_id);
  const [daysOf, flightsOf, stopsOf] = [by(days), by(flights), by(stops)];
  return rows.map((r) => ({
    id: r.id,
    airline: r.airline,
    flights: (flightsOf.get(r.id) ?? []).map((f) => f.value),
    from: { iata: r.fromIata, city: r.fromCity, timezone: r.fromTimezone },
    to: { iata: r.toIata, city: r.toCity, timezone: r.toTimezone },
    stops: (stopsOf.get(r.id) ?? []).map((s) => ({ iata: s.value, city: s.city, timezone: s.timezone })),
    validFrom: r.validFrom,
    validTo: r.validTo,
    days: (daysOf.get(r.id) ?? []).map((d) => d.value),
    departs: r.departs,
    minutes: r.minutes,
    price: r.price,
  }));
}

// Resorna som går en dag och inte har avgått än (R3), tidigast först
export async function findTrips(from: string, to: string, date: string, now: Date, ex?: Executor): Promise<CharterTrip[]> {
  const timetables = await readTimetables(from, to, ex);
  return timetables
    .filter((t) => runsOn(t, date))
    .map((t) => makeTrip(t, date))
    .filter((t) => t.departsAt > now.getTime());
}

export type CharterData = {
  destination: { id: string; title: string; airport: string };
  search: CharterSearch;
  out: CharterTrip[];
  back: CharterTrip[];
  // De valda resorna som finns och passar ihop (R5)
  choice: CharterChoice;
  outbound: CharterTrip | undefined;
  home: CharterTrip | undefined;
};

// Sökningen och valen kontrollerade mot databasen: datumen går att boka och
// resorna den dagen är de som går (TRIP-014-R1, R3, R5). null när datumen inte går att boka.
export async function readCharter(
  destination: CharterData["destination"],
  search: CharterSearch,
  choice: CharterChoice,
  now: Date,
  ex?: Executor,
): Promise<CharterData | null> {
  const range = bookableRange(fromDateString(localNow(HOME_TIMEZONE, now).date));
  if (dateError(search.outbound, range) || dateError(search.return, range, search.outbound)) return null;
  const [out, back] = [
    await findTrips(search.from, destination.airport, search.outbound, now, ex),
    await findTrips(destination.airport, search.from, search.return, now, ex),
  ];
  const { outbound, home } = chosenTrips(choice, out, back);
  return {
    destination,
    search,
    out,
    back,
    choice: { out: outbound?.id ?? null, back: home?.id ?? null },
    outbound,
    home,
  };
}

// Sidans sökning och val ur adressen. "address" när något saknas eller är fel,
// eller resmålet inte har några flyg (R1).
export async function loadCharter(id: string, params: Params): Promise<CharterData | { problem: "address" }> {
  // Klockan läses när någon frågar, inte när sidan byggs
  await connection();
  const now = new Date();
  const search = parseCharterSearch(params);
  const destination = search ? await getDestinationAirport(id) : null;
  const data = search && destination ? await readCharter(destination, search, parseChoice(params), now) : null;
  return data ?? { problem: "address" };
}

// Dagarna resorna går för varje avgångsflygplats till och från resmålets flygplats,
// för datumväljaren i sökformuläret (TRIP-014-R2)
export type Schedules = Record<string, { out: Schedule[]; back: Schedule[] }>;

export async function getSchedules(airport: string): Promise<Schedules> {
  const pick = ({ validFrom, validTo, days }: Timetable): Schedule => ({ validFrom, validTo, days });
  const entries = await Promise.all(
    DEPARTURE_AIRPORTS.map(async (from) => {
      const [out, back] = await Promise.all([readTimetables(from, airport), readTimetables(airport, from)]);
      return [from, { out: out.map(pick), back: back.map(pick) }] as const;
    }),
  );
  return Object.fromEntries(entries);
}
