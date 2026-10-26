import { expect, test } from "@playwright/test";
import {
  adminCard,
  CARD_SHADOW,
  createClass,
  css,
  DANGER,
  deleteWithConfirmation,
  expectNoA11yViolations,
  expectTextMessage,
  FLOAT_SHADOW,
  LINE,
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

test.beforeEach(async ({ page }) => {
  requireAdminPassword();
  await signIn(page);
});

// The card border is checked by TRIP-022-R1
test("TRIP-019-R3 R4 R5 the admin cards have the card shadow, Spara and Avbryt are compact pill buttons, an add-on without a name gives red text, and axe finds no violations, also with the aircraft form open", async ({
  page,
}) => {
  for (const title of ["Klasser & addons", "Plan", "Omdömen"]) {
    expect(await css(adminCard(page, title), "box-shadow")).toContain(CARD_SHADOW);
  }
  await expectNoA11yViolations(page);

  const section = tableSection(page, "Addons");
  await section.getByRole("button", { name: "Lägg till", exact: true }).click();
  const save = section.getByRole("button", { name: "Spara" });
  const cancel = section.getByRole("button", { name: "Avbryt" });
  // R5: the buttons' colours are checked by TRIP-022-R4
  for (const button of [save, cancel]) {
    await expect(button).toHaveCSS("border-top-left-radius", "999px");
    await expect(button).toHaveCSS("height", "34px");
  }

  // R4: everything but the name is filled in
  await page.getByLabel("Pris i kronor").fill("10");
  await page.getByLabel("Beskrivning").fill("Beskrivning");
  await save.click();
  await expectTextMessage(section.getByRole("alert").filter({ hasText: "Addon måste ha ett namn." }), DANGER);
  await expectNoA11yViolations(page);
  await cancel.click();

  await page.getByRole("button", { name: "Lägg till plan" }).click();
  await expect(page.getByLabel("Planets namn")).toBeVisible();
  await expectNoA11yViolations(page);
});

test("TRIP-019-R3 a dialog floats with the floating shadow", async ({ page }) => {
  const name = uniqueName("Klass");
  await createClass(page, name);

  await page.getByRole("button", { name: `Ta bort ${name}`, exact: true }).click();
  const dialog = page.getByRole("alertdialog");
  await expect(dialog).toBeVisible();
  expect(await css(dialog, "box-shadow")).toContain(FLOAT_SHADOW);
  // TRIP-022-R3: dialogs keep their fainter border
  await expect(dialog).toHaveCSS("border-top-color", LINE);
  await expectNoA11yViolations(page);
  await dialog.getByRole("button", { name: "Nej" }).click();

  await deleteWithConfirmation(page, `Ta bort ${name}`);
});

test("TRIP-019-R4 a saved review gives green text without a box", async ({ page }) => {
  const author = uniqueName("R"); // names are at most 20 characters (TRIP-021-R4)
  await writeReview(page, { author, rating: 4, title: "Rubrik", body: "Text" });
  await expectTextMessage(reviewForm(page).getByRole("status").filter({ hasText: "Omdömet sparades." }), SUCCESS);

  await deleteWithConfirmation(page, `Ta bort omdöme från ${author}`);
});
