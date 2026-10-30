import { afterAll, beforeAll, beforeEach, expect, test } from "vitest";
import { openUnitDb, queryUnitDb } from "../db/test-db";
import type { CharterBooking, FlightBooking } from "./cancel-rules";
import { unitTestDbFile } from "./local-db.mjs";

// Min bokning mot enhetstesternas egen databas (vitest.global-setup.mjs), aldrig din.
// lib/db.ts läser adressen när den importeras, så my-booking importeras först när den är satt.
// Tiden och slumptalet skickas in, så inget behöver vänta och lotteriet går att styra.
process.env.TURSO_DATABASE_URL = `file:${unitTestDbFile}`;
let mine: typeof import("./my-booking");

// 30 dagar före utresan, med god marginal till 24-timmarsregeln
const NOW = new Date("2030-01-01T12:00:00Z");
const WIN = () => 0.25;
const LOSE = () => 0.75;
const IP = "203.0.113.7";

// Flygbokningen: två passagerare och två flyg. Utresan 2030-01-10 07:00 (Stockholm), hemresan 2030-01-17 18:00.
// Platserna: 1 000 och 1 000 + 2 × Måltid 120 på utresan, 800 + Dåliga nerver 1 000 var på hemresan.
const FLIGHT = { number: "UNIT23", lastName: "Testsson", total: 1000 + 1240 + 1800 + 1800 };
const OTHER = { number: "UNIT24", lastName: "Annansson" };
const CHARTER = { number: "CH-KMNPQ2", lastName: "Charterson" };

const ids = { out: 0, back: 0, seats: [] as number[], otherSeat: 0, passengers: [] as number[], charterPassengers: [] as number[] };
let perPerson = 0;

const flightCredentials = { bookingNumber: FLIGHT.number, lastName: FLIGHT.lastName };
const request = (requestId: string, seatIds: number[], over = {}) => ({ ...flightCredentials, requestId, ids: seatIds, ...over });

async function insert(db: ReturnType<typeof openUnitDb>, sql: string, args: (string | number | null)[]) {
  return Number((await db.execute({ sql, args })).lastInsertRowid);
}

