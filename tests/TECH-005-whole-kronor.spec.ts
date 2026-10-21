import { readFileSync } from "node:fs";
import { createClient } from "@libsql/client";
import { expect, test } from "@playwright/test";
import { formatAmount, formatPrice } from "../lib/format";
import {
  createAddon,
  createAircraft,
  deleteWithConfirmation,
  requireAdminPassword,
  signIn,
  tableSection,
  uniqueName,
} from "./helpers";

// R2 runs the migration on a database in memory, so it never touches
// a real database. The admin tests create and delete their own add-ons.

const readSql = (file: string) => readFileSync(`db/${file}`, "utf8");

test("TECH-005-R2 the migration converts öre to the nearest whole krona", async () => {
  const db = createClient({ url: ":memory:" });
  try {
    await db.executeMultiple(readSql("schema.sql"));
    await db.execute(`INSERT INTO addons (name, description, price) VALUES
      ('Bagage', '', 24900), ('Halv', '', 1250), ('Under halv', '', 1249), ('Gratis', '', 0)`);
    await db.executeMultiple(readSql("migrations/004_whole_kronor.sql"));

    const rows = await db.execute("SELECT name, price FROM addons ORDER BY id");
    expect(rows.rows.map((r) => [r.name, r.price])).toEqual([
      ["Bagage", 249],
      ["Halv", 13],
      ["Under halv", 12],
      ["Gratis", 0],
    ]);
  } finally {
    db.close();
  }
});

test("TECH-005-R3 prices are formatted as whole kronor", () => {
  // Intl skriver mellanslag som hårt mellanslag
  expect(formatPrice(1290).replace(/\s/g, " ")).toBe("1 290 kr");
  expect(formatAmount(1290).replace(/\s/g, " ")).toBe("1 290");
  expect(formatPrice(0).replace(/\s/g, " ")).toBe("0 kr");
});

test("TECH-005-R3 the seed data has no prices", () => {
  const seed = readSql("seed.sql");
  for (const table of ["addons", "flight_prices", "booking_flights", "booking_flight_addons"]) {
    expect(seed).not.toMatch(new RegExp(`INSERT INTO ${table}\\b`));
  }
});

test.describe("admin", () => {
  test.beforeEach(async ({ page }) => {
    requireAdminPassword();
    await signIn(page);
  });

  test("TECH-005-R1 a price in kronor is shown as before", async ({ page }) => {
    const addon = uniqueName("Addon");
    const aircraft = uniqueName("Plan");
    await createAddon(page, addon, "249", "Beskrivning");
    await createAircraft(page, aircraft, [{ name: "Ekonomi", seats: 100 }], [{ name: addon, className: "Ekonomi" }]);

    const row = tableSection(page, "Addons").getByRole("row", { name: new RegExp(addon) });
    await expect(row.getByRole("cell").nth(1)).toHaveText("249");
    await page.getByRole("button", { name: `Visa ${aircraft}`, exact: true }).click();
    await page.getByRole("button", { name: "Visa Ekonomi" }).click();
    await expect(page.getByText(new RegExp(`${addon} · 249\\s*kr`))).toBeVisible();

    await deleteWithConfirmation(page, `Ta bort ${aircraft}`);
    await deleteWithConfirmation(page, `Ta bort ${addon}`);
  });

  test("TECH-005-R4 add-on prices must be whole kronor, 0 or more", async ({ page }) => {
    const name = uniqueName("Addon");
    const section = tableSection(page, "Addons");
    const price = page.getByLabel("Pris i kronor");
    const save = section.getByRole("button", { name: "Spara" });

    await section.getByRole("button", { name: "Lägg till", exact: true }).click();
    await page.getByLabel("Namn på addon").fill(name);
    await page.getByLabel("Beskrivning").fill("Beskrivning");

    for (const notWhole of ["12,50", "12.50", "tolv"]) {
      await price.fill(notWhole);
      await save.click();
      await expect(section.getByText("Ange priset i hela kronor.")).toBeVisible();
      await expect(page.getByRole("button", { name: `Ta bort ${name}`, exact: true })).toBeHidden();
    }

    await price.fill("-5");
    await save.click();
    await expect(section.getByText("Priset måste vara 0 kr eller mer.")).toBeVisible();

    await price.fill("0");
    await save.click();
    const row = section.getByRole("row", { name: new RegExp(name) });
    await expect(row.getByRole("cell").nth(1)).toHaveText("0");

    // Mellanslag mellan tusentalen går bra
    await page.getByRole("button", { name: `Ändra ${name}`, exact: true }).click();
    await price.fill("1 290");
    await save.click();
    await expect(row.getByRole("cell").nth(1)).toHaveText(/^1\s290$/);

    // Ändra till ören: felet visas och priset ligger kvar
    await page.getByRole("button", { name: `Ändra ${name}`, exact: true }).click();
    await price.fill("12,50");
    await save.click();
    await expect(section.getByText("Ange priset i hela kronor.")).toBeVisible();
    await section.getByRole("button", { name: "Avbryt" }).click();
    await expect(row.getByRole("cell").nth(1)).toHaveText(/^1\s290$/);

    await deleteWithConfirmation(page, `Ta bort ${name}`);
  });
});
