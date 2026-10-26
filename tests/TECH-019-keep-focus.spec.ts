import { expect, test, type Locator, type Page } from "@playwright/test";
import { createAddon, deleteWithConfirmation, expectNoA11yViolations, requireAdminPassword, signIn, uniqueName } from "./helpers";

// Round buttons are aria-disabled, never disabled, so focus stays on them
// when they become unavailable (TECH-019-R1). The pages are the ones the
// round buttons are on; the booking pages are tested in TRIP-024.

const UNAVAILABLE = "aria-disabled";

// Enter on a focused, unavailable button: it keeps focus and nothing happens
async function expectKeepsFocus(page: Page, button: Locator) {
  await expect(button).toBeFocused();
  await expect(button).toHaveAttribute(UNAVAILABLE, "true");
  await page.keyboard.press("Enter");
  await expect(button).toBeFocused();
}

test("TECH-019-R1 the traveller picker keeps focus on − at 1 and on + at 10", async ({ page }) => {
  await page.goto("/");
  const fewer = page.getByRole("button", { name: "Färre resenärer" });
  const more = page.getByRole("button", { name: "Fler resenärer" });
  const count = page.locator(".tabular-nums");

  await more.focus();
  await page.keyboard.press("Enter");
  await expect(count).toHaveText("2");
  await fewer.focus();
  await page.keyboard.press("Enter");
  await expect(count).toHaveText("1");
  await expectKeepsFocus(page, fewer);
  await expect(count).toHaveText("1");

  await more.focus();
  for (let i = 0; i < 9; i++) await page.keyboard.press("Enter");
  await expect(count).toHaveText("10");
  await expectKeepsFocus(page, more);
  await expect(count).toHaveText("10");
  await expectNoA11yViolations(page);
});

test("TECH-019-R1 the calendar's month buttons keep focus on the first and the last month", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("combobox", { name: "Utresa" }).click();
  const calendar = page.getByRole("dialog", { name: "Välj datum" });
  const previous = calendar.getByRole("button", { name: "Föregående månad" });
  const next = calendar.getByRole("button", { name: "Nästa månad" });

  await previous.focus();
  await expectKeepsFocus(page, previous);

  await next.focus();
  for (let i = 0; i < 5; i++) await page.keyboard.press("Enter");
  await expectKeepsFocus(page, next);
  await expect(calendar.getByRole("grid").last()).toHaveAccessibleName("april 2027");
  await previous.focus();
  await page.keyboard.press("Enter");
  await expect(next).not.toHaveAttribute(UNAVAILABLE, "true");
});

test("TECH-019-R1 the review carousel's arrows keep focus when pressed", async ({ page }) => {
  await page.goto("/");
  const carousel = page.getByRole("region", { name: "Omdömen" });
  await expect(carousel.locator('article[aria-hidden="false"]')).toHaveCount(1);
  const arrow = page.getByRole("button", { name: "Nästa omdöme" });
  expect(await carousel.locator("article").count()).toBeGreaterThan(1);

  await arrow.focus();
  await page.keyboard.press("Enter");
  await expect(arrow).toBeFocused();
  // The carousel goes round, so the arrow is always available
  await expect(arrow).not.toHaveAttribute(UNAVAILABLE, "true");
  await expectNoA11yViolations(page);
});

test.describe("admin", () => {
  test.beforeEach(async ({ page }) => {
    requireAdminPassword();
    await signIn(page);
  });

  const form = (page: Page) => page.locator("form").filter({ has: page.getByLabel("Planets namn") });

  test("TECH-019-R1 Lägg till klass is aria-disabled and keeps focus", async ({ page }) => {
    await page.getByRole("button", { name: "Lägg till plan" }).click();
    const f = form(page);
    await f.getByRole("button", { name: "Lägg till klass" }).click();
    const add = f.getByRole("button", { name: "Lägg till klass" });
    await f.getByLabel("Klass att lägga till").selectOption({ label: "Business" });
    await f.getByLabel("Antal platser", { exact: true }).fill("0");
    await add.focus();
    await expectKeepsFocus(page, add);
    await expect(f.getByText("0 platser")).toHaveCount(0);
    await expectNoA11yViolations(page);
  });

  test("TECH-019-R1 Lägg till addon is aria-disabled and keeps focus", async ({ page }) => {
    const addon = uniqueName("Addon");
    await createAddon(page, addon, "10", "Beskrivning");
    await page.getByRole("button", { name: "Lägg till plan" }).click();
    const f = form(page);
    // An add-on is chosen per class, so the plane needs one first
    await f.getByRole("button", { name: "Lägg till klass" }).click();
    await f.getByLabel("Klass att lägga till").selectOption({ label: "Ekonomi" });
    await f.getByLabel("Antal platser", { exact: true }).fill("100");
    await f.getByRole("button", { name: "Lägg till klass" }).click();
    await f.getByRole("button", { name: "Lägg till addon" }).click();
    const add = f.getByRole("button", { name: "Lägg till addon" });
    await f.getByLabel("Addon", { exact: true }).selectOption({ label: addon });
    await add.focus();
    await expectKeepsFocus(page, add);
    await expectNoA11yViolations(page);

    await f.getByText("Avbryt", { exact: true }).click();
    await deleteWithConfirmation(page, `Ta bort ${addon}`);
  });
});