beforeAll(async () => {
  mine = await import("./my-booking");
  const db = openUnitDb();
  try {
    await db.execute("PRAGMA foreign_keys = ON");
    const one = async <T>(sql: string, args: (string | number)[] = []) => (await db.execute({ sql, args })).rows[0] as unknown as T;
    const economy = (await one<{ id: number }>("SELECT id FROM classes WHERE name = 'Ekonomi'")).id;
    const route = (await one<{ id: number }>(
      `SELECT r.id FROM routes r JOIN airports f ON f.id = r.from_airport_id JOIN airports t ON t.id = r.to_airport_id
       WHERE f.iata = 'ARN' AND t.iata = 'LHR'`,
    )).id;
    const back = (await one<{ id: number }>(
      `SELECT r.id FROM routes r JOIN airports f ON f.id = r.from_airport_id JOIN airports t ON t.id = r.to_airport_id
       WHERE f.iata = 'LHR' AND t.iata = 'ARN'`,
    )).id;
    const aircraft = await insert(db, "INSERT INTO aircraft (name) VALUES ('Unit Min Plan')", []);

    const makeBooking = async (number: string, lastName: string, total: number) =>
      insert(
        db,
        `INSERT INTO bookings (booking_number, request_id, first_name, last_name, email, phone, address, payment, total)
         VALUES (?, ?, 'Anna', ?, 'unit-min@exempel.se', '070-123 45 67', 'Gatan 1', 'cash', ?)`,
        [number, `unit-min-${number}`, lastName, total],
      );
    const bookingId = await makeBooking(FLIGHT.number, FLIGHT.lastName, FLIGHT.total);
    for (const [position, name] of ["Anna", "Bo"].entries()) {
      ids.passengers.push(
        await insert(db, "INSERT INTO booking_passengers (booking_id, position, first_name, last_name, age) VALUES (?, ?, ?, 'Testsson', 40)", [
          bookingId,
          position,
          name,
        ]),
      );
    }
    ids.out = await insert(
      db,
      "INSERT INTO booking_flights (booking_id, position, route_id, date, departure_time, aircraft_id, price) VALUES (?, 0, ?, '2030-01-10', '07:00', ?, 1000)",
      [bookingId, route, aircraft],
    );
    ids.back = await insert(
      db,
      "INSERT INTO booking_flights (booking_id, position, route_id, date, departure_time, aircraft_id, price) VALUES (?, 1, ?, '2030-01-17', '18:00', ?, 800)",
      [bookingId, back, aircraft],
    );
    const seat = (flightId: number, passenger: number, price: number) =>
      insert(db, "INSERT INTO booking_seats (booking_flight_id, passenger_id, class_id, price) VALUES (?, ?, ?, ?)", [
        flightId,
        ids.passengers[passenger],
        economy,
        price,
      ]);
    ids.seats = [await seat(ids.out, 0, 1000), await seat(ids.out, 1, 1000), await seat(ids.back, 0, 800), await seat(ids.back, 1, 800)];
    const addon = (seatId: number, name: string, count: number, price: number) =>
      insert(db, "INSERT INTO booking_addons (booking_seat_id, name, count, price) VALUES (?, ?, ?, ?)", [seatId, name, count, price]);
    await addon(ids.seats[1], "Måltid", 2, 120);
    await addon(ids.seats[2], "Dåliga nerver", 1, 1000);
    await addon(ids.seats[3], "Dåliga nerver", 1, 1000);

    // En annan bokning, vars plats inte går att avboka med den första bokningens uppgifter
    const otherId = await makeBooking(OTHER.number, OTHER.lastName, 500);
    const otherPassenger = await insert(
      db,
      "INSERT INTO booking_passengers (booking_id, position, first_name, last_name, age) VALUES (?, 0, 'Cora', 'Annansson', 30)",
      [otherId],
    );
    const otherFlight = await insert(
      db,
      "INSERT INTO booking_flights (booking_id, position, route_id, date, departure_time, aircraft_id, price) VALUES (?, 0, ?, '2030-01-10', '07:00', ?, 500)",
      [otherId, route, aircraft],
    );
    ids.otherSeat = await insert(db, "INSERT INTO booking_seats (booking_flight_id, passenger_id, class_id, price) VALUES (?, ?, ?, 500)", [
      otherFlight,
      otherPassenger,
      economy,
    ]);

    // Charterbokningen: en tidtabell ut från Arlanda och en tillbaka, till samma resmål
    const pair = await one<{ out: string; back: string; destination: string }>(
      `SELECT o.id AS out, b.id AS back, d.id AS destination
       FROM charter_timetables o
       JOIN charter_timetables b ON b.from_airport = o.to_airport AND b.to_airport = o.from_airport
       JOIN destinations d ON d.nearest_airport = o.to_airport
       WHERE o.from_airport = 'ARN' LIMIT 1`,
    );
    const charterId = await insert(
      db,
      `INSERT INTO charter_bookings (booking_number, request_id, destination_id, first_name, last_name, email, phone, address, payment, total)
       VALUES (?, 'unit-min-charter', ?, 'Cecilia', ?, 'unit-min@exempel.se', '070-123 45 67', 'Gatan 1', 'collect', ?)`,
      [CHARTER.number, pair.destination, CHARTER.lastName, 2 * (3000 + 2500 + 1000 + 2000)],
    );
    for (const [position, name] of ["Cecilia", "David"].entries()) {
      ids.charterPassengers.push(
        await insert(
          db,
          "INSERT INTO charter_booking_passengers (booking_id, position, first_name, last_name, age) VALUES (?, ?, ?, 'Charterson', 30)",
          [charterId, position, name],
        ),
      );
    }
    await insert(db, "INSERT INTO charter_booking_trips (booking_id, position, timetable_id, date, price) VALUES (?, 0, ?, '2030-01-10', 3000)", [charterId, pair.out]);
    await insert(db, "INSERT INTO charter_booking_trips (booking_id, position, timetable_id, date, price) VALUES (?, 1, ?, '2030-01-17', 2500)", [charterId, pair.back]);
    await insert(db, "INSERT INTO charter_booking_extras (booking_id, code, name, price) VALUES (?, 'ultimate', 'Den ultimata upplevelsen', 1000)", [charterId]);
    await insert(db, "INSERT INTO charter_booking_extras (booking_id, code, name, price) VALUES (?, 'grylls', 'Bear Grylls Experience', 2000)", [charterId]);
    perPerson = 3000 + 2500 + 1000 + 2000;
  } finally {
    db.close();
  }
});

