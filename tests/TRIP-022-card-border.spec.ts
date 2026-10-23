import { expect, test, type Locator } from "@playwright/test";
import {
  ACCENT_SOFT,
  ACCENT_STRONG,
  adminCard,
  backgroundOf,
  contrast,
  css,
  expectNoA11yViolations,
  INK,
  layer,
  LINE,
  LINE_STRONG,
  requireAdminPassword,
  signIn,
} from "./helpers";

// A primary button: the faint wine red tone, the fields' border and light text
async function expectTonedDown(button: Locator) {
  await expect(button).toHaveCSS("background-color", ACCENT_SOFT);
  await expect(button).toHaveCSS("border-top-color", LINE_STRONG);
  await expect(button).toHaveCSS("color", INK);
}

test("TRIP-022-R1 the search form and the sign-in form have the fields' border colour", async ({ page }) => {
  await page.goto("/");
  const from = page.getByRole("combobox", { name: "Från" });
  const searchCard = page.locator("section").filter({ has: from });
  // The field's border is on the box around the input
  await expect(from.locator("xpath=..")).toHaveCSS("border-top-color", LINE_STRONG);
  await expect(searchCard).toHaveCSS("border-top-color", LINE_STRONG);

  await page.goto("/admin/login");
  const loginCard = page.locator("section").filter({ has: page.getByLabel("Lösenord") });
  await expect(loginCard).toHaveCSS("border-top-color", LINE_STRONG);
});

test("TRIP-022-R1 and R4 the admin cards, the aircraft form and its Spara and Avbryt have the fields' border colour", async ({
  page,
}) => {
  requireAdminPassword();
  await signIn(page);
  for (const title of ["Klasser & addons", "Plan", "Omdömen"]) {
    await expect(adminCard(page, title)).toHaveCSS("border-top-color", LINE_STRONG);
  }

  await page.getByRole("button", { name: "Lägg till plan" }).click();
  const form = page.locator("form").filter({ has: page.getByLabel("Planets namn") });
  await expect(form).toHaveCSS("border-top-color", LINE_STRONG);
  await expectTonedDown(form.getByRole("button", { name: "Spara", exact: true }));
  const cancel = form.getByRole("button", { name: "Avbryt" });
  await expect(cancel).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(cancel).toHaveCSS("border-top-color", LINE_STRONG);
  await cancel.hover();
  await expect(cancel).toHaveCSS("border-top-color", ACCENT_STRONG);
  await expectNoA11yViolations(page);
});

test("TRIP-022-R2 every review card has the fields' border colour, also the one in focus", async ({ page }) => {
  await page.goto("/");
  const cards = page.getByRole("region", { name: "Omdömen" }).locator("article");
  await expect(cards.first()).toBeAttached();
  for (const card of await cards.all()) {
    await expect(card).toHaveCSS("border-top-color", LINE_STRONG);
  }
});

test("TRIP-022-R3 the airport suggestions keep their fainter border", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("combobox", { name: "Från" }).fill("lon");
  await expect(page.getByRole("listbox")).toHaveCSS("border-top-color", LINE);
});

test("TRIP-022-R4 the primary button is toned down, and buttons get a wine red border on hover", async ({ page }) => {
  await page.goto("/admin/login");
  const login = page.getByRole("button", { name: "Logga in" });
  await expectTonedDown(login);

  // The button is translucent, so its colour is laid over the card behind it
  const behind = await backgroundOf(login.locator("xpath=.."));
  const fill = layer(await css(login, "background-color"), behind);
  expect(contrast(await css(login, "color"), fill)).toBeGreaterThanOrEqual(4.5);

  await login.hover();
  await expect(login).toHaveCSS("border-top-color", ACCENT_STRONG);
});
