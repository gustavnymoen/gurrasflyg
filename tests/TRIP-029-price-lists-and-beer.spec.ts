import { expect } from "@playwright/test";
import { createAddon, createAircraft, deleteWithConfirmation, expectNoA11yViolations, runsLocally, signIn } from "./helpers";
import { amount, openBooking, passenger, test } from "./plan";

// The price lists' rows are unit tests in lib/booking-rules.test.ts and shown
// in TRIP-027's and TRIP-014's tests. Which add-on is beer, and removing it,
// are unit tests there too; here the page uses them.

test.describe("beer from 18", () => {
  // The rule is for the add-on named Öl, and add-on names are unique: a
  // deployed site's own Öl would stop the test from creating one
  test.skip(!process.env.ADMIN_PASSWORD || !runsLocally, "Creates the add-on Öl: only against the local test server");

  test("TRIP-029-R3 R4 Öl waits for 18, and is removed when the age goes below 18", async ({ page, fleet }) => {
    const aircraft = "E2E Plan Öl";
    await signIn(page);
    await createAddon(page, "Öl", "100", "En kall");
    await createAircraft(page, aircraft, [{ name: fleet.base, seats: 10 }], [{ name: "Öl", className: fleet.base }]);
    try {
      await openBooking(page, aircraft, { [fleet.base]: 1 });
      const card = passenger(page, 1);
      const more = card.getByRole("button", { name: "Fler Öl" });
      const beer = card.getByRole("listitem").filter({ hasText: "En kall" });
      // The form's total, with the add-ons (Din resa further down has one without them)
      const total = async () =>
        amount(await page.getByText(/^Totalt för resan/).first().locator("..").locator("span").last().textContent());

      // No age yet, then 17: Från 18 år, and + can't be used
      await expect(beer).toContainText("Från 18 år");
      await card.getByLabel("Ålder").selectOption("17");
      await expect(more).toHaveAttribute("aria-disabled", "true");

      // 40: two beers, priced as before
      await card.getByLabel("Ålder").selectOption("40");
      await expect(beer).not.toContainText("Från 18 år");
      const before = await total();
      await more.click();
      await more.click();
      await expect(beer.locator("[aria-live]")).toHaveText("2 Öl");
      await expect.poll(total).toBe(before + 200);

      // 16: the beer is gone, the price follows, and the card says why
      await card.getByLabel("Ålder").selectOption("16");
      await expect(beer.locator("[aria-live]")).toHaveText("0 Öl");
      await expect.poll(total).toBe(before);
      await expect(card.getByRole("status")).toHaveText("Ölen togs bort eftersom passageraren är under 18 år.");
      await expectNoA11yViolations(page);
    } finally {
      await page.goto("/admin");
      await deleteWithConfirmation(page, `Ta bort ${aircraft}`);
      await deleteWithConfirmation(page, "Ta bort Öl");
    }
  });
});
