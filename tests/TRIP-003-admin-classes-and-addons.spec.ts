import { expect, test, type Page } from "@playwright/test";
import {
  createAddon,
  createAircraft,
  createClass,
  deleteWithConfirmation,
  requireAdminPassword,
  signIn,
  tableSection,
  uniqueName,
} from "./helpers";

// The tests create their own classes and add-ons with unique names, and
// delete them again, so they can also run against the live site.

test.beforeEach(async ({ page }) => {
  requireAdminPassword();
  await signIn(page);
});

const trash = (page: Page, name: string) =>
  page.getByRole("button", { name: `Ta bort ${name}`, exact: true });

test("TRIP-003-R1 card shows classes and add-ons and can be folded", async ({ page }) => {
  const classes = tableSection(page, "Klasser");
  await expect(classes.getByRole("heading", { name: /^Klasser \(\d+\)$/ })).toBeVisible();
  await expect(classes.getByRole("columnheader", { name: "Namn" })).toBeVisible();
  const addons = tableSection(page, "Addons");
  await expect(addons.getByRole("columnheader", { name: "Pris (SEK)" })).toBeVisible();

  const toggle = page.getByRole("button", { name: "Klasser & addons" });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(classes).toBeHidden();
  await toggle.click();
  await expect(classes).toBeVisible();
});

test("TRIP-003-R2 add a cabin class, or cancel", async ({ page }) => {
  const name = uniqueName("Klass");
  await createClass(page, name);

  const section = tableSection(page, "Klasser");
  await section.getByRole("button", { name: "Lägg till", exact: true }).click();
  await page.getByLabel("Namn på klassen").fill("Ska inte sparas");
  await section.getByRole("button", { name: "Avbryt" }).click();
  await expect(page.getByLabel("Namn på klassen")).toBeHidden();
  await expect(section.getByText("Ska inte sparas")).toBeHidden();

  await deleteWithConfirmation(page, `Ta bort ${name}`);
});

test("TRIP-003-R3 class names are required and unique", async ({ page }) => {
  const name = uniqueName("Klass");
  await createClass(page, name);
  const section = tableSection(page, "Klasser");

  await section.getByRole("button", { name: "Lägg till", exact: true }).click();
  await section.getByRole("button", { name: "Spara" }).click();
  await expect(section.getByText("Klassen måste ha ett namn.")).toBeVisible();

  await page.getByLabel("Namn på klassen").fill(`  ${name.toLowerCase()}  `);
  await section.getByRole("button", { name: "Spara" }).click();
  await expect(section.getByText(`Klassen "${name.toLowerCase()}" finns redan.`)).toBeVisible();
  await section.getByRole("button", { name: "Avbryt" }).click();

  await deleteWithConfirmation(page, `Ta bort ${name}`);
});

test("TRIP-003-R4 rename a cabin class", async ({ page }) => {
  const name = uniqueName("Klass");
  const renamed = `${name} ny`;
  await createClass(page, name);

  await page.getByRole("button", { name: `Ändra ${name}`, exact: true }).click();
  await page.getByLabel("Namn på klassen").fill(renamed);
  await tableSection(page, "Klasser").getByRole("button", { name: "Spara" }).click();
  await expect(trash(page, renamed)).toBeVisible();
  await expect(trash(page, name)).toBeHidden();

  await deleteWithConfirmation(page, `Ta bort ${renamed}`);
});

test("TRIP-003-R5 delete a cabin class, unless it is in use", async ({ page }) => {
  const name = uniqueName("Klass");
  await createClass(page, name);

  // Nej keeps the class
  await trash(page, name).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Nej" }).click();
  await expect(trash(page, name)).toBeVisible();

  // In use by an aircraft: can't be deleted
  const aircraft = uniqueName("Plan");
  await createAircraft(page, aircraft, [{ name, seats: 10 }]);
  await trash(page, name).click();
  const dialog = page.getByRole("alertdialog");
  await dialog.getByRole("button", { name: "Ja" }).click();
  await expect(dialog.getByRole("heading", { name: "Du kan ej ta bort" })).toBeVisible();
  await expect(dialog.getByText("den används av ett plan eller en flight")).toBeVisible();
  await dialog.getByRole("button", { name: "OK" }).click();
  await expect(dialog).toBeHidden();
  await expect(trash(page, name)).toBeVisible();

  // Ja deletes it once nothing uses it
  await deleteWithConfirmation(page, `Ta bort ${aircraft}`);
  await deleteWithConfirmation(page, `Ta bort ${name}`);
  await expect(trash(page, name)).toBeHidden();
});