const charterCredentials = { bookingNumber: CHARTER.number, lastName: CHARTER.lastName };

beforeEach(async () => {
  await queryUnitDb("DELETE FROM login_attempts");
  // Alla avbokningar tas bort mellan testerna, så att varje test börjar med en hel bokning
  await queryUnitDb("UPDATE booking_seats SET cancellation_id = NULL");
  await queryUnitDb("DELETE FROM booking_cancellations");
  await queryUnitDb("UPDATE charter_booking_passengers SET cancellation_id = NULL");
  await queryUnitDb("DELETE FROM charter_booking_cancellations");
});

afterAll(async () => {
  const db = openUnitDb();
  try {
    await db.execute("PRAGMA foreign_keys = ON");
    await db.execute("DELETE FROM bookings WHERE request_id LIKE 'unit-min-%'");
    await db.execute("DELETE FROM charter_bookings WHERE request_id LIKE 'unit-min-%'");
    await db.execute("DELETE FROM aircraft WHERE name = 'Unit Min Plan'");
  } finally {
    db.close();
  }
});

const flightBooking = async (over = {}) => {
  const found = await mine.lookUpBooking(IP, { ...flightCredentials, ...over }, NOW);
  if (!("booking" in found)) throw new Error("not found");
  return found.booking as FlightBooking;
};
const cancellations = (table = "booking_cancellations") => queryUnitDb<{ won: number; amount: number; refunded: number }>(`SELECT won, amount, refunded FROM ${table}`); // nosemgrep: semgrep.sql-built-from-text

// ---------------------------------------------------------------- Uppslag

test("TRIP-023-R2 R4 a flight booking is found by its number and the contact's last name, in any case and with spaces around", async () => {
  const booking = await flightBooking({ bookingNumber: "  unit23 ", lastName: " TESTSSON" });
  expect(booking).toMatchObject({
    kind: "flight",
    bookingNumber: "UNIT23",
    contact: { firstName: "Anna", lastName: "Testsson", email: "unit-min@exempel.se", phone: "070-123 45 67", address: "Gatan 1" },
    payment: "Cash till piloten",
    total: FLIGHT.total,
    cancellations: [],
  });
});

test("TRIP-023-R4 the booking shows each flight with route, date, time, aircraft, and each passenger's class, add-ons and price", async () => {
  const booking = await flightBooking();
  expect(booking.passengers.map((p) => [p.name, p.age])).toEqual([["Anna Testsson", 40], ["Bo Testsson", 40]]);
  expect(booking.flights.map((f) => [f.title, f.date, f.time, f.from.iata, f.to.iata, f.aircraft, f.late])).toEqual([
    ["Utresa", "2030-01-10", "07:00", "ARN", "LHR", "Unit Min Plan", false],
    ["Hemresa", "2030-01-17", "18:00", "LHR", "ARN", "Unit Min Plan", false],
  ]);
  const seats = booking.flights.flatMap((f) => f.seats);
  expect(seats.map((s) => [s.className, s.price, s.addons.map((a) => `${a.count} ${a.name} ${a.price}`)])).toEqual([
    ["Ekonomi", 1000, []],
    ["Ekonomi", 1000, ["2 Måltid 120"]],
    ["Ekonomi", 800, ["1 Dåliga nerver 1000"]],
    ["Ekonomi", 800, ["1 Dåliga nerver 1000"]],
  ]);
  // Platserna och tilläggen är bokningens totalt
  const sum = seats.reduce((s, seat) => s + seat.price + seat.addons.reduce((a, x) => a + x.price * x.count, 0), 0);
  expect(sum).toBe(FLIGHT.total);
});

