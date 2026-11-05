import { afterAll, beforeAll, expect, test } from "vitest";
import { openUnitDb, queryUnitDb } from "../db/test-db";
import { type CharterChoice, type CharterForm, type CharterSearch, emptyCharterForm, NO_CHOICE } from "./charter-rules";
import { fare } from "./fare-rules";
import { unitTestDbFile } from "./local-db.mjs";

// Sparar charterbokningar i enhetstesternas egen databas (vitest.global-setup.mjs),
// aldrig i din. lib/db.ts läser adressen när den importeras, så modulerna
// importeras först när den är satt.
process.env.TURSO_DATABASE_URL = `file:${unitTestDbFile}`;
let bookings: typeof import("./charter-bookings");
let charter: typeof import("./charter");
let INVALID: string;

const destination = { id: "teufelsberg", title: "Teufelsberg", airport: "BER" };
// Måndag 2027-01-11 ut och lördag 2027-01-16 hem, sedda från en dag i november
const NOW = new Date("2026-11-02T10:00:00Z");
const search: CharterSearch = { from: "ARN", outbound: "2027-01-11", return: "2027-01-16", travellers: 2 };
// Utresan och hemresan som testet väljer: den första utresan och den sista hemresan
const trips = { out: "", back: "", outPrice: 0, backPrice: 0 };
// Testets plan, klasser och tillägg (satta i beforeAll). Planet har en tidsfaktor som charter ska bortse från.
const ids = { aircraft: 0, economy: 0, business: 0, meal: 0 };
const PLANE_PERCENT = 120;
const seating = () => ({ [ids.business]: 1, [ids.economy]: 1 });
const plan = () => ({ aircraftId: ids.aircraft, seating: seating() });
const choice = (over: Partial<CharterChoice> = {}): CharterChoice => ({
  out: trips.out,
  back: trips.back,
  plans: [plan(), plan()],
  ...over,
});

// Resenär 0 får Business och resenär 1 Ekonomi, på båda resorna: den dyraste klassen först
const leg = (classId: number, addons: Record<number, number> = {}) => ({ classId, addons });
const seated = (...legs: ReturnType<typeof leg>[]) => legs;

