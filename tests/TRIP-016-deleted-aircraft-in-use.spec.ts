import { expect, test, type Page } from "@playwright/test";
import {
  createAddon,
  createAircraft,
  createClass,
  expectNoA11yViolations,
  requireAdminPassword,
  signIn,
  uniqueName,
} from "./helpers";

// The tests create their own aircraft, class and add-on with unique names, and
// delete them again, so they can also run against the live site.

test.beforeEach(async ({ page }) => {
  requireAdminPassword();
  await signIn(page);
});

const trash = (page: Page, name: string) =>
  page.getByRole("button", { name: `Ta bort ${name}`, exact: true });

// Trash, then Ja, without waiting for the page to show the new data
async function deleteAtOnce(page: Page, name: string) {
  await trash(page, name).click();
  const dialog = page.getByRole("alertdialog");
  await expect(dialog.getByRole("heading", { name: "Är du säker?" })).toBeVisible();
  await dialog.getByRole("button", { name: "Ja" }).click();
  await expect(dialog).toBeHidden();
}

test("TRIP-016-R1 R2 a class and an add-on can be deleted at once after their only aircraft", async ({ page }) => {
  const className = uniqueName("Klass");
  const addonName = uniqueName("Addon");
  const aircraft = uniqueName("Plan");
  await createClass(page, className);
  await createAddon(page, addonName, "50", "Beskrivning");
  await createAircraft(page, aircraft, [{ name: className, seats: 10 }], [{ name: addonName, className }]);

  await deleteAtOnce(page, aircraft);
  await deleteAtOnce(page, className);
  await deleteAtOnce(page, addonName);

  await expect(trash(page, className)).toHaveCount(0);
  await expect(trash(page, addonName)).toHaveCount(0);
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await expectNoA11yViolations(page);
});

test("TRIP-016-R1 a class used by another aircraft is still in use", async ({ page }) => {
  const className = uniqueName("Klass");
  const first = uniqueName("Plan");
  const second = uniqueName("Plan");
  await createClass(page, className);
  await createAircraft(page, first, [{ name: className, seats: 10 }]);
  await createAircraft(page, second, [{ name: className, seats: 10 }]);

  await deleteAtOnce(page, first);
  await trash(page, className).click();
  const dialog = page.getByRole("alertdialog");
  await dialog.getByRole("button", { name: "Ja" }).click();
  await expect(dialog.getByRole("heading", { name: "Du kan ej ta bort" })).toBeVisible();
  await expectNoA11yViolations(page);
  await dialog.getByRole("button", { name: "OK" }).click();
  await expect(trash(page, className)).toBeVisible();

  await deleteAtOnce(page, second);
  await deleteAtOnce(page, className);
  await expect(trash(page, className)).toHaveCount(0);
});
