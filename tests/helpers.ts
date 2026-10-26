import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { addDays, toDateString } from "../lib/dates";

// True when the tests run against the local test server (npm run test:local),
// false against the live site. Tests that change shared data in a way that
// can't be undone run only locally.
export const runsLocally = (process.env.BASE_URL ?? "").startsWith("http://localhost");

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

// The form "Nytt omdöme" on the admin page, and writing a review in it
export const reviewForm = (page: Page) =>
  page.locator("form").filter({ has: page.getByRole("heading", { name: "Nytt omdöme" }) });

export async function writeReview(page: Page, review: { author: string; rating: number; title: string; body: string }) {
  const form = reviewForm(page);
  await form.getByLabel("Namn på personen").fill(review.author);
  await form.getByRole("radio", { name: new RegExp(`^${review.rating} stjärn`) }).click();
  await form.getByLabel("Rubrik").fill(review.title);
  await form.getByLabel("Text").fill(review.body);
  await form.getByRole("button", { name: "Spara omdöme" }).click();
}

// The table Klasser or Addons on the admin page. Both sit inside the card
// "Klasser & addons", which is also a <section>, so take the innermost.
export function tableSection(page: Page, heading: "Klasser" | "Addons") {
  return page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: new RegExp(`^${heading}`) }) })
    .last();
}

