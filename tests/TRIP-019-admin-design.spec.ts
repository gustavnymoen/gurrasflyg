import { expect, test, type Page } from "@playwright/test";
import {
  ACCENT,
  ACCENT_STRONG,
  CARD_SHADOW,
  createClass,
  css,
  DANGER,
  deleteWithConfirmation,
  EDGE,
  expectNoA11yViolations,
  expectTextMessage,
  FLOAT_SHADOW,
  requireAdminPassword,
  reviewForm,
  signIn,
  SUCCESS,
  tableSection,
  uniqueName,
  writeReview,
} from "./helpers";

// Tests that need data create it with a unique name and delete it again, so
// they can also run against the live site.

// A collapsible admin card, found by the button in its heading ("Plan (3)")
const adminCard = (page: Page, title: string) =>
  page.locator("section").filter({ has: page.getByRole("button", { name: new RegExp(`^${title}`), expanded: true }) });

// Opens the form for a new add-on, fills in everything but the name and saves
async function saveAddonWithoutName(page: Page) {
  const section = tableSection(page, "Addons");
  await section.getByRole("button", { name: "Lägg till", exact: true }).click();
  await page.getByLabel("Pris i kronor").fill("10");
  await page.getByLabel("Beskrivning").fill("Beskrivning");
  await section.getByRole("button", { name: "Spara" }).click();
  return section.getByRole("alert").filter({ hasText: "Addon måste ha ett namn." });
}

test.beforeEach(async ({ page }) => {
  requireAdminPassword();
  await signIn(page);
});

test("TRIP-019-R3 the admin cards have the card border and the card shadow", async ({ page }) => {
  for (const title of ["Klasser & addons", "Plan", "Omdömen"]) {
    const card = adminCard(page, title);
    await expect(card).toHaveCSS("border-top-color", EDGE);
    expect(await css(card, "box-shadow")).toContain(CARD_SHADOW);
  }
});

test("TRIP-019-R3 a dialog floats with the floating shadow", async ({ page }) => {
  const name = uniqueName("Klass");
  await createClass(page, name);

  await page.getByRole("button", { name: `Ta bort ${name}`, exact: true }).click();
  const dialog = page.getByRole("alertdialog");
  await expect(dialog).toBeVisible();
  expect(await css(dialog, "box-shadow")).toContain(FLOAT_SHADOW);
  await expectNoA11yViolations(page);
  await dialog.getByRole("button", { name: "Nej" }).click();

  await deleteWithConfirmation(page, `Ta bort ${name}`);
});

test("TRIP-019-R4 a saved review gives green text without a box", async ({ page }) => {
  const author = uniqueName("Resenär");
  await writeReview(page, { author, rating: 4, title: "Rubrik", body: "Text" });
  await expectTextMessage(reviewForm(page).getByRole("status").filter({ hasText: "Omdömet sparades." }), SUCCESS);

  await deleteWithConfirmation(page, `Ta bort omdöme från ${author}`);
});

test("TRIP-019-R4 an add-on without a name gives red text without a box", async ({ page }) => {
  await expectTextMessage(await saveAddonWithoutName(page), DANGER);
  await expectNoA11yViolations(page);
});

test("TRIP-019-R5 Spara and Avbryt are compact pill buttons of the same shape", async ({ page }) => {
  const section = tableSection(page, "Addons");
  await section.getByRole("button", { name: "Lägg till", exact: true }).click();
  const save = section.getByRole("button", { name: "Spara" });
  const cancel = section.getByRole("button", { name: "Avbryt" });

  await expect(save).toHaveCSS("background-color", ACCENT);
  await expect(cancel).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(cancel).toHaveCSS("border-top-color", ACCENT_STRONG);
  for (const button of [save, cancel]) {
    await expect(button).toHaveCSS("border-top-left-radius", "999px");
    await expect(button).toHaveCSS("height", "34px");
  }
});

test("TRIP-019 accessibility: axe finds no violations on the admin page, also with the aircraft form open", async ({ page }) => {
  await expectNoA11yViolations(page);
  await page.getByRole("button", { name: "Lägg till plan" }).click();
  await expect(page.getByLabel("Planets namn")).toBeVisible();
  await expectNoA11yViolations(page);
});
