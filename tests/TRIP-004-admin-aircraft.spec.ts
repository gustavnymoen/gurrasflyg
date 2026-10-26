import { expect, test, type Page } from "@playwright/test";
import {
  createAddon,
  createAircraft,
  deleteWithConfirmation,
  fillAircraftForm,
  requireAdminPassword,
  signIn,
  uniqueName,
} from "./helpers";

// The tests create their own aircraft and add-ons with unique names, and
// delete them again, so they can also run against the live site.

test.beforeEach(async ({ page }) => {
  requireAdminPassword();
  await signIn(page);
});

const aircraftRow = (page: Page, name: string) =>
  page.getByRole("row").filter({ has: page.getByRole("button", { name: `Ta bort ${name}`, exact: true }) });

const form = (page: Page) => page.locator("form").filter({ has: page.getByLabel("Planets namn") });

async function openNewForm(page: Page) {
  await page.getByRole("button", { name: "Lägg till plan" }).click();
  await expect(form(page).getByRole("heading", { name: "Nytt plan" })).toBeVisible();
}

test("TRIP-004-R1 R2 R7 R8 R9 the table shows an aircraft's classes, seats and add-ons, names are unique, it is changed and deleted", async ({ page }) => {
  const name = uniqueName("Plan");
  const renamed = `${name} ny`;
  const addon = uniqueName("Måltid");
  await createAddon(page, addon, "95", "Varm måltid");

  // R1: the table
  await expect(page.getByRole("button", { name: /^Plan/ })).toBeVisible();
  for (const column of ["Namn", "Klasser", "Platser"]) {
    await expect(page.getByRole("columnheader", { name: column, exact: true }).first()).toBeVisible();
  }
  await createAircraft(
    page,
    name,
    [
      { name: "Ekonomi", seats: 100 },
      { name: "Business", seats: 20 },
    ],
    [{ name: addon, className: "Business" }],
  );
  const cells = aircraftRow(page, name).getByRole("cell");
  // Namn, Prisfaktor, Tidsfaktor (TRIP-011-R8), Klasser, Platser
  await expect(cells.nth(1)).toHaveText(name);
  await expect(cells.nth(4)).toHaveText("2");
  await expect(cells.nth(5)).toHaveText("120");

  // R2: expanding shows the classes, add-ons and prices
  await page.getByRole("button", { name: `Visa ${name}`, exact: true }).click();
  const business = page.getByRole("row").filter({ has: page.getByRole("button", { name: "Visa Business" }) });
  await expect(business).toContainText("1 addon");
  await expect(business).toContainText("20");
  await business.getByRole("button", { name: "Visa Business" }).click();
  await expect(page.getByText(new RegExp(`${addon} · 95\\s*kr`))).toBeVisible();
  await page.getByRole("button", { name: "Visa Ekonomi" }).click();
  await expect(page.getByText("Inga addons i den här klassen.")).toBeVisible();

  // R7: the name and a class are required, and names are unique
  await openNewForm(page);
  const f = form(page);
  const save = f.getByRole("button", { name: "Spara", exact: true });
  await save.click();
  await expect(f.getByText("Planet måste ha ett namn.")).toBeVisible();
  await f.getByLabel("Planets namn").fill(`${name} 2`);
  await save.click();
  await expect(f.getByText("Planet måste ha minst en klass.")).toBeVisible();
  await fillAircraftForm(page, name.toUpperCase(), [{ name: "Ekonomi", seats: 10 }]);
  await save.click();
  await expect(f.getByText(`Det finns redan ett plan som heter "${name.toUpperCase()}".`)).toBeVisible();
  await f.getByRole("button", { name: "Avbryt", exact: true }).click();

  // R8: change the name and the classes
  await page.getByRole("button", { name: `Ändra ${name}`, exact: true }).click();
  await expect(f.getByRole("heading", { name: `Ändra ${name}` })).toBeVisible();
  await expect(f.getByLabel("Planets namn")).toHaveValue(name);
  await expect(f.getByText("100 platser")).toBeVisible();
  await expect(f.getByText("20 platser")).toBeVisible();
  await f.getByRole("button", { name: "Ta bort Business från planet" }).click();
  await fillAircraftForm(page, renamed, [{ name: "Business", seats: 5 }]);
  await save.click();
  const renamedCells = aircraftRow(page, renamed).getByRole("cell");
  await expect(renamedCells.nth(4)).toHaveText("2");
  await expect(renamedCells.nth(5)).toHaveText("105");

  // R9: Nej keeps the aircraft, Ja deletes it
  await page.getByRole("button", { name: `Ta bort ${renamed}`, exact: true }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Nej" }).click();
  await expect(aircraftRow(page, renamed)).toBeVisible();
  await deleteWithConfirmation(page, `Ta bort ${renamed}`);
  await expect(aircraftRow(page, renamed)).toHaveCount(0);
  await deleteWithConfirmation(page, `Ta bort ${addon}`);
});

test("TRIP-004-R3 R4 R5 R6 the new aircraft's form: cancel discards, classes need valid seats and are added once, seats are changed, add-ons are chosen per class", async ({ page }) => {
  const addon = uniqueName("Addon");
  await createAddon(page, addon, "10", "Beskrivning");

  // R3: cancel discards the new aircraft
  const discarded = uniqueName("Plan");
  await openNewForm(page);
  await fillAircraftForm(page, discarded, [{ name: "Ekonomi", seats: 50 }]);
  await form(page).getByRole("button", { name: "Avbryt", exact: true }).click();
  await expect(form(page)).toBeHidden();
  await expect(page.getByRole("button", { name: `Ta bort ${discarded}`, exact: true })).toBeHidden();

  // R4: valid seats, each class once
  await openNewForm(page);
  const f = form(page);
  await f.getByRole("button", { name: "Lägg till klass" }).click();
  const plusClass = f.getByRole("button", { name: "Lägg till klass" });
  await f.getByLabel("Klass att lägga till").selectOption({ label: "Business" });
  for (const seats of ["0", "abc", "2.5"]) {
    await f.getByLabel("Antal platser", { exact: true }).fill(seats);
    await expect(plusClass).toHaveAttribute("aria-disabled", "true");
  }
  await f.getByLabel("Antal platser", { exact: true }).fill("20");
  await plusClass.click();
  await f.getByRole("button", { name: "Lägg till klass" }).click();
  const options = f.getByLabel("Klass att lägga till").locator("option");
  await expect(options.filter({ hasText: "Business" })).toHaveCount(0);
  await f.getByLabel("Klass att lägga till").selectOption({ label: "Ekonomi" });
  await f.getByLabel("Antal platser", { exact: true }).fill("100");
  await f.getByRole("button", { name: "Lägg till klass" }).click();
  // Listed in the class table's order: Ekonomi before Business
  const listed = f.getByRole("listitem").filter({ hasText: "platser" });
  await expect(listed.nth(0)).toContainText("Ekonomi");
  await expect(listed.nth(0)).toContainText("100 platser");
  await expect(listed.nth(1)).toContainText("Business");

  // R5: seats can be changed
  await f.getByRole("button", { name: "Ändra platser i Ekonomi" }).click();
  const seats = f.getByLabel("Antal platser i Ekonomi");
  await seats.fill("0");
  await expect(f.getByRole("button", { name: "Klar" })).toBeDisabled();
  await seats.fill("150");
  await f.getByRole("button", { name: "Klar" }).click();
  await expect(f.getByText("150 platser")).toBeVisible();

  // R6: an add-on is chosen per class, once each
  await f.getByRole("button", { name: "Lägg till addon" }).click();
  const plusAddon = f.getByRole("button", { name: "Lägg till addon" });
  await f.getByLabel("Addon", { exact: true }).selectOption({ label: addon });
  await expect(plusAddon).toHaveAttribute("aria-disabled", "true");
  await f.getByLabel("Klass", { exact: true }).selectOption({ label: "Ekonomi" });
  await plusAddon.click();
  await expect(f.getByRole("listitem").filter({ hasText: addon })).toContainText("Ekonomi");
  await f.getByRole("button", { name: "Lägg till addon" }).click();
  await f.getByLabel("Addon", { exact: true }).selectOption({ label: addon });
  await f.getByLabel("Klass", { exact: true }).selectOption({ label: "Ekonomi" });
  await plusAddon.click();
  await expect(f.getByText("Den addonen finns redan i den klassen.")).toBeVisible();
  // The add-on row's ✕ is also called Avbryt, so the add-on row is closed by its own button first
  await f.getByRole("button", { name: "Avbryt", exact: true }).first().click();

  // R5: removing a class removes its add-ons
  await f.getByRole("button", { name: "Ta bort Ekonomi från planet" }).click();
  await f.getByRole("button", { name: "Ta bort Business från planet" }).click();
  await expect(f.getByText("Inga klasser tillagda.")).toBeVisible();
  await expect(f.getByText("Inga addons tillagda.")).toBeVisible();
  await expect(f.getByRole("button", { name: "Lägg till addon" })).toBeDisabled();

  await f.getByRole("button", { name: "Avbryt", exact: true }).last().click();
  await deleteWithConfirmation(page, `Ta bort ${addon}`);
});