test("TRIP-023-R2 a wrong number and a wrong last name get the same answer, and so does a number of the wrong shape", async () => {
  const wrongNumber = await mine.lookUpBooking(IP, { bookingNumber: "ZZZZZZ", lastName: FLIGHT.lastName }, NOW);
  const wrongName = await mine.lookUpBooking(IP, { ...flightCredentials, lastName: "Fel" }, NOW);
  const odd = await mine.lookUpBooking(IP, { bookingNumber: "?!", lastName: FLIGHT.lastName }, NOW);
  expect(wrongNumber).toEqual({ notFound: true });
  expect(wrongName).toEqual(wrongNumber);
  expect(odd).toEqual(wrongNumber);
});

test("TRIP-023-R2 R5 a charter booking is found by its CH- number, with trips, passengers and extras", async () => {
  const found = await mine.lookUpBooking(IP, charterCredentials, NOW);
  const booking = (found as { booking: CharterBooking }).booking;
  expect(booking).toMatchObject({ kind: "charter", bookingNumber: CHARTER.number, payment: "Vi hämtar pengarna hos dig", late: false });
  expect(booking.trips.map((t) => [t.title, t.trip.date, t.trip.price])).toEqual([
    ["Utresa", "2030-01-10", 3000],
    ["Hemresa", "2030-01-17", 2500],
  ]);
  expect(booking.passengers.map((p) => [p.name, p.amount, p.cancelled])).toEqual([
    ["Cecilia Charterson", perPerson, false],
    ["David Charterson", perPerson, false],
  ]);
  expect(booking.extras).toEqual([
    { name: "Den ultimata upplevelsen", price: 1000 },
    { name: "Bear Grylls Experience", price: 2000 },
  ]);
  expect(booking.total).toBe(2 * perPerson);
});

// ---------------------------------------------------------------- Gränsen

test("TRIP-023-R3 after 5 wrong attempts the sixth is refused even with the right number and last name", async () => {
  for (let i = 0; i < 5; i++) {
    expect(await mine.lookUpBooking(IP, { ...flightCredentials, lastName: "Fel" }, NOW)).toEqual({ notFound: true });
  }
  const sixth = await mine.lookUpBooking(IP, flightCredentials, NOW);
  expect(sixth).toEqual({ locked: { minutesLeft: expect.any(Number) } });
  // Och när de femton minuterna har gått är det öppet igen
  const later = new Date(NOW.getTime() + 16 * 60_000);
  expect(await mine.lookUpBooking(IP, flightCredentials, later)).toHaveProperty("booking");
});

test("TECH-026-R1 a right lookup keeps the address's count, so alternating guesses and lookups still lock it, and another address is not locked", async () => {
  const wrong = { ...flightCredentials, lastName: "Fel" };
  for (let i = 0; i < 4; i++) await mine.lookUpBooking(IP, wrong, NOW);
  expect(await mine.lookUpBooking(IP, flightCredentials, NOW)).toHaveProperty("booking");
  expect(await queryUnitDb("SELECT * FROM login_attempts WHERE ip = ?", [`uppslag:${IP}`])).toHaveLength(1);
  expect(await mine.lookUpBooking(IP, wrong, NOW)).toEqual({ locked: { minutesLeft: expect.any(Number) } });
  expect(await mine.lookUpBooking("203.0.113.8", flightCredentials, NOW)).toHaveProperty("booking");
});

test("TECH-026-R1 a visitor who looks up their own booking a few times in a row stays under the limit", async () => {
  for (let i = 0; i < 5; i++) expect(await mine.lookUpBooking(IP, flightCredentials, NOW)).toHaveProperty("booking");
});

