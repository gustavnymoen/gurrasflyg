import { expect, type Locator } from "@playwright/test";
import { formatDuration, formatPrice } from "../lib/format";
import { expectNoA11yViolations, kronor, openResults, signIn } from "./helpers";
import {
  aircraftCard,
  aircraftCards,
  aircraftList,
  alert,
  amount,
  cardMinutes,
  cardPrice,
  chooseAircraft,
  chooseFlights,
  chosenAircraft,
  classList,
  classRow,
  count,
  done,
  flightButtons,
  folded,
  openPlan,
  place,
  searchUrl,
  TOMORROW,
  test,
} from "./plan";

// The prices, times, rules and the address are also unit tests: lib/fare-rules.test.ts,
// lib/trip.test.ts, lib/numbers.test.ts and db/migrations/008_factors.test.ts.
// Here the page is shown to use them.

// "07:20" + 80 minutes -> "08:40"
const later = (time: string, by: number) => {
  const total = (Number(time.slice(0, 2)) * 60 + Number(time.slice(3)) + by + 24 * 60) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

test("TRIP-011-R1 Fortsätt opens the chosen flights and the travellers, and a reload shows the same", async ({
  page,
}) => {
  const [outbound, back] = await openPlan(page, 2, true);
  await expect(page).toHaveURL(/\/flyg\/plan\?/);
  const overview = page.locator("section").filter({ has: page.getByRole("heading", { name: "Din resa" }) });
  const check = async () => {
    await expect(overview).toContainText(new RegExp(`Utresa.*${outbound} ARN Stockholm – LHR London`));
    await expect(overview).toContainText(new RegExp(`Hemresa.*${back} LHR London – ARN Stockholm`));
    await expect(overview).toContainText("2 resenärer");
  };
  await check();
  const steps = page.getByRole("list", { name: "Steg" }).getByRole("listitem");
  await expect(steps.filter({ hasText: "Plan och klass" })).toHaveAttribute("aria-current", "step");
  await page.reload();
  await check();
});

test("TRIP-011-R1 an address without a chosen flight says what to do", async ({ page }) => {
  await page.goto(`/flyg/plan?fran=ARN&till=LHR&utresa=${TOMORROW}&resenarer=2`);
  await expect(page.getByText("Adressen saknar något. Börja med att söka efter ett flyg.")).toBeVisible();
  await page.goto(`/flyg/plan?fran=ARN&till=LHR&utresa=${TOMORROW}&resenarer=2&ut=03:33`);
  await expect(page.getByText("Flyget finns inte eller har redan gått. Välj ett annat flyg.")).toBeVisible();
});

test.describe("with the tests' own aircraft", () => {
  test.skip(!process.env.ADMIN_PASSWORD, "ADMIN_PASSWORD is not set");

  // That an aircraft without room is not shown is TRIP-026-R1
  test("TRIP-011-R2 R9 each aircraft shows its price, time, arrival and how it compares, and the från price in the results is the cheapest with room for everyone", async ({
    page,
    fleet,
  }) => {
    await openResults(page, searchUrl(5, false));
    const from = kronor((await flightButtons(page).first().textContent()) ?? "");
    const [departure] = await chooseFlights(page, false);
    await page.getByRole("link", { name: "Fortsätt" }).click();
    await expect(page.getByRole("heading", { name: "Plan för utresan" })).toBeVisible();
    // Stor has the factors 1,00: its time is the route's, and London is an hour behind Stockholm
    const large = aircraftCard(page, "utresan", fleet.large);
    const route = await cardMinutes(large);
    await expect(large).toContainText(`landar ${later(departure, route - 60)}`);
    expect(await cardMinutes(aircraftCard(page, "utresan", fleet.fast))).toBe(Math.round(route * 0.3));
    expect(await cardPrice(aircraftCard(page, "utresan", fleet.fast))).toBe(Math.round((await cardPrice(large)) * 3));

    // Every aircraft is compared with the cheapest and the fastest of them
    const shown = [];
    for (const card of await aircraftCards(page, "utresan").all()) shown.push({ card, price: await cardPrice(card), time: await cardMinutes(card) });
    const cheapest = Math.min(...shown.map((s) => s.price));
    const fastest = Math.min(...shown.map((s) => s.time));
    for (const { card, price, time } of shown) {
      await expect(card).toContainText(price === cheapest ? "Billigast" : `+${formatPrice(price - cheapest)} / person`);
      await expect(card).toContainText(time === fastest ? "Snabbast" : `+${formatDuration(time - fastest)}`);
    }
    // R9: Liten has room for 4 and doesn't count, and the från price is the cheapest of the others
    await expect(aircraftCard(page, "utresan", fleet.small)).toHaveCount(0);
    expect(cheapest).toBe(from);
    await chooseAircraft(page, "utresan", fleet.large);
    await expectNoA11yViolations(page);
  });

  // Where the classes start (at 0) is TRIP-024-R2
  test("TRIP-011-R3 the classes show their prices, keep to the seats and say what is missing, and at 320 px the aircraft and the classes fit without sideways scrolling", async ({
    page,
    fleet,
  }) => {
    const wide = page.viewportSize()!;
    const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    await openPlan(page, 3);
    await page.setViewportSize({ width: 320, height: 640 });
    expect(await overflow()).toBeLessThanOrEqual(0);
    await chooseAircraft(page, "utresan", fleet.fast);
    expect(await overflow()).toBeLessThanOrEqual(0);
    await page.setViewportSize(wide);
    const basic = classRow(page, "utresan", fleet.base);
    const luxury = classRow(page, "utresan", fleet.luxury);
    await expect(basic).toContainText("Billigast");
    await expect(luxury).toContainText(`+${formatPrice((await cardPrice(luxury)) - (await cardPrice(basic)))} / person`);

    const more = (row: Locator, name: string) => row.getByRole("button", { name: `Fler i ${name}` });
    await place(page, "utresan", fleet.luxury, 2);
    await expect(count(luxury)).toHaveText(`2 i ${fleet.luxury}`);
    // The class has two seats: a third traveller can't be put there
    await expect(more(luxury, fleet.luxury)).toHaveAttribute("aria-disabled", "true");

    // The message comes at Klar (TRIP-026-R3)
    await done(page, "utresan");
    const message = classList(page, "utresan").getByRole("alert");
    await expect(message).toHaveText("1 resenär har ingen klass. Lägg till den i en klass.");
    await expectNoA11yViolations(page);
    await more(basic, fleet.base).click();
    await expect(message).toHaveCount(0);
    // All three are placed, so no class takes more
    await expect(more(basic, fleet.base)).toHaveAttribute("aria-disabled", "true");

    // Klar folds the card, which also fits at 320 px
    await done(page, "utresan");
    await expect(folded(page, "utresan")).toBeVisible();
    await page.setViewportSize({ width: 320, height: 640 });
    expect(await overflow()).toBeLessThanOrEqual(0);
  });

  test("TRIP-011-R4 R10 the prices follow every change at once, another aircraft clears the classes, going back and on keeps everything, and another flight clears its aircraft", async ({
    page,
    fleet,
  }) => {
    await openPlan(page, 3, true);
    const legTotal = (leg: "utresan" | "hemresan") => classList(page, leg).getByText(/^\d[\d\s]*\skr$/);
    const tripTotal = page.getByText(/^\d[\d\s]*\skr$/).last();
    const total = async (locator: Locator) => amount(await locator.textContent());
    const priceOf = async (leg: "utresan" | "hemresan", name: string) => cardPrice(classRow(page, leg, name));

    // R4: two in the cheapest class and one in the luxury class on the outbound flight
    await chooseAircraft(page, "utresan", fleet.large);
    await place(page, "utresan", fleet.base, 2);
    const outboundBasic = await priceOf("utresan", fleet.base);
    await expect(legTotal("utresan")).toHaveText(formatPrice(2 * outboundBasic));
    await place(page, "utresan", fleet.luxury, 1);
    const outboundTotal = 2 * outboundBasic + (await priceOf("utresan", fleet.luxury));
    await expect(legTotal("utresan")).toHaveText(formatPrice(outboundTotal));
    expect(await total(tripTotal)).toBe(outboundTotal);
    await done(page, "utresan");
    // R4: two in the cheapest and one in the luxury class on the return flight
    await chooseAircraft(page, "hemresan", fleet.fast);
    await place(page, "hemresan", fleet.base, 2);
    await place(page, "hemresan", fleet.luxury, 1);
    const returnTotal = 2 * (await priceOf("hemresan", fleet.base)) + (await priceOf("hemresan", fleet.luxury));
    await expect(legTotal("hemresan")).toHaveText(formatPrice(returnTotal));
    expect(await total(tripTotal)).toBe(outboundTotal + returnTotal);

    // R10: back to the flights and on, without a change
    await page.getByRole("link", { name: "Flyg", exact: true }).click();
    await page.getByRole("link", { name: "Fortsätt" }).click();
    await expect(folded(page, "utresan")).toContainText(`${fleet.base}: 2`);
    await expect(chosenAircraft(page, "hemresan")).toContainText(fleet.fast);
    await folded(page, "utresan").click();
    await expect(count(classRow(page, "utresan", fleet.base))).toHaveText(`2 i ${fleet.base}`);

    // R10: another aircraft, and every class starts at 0 again (TRIP-024-R2)
    await chosenAircraft(page, "utresan").click();
    await chooseAircraft(page, "utresan", fleet.fast);
    await expect(count(classRow(page, "utresan", fleet.base))).toHaveText(`0 i ${fleet.base}`);
    await expect(count(classRow(page, "utresan", fleet.luxury))).toHaveText(`0 i ${fleet.luxury}`);

    // R10: another flight clears its aircraft and classes, and keeps the other flight's
    await place(page, "utresan", fleet.base, 3);
    await done(page, "utresan");
    await page.getByRole("link", { name: "Flyg", exact: true }).click();
    await page.getByRole("button", { name: "Ändra hemresa" }).click();
    await chooseFlights(page, false, [1]);
    await page.getByRole("link", { name: "Fortsätt" }).click();
    await expect(folded(page, "utresan")).toContainText(fleet.fast);
    await expect(aircraftList(page, "hemresan")).toBeVisible();
    await expect(chosenAircraft(page, "hemresan")).toHaveCount(0);
  });

  test.describe("in admin", () => {
    // Signed in in the test, not in beforeEach, which runs before the tests' aircraft are created
    test("TRIP-011-R6 a class's price factor is shown, checked and used in the prices", async ({ page, fleet }) => {
      await signIn(page);
      const row = page.getByRole("row").filter({ hasText: fleet.luxury });
      await expect(row).toContainText("2,00");
      await page.getByRole("button", { name: `Ändra ${fleet.luxury}`, exact: true }).click();
      const factor = page.getByLabel("Prisfaktor");
      for (const wrong of ["0,90", "10,50", "abc"]) {
        await factor.fill(wrong);
        await page.getByRole("button", { name: "Spara", exact: true }).click();
        await expect(alert(page)).toHaveText(/Prisfaktorn måste vara ett tal från 1 till 10/);
        await expect(factor).toHaveAttribute("aria-invalid", "true");
      }
      await expectNoA11yViolations(page);
      await factor.fill("2,50");
      await page.getByRole("button", { name: "Spara", exact: true }).click();
      await expect(page.getByRole("row").filter({ hasText: fleet.luxury })).toContainText("2,50");

      try {
        await openPlan(page, 1);
        await chooseAircraft(page, "utresan", fleet.large);
        const basic = await cardPrice(classRow(page, "utresan", fleet.base));
        expect(await cardPrice(classRow(page, "utresan", fleet.luxury))).toBe(Math.round(basic * 2.5));
      } finally {
        await page.goto("/admin");
        await page.getByRole("button", { name: `Ändra ${fleet.luxury}`, exact: true }).click();
        await page.getByLabel("Prisfaktor").fill("2,00");
        await page.getByRole("button", { name: "Spara", exact: true }).click();
        await expect(page.getByRole("row").filter({ hasText: fleet.luxury })).toContainText("2,00");
      }
    });

    test("TRIP-011-R8 an aircraft's factors are shown, checked and used in the times, and at 320 px the form and its factor fields fit in view", async ({ page, fleet }) => {
      await signIn(page);
      const row = page.getByRole("row").filter({ hasText: fleet.small });
      await expect(row).toContainText("1,50");
      await expect(row).toContainText("2,00");
      await page.getByRole("button", { name: `Ändra ${fleet.small}`, exact: true }).click();
      const price = page.getByLabel("Prisfaktor");
      const time = page.getByLabel("Tidsfaktor");
      const save = page.getByRole("button", { name: "Spara", exact: true });

      // The table scrolls sideways at 320 px, but the form in it is seen whole without scrolling
      const wide = page.viewportSize()!;
      await page.setViewportSize({ width: 320, height: 640 });
      for (const field of [page.getByLabel("Planets namn"), price, time, save]) {
        const box = await field.boundingBox();
        expect(box && box.x + box.width).toBeLessThanOrEqual(320);
      }
      await page.setViewportSize(wide);

      await price.fill("0,90");
      await time.fill("0");
      await save.click();
      await expect(alert(page)).toContainText("Prisfaktorn måste vara ett tal från 1 till 10");
      await expect(alert(page)).toContainText("Tidsfaktorn måste vara ett tal större än 0 och högst 10");
      await expect(price).toHaveAttribute("aria-invalid", "true");
      await expect(time).toHaveAttribute("aria-invalid", "true");
      await expectNoA11yViolations(page);
      await price.fill("1,50");
      await time.fill("abc");
      await save.click();
      await expect(alert(page)).toHaveText(/^Tidsfaktorn/);
      await expect(price).not.toHaveAttribute("aria-invalid");

      await time.fill("0,50");
      await save.click();
      await expect(page.getByRole("row").filter({ hasText: fleet.small })).toContainText("0,50");
      try {
        await openPlan(page, 1);
        const route = await cardMinutes(aircraftCard(page, "utresan", fleet.large));
        expect(await cardMinutes(aircraftCard(page, "utresan", fleet.small))).toBe(Math.round(route * 0.5));
      } finally {
        await page.goto("/admin");
        await page.getByRole("button", { name: `Ändra ${fleet.small}`, exact: true }).click();
        await page.getByLabel("Tidsfaktor").fill("2,00");
        await page.getByRole("button", { name: "Spara", exact: true }).click();
        await expect(page.getByRole("row").filter({ hasText: fleet.small })).toContainText("2,00");
      }
    });
  });
});

test("TRIP-011-R1 @smoke the page for a chosen flight loads and lists aircraft", async ({ page }) => {
  await openPlan(page, 1);
  await expect(aircraftList(page, "utresan").getByRole("button", { expanded: false }).first()).toBeVisible();
});
