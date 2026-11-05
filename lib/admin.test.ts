import { afterEach, beforeAll, beforeEach, expect, test } from "vitest";
import { queryUnitDb } from "../db/test-db";
import { unitTestDbFile } from "./local-db.mjs";

// Planer, klasser och addons skapas i enhetstesternas egen databas
// (vitest.global-setup.mjs), aldrig i din. lib/db.ts läser adressen när den
// importeras, så admin importeras först när den är satt.
process.env.TURSO_DATABASE_URL = `file:${unitTestDbFile}`;
let admin: typeof import("./admin");

beforeAll(async () => {
  admin = await import("./admin");
});

const exists = async (table: "classes" | "addons", name: string) =>
  (await queryUnitDb(`SELECT 1 FROM ${table} WHERE name = ?`, [name])).length === 1;

const idOf = async (table: "classes" | "addons" | "aircraft", name: string) =>
  (await queryUnitDb<{ id: number }>(`SELECT id FROM ${table} WHERE name = ?`, [name]))[0].id;

// En klass och en addon som bara de planen som skickas in använder
async function planeWith(plane: string, className: string, addonName: string) {
  const classId = await idOf("classes", className);
  const addonId = await idOf("addons", addonName);
  await admin.createAircraft({
    name: plane,
    priceFactor: "1,00",
    timeFactor: "1,00",
    classes: [{ classId, capacity: 10 }],
    addons: [{ addonId, classId }],
  });
}

const names = { cls: "TRIP-016 Klass", addon: "TRIP-016 Addon", planeA: "TRIP-016 Plan A", planeB: "TRIP-016 Plan B" };

// Varje test börjar med en egen klass och addon, och städar efter sig
beforeEach(async () => {
  await admin.createClass(names.cls, "1,00");
  await admin.createAddon({ name: names.addon, description: "Unit", price: "10" });
});

afterEach(async () => {
  for (const plane of [names.planeA, names.planeB]) {
    if ((await queryUnitDb("SELECT 1 FROM aircraft WHERE name = ?", [plane])).length) {
      await admin.deleteAircraft(await idOf("aircraft", plane));
    }
  }
  if (await exists("addons", names.addon)) await admin.deleteAddon(await idOf("addons", names.addon));
  if (await exists("classes", names.cls)) await admin.deleteClass(await idOf("classes", names.cls));
});

test("TRIP-016-R1 deleting the only aircraft frees its class and add-on", async () => {
  await planeWith(names.planeA, names.cls, names.addon);
  const classId = await idOf("classes", names.cls);
  const addonId = await idOf("addons", names.addon);

  await expect(admin.deleteClass(classId)).rejects.toThrow("Du kan ej ta bort");
  await expect(admin.deleteAddon(addonId)).rejects.toThrow("Du kan ej ta bort");

  await admin.deleteAircraft(await idOf("aircraft", names.planeA));
  await admin.deleteAddon(addonId);
  await admin.deleteClass(classId);
  expect(await exists("classes", names.cls)).toBe(false);
  expect(await exists("addons", names.addon)).toBe(false);
});

test("TRIP-016-R1 a class and add-on shared with another aircraft stay in use", async () => {
  await planeWith(names.planeA, names.cls, names.addon);
  await planeWith(names.planeB, names.cls, names.addon);
  await admin.deleteAircraft(await idOf("aircraft", names.planeA));

  await expect(admin.deleteClass(await idOf("classes", names.cls))).rejects.toThrow("Du kan ej ta bort");
  await expect(admin.deleteAddon(await idOf("addons", names.addon))).rejects.toThrow("Du kan ej ta bort");
  expect(await exists("classes", names.cls)).toBe(true);
  expect(await exists("addons", names.addon)).toBe(true);
});

test("TRIP-039-R5 an aircraft, class and add-on used by a charter booking cannot be deleted", async () => {
  await planeWith(names.planeA, names.cls, names.addon);
  const [aircraft, classId, addonId] = [
    await idOf("aircraft", names.planeA),
    await idOf("classes", names.cls),
    await idOf("addons", names.addon),
  ];
  const [pair] = await queryUnitDb<{ timetable: string; destination: string }>(
    `SELECT t.id AS timetable, d.id AS destination FROM charter_timetables t
     JOIN destinations d ON d.nearest_airport = t.to_airport WHERE t.from_airport = 'ARN' LIMIT 1`,
  );
  // Bokningen skrivs direkt i enhetstesternas databas och städas bort nedan
  const { openUnitDb } = await import("../db/test-db");
  const db = openUnitDb();
  try {
    await db.execute("PRAGMA foreign_keys = ON");
    await db.executeMultiple(`
      INSERT INTO charter_bookings (booking_number, request_id, destination_id, first_name, last_name, email, phone, address, payment, total)
        VALUES ('CH-KMNPQ4', 'unit-admin-charter', '${pair.destination}', 'A', 'B', 'a@b.se', '0701234567', 'Gatan 1', 'cash', 1000);
      INSERT INTO charter_booking_passengers (booking_id, position, first_name, last_name, age)
        VALUES ((SELECT id FROM charter_bookings WHERE request_id = 'unit-admin-charter'), 0, 'A', 'B', 40);
      INSERT INTO charter_booking_trips (booking_id, position, timetable_id, date, price, aircraft_id)
        VALUES ((SELECT id FROM charter_bookings WHERE request_id = 'unit-admin-charter'), 0, '${pair.timetable}', '2030-01-10', 1000, ${aircraft});
      INSERT INTO charter_booking_seats (booking_trip_id, passenger_id, class_id, price)
        VALUES ((SELECT id FROM charter_booking_trips WHERE aircraft_id = ${aircraft}),
                (SELECT id FROM charter_booking_passengers WHERE first_name = 'A' AND booking_id IN (SELECT id FROM charter_bookings WHERE request_id = 'unit-admin-charter')), ${classId}, 1000);
      INSERT INTO charter_booking_addons (booking_seat_id, addon_id, name, count, price)
        VALUES ((SELECT id FROM charter_booking_seats WHERE class_id = ${classId}), ${addonId}, 'Unit', 1, 10);
    `);
    await expect(admin.deleteAircraft(aircraft)).rejects.toThrow("Du kan ej ta bort");
    await expect(admin.deleteClass(classId)).rejects.toThrow("Du kan ej ta bort");
    await expect(admin.deleteAddon(addonId)).rejects.toThrow("Du kan ej ta bort");
  } finally {
    await db.execute("DELETE FROM charter_bookings WHERE request_id = 'unit-admin-charter'");
    db.close();
  }
});
