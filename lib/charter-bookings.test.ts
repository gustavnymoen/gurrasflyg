import { afterAll, beforeAll, expect, test } from "vitest";
import { openUnitDb, queryUnitDb } from "../db/test-db";
import { type CharterForm, type CharterSearch, charterTotal, emptyCharterForm } from "./charter-rules";
import { unitTestDbFile } from "./local-db.mjs";

// Sparar charterbokningar i enhetstesternas egen databas (vitest.global-setup.mjs),
// aldrig i din. lib/db.ts läser adressen när den importeras, så modulerna
// importeras först när den är satt.
process.env.TURSO_DATABASE_URL = `file:${unitTestDbFile}`;
let bookings: typeof import("./charter-bookings");
let charter: typeof import("./charter");

const destination = { id: "teufelsberg", title: "Teufelsberg", airport: "BER" };
// Måndag 2027-01-11 ut och lördag 2027-01-16 hem, sedda från en dag i november
const NOW = new Date("2026-11-02T10:00:00Z");
const search: CharterSearch = { from: "ARN", outbound: "2027-01-11", return: "2027-01-16", travellers: 2 };
// Utresan och hemresan som testet väljer: den första utresan och den sista hemresan
const trips = { out: "", back: "", outPrice: 0, backPrice: 0 };
const choice = () => ({ out: trips.out, back: trips.back });

function form(requestId: string, over: Partial<CharterForm> = {}): CharterForm {
  return {
    ...emptyCharterForm(requestId),
    passengers: [
      { firstName: "Unit 0", lastName: "Test", age: "40" },
      { firstName: "Unit 1", lastName: "Test", age: "12" },
    ],
    contact: { firstName: "Unit", lastName: "Test", email: "unit@exempel.se", phone: "070-123 45 67", address: "Gatan 1" },
    checks: [true, true, true],
    extras: ["ultimate", "grylls"],
    payment: "collect",
    ...over,
  };
}

const book = (request: Partial<Parameters<typeof bookings.createCharterBooking>[0]> & { form: CharterForm }, now = NOW) =>
  bookings.createCharterBooking({ destination, search, choice: choice(), ...request }, now);

const rowsFor = (requestId: string) =>
  queryUnitDb<{ id: number; booking_number: string; total: number }>(
    "SELECT id, booking_number, total FROM charter_bookings WHERE request_id = ?",
    [requestId],
  );

const countAll = async () =>
  Number((await queryUnitDb<{ n: number }>("SELECT COUNT(*) AS n FROM charter_bookings WHERE request_id LIKE 'unit-%'"))[0].n);

beforeAll(async () => {
  bookings = await import("./charter-bookings");
  charter = await import("./charter");
  const data = await charter.readCharter(destination, search, { out: null, back: null }, NOW);
  const out = data!.out[0];
  const back = data!.back.at(-1)!;
  Object.assign(trips, { out: out.id, back: back.id, outPrice: out.price, backPrice: back.price });
});

// Testerna städar efter sig
afterAll(async () => {
  const db = openUnitDb();
  try {
    await db.execute("PRAGMA foreign_keys = ON");
    await db.execute("DELETE FROM charter_bookings WHERE request_id LIKE 'unit-%'");
  } finally {
    db.close();
  }
});

test("TRIP-014-R8 a booking is saved with the database's prices and the booking number CH- and six characters", async () => {
  const requestId = "unit-charter-saved";
  // Ett pris skickat från webbläsaren räknas inte
  const tampered = { ...form(requestId), total: 1, price: 1, extras: ["ultimate", "grylls"] };
  const { bookingNumber } = await book({ form: tampered });
  expect(bookingNumber).toMatch(/^CH-[A-HJ-NP-Z2-9]{6}$/);

  const [booking] = await rowsFor(requestId);
  expect(booking.booking_number).toBe(bookingNumber);
  expect(booking.total).toBe(charterTotal([trips.outPrice, trips.backPrice], ["ultimate", "grylls"], 2));

  const saved = await queryUnitDb<{ position: number; timetable_id: string; date: string; price: number }>(
    "SELECT position, timetable_id, date, price FROM charter_booking_trips WHERE booking_id = ? ORDER BY position",
    [booking.id],
  );
  expect(saved.map((t) => [t.position, t.timetable_id, t.date, t.price])).toEqual([
    [0, trips.out, "2027-01-11", trips.outPrice],
    [1, trips.back, "2027-01-16", trips.backPrice],
  ]);
  const passengers = await queryUnitDb<{ first_name: string; age: number }>(
    "SELECT first_name, age FROM charter_booking_passengers WHERE booking_id = ? ORDER BY position",
    [booking.id],
  );
  expect(passengers.map((p) => [p.first_name, p.age])).toEqual([
    ["Unit 0", 40],
    ["Unit 1", 12],
  ]);
  const extras = await queryUnitDb<{ code: string; name: string; price: number }>(
    "SELECT code, name, price FROM charter_booking_extras WHERE booking_id = ? ORDER BY code",
    [booking.id],
  );
  expect(extras.map((e) => [e.code, e.name, e.price])).toEqual([
    ["grylls", "Bear Grylls Experience", 2000],
    ["ultimate", "Den ultimata upplevelsen", 1000],
  ]);
});

