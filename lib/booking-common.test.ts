import { afterAll, beforeAll, expect, test, vi } from "vitest";
import { openUnitDb } from "../db/test-db";
import { unitTestDbFile } from "./local-db.mjs";

// Två "slumpade" koder: AAAAAA först, sedan BBBBBB
let next = 0;
let calls = 0;
vi.mock("node:crypto", () => ({ randomInt: () => (calls++ < 6 ? 0 : next) }));

// Egen databas, se lib/bookings.test.ts
process.env.TURSO_DATABASE_URL = `file:${unitTestDbFile}`;
let common: typeof import("./booking-common");
let db: typeof import("./db");

beforeAll(async () => {
  common = await import("./booking-common");
  db = await import("./db");
  next = 1;
  await db.run(
    `INSERT INTO bookings (booking_number, request_id, first_name, last_name, email, phone, address, payment, total)
     VALUES ('AAAAAA', 'unit-common', 'Unit', 'Test', 'u@e.se', '1', 'G 1', 'cash', 0)`,
  );
});

afterAll(async () => {
  const client = openUnitDb();
  try {
    await client.execute("DELETE FROM bookings WHERE request_id = 'unit-common'");
  } finally {
    client.close();
  }
});

test("TECH-029-R2 a booking number has six characters, CH- first for charter, and skips a taken one", async () => {
  calls = 0;
  const flight = await db.withTransaction((tx) => common.newBookingNumber(tx, "bookings"));
  expect(flight).toBe("BBBBBB"); // AAAAAA är tagen
  calls = 0;
  const charter = await db.withTransaction((tx) => common.newBookingNumber(tx, "charter_bookings", "CH-"));
  expect(charter).toBe("CH-AAAAAA"); // fri i sin egen tabell
  expect(common.randomBookingCode()).toMatch(/^[A-HJ-NP-Z2-9]{6}$/);
});

test("TECH-029-R2 an existing booking is found by request_id, and nothing for an unknown or non-text one", async () => {
  const find = (id: unknown) => db.withTransaction((tx) => common.findBookingByRequestId(tx, "bookings", id));
  expect(await find("unit-common")).toEqual({ bookingNumber: "AAAAAA" });
  expect(await find("unit-unknown")).toBeUndefined();
  expect(await find(undefined)).toBeUndefined();
});

test("TECH-029-R2 an error is shown to the visitor only if it is a BookingError", () => {
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  expect(common.bookingFailure(new common.BookingError("Synligt"))).toEqual({ ok: false, error: "Synligt" });
  expect(log).not.toHaveBeenCalled();
  expect(common.bookingFailure(new Error("hemligt"))).toEqual({ ok: false, error: "Något gick fel, försök igen." });
  expect(log).toHaveBeenCalledOnce();
  log.mockRestore();
});
