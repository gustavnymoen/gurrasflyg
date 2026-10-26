import { expect, test, type Page } from "@playwright/test";
import { formatDay, formatShort } from "../lib/dates";
import {
  chooseAirport,
  daysFromToday,
  expectNoA11yViolations,
  kronor,
  openResults,
  requireAdminPassword,
  searchDone,
  signIn,
  typeAirport,
} from "./helpers";

// The search, its rules and the route data are also unit tests: lib/search.test.ts,
// lib/flight-rules.test.ts and db/migrations/007_all_routes.test.ts. The dates
// are relative to today, since every bookable day has flights (R10).

const TOMORROW = daysFromToday(1);
const IN_A_WEEK = daysFromToday(7);
const oneWay = (date = TOMORROW, travellers = 1) =>
  `/flyg?fran=ARN&till=LHR&utresa=${date}&resenarer=${travellers}`;
const roundTrip = `/flyg?fran=ARN&till=LHR&utresa=${TOMORROW}&hemresa=${IN_A_WEEK}&resenarer=2`;

const flightButtons = (page: Page) => page.getByRole("button", { name: /^\d\d:\d\d / });
const listHeading = (page: Page) => page.getByRole("heading", { level: 2 });
// The summary "Din resa" and its total price
const summary = (page: Page) =>
  page.locator("section").filter({ has: page.getByRole("heading", { name: "Din resa" }) });
const summaryTotal = async (page: Page) => kronor((await summary(page).getByText(/^från [\d\s]+kr$/).textContent()) ?? "");
// The sort choice is a radio button behind its visible label, which is what a visitor clicks
const sortBy = (page: Page, label: "Pris" | "Avgångstid") => page.getByText(label, { exact: true }).click();

async function timesShown(page: Page) {
  return (await flightButtons(page).allTextContents()).map((t) => t.slice(0, 5));
}
async function pricesShown(page: Page) {
  return (await flightButtons(page).allTextContents()).map(kronor);
}

// axe waits on the browser's timers. With the clock stopped during the search,
// move it on in small steps while axe runs, well under the search's 1 second.
// At the end axe opens and closes a blank page of its own; a step that is
// under way just then fails with "Target page … has been closed", although
// the page under test is still open. Such a step is skipped: if something is
// really wrong, axe's own result below says so.
async function axeWhileSearching(page: Page) {
  let done = false;
  const check = expectNoA11yViolations(page).finally(() => (done = true));
  for (let ms = 0; !done && ms < 800; ms += 20) await page.clock.runFor(20).catch(() => {});
  await check;
}