test("TRIP-023-R3 the count is kept apart from the admin sign-in's", async () => {
  await mine.lookUpBooking(IP, { ...flightCredentials, lastName: "Fel" }, NOW);
  const rows = await queryUnitDb<{ ip: string }>("SELECT ip FROM login_attempts");
  expect(rows.map((r) => r.ip)).toEqual([`uppslag:${IP}`]);
});

// ---------------------------------------------------------------- Avboka en flygbokning

test("TRIP-023-R6 R10 cancelling one passenger's seat on one flight is worth the seat and its add-ons, and a win refunds it", async () => {
  const result = await mine.cancelParts(IP, request("unit-a", [ids.seats[1]]), NOW, WIN);
  expect(result).toMatchObject({ won: true, amount: 1240 });
  const { booking } = result as { booking: FlightBooking };
  expect(booking.flights[0].seats.map((s) => s.cancelled)).toEqual([false, true]);
  expect(booking.flights[1].seats.map((s) => s.cancelled)).toEqual([false, false]);
  expect(booking.cancellations).toMatchObject([{ won: true, amount: 1240, refunded: 1240 }]);
  expect(await cancellations()).toEqual([{ won: 1, amount: 1240, refunded: 1240 }]);
});

test("TRIP-023-R10 a loss refunds nothing but the cancellation is still saved with its amount", async () => {
  const result = await mine.cancelParts(IP, request("unit-b", [ids.seats[2], ids.seats[3]]), NOW, LOSE);
  expect(result).toMatchObject({ won: false, amount: 3600 });
  expect(await cancellations()).toEqual([{ won: 0, amount: 3600, refunded: 0 }]);
  const booking = (result as { booking: FlightBooking }).booking;
  expect(booking.cancellations[0].refunded).toBe(0);
});

test("TRIP-023-R10 exactly one half loses", async () => {
  const result = await mine.cancelParts(IP, request("unit-c", [ids.seats[0]]), NOW, () => 0.5);
  expect(result).toMatchObject({ won: false });
});

test("TRIP-023-R6 the outbound flight can be cancelled and the return kept; every flight cancelled cancels the booking", async () => {
  const first = (await mine.cancelParts(IP, request("unit-d1", [ids.seats[0], ids.seats[1]]), NOW, WIN)) as { booking: FlightBooking };
  expect(first.booking.flights.map((f) => f.seats.every((s) => s.cancelled))).toEqual([true, false]);
  const second = (await mine.cancelParts(IP, request("unit-d2", [ids.seats[2], ids.seats[3]]), NOW, LOSE)) as { booking: FlightBooking };
  expect(second.booking.flights.every((f) => f.seats.every((s) => s.cancelled))).toBe(true);
  expect(second.booking.cancellations.map((c) => c.won)).toEqual([true, false]);
});

test("TRIP-023-R10 the same confirmation sent twice gives one cancellation and one draw", async () => {
  let draws = 0;
  const random = () => (draws++, 0.1);
  const [first, second] = [
    await mine.cancelParts(IP, request("unit-e", [ids.seats[0]]), NOW, random),
    await mine.cancelParts(IP, request("unit-e", [ids.seats[0]]), NOW, random),
  ];
  expect(second).toMatchObject({ won: true, amount: 1000 });
  expect(first).toMatchObject({ won: true, amount: 1000 });
  expect(draws).toBe(1);
  expect(await cancellations()).toHaveLength(1);
});

test("TRIP-023-R10 two confirmations at the same moment give one cancellation", async () => {
  const results = await Promise.all([
    mine.cancelParts(IP, request("unit-f", [ids.seats[0]]), NOW, WIN),
    mine.cancelParts(IP, request("unit-f", [ids.seats[0]]), NOW, WIN),
  ]);
  expect(results.every((r) => "booking" in r)).toBe(true);
  expect(await cancellations()).toHaveLength(1);
});