function form(requestId: string, over: Partial<CharterForm> = {}): CharterForm {
  return {
    ...emptyCharterForm(requestId),
    legKeys: ["", ""],
    passengers: [
      { firstName: "Unit 0", lastName: "Test", age: "40", legs: seated(leg(ids.business), leg(ids.business)) },
      { firstName: "Unit 1", lastName: "Test", age: "12", legs: seated(leg(ids.economy), leg(ids.economy)) },
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

// Vad de två resenärerna kostar på en resa med en avgång för priset price: Business plus Ekonomi
const seats = (price: number) => fare(price, PLANE_PERCENT, 150) + fare(price, PLANE_PERCENT, 100);

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
  ({ INVALID } = await import("./booking-common"));
  const data = await charter.readCharter(destination, search, NO_CHOICE, NOW);
  const out = data!.out[0];
  const back = data!.back.at(-1)!;
  Object.assign(trips, { out: out.id, back: back.id, outPrice: out.price, backPrice: back.price });

  const db = openUnitDb();
  try {
    const classId = async (name: string) =>
      Number((await db.execute({ sql: "SELECT id FROM classes WHERE name = ?", args: [name] })).rows[0].id);
    ids.economy = await classId("Ekonomi");
    ids.business = await classId("Business");
    ids.aircraft = Number(
      (
        await db.execute({
          sql: "INSERT INTO aircraft (name, price_percent, time_percent) VALUES ('Unit Charterplan', ?, 200)",
          args: [PLANE_PERCENT],
        })
      ).lastInsertRowid,
    );
    for (const [id, capacity] of [
      [ids.economy, 10],
      [ids.business, 4],
    ]) {
      await db.execute({
        sql: "INSERT INTO aircraft_capacity (aircraft_id, class_id, capacity) VALUES (?, ?, ?)",
        args: [ids.aircraft, id, capacity],
      });
    }
    ids.meal = Number(
      (await db.execute("INSERT INTO addons (name, description, price) VALUES ('Unit Måltid', 'Unit', 120)")).lastInsertRowid,
    );
    for (const id of [ids.economy, ids.business]) {
      await db.execute({
        sql: "INSERT INTO aircraft_class_addons (aircraft_id, class_id, addon_id) VALUES (?, ?, ?)",
        args: [ids.aircraft, id, ids.meal],
      });
    }
  } finally {
    db.close();
  }
});

// Testerna städar efter sig: bokningarna, och sedan planet och tillägget
afterAll(async () => {
  const db = openUnitDb();
  try {
    await db.execute("PRAGMA foreign_keys = ON");
    await db.execute("DELETE FROM charter_bookings WHERE request_id LIKE 'unit-%'");
    await db.execute({ sql: "DELETE FROM aircraft_class_addons WHERE aircraft_id = ?", args: [ids.aircraft] });
    await db.execute({ sql: "DELETE FROM aircraft_capacity WHERE aircraft_id = ?", args: [ids.aircraft] });
    await db.execute({ sql: "DELETE FROM aircraft WHERE id = ?", args: [ids.aircraft] });
    await db.execute("DELETE FROM addons WHERE name LIKE 'Unit %'");
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
  expect(booking.total).toBe(seats(trips.outPrice) + seats(trips.backPrice) + (1000 + 2000) * 2);

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

test("TRIP-039-R3 R5 the aircraft, the seats with their classes and prices, and the add-ons are saved", async () => {
  const requestId = "unit-charter-seats";
  const base = form(requestId, { extras: [] });
  base.passengers[1].legs = seated(leg(ids.economy, { [ids.meal]: 2 }), leg(ids.economy));
  await book({ form: base });
  const [booking] = await rowsFor(requestId);
  expect(booking.total).toBe(seats(trips.outPrice) + seats(trips.backPrice) + 2 * 120);

  const trip = await queryUnitDb<{ position: number; aircraft_id: number; price: number }>(
    "SELECT position, aircraft_id, price FROM charter_booking_trips WHERE booking_id = ? ORDER BY position",
    [booking.id],
  );
  // Avgångens pris är kvar som basen, och planet är sparat
  expect(trip.map((t) => [t.position, t.aircraft_id, t.price])).toEqual([
    [0, ids.aircraft, trips.outPrice],
    [1, ids.aircraft, trips.backPrice],
  ]);
  const seatRows = await queryUnitDb<{ position: number; passenger: string; class_id: number; price: number }>(
    `SELECT bt.position, p.first_name AS passenger, s.class_id, s.price FROM charter_booking_seats s
     JOIN charter_booking_trips bt ON bt.id = s.booking_trip_id
     JOIN charter_booking_passengers p ON p.id = s.passenger_id
     WHERE bt.booking_id = ? ORDER BY bt.position, p.position`,
    [booking.id],
  );
  expect(seatRows.map((r) => [r.position, r.passenger, r.class_id, r.price])).toEqual([
    [0, "Unit 0", ids.business, fare(trips.outPrice, PLANE_PERCENT, 150)],
    [0, "Unit 1", ids.economy, fare(trips.outPrice, PLANE_PERCENT, 100)],
    [1, "Unit 0", ids.business, fare(trips.backPrice, PLANE_PERCENT, 150)],
    [1, "Unit 1", ids.economy, fare(trips.backPrice, PLANE_PERCENT, 100)],
  ]);
  const addons = await queryUnitDb<{ name: string; count: number; price: number }>(
    `SELECT a.name, a.count, a.price FROM charter_booking_addons a
     JOIN charter_booking_seats s ON s.id = a.booking_seat_id
     JOIN charter_booking_trips bt ON bt.id = s.booking_trip_id WHERE bt.booking_id = ?`,
    [booking.id],
  );
  expect(addons.map((a) => [a.name, a.count, a.price])).toEqual([["Unit Måltid", 2, 120]]);
});

test("TRIP-039-R2 the time factor of an aircraft is ignored in charter", async () => {
  const data = await charter.readCharter(destination, search, choice(), NOW);
  expect(data!.fleet.find((a) => a.id === ids.aircraft)?.timePercent).toBe(100);
});

test("TRIP-039-R5 R6 a missing or wrong aircraft, classes that don't fit or add-ons in the wrong class are refused and nothing is saved", async () => {
  const before = await countAll();
  // Inget plan, ett plan som inte finns, antal som inte går ihop med resenärerna
  const none = { aircraftId: null, seating: null };
  await expect(book({ form: form("unit-charter-noplan"), choice: choice({ plans: [none, plan()] }) })).rejects.toThrow(bookings.CHANGED);
  await expect(book({ form: form("unit-charter-badplan"), choice: choice({ plans: [plan(), { ...plan(), aircraftId: 999_999 }] }) })).rejects.toThrow(bookings.CHANGED);
  const tooMany = { aircraftId: ids.aircraft, seating: { [ids.economy]: 3 } };
  await expect(book({ form: form("unit-charter-three"), choice: choice({ plans: [plan(), tooMany] }) })).rejects.toThrow(bookings.CHANGED);
  const tooFew = { aircraftId: ids.aircraft, seating: { [ids.economy]: 1 } };
  await expect(book({ form: form("unit-charter-few"), choice: choice({ plans: [tooFew, plan()] }) })).rejects.toThrow(bookings.CHANGED);

  // Klasserna i formuläret stämmer inte med antalen: fel ordning, eller en klass som planet inte har
  const swapped = form("unit-charter-swapped");
  swapped.passengers[0].legs[0] = leg(ids.economy);
  swapped.passengers[1].legs[0] = leg(ids.business);
  await expect(book({ form: swapped })).rejects.toThrow(INVALID);
  const foreign = form("unit-charter-foreign");
  foreign.passengers[0].legs[1] = leg(999_999);
  await expect(book({ form: foreign })).rejects.toThrow(INVALID);
  // Ett tillägg som inte finns i klassen, och fler än 10
  const unknownAddon = form("unit-charter-addon");
  unknownAddon.passengers[0].legs[0] = leg(ids.business, { 999_999: 1 });
  await expect(book({ form: unknownAddon })).rejects.toThrow(INVALID);
  const eleven = form("unit-charter-eleven");
  eleven.passengers[0].legs[0] = leg(ids.business, { [ids.meal]: 11 });
  await expect(book({ form: eleven })).rejects.toThrow(INVALID);
  expect(await countAll()).toBe(before);
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
  expect(booking.total).toBe(seats(7777) + seats(trips.backPrice));
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
      { firstName: "A", lastName: "B", age: "40", legs: seated(leg(ids.business), leg(ids.business)) },
      { firstName: "C", lastName: "D", age: "18", legs: seated(leg(ids.economy), leg(ids.economy)) },
    ],
  });
  await book({ form: adults });
  const [booking] = await rowsFor("unit-charter-adults");
  expect(booking.total).toBe(seats(trips.outPrice) + seats(trips.backPrice) + 4000 * 2);
});

test("TRIP-014-R8 nothing is saved when the timetable doesn't run on the date, the date has passed or the return doesn't fit", async () => {
  const before = await countAll();
  // ARN-BER-EW488 går inte på lördagar
  const saturday = { ...search, outbound: "2027-01-16" };
  await expect(
    book({ form: form("unit-charter-sat"), search: saturday, choice: choice({ out: "ARN-BER-EW488" }) }),
  ).rejects.toThrow(bookings.CHANGED);
  // Dagen har passerat
  await expect(book({ form: form("unit-charter-past") }, new Date("2027-02-01T10:00:00Z"))).rejects.toThrow(bookings.CHANGED);
  // Hemresan går före utresans ankomst: samma dag, den tidigaste hemresan efter den senaste utresan
  const sameDay = { ...search, return: search.outbound };
  const data = await charter.readCharter(destination, sameDay, NO_CHOICE, NOW);
  const latest = data!.out.at(-1)!;
  const earliest = data!.back[0];
  await expect(
    book({ form: form("unit-charter-early"), search: sameDay, choice: choice({ out: latest.id, back: earliest.id }) }),
  ).rejects.toThrow(bookings.CHANGED);
  // Ett id som inte finns
  await expect(book({ form: form("unit-charter-none"), choice: choice({ out: "nope" }) })).rejects.toThrow(
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
