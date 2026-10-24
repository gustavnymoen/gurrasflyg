import { afterAll, beforeAll, expect, test } from "vitest";
import { openUnitDb, queryUnitDb } from "../db/test-db";
import { type BookingForm, emptyForm, fitForm } from "./booking-rules";
import { addDays, toDateString } from "./dates";
import { fare } from "./fare-rules";
import { unitTestDbFile } from "./local-db.mjs";
import type { Search } from "./search";

// Sparar bokningar i enhetstesternas egen databas (vitest.global-setup.mjs),
// aldrig i din. lib/db.ts läser adressen när den importeras, så bookings
// importeras först när den är satt.
process.env.TURSO_DATABASE_URL = `file:${unitTestDbFile}`;
let bookings: typeof import("./bookings");

const TOMORROW = addDays(toDateString(new Date()), 1);
const search: Search = { from: "ARN", to: "LHR", outbound: TOMORROW, return: null, travellers: 3 };
// Testets plan, klasser, tillägg och avgång (satta i beforeAll)
const ids = { aircraft: 0, economy: 0, business: 0, meal: 0, lounge: 0 };
let departure = { time: "", price: 0 };
const PLANE_PERCENT = 120;

const legs = () => [
  { time: departure.time, aircraftId: ids.aircraft, seating: { [ids.economy]: 1, [ids.business]: 2 } },
];

// Ett ifyllt formulär: 2 i Business och 1 i Ekonomi, 2 Måltid för Passagerare 3
function form(requestId: string): BookingForm {
  const empty = fitForm(emptyForm(requestId), [], 3);
  return {
    ...empty,
    legKeys: [""],
    passengers: empty.passengers.map((p, i) => ({
      ...p,
      firstName: `Unit ${i}`,
      lastName: "Test",
      age: "40",
      nerves: i === 0,
      legs: [{ classId: i < 2 ? ids.business : ids.economy, addons: i === 2 ? { [ids.meal]: 2 } : {} }],
    })),
    contact: { firstName: "Unit", lastName: "Test", email: "unit@exempel.se", phone: "070-123 45 67", address: "Gatan 1" },
    checks: [true, true, true],
    payment: "collect",
  };
}

const bookingsFor = (requestId: string) =>
  queryUnitDb<{ id: number; booking_number: string; total: number }>(
    "SELECT id, booking_number, total FROM bookings WHERE request_id = ?",
    [requestId],
  );

beforeAll(async () => {
  bookings = await import("./bookings");
  const db = openUnitDb();
  try {
    const one = async <T>(sql: string, args: (string | number)[] = []) =>
      (await db.execute({ sql, args })).rows[0] as unknown as T;
    ids.economy = (await one<{ id: number }>("SELECT id FROM classes WHERE name = 'Ekonomi'")).id;
    ids.business = (await one<{ id: number }>("SELECT id FROM classes WHERE name = 'Business'")).id;
    ids.aircraft = Number(
      (await db.execute({ sql: "INSERT INTO aircraft (name, price_percent) VALUES ('Unit Plan', ?)", args: [PLANE_PERCENT] }))
        .lastInsertRowid,
    );
    for (const [classId, capacity] of [
      [ids.economy, 10],
      [ids.business, 4],
    ]) {
      await db.execute({
        sql: "INSERT INTO aircraft_capacity (aircraft_id, class_id, capacity) VALUES (?, ?, ?)",
        args: [ids.aircraft, classId, capacity],
      });
    }
    const addon = async (name: string, price: number, classIds: number[]) => {
      const id = Number(
        (
          await db.execute({
            sql: "INSERT INTO addons (name, description, price) VALUES (?, 'Unit', ?)",
            args: [name, price],
          })
        ).lastInsertRowid,
      );
      for (const classId of classIds) {
        await db.execute({
          sql: "INSERT INTO aircraft_class_addons (aircraft_id, class_id, addon_id) VALUES (?, ?, ?)",
          args: [ids.aircraft, classId, id],
        });
      }
      return id;
    };
    ids.meal = await addon("Unit Måltid", 120, [ids.economy, ids.business]);
    ids.lounge = await addon("Unit Lounge", 500, [ids.business]);
    departure = await one(
      `SELECT d.departure_time AS time, d.price FROM routes r
       JOIN airports f ON f.id = r.from_airport_id JOIN airports t ON t.id = r.to_airport_id
       JOIN route_departures d ON d.route_id = r.id
       WHERE f.iata = 'ARN' AND t.iata = 'LHR' ORDER BY d.departure_time LIMIT 1`,
    );
  } finally {
    db.close();
  }
});

// Testerna städar efter sig: bokningarna, och sedan planet och tilläggen
afterAll(async () => {
  const db = openUnitDb();
  try {
    await db.execute("PRAGMA foreign_keys = ON");
    await db.execute("DELETE FROM bookings WHERE request_id LIKE 'unit-%'");
    await db.execute({ sql: "DELETE FROM aircraft_class_addons WHERE aircraft_id = ?", args: [ids.aircraft] });
    await db.execute({ sql: "DELETE FROM aircraft_capacity WHERE aircraft_id = ?", args: [ids.aircraft] });
    await db.execute({ sql: "DELETE FROM aircraft WHERE id = ?", args: [ids.aircraft] });
    await db.execute("DELETE FROM addons WHERE name LIKE 'Unit %'");
  } finally {
    db.close();
  }
});

