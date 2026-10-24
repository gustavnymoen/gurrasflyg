import { expect, type Page } from "@playwright/test";
import { formatPrice } from "../lib/format";
import { expectNoA11yViolations } from "./helpers";
import {
  aircraftCard,
  amount,
  cardPrice,
  chooseAircraft,
  chosenAircraft,
  classList,
  classRow,
  count,
  done,
  folded,
  openPlan,
  place,
  test,
} from "./plan";

// The first seating, the totals and when the traveller may go on are also unit
// tests in lib/fare-rules.test.ts and lib/trip.test.ts. Here the page is shown to use them.

// A flight in the summary card Din resa
const overviewItem = (page: Page, leg: "Utresa" | "Hemresa") =>
  page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: "Din resa" }) })
    .getByRole("listitem")
    .filter({ hasText: leg });
// "2 h 20 min · landar 09:40" on an aircraft card
const timeAndArrival = async (page: Page, name: string) =>
  (await aircraftCard(page, "utresan", name).getByText(/landar/).textContent()) ?? "";
const message = (page: Page, leg: "utresan" | "hemresan") => classList(page, leg).getByRole("alert");
const tripNote = (page: Page) => page.getByText(/för att gå vidare/);

test.describe("with the tests' own aircraft", () => {
  test.skip(!process.env.ADMIN_PASSWORD, "ADMIN_PASSWORD is not set");

  test("TRIP-024-R1 Din resa shows the chosen aircraft, its flight time and arrival, after a change and a reload", async ({
    page,
    fleet,
  }) => {
    await openPlan(page, 2, true);
    const outbound = overviewItem(page, "Utresa");
    await expect(outbound).not.toContainText("landar");

    const large = `${fleet.large} · ${await timeAndArrival(page, fleet.large)}`;
    await chooseAircraft(page, "utresan", fleet.large);
    await expect(outbound).toContainText(large);
    // Only the outbound flight has an aircraft
    await expect(overviewItem(page, "Hemresa")).not.toContainText("landar");
    await expectNoA11yViolations(page);

    await chosenAircraft(page, "utresan").click();
    const fast = `${fleet.fast} · ${await timeAndArrival(page, fleet.fast)}`;
    await chooseAircraft(page, "utresan", fleet.fast);
    await expect(outbound).toContainText(fast);
    await expect(outbound).not.toContainText(fleet.large);

    await page.reload();
    await expect(outbound).toContainText(fast);
  });

  // The message comes at Klar (TRIP-026-R3)
  test("TRIP-024-R2 every class starts at 0, and the numbers are kept going back and on", async ({ page, fleet }) => {
    await openPlan(page, 2);
    await chooseAircraft(page, "utresan", fleet.fast);
    await expect(count(classRow(page, "utresan", fleet.base))).toHaveText(`0 i ${fleet.base}`);
    await expect(count(classRow(page, "utresan", fleet.luxury))).toHaveText(`0 i ${fleet.luxury}`);
    await done(page, "utresan");
    await expect(message(page, "utresan")).toHaveText("2 resenärer har ingen klass. Lägg till dem i en klass.");

    await place(page, "utresan", fleet.base, 1);
    await expect(message(page, "utresan")).toHaveText("1 resenär har ingen klass. Lägg till den i en klass.");
    await place(page, "utresan", fleet.luxury, 1);
    await expect(message(page, "utresan")).toHaveCount(0);
    await done(page, "utresan");

    // Back to the flights and on, without a change
    await page.getByRole("link", { name: "Flyg", exact: true }).click();
    // The plan page has a Fortsätt of its own now (TRIP-012-R1): wait for the results
    await expect(page).toHaveURL(/\/flyg\?/);
    await page.getByRole("link", { name: "Fortsätt" }).click();
    await folded(page, "utresan").click();
    await expect(count(classRow(page, "utresan", fleet.base))).toHaveText(`1 i ${fleet.base}`);
    await expect(count(classRow(page, "utresan", fleet.luxury))).toHaveText(`1 i ${fleet.luxury}`);
  });

  test("TRIP-024-R3 the totals are 0 kr at first and then the sum so far", async ({ page, fleet }) => {
    await openPlan(page, 2);
    await chooseAircraft(page, "utresan", fleet.large);
    const legTotal = classList(page, "utresan").getByText(/^\d[\d\s]*\skr$/);
    const tripTotal = page.getByText(/^\d[\d\s]*\skr$/).last();
    await expect(legTotal).toHaveText(formatPrice(0));
    await expect(tripTotal).toHaveText(formatPrice(0));

    const luxury = classRow(page, "utresan", fleet.luxury);
    await place(page, "utresan", fleet.luxury, 1);
    const price = await cardPrice(luxury);
    await expect(legTotal).toHaveText(formatPrice(price));
    expect(amount(await tripTotal.textContent())).toBe(price);
  });

  test("TRIP-024-R4 nothing leads on until everyone on every flight has a class", async ({ page, fleet }) => {
    await openPlan(page, 2, true);
    const noWayOn = async () => {
      await expect(page.getByRole("main").getByRole("link", { name: /Fortsätt|Resenärer/ })).toHaveCount(0);
      await expect(page.getByRole("main").getByRole("button", { name: /Fortsätt|Resenärer/ })).toHaveCount(0);
    };

    await chooseAircraft(page, "utresan", fleet.large);
    await place(page, "utresan", fleet.base, 1);
    await done(page, "utresan");
    await expect(message(page, "utresan")).toBeVisible();
    await expect(tripNote(page)).toHaveText("Lägg alla resenärer i en klass på varje flyg för att gå vidare.");
    await noWayOn();

    // Everyone placed on the outbound flight only
    await place(page, "utresan", fleet.base, 1);
    await done(page, "utresan");
    await chooseAircraft(page, "hemresan", fleet.fast);
    await done(page, "hemresan");
    await expect(message(page, "hemresan")).toHaveText("2 resenärer har ingen klass. Lägg till dem i en klass.");
    await expect(tripNote(page)).toHaveText("Lägg alla resenärer i en klass på varje flyg för att gå vidare.");
    await noWayOn();

    // Everyone placed: Klar on the open card leads on (TRIP-012-R1)
    await place(page, "hemresan", fleet.base, 2);
    await expect(tripNote(page)).toHaveText("Tryck Klar på varje flyg för att gå vidare.");
    await noWayOn();
  });

  test("TRIP-024-R5 focus stays on Fler and Färre when they become unavailable", async ({ page, fleet }) => {
    await openPlan(page, 2);
    await chooseAircraft(page, "utresan", fleet.fast);
    const row = classRow(page, "utresan", fleet.base);
    const more = row.getByRole("button", { name: `Fler i ${fleet.base}` });
    const fewer = row.getByRole("button", { name: `Färre i ${fleet.base}` });

    // The second Enter places the last traveller
    await more.focus();
    await page.keyboard.press("Enter");
    await expect(count(row)).toHaveText(`1 i ${fleet.base}`);
    await page.keyboard.press("Enter");
    await expect(count(row)).toHaveText(`2 i ${fleet.base}`);
    await expect(more).toBeFocused();
    await expect(more).toHaveAttribute("aria-disabled", "true");
    // It does nothing now
    await page.keyboard.press("Enter");
    await expect(count(row)).toHaveText(`2 i ${fleet.base}`);

    await fewer.focus();
    await page.keyboard.press("Enter");
    await expect(count(row)).toHaveText(`1 i ${fleet.base}`);
    await page.keyboard.press("Enter");
    await expect(count(row)).toHaveText(`0 i ${fleet.base}`);
    await expect(fewer).toBeFocused();
    await expect(fewer).toHaveAttribute("aria-disabled", "true");
    await page.keyboard.press("Tab");
    await expect(more).toBeFocused();
  });
});
