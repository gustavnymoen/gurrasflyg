import { createClient } from "@libsql/client";
import { readFileSync } from "node:fs";
import { expect, test } from "vitest";

// Migreringen läggs på en databas i minnet som redan har en charterbokning från före planen:
// ingen befintlig rad ändras, och den gamla bokningen får inget plan och inga platser (TRIP-039-R7).
const readSql = (file: string) => readFileSync(`db/${file}`, "utf8");

async function open() {
  const db = createClient({ url: ":memory:" });
  await db.execute("PRAGMA foreign_keys = ON");
  await db.executeMultiple(readSql("migrations/005_charter.sql"));
  await db.executeMultiple(readSql("migrations/011_charter_bookings.sql"));
  // Planen, klasserna och tilläggen som migreringen pekar på, i den form de har i schemat
  await db.executeMultiple(`
    CREATE TABLE aircraft (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
    CREATE TABLE classes (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
    CREATE TABLE addons (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
    INSERT INTO aircraft VALUES (1, 'Plan');
    INSERT INTO classes VALUES (1, 'Ekonomi');
    INSERT INTO addons VALUES (1, 'Måltid');
    INSERT INTO charter_airports VALUES ('BER', 'Berlin', 'Berlin', 'DE', 'Germany', 52.3, 13.5, 'Europe/Berlin');
    INSERT INTO charter_airports VALUES ('ARN', 'Arlanda', 'Stockholm', 'SE', 'Sweden', 59.6, 17.9, 'Europe/Stockholm');
    INSERT INTO destinations (id, title, description, continent, country, country_name, region, locality, category, access, nearest_airport, path)
      VALUES ('x', 'X', 'X', 'Europe', 'DE', 'Germany', 'R', 'L', 'C', 'Open', 'BER', 'x.md');
    INSERT INTO charter_timetables VALUES ('T1', 'Test', 'ARN', 'BER', '2026-11-01', '2027-04-30', '07:00', '08:40', 0, 100, 1000);
  `);
  return db;
}

test("TRIP-039-R7 the migration changes no existing row, and an old trip has no aircraft and no seats", async () => {
  const db = await open();
  await db.executeMultiple(`
    INSERT INTO charter_bookings (booking_number, request_id, destination_id, first_name, last_name, email, phone, address, payment, total)
      VALUES ('CH-K7M2QX', 'r1', 'x', 'A', 'B', 'a@b.se', '0701234567', 'Gatan 1', 'cash', 2000);
    INSERT INTO charter_booking_passengers (booking_id, position, first_name, last_name, age) VALUES (1, 0, 'A', 'B', 40);
    INSERT INTO charter_booking_trips (booking_id, position, timetable_id, date, price) VALUES (1, 0, 'T1', '2027-01-11', 1000);
  `);
  const rows = async () => (await db.execute("SELECT * FROM charter_booking_trips")).rows.map((r) => ({ ...r }));
  const before = await rows();

  await db.executeMultiple(readSql("migrations/013_charter_aircraft.sql"));

  // The old row is the same, with a new empty column
  expect(await rows()).toEqual(before.map((row) => ({ ...row, aircraft_id: null })));
  expect((await db.execute("SELECT COUNT(*) AS n FROM charter_booking_seats")).rows[0].n).toBe(0);
  db.close();
});

test("TRIP-039-R5 a seat belongs to one traveller on one trip, and its class and add-ons must exist", async () => {
  const db = await open();
  try {
    await db.executeMultiple(readSql("migrations/013_charter_aircraft.sql"));
    await db.executeMultiple(`
      INSERT INTO charter_bookings (booking_number, request_id, destination_id, first_name, last_name, email, phone, address, payment, total)
        VALUES ('CH-K7M2QX', 'r1', 'x', 'A', 'B', 'a@b.se', '0701234567', 'Gatan 1', 'cash', 2000);
      INSERT INTO charter_booking_passengers (booking_id, position, first_name, last_name, age) VALUES (1, 0, 'A', 'B', 40);
      INSERT INTO charter_booking_trips (booking_id, position, timetable_id, date, price, aircraft_id) VALUES (1, 0, 'T1', '2027-01-11', 1000, 1);
      INSERT INTO charter_booking_seats (booking_trip_id, passenger_id, class_id, price) VALUES (1, 1, 1, 1200);
    `);
    const seat = (classId: number, price = 1) =>
      db.execute({ sql: "INSERT INTO charter_booking_seats (booking_trip_id, passenger_id, class_id, price) VALUES (1, 1, ?, ?)", args: [classId, price] });
    await expect(seat(1)).rejects.toThrow(/UNIQUE/);
    await db.execute("DELETE FROM charter_booking_seats");
    await expect(seat(99)).rejects.toThrow(/FOREIGN/);
    await expect(seat(1, -1)).rejects.toThrow();
    await seat(1);
    const addon = (count: number, addonId = 1) =>
      db.execute({ sql: "INSERT INTO charter_booking_addons (booking_seat_id, addon_id, name, count, price) VALUES (1, ?, 'Måltid', ?, 120)", args: [addonId, count] });
    await addon(2);
    await expect(addon(0)).rejects.toThrow();
    await expect(addon(11)).rejects.toThrow();
    await expect(addon(1, 99)).rejects.toThrow(/FOREIGN/);
    // A booking that is deleted takes its trips, seats and add-ons with it
    await db.execute("DELETE FROM charter_bookings");
    expect((await db.execute("SELECT COUNT(*) AS n FROM charter_booking_addons")).rows[0].n).toBe(0);
  } finally {
    db.close();
  }
});
