import { createClient } from "@libsql/client";
import { readFileSync } from "node:fs";
import { expect, test } from "vitest";

// Tabellernas regler kontrolleras på en databas i minnet med schemat, kursdatans
// tabeller (005) och migreringen. Egen databas, så att inget skrivs i någon annan.

const readSql = (file: string) => readFileSync(`db/${file}`, "utf8");

async function open() {
  const db = createClient({ url: ":memory:" });
  await db.execute("PRAGMA foreign_keys = ON");
  await db.executeMultiple(readSql("migrations/005_charter.sql"));
  await db.executeMultiple(readSql("migrations/011_charter_bookings.sql"));
  await db.executeMultiple(`
    INSERT INTO charter_airports VALUES ('BER', 'Berlin', 'Berlin', 'DE', 'Germany', 52.3, 13.5, 'Europe/Berlin');
    INSERT INTO charter_airports VALUES ('ARN', 'Arlanda', 'Stockholm', 'SE', 'Sweden', 59.6, 17.9, 'Europe/Stockholm');
    INSERT INTO destinations (id, title, description, continent, country, country_name, region, locality, category, access, nearest_airport, path)
      VALUES ('x', 'X', 'X', 'Europe', 'DE', 'Germany', 'R', 'L', 'C', 'Open', 'BER', 'x.md');
    INSERT INTO charter_timetables VALUES ('T1', 'Test', 'ARN', 'BER', '2026-11-01', '2027-04-30', '07:00', '08:40', 0, 100, 1000);
  `);
  return db;
}

const booking = (over: Record<string, string | number> = {}) => {
  const values = {
    booking_number: "CH-K7M2QX",
    request_id: "r1",
    destination_id: "x",
    first_name: "A",
    last_name: "B",
    email: "a@b.se",
    phone: "0701234567",
    address: "Gatan 1",
    payment: "cash",
    total: 1000,
    ...over,
  };
  const columns = Object.keys(values);
  return {
    sql: `INSERT INTO charter_bookings (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,
    args: Object.values(values),
  };
};

test("TRIP-014-R8 a booking number is CH- and six characters without 0, O, 1 and I", async () => {
  const db = await open();
  try {
    await db.execute(booking());
    for (const bad of ["K7M2QX", "CH-K7M2Q", "CH-K7M2QXX", "CH-K7M2Q0", "CH-K7M2QO", "CH-K7M2Q1", "CH-K7M2QI", "ch-K7M2QX"]) {
      await expect(db.execute(booking({ booking_number: bad, request_id: bad })), bad).rejects.toThrow();
    }
  } finally {
    db.close();
  }
});

test("TRIP-014-R8 a booking number and a request id are used once", async () => {
  const db = await open();
  try {
    await db.execute(booking());
    await expect(db.execute(booking({ request_id: "r2" }))).rejects.toThrow(/UNIQUE/);
    await expect(db.execute(booking({ booking_number: "CH-K7M2QY" }))).rejects.toThrow(/UNIQUE/);
    await expect(db.execute(booking({ booking_number: "CH-K7M2QY", request_id: "r3", payment: "gold" }))).rejects.toThrow();
    await expect(db.execute(booking({ booking_number: "CH-K7M2QY", request_id: "r3", destination_id: "nope" }))).rejects.toThrow(/FOREIGN/);
  } finally {
    db.close();
  }
});

test("TRIP-014-R8 passengers, trips and extras belong to a booking, follow its rules and are deleted with it", async () => {
  const db = await open();
  try {
    const { lastInsertRowid } = await db.execute(booking());
    const id = Number(lastInsertRowid);
    const insert = (sql: string, args: (string | number)[]) => db.execute({ sql, args });
    await insert("INSERT INTO charter_booking_passengers (booking_id, position, first_name, last_name, age) VALUES (?, 0, 'A', 'B', 40)", [id]);
    await expect(
      insert("INSERT INTO charter_booking_passengers (booking_id, position, first_name, last_name, age) VALUES (?, 1, 'A', 'B', 0)", [id]),
    ).rejects.toThrow();
    await expect(
      insert("INSERT INTO charter_booking_passengers (booking_id, position, first_name, last_name, age) VALUES (?, 1, 'A', 'B', 121)", [id]),
    ).rejects.toThrow();
    await expect(
      insert("INSERT INTO charter_booking_passengers (booking_id, position, first_name, last_name, age) VALUES (?, 0, 'C', 'D', 30)", [id]),
    ).rejects.toThrow(/UNIQUE/);

    await insert("INSERT INTO charter_booking_trips (booking_id, position, timetable_id, date, price) VALUES (?, 0, 'T1', '2027-01-11', 1000)", [id]);
    await expect(
      insert("INSERT INTO charter_booking_trips (booking_id, position, timetable_id, date, price) VALUES (?, 2, 'T1', '2027-01-11', 1000)", [id]),
    ).rejects.toThrow();
    await expect(
      insert("INSERT INTO charter_booking_trips (booking_id, position, timetable_id, date, price) VALUES (?, 1, 'nope', '2027-01-11', 1000)", [id]),
    ).rejects.toThrow(/FOREIGN/);

    await insert("INSERT INTO charter_booking_extras (booking_id, code, name, price) VALUES (?, 'ultimate', 'Den ultimata upplevelsen', 1000)", [id]);
    await expect(
      insert("INSERT INTO charter_booking_extras (booking_id, code, name, price) VALUES (?, 'ultimate', 'Den ultimata upplevelsen', 1000)", [id]),
    ).rejects.toThrow(/UNIQUE/);

    await db.execute({ sql: "DELETE FROM charter_bookings WHERE id = ?", args: [id] });
    for (const table of ["charter_booking_passengers", "charter_booking_trips", "charter_booking_extras"]) {
      expect((await db.execute(`SELECT COUNT(*) AS n FROM ${table}`)).rows[0].n, table).toBe(0); // nosemgrep: semgrep.sql-built-from-text
    }
  } finally {
    db.close();
  }
});
