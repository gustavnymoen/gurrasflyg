import { expect, type Locator } from "@playwright/test";
import { formatDuration, formatPrice } from "../lib/format";
import { expectNoA11yViolations, kronor, openResults, signIn } from "./helpers";
import {
  aircraftCard,
  aircraftList,
  alert,
  amount,
  cardMinutes,
  cardPrice,
  chooseAircraft,
  chooseFlights,
  classList,
  classRow,
  count,
  flightButtons,
  openPlan,
  place,
  searchUrl,
  TOMORROW,
  test,
  toClasses,
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
  await expect(steps.filter({ hasText: "Plan" })).toHaveAttribute("aria-current", "step");
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

  test("TRIP-011-R2 each aircraft shows its price, time, arrival and how it compares; one too small can't be chosen", async ({
    page,
    fleet,
  }) => {
    const [departure] = await openPlan(page, 5);
    const small = aircraftCard(page, "utresan", fleet.small);
    await expect(aircraftList(page, "utresan").getByRole("radio", { name: fleet.small })).toBeDisabled();
    await expect(small).toContainText("För få platser: 4 platser för 5 resenärer");

    // Stor has the factors 1,00: its time is the route's, and London is an hour behind Stockholm
    const large = aircraftCard(page, "utresan", fleet.large);
    const route = await cardMinutes(large);
    await expect(large).toContainText(`landar ${later(departure, route - 60)}`);
    expect(await cardMinutes(aircraftCard(page, "utresan", fleet.fast))).toBe(Math.round(route * 0.3));
    expect(await cardPrice(aircraftCard(page, "utresan", fleet.fast))).toBe(Math.round((await cardPrice(large)) * 3));

    // Every aircraft that can be chosen is compared with the cheapest and the fastest of them
    const cards = aircraftList(page, "utresan").getByRole("listitem").filter({ has: page.locator("input:enabled") });
    const shown = [];
    for (const card of await cards.all()) shown.push({ card, price: await cardPrice(card), time: await cardMinutes(card) });
    const cheapest = Math.min(...shown.map((s) => s.price));
    const fastest = Math.min(...shown.map((s) => s.time));
    for (const { card, price, time } of shown) {
      await expect(card).toContainText(price === cheapest ? "Billigast" : `+${formatPrice(price - cheapest)} / person`);
      await expect(card).toContainText(time === fastest ? "Snabbast" : `+${formatDuration(time - fastest)}`);
    }
    await chooseAircraft(page, "utresan", fleet.large);
    await expectNoA11yViolations(page);
  });

  // Where the classes start (at 0) is TRIP-024-R2
  test("TRIP-011-R3 the classes show their prices, keep to the seats and say what is missing", async ({
    page,
    fleet,
  }) => {
    await openPlan(page, 3);
    await chooseAircraft(page, "utresan", fleet.fast);
    await toClasses(page);
    const basic = classRow(page, "utresan", fleet.base);
    const luxury = classRow(page, "utresan", fleet.luxury);
    await expect(basic).toContainText("Billigast");
    await expect(luxury).toContainText(`+${formatPrice((await cardPrice(luxury)) - (await cardPrice(basic)))} / person`);

    const more = (row: Locator, name: string) => row.getByRole("button", { name: `Fler i ${name}` });
    await place(page, "utresan", fleet.luxury, 2);
    await expect(count(luxury)).toHaveText(`2 i ${fleet.luxury}`);
    // The class has two seats: a third traveller can't be put there
    await expect(more(luxury, fleet.luxury)).toBeDisabled();

    const message = classList(page, "utresan").getByRole("alert");
    await expect(message).toHaveText("1 resenär har ingen klass. Lägg till den i en klass.");
    await expectNoA11yViolations(page);
    await more(basic, fleet.base).click();
    await expect(message).toHaveCount(0);
    // All three are placed, so no class takes more
    await expect(more(basic, fleet.base)).toBeDisabled();
  });

  test("TRIP-011-R4 the prices per class, per flight and for the trip follow every change at once", async ({
    page,
    fleet,
  }) => {
    await openPlan(page, 3, true);
    await chooseAircraft(page, "utresan", fleet.large);
    await chooseAircraft(page, "hemresan", fleet.fast);
    await toClasses(page);

    const legTotal = (leg: "utresan" | "hemresan") => classList(page, leg).getByText(/^\d[\d\s]*\skr$/);
    const tripTotal = page.getByText(/^\d[\d\s]*\skr$/).last();
    const total = async (locator: Locator) => amount(await locator.textContent());
    const priceOf = async (leg: "utresan" | "hemresan", name: string) => cardPrice(classRow(page, leg, name));

    // Everyone in the cheapest class on the outbound flight
    await place(page, "utresan", fleet.base, 3);
    expect(await total(legTotal("utresan"))).toBe(3 * (await priceOf("utresan", fleet.base)));
    // One in the luxury class on the return flight
    await place(page, "hemresan", fleet.base, 2);
    await place(page, "hemresan", fleet.luxury, 1);
    const returnTotal = 2 * (await priceOf("hemresan", fleet.base)) + (await priceOf("hemresan", fleet.luxury));
    await expect(legTotal("hemresan")).toHaveText(formatPrice(returnTotal));
    expect(await total(tripTotal)).toBe((await total(legTotal("utresan"))) + returnTotal);
  });

  test("TRIP-011-R9 the från price in the results is the cheapest aircraft with room for everyone", async ({
    page,
    fleet,
  }) => {
    await openResults(page, searchUrl(5, false));
    const from = kronor((await flightButtons(page).first().textContent()) ?? "");
    await chooseFlights(page, false);
    await page.getByRole("link", { name: "Fortsätt" }).click();
    // Liten has room for 4 and doesn't count
    await expect(aircraftCard(page, "utresan", fleet.small)).toContainText("För få platser");
    const cards = aircraftList(page, "utresan").getByRole("listitem").filter({ has: page.locator("input:enabled") });
    const prices = await Promise.all((await cards.all()).map(cardPrice));
    expect(Math.min(...prices)).toBe(from);
  });

  test("TRIP-011-R10 another aircraft clears the classes; going back and on without a change keeps everything", async ({
    page,
    fleet,
  }) => {
    await openPlan(page, 3, true);
    await chooseAircraft(page, "utresan", fleet.large);
    await chooseAircraft(page, "hemresan", fleet.fast);
    await toClasses(page);
    const basic = classRow(page, "utresan", fleet.base);
    await place(page, "utresan", fleet.base, 2);
    await place(page, "utresan", fleet.luxury, 1);
    await expect(count(basic)).toHaveText(`2 i ${fleet.base}`);

    // Back to the aircraft and on, without a change
    await page.getByRole("button", { name: "Plan", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Plan för utresan" })).toBeFocused();
    await expect(aircraftList(page, "utresan").getByRole("radio", { name: fleet.large })).toBeChecked();
    await expect(aircraftList(page, "hemresan").getByRole("radio", { name: fleet.fast })).toBeChecked();
    await toClasses(page);
    await expect(count(basic)).toHaveText(`2 i ${fleet.base}`);

    // Back to the flights and on, without a change
    await page.getByRole("link", { name: "Flyg", exact: true }).click();
    await page.getByRole("link", { name: "Fortsätt" }).click();
    await expect(page.getByRole("heading", { name: "Plan för utresan" })).toBeVisible();
    await expect(aircraftList(page, "utresan").getByRole("radio", { name: fleet.large })).toBeChecked();
    await toClasses(page);
    await expect(count(basic)).toHaveText(`2 i ${fleet.base}`);

    // Another aircraft: every class starts at 0 again (TRIP-024-R2)
    await page.getByRole("button", { name: "Plan", exact: true }).click();
    await chooseAircraft(page, "utresan", fleet.fast);
    await toClasses(page);
    await expect(count(classRow(page, "utresan", fleet.base))).toHaveText(`0 i ${fleet.base}`);
    await expect(count(classRow(page, "utresan", fleet.luxury))).toHaveText(`0 i ${fleet.luxury}`);
  });

  test("TRIP-011-R10 another flight clears its aircraft and classes", async ({ page, fleet }) => {
    await openPlan(page, 2, true);
    await chooseAircraft(page, "utresan", fleet.large);
    await chooseAircraft(page, "hemresan", fleet.fast);

    await page.getByRole("link", { name: "Flyg", exact: true }).click();
    await page.getByRole("button", { name: "Ändra hemresa" }).click();
    await chooseFlights(page, false, [1]);
    await page.getByRole("link", { name: "Fortsätt" }).click();
    await expect(aircraftList(page, "utresan").getByRole("radio", { name: fleet.large })).toBeChecked();
    await expect(aircraftList(page, "hemresan").getByRole("radio", { checked: true })).toHaveCount(0);

    // Going on without an aircraft for every flight says what is missing
    await page.getByRole("button", { name: "Fortsätt" }).click();
    await expect(alert(page)).toHaveText("Välj ett plan för hemresan.");
    await expectNoA11yViolations(page);
  });

  test.describe("on a narrow phone", () => {
    test.use({ viewport: { width: 320, height: 640 } });

    test("TRIP-011-R3 at 320 px the aircraft and the classes fit without sideways scrolling", async ({
      page,
      fleet,
    }) => {
      const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      await openPlan(page, 2);
      expect(await overflow()).toBeLessThanOrEqual(0);
      await chooseAircraft(page, "utresan", fleet.fast);
      await toClasses(page);
      expect(await overflow()).toBeLessThanOrEqual(0);
    });
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
        await toClasses(page);
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

    test("TRIP-011-R8 an aircraft's factors are shown, checked and used in the times", async ({ page, fleet }) => {
      await signIn(page);
      const row = page.getByRole("row").filter({ hasText: fleet.small });
      await expect(row).toContainText("1,50");
      await expect(row).toContainText("2,00");
      await page.getByRole("button", { name: `Ändra ${fleet.small}`, exact: true }).click();
      const price = page.getByLabel("Prisfaktor");
      const time = page.getByLabel("Tidsfaktor");
      const save = page.getByRole("button", { name: "Spara", exact: true });
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

    test.describe("on a narrow phone", () => {
      test.use({ viewport: { width: 320, height: 640 } });

      // Tabellen rullar i sidled, men formuläret i den ska synas helt utan att man rullar
      test("TRIP-011-R8 at 320 px the aircraft form and its factor fields fit in view", async ({ page, fleet }) => {
        await signIn(page);
        await page.getByRole("button", { name: `Ändra ${fleet.small}`, exact: true }).click();
        for (const field of [page.getByLabel("Planets namn"), page.getByLabel("Prisfaktor"), page.getByLabel("Tidsfaktor")]) {
          const box = await field.boundingBox();
          expect(box && box.x + box.width).toBeLessThanOrEqual(320);
        }
        const save = await page.getByRole("button", { name: "Spara", exact: true }).boundingBox();
        expect(save && save.x + save.width).toBeLessThanOrEqual(320);
      });
    });
  });
});

test("TRIP-011-R1 @smoke the page for a chosen flight loads and lists aircraft", async ({ page }) => {
  await openPlan(page, 1);
  await expect(aircraftList(page, "utresan").getByRole("radio").first()).toBeVisible();
});