test("TRIP-003-R6 add an add-on with name, price and description", async ({ page }) => {
  const name = uniqueName("Addon");
  await createAddon(page, name, "249", "Ett extra kolli på 23 kg");

  const row = tableSection(page, "Addons").getByRole("row", { name: new RegExp(name) });
  await expect(row).toContainText("Ett extra kolli på 23 kg");
  await expect(row.getByRole("cell").nth(1)).toHaveText("249");

  await deleteWithConfirmation(page, `Ta bort ${name}`);
});

test("TRIP-003-R7 add-on fields are required and names unique", async ({ page }) => {
  const name = uniqueName("Addon");
  await createAddon(page, name, "10", "Beskrivning");
  const section = tableSection(page, "Addons");
  const save = section.getByRole("button", { name: "Spara" });

  await section.getByRole("button", { name: "Lägg till", exact: true }).click();
  await page.getByLabel("Namn på addon").fill(`${name} 2`);
  await page.getByLabel("Beskrivning").fill("Beskrivning");
  await save.click();
  await expect(section.getByText("Ange ett pris.")).toBeVisible();

  await page.getByLabel("Pris i kronor").fill("10");
  await page.getByLabel("Beskrivning").fill("");
  await save.click();
  await expect(section.getByText("Addon måste ha en beskrivning.")).toBeVisible();

  await page.getByLabel("Beskrivning").fill("Beskrivning");
  await page.getByLabel("Namn på addon").fill("");
  await save.click();
  await expect(section.getByText("Addon måste ha ett namn.")).toBeVisible();

  await page.getByLabel("Namn på addon").fill(name.toUpperCase());
  await save.click();
  await expect(section.getByText(`Addon "${name.toUpperCase()}" finns redan.`)).toBeVisible();
  await section.getByRole("button", { name: "Avbryt" }).click();

  await deleteWithConfirmation(page, `Ta bort ${name}`);
});

test("TRIP-003-R8 change an add-on", async ({ page }) => {
  const name = uniqueName("Addon");
  await createAddon(page, name, "100", "Beskrivning");

  await page.getByRole("button", { name: `Ändra ${name}`, exact: true }).click();
  await expect(page.getByLabel("Namn på addon")).toHaveValue(name);
  await expect(page.getByLabel("Pris i kronor")).toHaveValue("100");
  await page.getByLabel("Pris i kronor").fill("150");
  await tableSection(page, "Addons").getByRole("button", { name: "Spara" }).click();

  const row = tableSection(page, "Addons").getByRole("row", { name: new RegExp(name) });
  await expect(row.getByRole("cell").nth(1)).toHaveText("150");

  await deleteWithConfirmation(page, `Ta bort ${name}`);
});

test("TRIP-003-R9 delete an add-on, unless it is in use", async ({ page }) => {
  const name = uniqueName("Addon");
  const aircraft = uniqueName("Plan");
  await createAddon(page, name, "50", "Beskrivning");
  await createAircraft(page, aircraft, [{ name: "Ekonomi", seats: 10 }], [{ name, className: "Ekonomi" }]);

  await trash(page, name).click();
  const dialog = page.getByRole("alertdialog");
  await dialog.getByRole("button", { name: "Ja" }).click();
  await expect(dialog.getByRole("heading", { name: "Du kan ej ta bort" })).toBeVisible();
  await expect(dialog.getByText("den används av ett plan eller en bokning")).toBeVisible();
  await dialog.getByRole("button", { name: "OK" }).click();

  await deleteWithConfirmation(page, `Ta bort ${aircraft}`);
  await deleteWithConfirmation(page, `Ta bort ${name}`);
  await expect(trash(page, name)).toBeHidden();
});