test.describe("the search form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("TRIP-010-R1 a filled-in search opens the results page", async ({ page }) => {
    await chooseAirport(page, "Från", "Arlanda", "Stockholm Arlanda");
    await chooseAirport(page, "Till", "Heathrow", "London Heathrow");
    await page.getByRole("combobox", { name: "Utresa" }).fill(formatShort(TOMORROW));
    await page.getByRole("combobox", { name: "Utresa" }).press("Enter");
    await page.getByRole("combobox", { name: "Hemresa" }).fill(formatShort(IN_A_WEEK));
    await page.getByRole("combobox", { name: "Hemresa" }).press("Enter");
    await page.getByRole("button", { name: "Fler resenärer" }).click();
    await page.getByRole("button", { name: "Sök", exact: true }).click();
    await expect(page).toHaveURL(roundTrip);
    await expect(page.getByRole("heading", { name: "Utresa Stockholm – London" })).toBeVisible();
  });

  test("TRIP-010-R1 a missing value is shown in red and the same airport in Från and Till gives no search, and nothing is searched", async ({ page }) => {
    await chooseAirport(page, "Från", "Arlanda", "Stockholm Arlanda");
    await page.getByRole("button", { name: "Sök", exact: true }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Välj vart du vill flyga." })).toBeVisible();
    await expect(page.getByRole("combobox", { name: "Till" })).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByRole("alert").filter({ hasText: "Välj datum för utresan." })).toBeVisible();
    await expect(page.getByRole("alert").filter({ hasText: "Välj datum för hemresan." })).toBeVisible();
    await expect(page.getByRole("alert").filter({ hasText: "Välj var du vill flyga från." })).toHaveCount(0);
    await expect(page).toHaveURL("/");
    await expectNoA11yViolations(page);

    // The message goes away when the value is chosen
    await chooseAirport(page, "Till", "Heathrow", "London Heathrow");
    await expect(page.getByRole("alert").filter({ hasText: "Välj vart du vill flyga." })).toHaveCount(0);

    // The same airport in both fields
    await chooseAirport(page, "Till", "Arlanda", "Stockholm Arlanda");
    await page.getByRole("combobox", { name: "Utresa" }).fill(formatShort(TOMORROW));
    await page.getByRole("combobox", { name: "Utresa" }).press("Enter");
    await page.getByRole("switch", { name: "Tur och retur" }).click();
    await page.getByRole("button", { name: "Sök", exact: true }).click();
    await expect(page.getByText("Ajja bajja, du måste flyga någonstans!")).toBeVisible();
    await expect(page).toHaveURL("/");
  });

  test("TRIP-010-R13 Tab chooses the highlighted airport and moves on", async ({ page }) => {
    const from = page.getByRole("combobox", { name: "Från" });
    const to = page.getByRole("combobox", { name: "Till" });
    const list = await typeAirport(page, "Från", "arlanda");
    await expect(list.getByRole("option")).toHaveCount(1);
    await from.press("Tab");
    await expect(from).toHaveValue("Stockholm Arlanda (ARN)");
    await expect(page.getByRole("listbox")).toBeHidden();
    await expect(to).toBeFocused();

    // The second suggestion, highlighted with Arrow down
    const options = (await typeAirport(page, "Till", "lon")).getByRole("option");
    await expect(options.nth(1)).toBeVisible();
    // The IATA code is the badge at the end of each suggestion
    const code = (option: number) => options.nth(option).locator("span").last().textContent();
    const [first, second] = [await code(0), await code(1)];
    await to.press("ArrowDown");
    await to.press("Tab");
    await expect(to).toHaveValue(new RegExp(`\\(${second}\\)$`));
    expect(second).not.toBe(first);

    // Shift+Tab chooses too, and focus moves back
    // Wait for the new suggestions: an older list is not chosen from
    await expect((await typeAirport(page, "Till", "heathrow")).getByRole("option")).toHaveCount(1);
    await to.press("Shift+Tab");
    await expect(to).toHaveValue("London Heathrow (LHR)");
    await expect(from).toBeFocused();

    // Without suggestions Tab only moves focus
    await typeAirport(page, "Från", "xyzzy");
    await expect(page.getByText("Inga flygplatser matchar")).toBeVisible();
    await from.press("Tab");
    await expect(from).toHaveValue("xyzzy");
    await expect(to).toBeFocused();
  });

});

test("TRIP-010-R2 an incomplete address shows the empty form and what to do", async ({ page }) => {
  await page.goto("/flyg?fran=ARN&utresa=2026-13-01");
  await expect(page.getByText("Sökningen saknar något. Fyll i formuläret och tryck på Sök.")).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Från" })).toHaveValue("");
});

test("TRIP-010-R3 skeleton cards first, the flights 1–4 seconds later, and screen readers are told", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto(oneWay());
  const status = page.getByRole("status");
  await expect(status).toHaveText("Söker flyg…");
  // The search has started and waits at least a second (searchDelay, unit tested):
  // stop the clock here, so that only the test moves it on
  await page.clock.pauseAt(Date.now() + 100);
  const skeletons = page.locator('ul[aria-hidden="true"] li');
  await expect(skeletons.first()).toBeVisible();
  await expect(flightButtons(page)).toHaveCount(0);
  await axeWhileSearching(page);

  await page.clock.runFor(4000);
  await expect(status).toHaveText(/^\d+ flyg hittades$/);
  await expect(skeletons).toHaveCount(0);
  await expect(flightButtons(page).first()).toBeVisible();
});

test("TRIP-010-R4 a search for today shows no departure that has already left", async ({ page }) => {
  await openResults(page, oneWay(daysFromToday(0)));
  const now = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", timeStyle: "short" }).format(new Date());
  for (const time of await timesShown(page)) expect(time > now).toBe(true);
});

