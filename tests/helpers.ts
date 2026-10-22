import AxeBuilder from "@axe-core/playwright";
import { createClient, type InArgs } from "@libsql/client";
import { expect, test, type Page } from "@playwright/test";
import { testDbFile } from "../lib/local-db.mjs";

// True when the tests run against the local test server (npm run test:local),
// false against the live site. Tests that change shared data in a way that
// can't be undone run only locally.
export const runsLocally = (process.env.BASE_URL ?? "").startsWith("http://localhost");

// Reads the local test database directly. Only for tests that run locally.
export async function queryTestDb<T>(sql: string, args: InArgs = []): Promise<T[]> {
  const db = createClient({ url: `file:${testDbFile}` });
  try {
    return (await db.execute({ sql, args })).rows as unknown as T[];
  } finally {
    db.close();
  }
}

// A name no one else uses, so tests can create data without clashing with
// real data, and find and delete it afterwards. "E2E" marks it as test data.
export function uniqueName(prefix: string) {
  return `E2E ${prefix} ${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
}

// Admin tests need the password. Locally it comes from .env.local; against the
// live site, set ADMIN_PASSWORD to the production password.
export function requireAdminPassword() {
  test.skip(!process.env.ADMIN_PASSWORD, "ADMIN_PASSWORD is not set");
}

export async function signIn(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("Lösenord").fill(process.env.ADMIN_PASSWORD ?? "");
  await page.getByRole("button", { name: "Logga in" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "Admin", exact: true })).toBeVisible();
}

// Clicks the trash can for a row and answers "Ja" in the "Är du säker?" dialog
export async function deleteWithConfirmation(page: Page, label: string) {
  await page.getByRole("button", { name: label, exact: true }).click();
  const dialog = page.getByRole("alertdialog");
  await expect(dialog.getByRole("heading", { name: "Är du säker?" })).toBeVisible();
  await dialog.getByRole("button", { name: "Ja" }).click();
  await expect(dialog).toBeHidden();
  // Wait until the page shows the row is gone. Until then the page's data is
  // old, and for example an add-on can still look like it is in use.
  await expect(page.getByRole("button", { name: label, exact: true })).toHaveCount(0);
}

// Today and six months ahead as YYYY-MM-DD in local time, the same way the search form counts
export function bookableDates() {
  const toDateString = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const today = new Date();
  const max = new Date(today.getFullYear(), today.getMonth() + 6, 1);
  const lastDay = new Date(max.getFullYear(), max.getMonth() + 1, 0).getDate();
  max.setDate(Math.min(today.getDate(), lastDay));
  return { min: toDateString(today), max: toDateString(max) };
}

// The table Klasser or Addons on the admin page. Both sit inside the card
// "Klasser & addons", which is also a <section>, so take the innermost.
export function tableSection(page: Page, heading: "Klasser" | "Addons") {
  return page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: new RegExp(`^${heading}`) }) })
    .last();
}

// Creates a cabin class or an add-on through the admin page
export async function createClass(page: Page, name: string) {
  const section = tableSection(page, "Klasser");
  await section.getByRole("button", { name: "Lägg till", exact: true }).click();
  await page.getByLabel("Namn på klassen").fill(name);
  await section.getByRole("button", { name: "Spara" }).click();
  await expect(page.getByRole("button", { name: `Ta bort ${name}`, exact: true })).toBeVisible();
}

export async function createAddon(page: Page, name: string, price: string, description: string) {
  const section = tableSection(page, "Addons");
  await section.getByRole("button", { name: "Lägg till", exact: true }).click();
  await page.getByLabel("Namn på addon").fill(name);
  await page.getByLabel("Pris i kronor").fill(price);
  await page.getByLabel("Beskrivning").fill(description);
  await section.getByRole("button", { name: "Spara" }).click();
  await expect(page.getByRole("button", { name: `Ta bort ${name}`, exact: true })).toBeVisible();
}

// Creates an aircraft with the given classes and add-ons through the aircraft form
export async function createAircraft(
  page: Page,
  name: string,
  classes: { name: string; seats: number }[],
  addons: { name: string; className: string }[] = [],
) {
  await page.getByRole("button", { name: "Lägg till plan" }).click();
  await fillAircraftForm(page, name, classes, addons);
  await page.getByRole("button", { name: "Spara", exact: true }).click();
  await expect(page.getByRole("button", { name: `Ta bort ${name}`, exact: true })).toBeVisible();
}

export async function fillAircraftForm(
  page: Page,
  name: string,
  classes: { name: string; seats: number }[],
  addons: { name: string; className: string }[] = [],
) {
  await page.getByLabel("Planets namn").fill(name);
  for (const c of classes) {
    await page.getByRole("button", { name: "Lägg till klass" }).click();
    await page.getByLabel("Klass att lägga till").selectOption({ label: c.name });
    await page.getByLabel("Antal platser", { exact: true }).fill(String(c.seats));
    await page.getByRole("button", { name: "Lägg till klass" }).click();
  }
  for (const a of addons) {
    await page.getByRole("button", { name: "Lägg till addon" }).click();
    await page.getByLabel("Addon", { exact: true }).selectOption({ label: a.name });
    await page.getByLabel("Klass", { exact: true }).selectOption({ label: a.className });
    await page.getByRole("button", { name: "Lägg till addon" }).click();
  }
}

// Runs axe on the page as it looks right now and requires that it breaks no
// WCAG 2.x level A or AA rule (TRIP-008-R12). axe finds only some of the
// problems; the rest is checked by hand (TRIP-021).
export async function expectNoA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    // The review carousel's side cards are faded on purpose (TRIP-006-R1) and
    // hidden from screen readers; the same review is shown at full contrast
    // when it is in focus. They count as decoration (WCAG 1.4.3 exception).
    .exclude('article[aria-hidden="true"]')
    .analyze();
  // Rule, description and elements, so that a failure can be understood from the report
  const violations = results.violations.map((v) => ({
    rule: v.id,
    help: v.help,
    elements: v.nodes.map((n) => n.target.join(" ")),
  }));
  expect(violations).toEqual([]);
}