test("TRIP-014-R8 a changed price in the database is the price that is saved", async () => {
  const requestId = "unit-charter-price";
  const db = openUnitDb();
  try {
    await db.execute({ sql: "UPDATE charter_timetables SET price = 7777 WHERE id = ?", args: [trips.out] });
    await book({ form: form(requestId, { extras: [] }) });
  } finally {
    await db.execute({ sql: "UPDATE charter_timetables SET price = ? WHERE id = ?", args: [trips.outPrice, trips.out] });
    db.close();
  }
  const [booking] = await rowsFor(requestId);
  expect(booking.total).toBe((7777 + trips.backPrice) * 2);
});

test("TRIP-014-R8 two calls with one request id give one booking", async () => {
  const first = await book({ form: form("unit-charter-twice") });
  const second = await book({ form: form("unit-charter-twice") });
  expect(second.bookingNumber).toBe(first.bookingNumber);
  expect(await rowsFor("unit-charter-twice")).toHaveLength(1);
});

test("TRIP-014-R7 Dryckespaket XXXL with a traveller under 18, or an unknown extra, is refused and nothing is saved", async () => {
  const before = await countAll();
  await expect(book({ form: form("unit-charter-drinks", { extras: ["drinks"] }) })).rejects.toThrow();
  await expect(book({ form: form("unit-charter-unknown", { extras: ["free-flight"] }) })).rejects.toThrow();
  expect(await countAll()).toBe(before);
  // Med bara vuxna går samma tillägg bra
  const adults = form("unit-charter-adults", {
    extras: ["drinks"],
    passengers: [
      { firstName: "A", lastName: "B", age: "40" },
      { firstName: "C", lastName: "D", age: "18" },
    ],
  });
  await book({ form: adults });
  const [booking] = await rowsFor("unit-charter-adults");
  expect(booking.total).toBe((trips.outPrice + trips.backPrice + 4000) * 2);
});

test("TRIP-014-R8 nothing is saved when the timetable doesn't run on the date, the date has passed or the return doesn't fit", async () => {
  const before = await countAll();
  // ARN-BER-EW488 går inte på lördagar
  const saturday = { ...search, outbound: "2027-01-16" };
  await expect(
    book({ form: form("unit-charter-sat"), search: saturday, choice: { out: "ARN-BER-EW488", back: trips.back } }),
  ).rejects.toThrow(bookings.CHANGED);
  // Dagen har passerat
  await expect(book({ form: form("unit-charter-past") }, new Date("2027-02-01T10:00:00Z"))).rejects.toThrow(bookings.CHANGED);
  // Hemresan går före utresans ankomst: samma dag, den tidigaste hemresan efter den senaste utresan
  const sameDay = { ...search, return: search.outbound };
  const data = await charter.readCharter(destination, sameDay, { out: null, back: null }, NOW);
  const latest = data!.out.at(-1)!;
  const earliest = data!.back[0];
  await expect(
    book({ form: form("unit-charter-early"), search: sameDay, choice: { out: latest.id, back: earliest.id } }),
  ).rejects.toThrow(bookings.CHANGED);
  // Ett id som inte finns
  await expect(book({ form: form("unit-charter-none"), choice: { out: "nope", back: trips.back } })).rejects.toThrow(
    bookings.CHANGED,
  );
  expect(await countAll()).toBe(before);
});

test("TRIP-014-R8 a missing payment method or field is refused", async () => {
  const before = await countAll();
  await expect(book({ form: form("unit-charter-nopay", { payment: null }) })).rejects.toThrow();
  const nameless = form("unit-charter-nameless");
  nameless.passengers[0].firstName = "";
  await expect(book({ form: nameless })).rejects.toThrow();
  expect(await countAll()).toBe(before);
});
