import { expect, type Page } from "@playwright/test";
import { expectNoA11yViolations, runsLocally } from "./helpers";
import { amount, deleteBookings, fillAll, openBooking, test } from "./plan";

// How the total is split (shares, rounding, the remainder) is a unit test in
// lib/booking-rules.test.ts; here the page shows it and it adds up.

const ROWS = [
  "Bränsle",
  "Mutor",
  "Alla möjliga avgifter",
  "Stänga luftrummet vid avgång och ankomst",
  "Försäkring",
  "Skatt 0 %",
];

// The price list on the page: the labels in order and the sums
async function readPriceList(page: Page) {
  const list = page.locator("main dl:visible");
  const labels = await list.locator("dt").allTextContents();
  const sums = (await list.locator("dd").allTextContents()).map(amount);
  return { list, labels, sums };
}

const sum = (numbers: number[]) => numbers.reduce((a, b) => a + b, 0);

test.describe("with the tests' own aircraft", () => {
  test.skip(!process.env.ADMIN_PASSWORD, "ADMIN_PASSWORD is not set");

  test("TRIP-027-R2 R4 Betala lists the six rows, adding up to Att betala, with no percent but the tax", async ({
    page,
    fleet,
  }) => {
    await openBooking(page, fleet.large, { [fleet.base]: 1, [fleet.luxury]: 2 });
    await fillAll(page, 3);
    await page.getByRole("button", { name: "Till betalning" }).click();
    await expect(page.getByRole("heading", { name: "Betala", level: 1 })).toBeVisible();

    const { labels, sums } = await readPriceList(page);
    expect(labels).toEqual(ROWS);
    const toPay = amount(await page.getByText("Att betala").locator("..").locator("span").last().textContent());
    expect(sum(sums)).toBe(toPay);
    expect(sums[5]).toBe(0);
    // No percent anywhere in the list except the tax row
    expect(labels.filter((label) => label.includes("%"))).toEqual(["Skatt 0 %"]);
    await expectNoA11yViolations(page);
  });
});

test.describe("booking, which writes to the test database", () => {
  test.skip(!process.env.ADMIN_PASSWORD || !runsLocally, "Creates bookings: only against the local test server");

  test("TRIP-027-R3 R4 the summary lists the same six rows, adding up to Totalt", async ({ page, fleet }) => {
    const email = `e2e-${Date.now()}@exempel.se`;
    try {
      await openBooking(page, fleet.large, { [fleet.base]: 1 });
      await fillAll(page, 1, email);
      await page.getByRole("button", { name: "Till betalning" }).click();
      await page.getByRole("radio", { name: "Cash till piloten" }).check();
      await page.getByRole("button", { name: "Betala" }).click();
      await expect(page.getByRole("heading", { name: "Tack för din bokning!" })).toBeVisible();

      const { labels, sums } = await readPriceList(page);
      expect(labels).toEqual(ROWS);
      const total = amount(await page.getByText("Totalt", { exact: true }).locator("..").locator("span").last().textContent());
      expect(sum(sums)).toBe(total);
      await expectNoA11yViolations(page);
    } finally {
      await deleteBookings(email);
    }
  });
});
