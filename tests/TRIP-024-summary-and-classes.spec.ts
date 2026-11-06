import { expect, type Page } from "@playwright/test";
import { formatPrice } from "../lib/format";
import { expectNoA11yViolations } from "./helpers";
import {
  aircraftCard,
  amount,
  cardPrice,
  chooseAircraft,
  classList,
  classRow,
  continueButton,
  count,
  done,
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
    // Din resa shows the aircraft once a traveller is placed in it (TRIP-043-R6)
    await chooseAircraft(page, "utresan", fleet.large);
    await expect(outbound).not.toContainText("landar");
    await place(page, "utresan", fleet.base, 1);
    await expect(outbound).toContainText(large);
    // Only the outbound flight has an aircraft
    await expect(overviewItem(page, "Hemresa")).not.toContainText("landar");
    await expectNoA11yViolations(page);

    const fast = `${fleet.fast} · ${await timeAndArrival(page, fleet.fast)}`;
    await chooseAircraft(page, "utresan", fleet.fast);
    await place(page, "utresan", fleet.base, 1);
    await expect(outbound).toContainText(fast);
    await expect(outbound).not.toContainText(fleet.large);

    await page.reload();
    await expect(outbound).toContainText(fast);
  });

  test("TRIP-024-R2 R3 R5 every class starts at 0, the totals follow, focus stays on Fler and Färre, and the numbers are kept going back and on", async ({
    page,
    fleet,
  }) => {
    await openPlan(page, 2);
    await chooseAircraft(page, "utresan", fleet.fast);
    await expect(count(classRow(page, "utresan", fleet.base))).toHaveText(`0 i ${fleet.base}`);
    await expect(count(classRow(page, "utresan", fleet.luxury))).toHaveText(`0 i ${fleet.luxury}`);

    // R3: the totals are 0 kr at first
    const legTotal = classList(page, "utresan").getByText(/^\d[\d\s]*\skr$/);
    const tripTotal = page.getByText(/^\d[\d\s]*\skr$/).last();
    await expect(legTotal).toHaveText(formatPrice(0));
    await expect(tripTotal).toHaveText(formatPrice(0));

    // R5: focus stays on Fler and Färre when they become unavailable
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

    // R2: Fortsätt waits and says who is missing (TRIP-043-R7)
    await expect(continueButton(page, "utresan")).toBeDisabled();
    await expect(classList(page, "utresan")).toContainText("Placera ut 2 resenärer till");

    // R3: the totals are the sum so far
    const luxury = classRow(page, "utresan", fleet.luxury);
    await place(page, "utresan", fleet.luxury, 1);
    const price = await cardPrice(luxury);
    await expect(legTotal).toHaveText(formatPrice(price));
    expect(amount(await tripTotal.textContent())).toBe(price);
    await expect(classList(page, "utresan")).toContainText("Placera ut 1 resenär till");
    await place(page, "utresan", fleet.base, 1);
    await expect(continueButton(page, "utresan")).toBeEnabled();

    // R2: back to the flights and on, without a change
    await page.getByRole("link", { name: "Flyg", exact: true }).click();
    await expect(page).toHaveURL(/\/flyg\?/);
    await page.getByRole("link", { name: "Fortsätt" }).click();
    await expect(count(classRow(page, "utresan", fleet.base))).toHaveText(`1 i ${fleet.base}`);
    await expect(count(classRow(page, "utresan", fleet.luxury))).toHaveText(`1 i ${fleet.luxury}`);
  });

  test("TRIP-024-R4 nothing leads on until everyone on every flight has a class", async ({ page, fleet }) => {
    await openPlan(page, 2, true);
    const noWayOn = async () => {
      await expect(page.getByRole("main").getByRole("link", { name: /Fortsätt|Resenärer/ })).toHaveCount(0);
      await expect(page.getByRole("main").getByRole("button", { name: /Fortsätt/, disabled: false })).toHaveCount(0);
    };

    await chooseAircraft(page, "utresan", fleet.large);
    await place(page, "utresan", fleet.base, 1);
    await expect(continueButton(page, "utresan")).toBeDisabled();
    await noWayOn();

    // Everyone placed on the outbound flight only: the return flight comes, and its Fortsätt waits
    await place(page, "utresan", fleet.base, 1);
    await done(page, "utresan");
    await chooseAircraft(page, "hemresan", fleet.fast);
    await expect(continueButton(page, "hemresan")).toBeDisabled();
    await expect(classList(page, "hemresan")).toContainText("Placera ut 2 resenärer till");
    await noWayOn();

    // Everyone placed: Fortsätt on the last flight leads on (TRIP-012-R1)
    await place(page, "hemresan", fleet.base, 2);
    await expect(continueButton(page, "hemresan")).toBeEnabled();
  });
});