test("TRIP-010-R4 with no departures left the page says so and suggests another date", async ({ page }) => {
  // Every departure of yesterday has left, as late in the evening every one of today's has
  await openResults(page, oneWay(daysFromToday(-1)));
  await expect(page.getByText("Inga flyg kvar den här dagen. Prova ett annat datum i sökningen ovan.")).toBeVisible();
  await expect(flightButtons(page)).toHaveCount(0);
  await expect(page.getByRole("status")).toHaveText("0 flyg hittades");
  await expectNoA11yViolations(page);
});

test("TRIP-010-R2 R4 R5 R7 every departure is shown with the airports and the price, sorted by departure first and by price on request, and the address shows the same search in a new tab", async ({
  page,
  context,
}) => {
  await openResults(page, oneWay());
  // R4: every departure of the route, at least 5, and the number matches
  const times = await timesShown(page);
  const count = times.length;
  expect(count).toBeGreaterThanOrEqual(5);
  await expect(page.getByText(new RegExp(`· ${count} flyg$`))).toBeVisible();
  await expect(page.getByRole("status")).toHaveText(`${count} flyg hittades`);
  await expectNoA11yViolations(page);

  // R5: the card shows the departure, the airports and the price, no flight time
  const card = flightButtons(page).first();
  await expect(card).toHaveAccessibleName(/^\d\d:\d\d ARN Stockholm till LHR London från [\d\s]+kr \/ person$/);
  await expect(card).not.toContainText(/min|tim|ankomst/i);

  // R7: sorted by departure first, by price on request, at once
  expect(times).toEqual(times.toSorted());
  await sortBy(page, "Pris");
  await expect(page.getByRole("radio", { name: "Pris" })).toBeChecked();
  const prices = await pricesShown(page);
  expect(prices).toEqual(prices.toSorted((a, b) => a - b));
  await expect(page.getByRole("status")).toHaveText(/flyg hittades$/);
  await sortBy(page, "Avgångstid");
  expect(await timesShown(page)).toEqual(times);

  // R2: the same address in a new tab shows the same flights, and the prices are the same every time (R11)
  const other = await context.newPage();
  await openResults(other, page.url());
  expect(await timesShown(other)).toEqual(times);
  expect(await pricesShown(other)).toEqual(await pricesShown(page));
});

test("TRIP-010-R6 R9 a card expands with the details and Välj, collapses again, and a one-way trip ends with the chosen flight and its total price", async ({
  page,
}) => {
  await openResults(page, oneWay(TOMORROW, 3));
  const card = flightButtons(page).first();
  const price = kronor((await card.textContent()) ?? "");

  await card.click();
  await expect(card).toHaveAttribute("aria-expanded", "true");
  const details = page.locator(`[id="${await card.getAttribute("aria-controls")}"]`);
  await expect(details).toContainText(/Flygnummer\s*GF \d+/);
  await expect(details).toContainText("Stockholm Arlanda, Sverige");
  await expect(details).toContainText("London Heathrow, Storbritannien");
  await expect(details).toContainText(/Totalt för 3 resenärer/);
  expect(kronor((await details.textContent()) ?? "")).toBe(3 * price);
  await expect(details.getByRole("button", { name: "Välj" })).toBeVisible();
  await expectNoA11yViolations(page);

  await card.click();
  await expect(card).toHaveAttribute("aria-expanded", "false");
  await expect(details).toBeHidden();

  // Enter and Space work too
  await card.press("Enter");
  await expect(card).toHaveAttribute("aria-expanded", "true");
  await card.press(" ");
  await expect(card).toHaveAttribute("aria-expanded", "false");

  // R9: Välj ends the trip with the flight and its total price
  await card.click();
  await details.getByRole("button", { name: "Välj" }).click();
  await expect(page.getByRole("heading", { name: "Din resa" })).toBeFocused();
  await expect(summary(page).getByText("Totalt för 3 resenärer")).toBeVisible();
  expect(await summaryTotal(page)).toBe(3 * price);
  await expectNoA11yViolations(page);
});