// Creates a cabin class or an add-on through the admin page. A new class's
// price factor is 1,00 unless another is given (TRIP-011-R6).
export async function createClass(page: Page, name: string, priceFactor?: string) {
  const section = tableSection(page, "Klasser");
  await section.getByRole("button", { name: "Lägg till", exact: true }).click();
  await page.getByLabel("Namn på klassen").fill(name);
  if (priceFactor) await section.getByLabel("Prisfaktor").fill(priceFactor);
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

// The aircraft's price and time factors, as typed in the form (TRIP-011-R8)
export type AircraftFactors = { price: string; time: string };

// Creates an aircraft with the given classes and add-ons through the aircraft
// form. Its factors are 1,00 and 1,00 unless others are given.
export async function createAircraft(
  page: Page,
  name: string,
  classes: { name: string; seats: number }[],
  addons: { name: string; className: string }[] = [],
  factors?: AircraftFactors,
) {
  await page.getByRole("button", { name: "Lägg till plan" }).click();
  await fillAircraftForm(page, name, classes, addons);
  if (factors) {
    await page.getByLabel("Prisfaktor").fill(factors.price);
    await page.getByLabel("Tidsfaktor").fill(factors.time);
  }
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

// A translucent colour, "rgba(…)" or "color(srgb …)", laid over an opaque
// background, as "rgb(…)"
export function layer(color: string, background: string) {
  const [br, bg, bb] = background.match(/[\d.]+/g)!.map(Number);
  const [r, g, b, alpha = 1] = color.match(/[\d.]+/g)!.map(Number);
  // color(srgb …) gives the channels from 0 to 1
  const scale = color.startsWith("color(srgb") ? 255 : 1;
  const mix = (f: number, k: number) => Math.round(f * scale * alpha + k * (1 - alpha));
  return `rgb(${mix(r, br)}, ${mix(g, bg)}, ${mix(b, bb)})`;
}

// WCAG contrast ratio between a foreground ("rgb(…)", "rgba(…)" or "color(srgb …)")
// and an opaque "rgb(…)" background. A translucent foreground is first laid over it.
export function contrast(foreground: string, background: string) {
  const luminance = (color: string) => {
    const [r, g, b] = color.match(/[\d.]+/g)!.map(Number).map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const l1 = luminance(layer(foreground, background));
  const l2 = luminance(background);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// The first non-transparent background behind an element (the surfaces are opaque)
export function backgroundOf(locator: Locator) {
  return locator.evaluate((el) => {
    for (let e: Element | null = el; e; e = e.parentElement) {
      const bg = getComputedStyle(e).backgroundColor;
      if (bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") return bg;
    }
    return getComputedStyle(document.body).backgroundColor;
  });
}

// A collapsible admin card, found by the button in its heading ("Plan (3)")
export const adminCard = (page: Page, title: string) =>
  page.locator("section").filter({ has: page.getByRole("button", { name: new RegExp(`^${title}`), expanded: true }) });

// The token values from app/globals.css, as the browser reports them
export const ACCENT = "rgb(139, 30, 63)";
export const ACCENT_STRONG = "rgb(200, 53, 96)";
// The accent at 30 %, mixed with color-mix(), which the browser reports as color(srgb …)
export const ACCENT_SOFT = "color(srgb 0.545098 0.117647 0.247059 / 0.3)";
export const INK = "rgb(236, 230, 220)";
export const DANGER = "rgb(240, 122, 122)";
export const SUCCESS = "rgb(127, 201, 160)";
export const LINE = "rgba(236, 230, 220, 0.14)";
export const LINE_STRONG = "rgba(236, 230, 220, 0.4)";
export const BRASS = "rgb(201, 164, 106)";
// The start of --shadow-card and --shadow-float, enough to tell them apart
export const CARD_SHADOW = "0px 30px 60px -24px";
export const FLOAT_SHADOW = "0px 18px 40px -12px";

// A computed CSS value of an element (or of its ::before/::after)
export const css = (locator: Locator, property: string, pseudo?: string) =>
  locator.evaluate((el, [p, ps]) => getComputedStyle(el, ps).getPropertyValue(p), [property, pseudo] as const);

// A message is coloured text: no background, no border
export async function expectTextMessage(message: Locator, color: string) {
  await expect(message).toBeVisible();
  await expect(message).toHaveCSS("color", color);
  await expect(message).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(message).toHaveCSS("border-top-width", "0px");
}

// Waits until an element's animations and transitions (its own and those
// inside it) have finished. Until then something fading in (the calendar) is
// half transparent and a colour is between two values, so contrast can't be measured.
export async function animationsDone(locator: Locator) {
  await locator.evaluate((el) => Promise.allSettled(el.getAnimations({ subtree: true }).map((a) => a.finished)));
}

// Runs axe on the page as it looks right now and requires that it breaks no
// WCAG 2.x level A or AA rule (TRIP-008-R12). axe finds only some of the
// problems; the rest is checked by hand (TRIP-021).
export async function expectNoA11yViolations(page: Page) {
  // Cards that fill in (TRIP-025) are partly see-through while they move, which axe reads as low contrast
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((a) => (a as CSSAnimation).animationName === "fill-in")
        .map((a) => a.finished),
    ),
  );
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

// Types in an airport field in the search form and waits for the suggestion list
export async function typeAirport(page: Page, field: "Från" | "Till", text: string) {
  await page.getByRole("combobox", { name: field }).fill(text);
  const list = page.getByRole("listbox");
  await expect(list).toBeVisible();
  return list;
}

export async function chooseAirport(page: Page, field: "Från" | "Till", text: string, option: string) {
  const list = await typeAirport(page, field, text);
  await list.getByRole("option", { name: new RegExp(option) }).click();
}

// A date some days from today, as "YYYY-MM-DD" in local time
export const daysFromToday = (days: number) => addDays(toDateString(new Date()), days);

// Opens a results page without waiting the simulated 1–4 seconds (TRIP-010-R3):
// the browser's clock is faked, and moved forward once the search has started
export async function openResults(page: Page, url: string) {
  await page.clock.install();
  await page.goto(url);
  await searchDone(page);
}

// Moves the clock past the simulated search and waits for its result
export async function searchDone(page: Page) {
  const status = page.getByRole("status");
  await expect(status).toHaveText("Söker flyg…");
  await page.clock.runFor(4000);
  await expect(status).toHaveText(/^\d+ flyg hittades$/);
}

// "från 1 290 kr / person" -> 1290 (the spaces in a price are non-breaking)
export const kronor = (text: string) => Number(text.match(/från\s*([\d\s]+?)\s*kr/)![1].replace(/\s/g, ""));