test("TRIP-023-R12 a seat from another booking, one already cancelled, an empty selection and a bad request are refused and nothing changes", async () => {
  await mine.cancelParts(IP, request("unit-g1", [ids.seats[0]]), NOW, WIN);
  const refused = [
    request("unit-g2", [ids.otherSeat]),
    request("unit-g3", [ids.seats[0]]),
    request("unit-g4", [ids.seats[1], ids.seats[0]]),
    request("unit-g5", []),
    request("unit-g6", [ids.seats[1], ids.seats[1]]),
    request("unit-g7", [-1]),
    request("unit-g8", [1.5]),
    request("unit-g9", [ids.seats[1]], { requestId: "" }),
  ];
  // Each from an address of its own: a right lookup no longer clears the count (TECH-026-R1), and nine would lock one
  for (const [i, r] of refused.entries()) expect(await mine.cancelParts(`203.0.113.${100 + i}`, r, NOW, WIN)).toHaveProperty("error");
  expect(await cancellations()).toHaveLength(1);
  const cancelled = await queryUnitDb<{ id: number }>("SELECT id FROM booking_seats WHERE cancellation_id IS NOT NULL");
  expect(cancelled.map((s) => s.id)).toEqual([ids.seats[0]]);
});

test("TRIP-023-R12 a request without a matching number and last name is refused and counts as a wrong attempt", async () => {
  const wrong = request("unit-h", [ids.seats[0]], { lastName: "Fel" });
  expect(await mine.cancelParts(IP, wrong, NOW, WIN)).toEqual({ notFound: true });
  expect(await mine.cancelParts(IP, { ...wrong, bookingNumber: "ZZZZZZ", lastName: FLIGHT.lastName }, NOW, WIN)).toEqual({ notFound: true });
  expect(await cancellations()).toHaveLength(0);
  const [attempts] = await queryUnitDb<{ attempts: number }>("SELECT attempts FROM login_attempts WHERE ip = ?", [`uppslag:${IP}`]);
  expect(attempts.attempts).toBe(2);
});

test("TRIP-023-R8 a flight that departs in 24 hours or less, or has left, is marked too late and is refused by the server", async () => {
  // Utresan 2030-01-10 07:00 i Stockholm är 06:00 UTC
  const justOver = new Date("2030-01-09T05:59:00Z");
  const exactly = new Date("2030-01-09T06:00:00Z");
  const after = new Date("2030-01-10T10:00:00Z");
  const lateOf = async (now: Date) => {
    const found = (await mine.lookUpBooking(IP, flightCredentials, now)) as { booking: FlightBooking };
    return found.booking.flights.map((f) => f.late);
  };
  expect(await lateOf(justOver)).toEqual([false, false]);
  expect(await lateOf(exactly)).toEqual([true, false]);
  expect(await lateOf(after)).toEqual([true, false]);

  expect(await mine.cancelParts(IP, request("unit-i1", [ids.seats[0]]), exactly, WIN)).toHaveProperty("error");
  expect(await mine.cancelParts(IP, request("unit-i2", [ids.seats[0]]), after, WIN)).toHaveProperty("error");
  // Hemresan går att avboka, och ett krav på båda flygen avvisas helt
  expect(await mine.cancelParts(IP, request("unit-i3", [ids.seats[0], ids.seats[2]]), exactly, WIN)).toHaveProperty("error");
  expect(await cancellations()).toHaveLength(0);
  expect(await mine.cancelParts(IP, request("unit-i4", [ids.seats[2]]), exactly, WIN)).toMatchObject({ won: true });
});

test("TRIP-023-R4 the cancelled amounts and refunds show what is left to pay", async () => {
  await mine.cancelParts(IP, request("unit-j1", [ids.seats[0]]), NOW, WIN);
  const result = (await mine.cancelParts(IP, request("unit-j2", [ids.seats[1]]), NOW, LOSE)) as { booking: FlightBooking };
  const { total, cancellations: list } = result.booking;
  expect(total).toBe(FLIGHT.total);
  expect(list.map((c) => [c.amount, c.refunded])).toEqual([[1000, 1000], [1240, 0]]);
});