test("TRIP-010-R2 R6 R8 R9 the results page shows the search in the form and a new date searches again, a return trip is chosen in two steps, changing the outbound starts over, and the trip ends with both flights and the sum of their prices, also at 320 px", async ({
  page,
}) => {
  await openResults(page, roundTrip);
  await expect(page.getByRole("combobox", { name: "Från" })).toHaveValue("Stockholm Arlanda (ARN)");
  await expect(page.getByRole("combobox", { name: "Till" })).toHaveValue("London Heathrow (LHR)");
  await expect(page.getByRole("combobox", { name: "Utresa" })).toHaveValue(formatShort(TOMORROW));
  await expect(page.getByRole("combobox", { name: "Hemresa" })).toHaveValue(formatShort(IN_A_WEEK));
  await expect(page.getByRole("group", { name: "Antal resenärer" })).toContainText("2");

  // R2: a new date searches again
  const later = daysFromToday(3);
  await page.getByRole("combobox", { name: "Utresa" }).fill(formatShort(later));
  await page.getByRole("combobox", { name: "Utresa" }).press("Enter");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Sök", exact: true }).click();
  await expect(page).toHaveURL(roundTrip.replace(TOMORROW, later));
  await searchDone(page);
  await expect(page.getByText(new RegExp(`^${formatDay(later)} · \\d+ flyg$`))).toBeVisible();

  // R8: the outbound is chosen first, then the return
  await expect(page.getByRole("listitem").filter({ hasText: "Utresa" })).toHaveAttribute("aria-current", "step");
  const wide = page.viewportSize()!;
  const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  const first = flightButtons(page).first();
  const outboundTime = ((await first.textContent()) ?? "").slice(0, 5);
  await first.click();
  await expect(page.getByRole("button", { name: "Välj" })).toBeVisible();
  // R6: an expanded card fits at 320 px
  await page.setViewportSize({ width: 320, height: 640 });
  expect(await overflow()).toBeLessThanOrEqual(0);
  await page.setViewportSize(wide);
  await page.getByRole("button", { name: "Välj" }).click();

  await expect(listHeading(page)).toHaveText("Hemresa London – Stockholm");
  await expect(listHeading(page)).toBeFocused();
  await expect(page.getByRole("listitem").filter({ hasText: "Hemresa" })).toHaveAttribute("aria-current", "step");
  await expect(page.getByText("Vald utresa")).toBeVisible();
  await expect(page.getByText(new RegExp(`${outboundTime} ARN Stockholm – LHR London`))).toBeVisible();
  await expect(flightButtons(page).first()).toHaveAccessibleName(/^\d\d:\d\d LHR London till ARN Stockholm/);
  await expectNoA11yViolations(page);

  // R8: changing the outbound starts over
  await page.getByRole("button", { name: "Ändra utresa" }).click();
  await expect(listHeading(page)).toHaveText("Utresa Stockholm – London");
  await expect(page.getByText("Vald utresa")).toHaveCount(0);

  // R9: both flights are chosen, and the summary adds their prices
  const prices: number[] = [];
  for (let step = 0; step < 2; step++) {
    const flight = flightButtons(page).first();
    prices.push(kronor((await flight.textContent()) ?? ""));
    await flight.click();
    await page.getByRole("button", { name: "Välj" }).click();
  }
  await expect(summary(page).getByText("Utresa", { exact: true })).toBeVisible();
  await expect(summary(page).getByText("Hemresa", { exact: true })).toBeVisible();
  expect(await summaryTotal(page)).toBe(2 * (prices[0] + prices[1]));
  // R6: the summary fits at 320 px
  await page.setViewportSize({ width: 320, height: 640 });
  expect(await overflow()).toBeLessThanOrEqual(0);
});

test("TRIP-010-R12 admin has no Tilldela plan", async ({ page }) => {
  requireAdminPassword();
  await signIn(page);
  await expect(page.getByRole("button", { name: "Plan", exact: false }).first()).toBeVisible();
  await expect(page.getByText("Tilldela plan")).toHaveCount(0);
  await expect(page.getByText(/rutter har plan/)).toHaveCount(0);
});

test("TRIP-010-R4 @smoke a search ARN → LHR for tomorrow shows at least 5 flights", async ({ page }) => {
  await openResults(page, oneWay());
  expect(await flightButtons(page).count()).toBeGreaterThanOrEqual(5);
});
