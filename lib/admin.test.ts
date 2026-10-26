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