test("TRIP-023-R11 a fully cancelled booking is still found, with its history", async () => {
  await mine.cancelParts(IP, request("unit-k", ids.seats), NOW, LOSE);
  const booking = await flightBooking();
  expect(booking.flights.every((f) => f.seats.every((s) => s.cancelled))).toBe(true);
  expect(booking.cancellations).toMatchObject([{ won: false, amount: FLIGHT.total, refunded: 0 }]);
  expect(booking.cancellations[0].at).toMatch(/^\d{1,2} \w+\.? \d\d:\d\d$/);
  // Och inget mer går att avboka
  expect(await mine.cancelParts(IP, request("unit-k2", [ids.seats[0]]), NOW, WIN)).toHaveProperty("error");
});

test("TRIP-023-R11 the cancelled parts and the booking's total are kept, not deleted", async () => {
  await mine.cancelParts(IP, request("unit-l", ids.seats), NOW, WIN);
  const [{ n }] = await queryUnitDb<{ n: number }>("SELECT COUNT(*) AS n FROM booking_seats s JOIN booking_flights f ON f.id = s.booking_flight_id JOIN bookings b ON b.id = f.booking_id WHERE b.booking_number = ?", [FLIGHT.number]);
  expect(n).toBe(4);
  const [{ total }] = await queryUnitDb<{ total: number }>("SELECT total FROM bookings WHERE booking_number = ?", [FLIGHT.number]);
  expect(total).toBe(FLIGHT.total);
});

// ---------------------------------------------------------------- Avboka en charterbokning

const charterRequest = (requestId: string, passengerIds: number[], over = {}) => ({ ...charterCredentials, requestId, ids: passengerIds, ...over });

test("TRIP-023-R7 R10 cancelling one traveller is worth both trips and every extra, and a win refunds it", async () => {
  const result = await mine.cancelParts(IP, charterRequest("unit-m1", [ids.charterPassengers[0]]), NOW, WIN);
  expect(result).toMatchObject({ won: true, amount: perPerson });
  const { booking } = result as { booking: CharterBooking };
  expect(booking.passengers.map((p) => p.cancelled)).toEqual([true, false]);
  expect(await cancellations("charter_booking_cancellations")).toEqual([{ won: 1, amount: perPerson, refunded: perPerson }]);
});

test("TRIP-023-R7 the whole trip is every traveller, and then the booking is cancelled", async () => {
  const result = (await mine.cancelParts(IP, charterRequest("unit-n", ids.charterPassengers), NOW, LOSE)) as {
    booking: CharterBooking;
    amount: number;
  };
  expect(result.amount).toBe(2 * perPerson);
  expect(result.booking.passengers.every((p) => p.cancelled)).toBe(true);
  expect(result.booking.cancellations[0]).toMatchObject({ won: false, refunded: 0 });
});

test("TRIP-023-R8 a charter booking whose outbound trip departs in 24 hours or less cannot be cancelled", async () => {
  // Utresan 2030-01-10, tidtabellens avgångstid i Stockholm: en dag före är för sent
  const soon = new Date("2030-01-09T23:59:00Z");
  const found = (await mine.lookUpBooking(IP, charterCredentials, soon)) as { booking: CharterBooking };
  expect(found.booking.late).toBe(true);
  expect(await mine.cancelParts(IP, charterRequest("unit-o", [ids.charterPassengers[0]]), soon, WIN)).toHaveProperty("error");
  expect(await cancellations("charter_booking_cancellations")).toHaveLength(0);
});

test("TRIP-023-R12 a charter request with a traveller from another booking or one already cancelled is refused", async () => {
  await mine.cancelParts(IP, charterRequest("unit-p1", [ids.charterPassengers[0]]), NOW, WIN);
  const [other] = await queryUnitDb<{ id: number }>("SELECT id FROM booking_passengers LIMIT 1");
  for (const r of [charterRequest("unit-p2", [ids.charterPassengers[0]]), charterRequest("unit-p3", [other.id]), charterRequest("unit-p4", [])]) {
    expect(await mine.cancelParts(IP, r, NOW, WIN)).toHaveProperty("error");
  }
  expect(await cancellations("charter_booking_cancellations")).toHaveLength(1);
});