test("TRIP-012-R8 a booking is saved with the database's prices and a six-character booking number", async () => {
  const requestId = "unit-saved-1";
  // Ett pris skickat från webbläsaren räknas inte
  const sent = form(requestId);
  const tampered = { ...sent, total: 1, passengers: sent.passengers.map((p) => ({ ...p, price: 1 })) };
  const { bookingNumber } = await bookings.createBooking({ search, legs: legs(), form: tampered });
  expect(bookingNumber).toMatch(/^[A-HJ-NP-Z2-9]{6}$/);

  const business = fare(departure.price, PLANE_PERCENT, 150);
  const economy = fare(departure.price, PLANE_PERCENT, 100);
  const [booking] = await bookingsFor(requestId);
  expect(booking.booking_number).toBe(bookingNumber);
  expect(booking.total).toBe(2 * business + economy + 2 * 120 + 1000);

  const seats = await queryUnitDb<{ position: number; first_name: string; age: number; class_id: number; price: number }>(
    `SELECT p.position, p.first_name, p.age, s.class_id, s.price FROM booking_seats s
     JOIN booking_passengers p ON p.id = s.passenger_id WHERE p.booking_id = ? ORDER BY p.position`,
    [booking.id],
  );
  expect(seats.map((s) => [s.first_name, s.age, s.class_id, s.price])).toEqual([
    ["Unit 0", 40, ids.business, business],
    ["Unit 1", 40, ids.business, business],
    ["Unit 2", 40, ids.economy, economy],
  ]);
  const flight = await queryUnitDb<{ date: string; departure_time: string; aircraft_id: number; price: number }>(
    "SELECT date, departure_time, aircraft_id, price FROM booking_flights WHERE booking_id = ?",
    [booking.id],
  );
  expect(flight).toEqual([
    { date: TOMORROW, departure_time: departure.time, aircraft_id: ids.aircraft, price: departure.price },
  ]);
  const addons = await queryUnitDb<{ addon_id: number | null; name: string; count: number; price: number }>(
    `SELECT a.addon_id, a.name, a.count, a.price FROM booking_addons a
     JOIN booking_seats s ON s.id = a.booking_seat_id JOIN booking_flights f ON f.id = s.booking_flight_id
     WHERE f.booking_id = ? ORDER BY a.name`,
    [booking.id],
  );
  expect(addons.map((a) => ({ ...a }))).toEqual([
    { addon_id: null, name: "Dåliga nerver", count: 1, price: 1000 },
    { addon_id: ids.meal, name: "Unit Måltid", count: 2, price: 120 },
  ]);
});

test("TRIP-012-R8 pressing Betala twice gives one booking", async () => {
  const requestId = "unit-twice-1";
  const [first, second] = await Promise.all([
    bookings.createBooking({ search, legs: legs(), form: form(requestId) }),
    bookings.createBooking({ search, legs: legs(), form: form(requestId) }),
  ]);
  expect(second.bookingNumber).toBe(first.bookingNumber);
  expect(await bookingsFor(requestId)).toHaveLength(1);
});

test("TRIP-012-R8 an add-on not allowed in the passenger's class is refused, and nothing is saved", async () => {
  const requestId = "unit-lounge-1";
  const sent = form(requestId);
  // Lounge går bara att köpa i Business, och Passagerare 3 sitter i Ekonomi
  const lounge = {
    ...sent,
    passengers: sent.passengers.with(2, { ...sent.passengers[2], legs: [{ classId: ids.economy, addons: { [ids.lounge]: 1 } }] }),
  };
  await expect(bookings.createBooking({ search, legs: legs(), form: lounge })).rejects.toThrow(bookings.BookingError);
  expect(await bookingsFor(requestId)).toHaveLength(0);
});

test("TRIP-012-R8 nothing is saved when the booking is no longer valid", async () => {
  const requestId = "unit-gone-1";
  // Planet finns inte (t.ex. borttaget i admin)
  const gone = [{ ...legs()[0], aircraftId: ids.aircraft + 1000 }];
  await expect(bookings.createBooking({ search, legs: gone, form: form(requestId) })).rejects.toThrow(bookings.CHANGED);
  // Avgången har redan gått
  const yesterday = { ...search, outbound: addDays(TOMORROW, -2) };
  await expect(bookings.createBooking({ search: yesterday, legs: legs(), form: form(requestId) })).rejects.toThrow(
    bookings.CHANGED,
  );
  // Ett fält saknas
  const noName = { ...form(requestId), contact: { ...form(requestId).contact, lastName: "" } };
  await expect(bookings.createBooking({ search, legs: legs(), form: noName })).rejects.toThrow(bookings.BookingError);
  expect(await bookingsFor(requestId)).toHaveLength(0);
});
