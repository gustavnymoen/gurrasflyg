import { localNow } from "../lib/flight-rules";
import { daysFromToday } from "./helpers";
import { inTestDb } from "./plan";

// Bookings for the tests of Min bokning (TRIP-023), written straight into the
// test database (npm run test:local) instead of booked through the pages, which
// would take far longer. Each seed has numbers and names of its own, and
// removeSeed deletes it (the bookings, and with them the cancellations).

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const code = () => Array.from({ length: 6 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");

export type Seed = {
  number: string;
  lastName: string;
  email: string;
  total: number;
  aircraft?: string;
};

// A departure: a date and a local time in Stockholm
export type Departure = { date: string; time: string };

// Far enough ahead to be cancelled
export const farOut: Departure = { date: daysFromToday(20), time: "07:00" };
export const farBack: Departure = { date: daysFromToday(27), time: "18:00" };

// A departure some hours from now (negative: some hours ago), in Stockholm time
export function inHours(hours: number): Departure {
  return localNow("Europe/Stockholm", new Date(Date.now() + hours * 3_600_000));
}

const contact = (seed: Pick<Seed, "lastName" | "email">) =>
  [seed.lastName, seed.email, "070-123 45 67", "Storgatan 1, 123 45 Byn"] as const;

// A flight booking with two passengers, Anna and Bo. Outbound ARN → LHR: 1 000 kr
// each, and Bo has 2 × Måltid at 120 kr (1 240 kr). Return LHR → ARN: 800 kr each.
// Total 3 840 kr.
export async function seedFlightBooking(out: Departure = farOut, back: Departure = farBack): Promise<Seed> {
  const id = `${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
  const seed: Seed = {
    number: code(),
    lastName: `Minsson${id}`,
    email: `e2e-min-${id}@exempel.se`,
    total: 1000 + 1240 + 800 + 800,
    aircraft: `E2E Plan Min ${id}`,
  };
  await inTestDb(async (db) => {
    const one = async (sql: string, args: (string | number)[] = []) => (await db.execute({ sql, args })).rows[0];
    const insert = async (sql: string, args: (string | number | null)[]) => Number((await db.execute({ sql, args })).lastInsertRowid);
    const economy = Number((await one("SELECT id FROM classes WHERE name = 'Ekonomi'")).id);
    const route = async (from: string, to: string) =>
      Number(
        (
          await one(
            `SELECT r.id FROM routes r JOIN airports f ON f.id = r.from_airport_id JOIN airports t ON t.id = r.to_airport_id
             WHERE f.iata = ? AND t.iata = ?`,
            [from, to],
          )
        ).id,
      );
    const aircraft = await insert("INSERT INTO aircraft (name) VALUES (?)", [seed.aircraft!]);
    const booking = await insert(
      `INSERT INTO bookings (booking_number, request_id, first_name, last_name, email, phone, address, payment, total)
       VALUES (?, ?, 'Cecilia', ?, ?, ?, ?, 'cash', ?)`,
      [seed.number, `e2e-min-${id}`, ...contact(seed), seed.total],
    );
    const passengers = [];
    for (const [position, name] of ["Anna", "Bo"].entries()) {
      passengers.push(
        await insert(
          "INSERT INTO booking_passengers (booking_id, position, first_name, last_name, age) VALUES (?, ?, ?, 'Testsson', 40)",
          [booking, position, name],
        ),
      );
    }
    const flights = [
      { position: 0, from: "ARN", to: "LHR", when: out, price: 1000 },
      { position: 1, from: "LHR", to: "ARN", when: back, price: 800 },
    ];
    for (const f of flights) {
      const flight = await insert(
        "INSERT INTO booking_flights (booking_id, position, route_id, date, departure_time, aircraft_id, price) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [booking, f.position, await route(f.from, f.to), f.when.date, f.when.time, aircraft, f.price],
      );
      for (const [p, passenger] of passengers.entries()) {
        const seat = await insert("INSERT INTO booking_seats (booking_flight_id, passenger_id, class_id, price) VALUES (?, ?, ?, ?)", [
          flight,
          passenger,
          economy,
          f.price,
        ]);
        if (f.position === 0 && p === 1) {
          await insert("INSERT INTO booking_addons (booking_seat_id, name, count, price) VALUES (?, 'Måltid', 2, 120)", [seat]);
        }
      }
    }
  });
  return seed;
}

// A charter booking for Anna and Bo, with two extras (1 000 kr and 2 000 kr per person), outbound 3 000 kr and
// return 2 500 kr per person: 8 500 kr each and 17 000 kr in all
export async function seedCharterBooking(outDate = farOut.date, backDate = farBack.date): Promise<Seed> {
  const id = `${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
  const seed: Seed = { number: `CH-${code()}`, lastName: `Charterman${id}`, email: `e2e-min-${id}@exempel.se`, total: 2 * 8500 };
  await inTestDb(async (db) => {
    const pair = (
      await db.execute(
        `SELECT o.id AS out, b.id AS back, d.id AS destination
         FROM charter_timetables o
         JOIN charter_timetables b ON b.from_airport = o.to_airport AND b.to_airport = o.from_airport
         JOIN destinations d ON d.nearest_airport = o.to_airport
         WHERE o.from_airport = 'ARN' LIMIT 1`,
      )
    ).rows[0];
    const insert = async (sql: string, args: (string | number | null)[]) => Number((await db.execute({ sql, args })).lastInsertRowid);
    const booking = await insert(
      `INSERT INTO charter_bookings (booking_number, request_id, destination_id, first_name, last_name, email, phone, address, payment, total)
       VALUES (?, ?, ?, 'Cecilia', ?, ?, ?, ?, 'collect', ?)`,
      [seed.number, `e2e-min-${id}`, String(pair.destination), ...contact(seed), seed.total],
    );
    for (const [position, name] of ["Anna", "Bo"].entries()) {
      await insert("INSERT INTO charter_booking_passengers (booking_id, position, first_name, last_name, age) VALUES (?, ?, ?, ?, 30)", [
        booking,
        position,
        name,
        "Testsson",
      ]);
    }
    await insert("INSERT INTO charter_booking_trips (booking_id, position, timetable_id, date, price) VALUES (?, 0, ?, ?, 3000)", [
      booking,
      String(pair.out),
      outDate,
    ]);
    await insert("INSERT INTO charter_booking_trips (booking_id, position, timetable_id, date, price) VALUES (?, 1, ?, ?, 2500)", [
      booking,
      String(pair.back),
      backDate,
    ]);
    await insert("INSERT INTO charter_booking_extras (booking_id, code, name, price) VALUES (?, 'ultimate', 'Den ultimata upplevelsen', 1000)", [booking]);
    await insert("INSERT INTO charter_booking_extras (booking_id, code, name, price) VALUES (?, 'grylls', 'Bear Grylls Experience', 2000)", [booking]);
  });
  return seed;
}

// Deletes what a seed made: the bookings (with passengers, seats and cancellations), then the aircraft
export async function removeSeed(seed: Seed) {
  await inTestDb(async (db) => {
    await db.execute({ sql: "DELETE FROM bookings WHERE email = ?", args: [seed.email] });
    await db.execute({ sql: "DELETE FROM charter_bookings WHERE email = ?", args: [seed.email] });
    if (seed.aircraft) await db.execute({ sql: "DELETE FROM aircraft WHERE name = ?", args: [seed.aircraft] });
  });
}
