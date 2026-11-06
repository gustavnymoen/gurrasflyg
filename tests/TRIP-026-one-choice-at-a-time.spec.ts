import { expect, type Page } from "@playwright/test";
import { expectNoA11yViolations } from "./helpers";
import {
  aircraftCard,
  aircraftList,
  chooseAircraft,
  classList,
  classRow,
  continueButton,
  count,
  counter,
  done,
  folded,
  openPlan,
  place,
  test,
} from "./plan";

// The aircraft with room, the counter and which card is open after a reload
// are also unit tests in lib/fare-rules.test.ts and lib/trip.test.ts. The
// message when no aircraft has room is checked in verification.md: every
// database the tests run against has an aircraft with room for 10, the most
// a search allows.

const heading = (page: Page, name: string) => page.getByRole("heading", { name, exact: true });

// Chooses the aircraft, puts every traveller in the cheapest class and presses Fortsätt
async function finish(page: Page, leg: "utresan" | "hemresan", aircraft: string, base: string, travellers: number) {
  await chooseAircraft(page, leg, aircraft);
  await place(page, leg, base, travellers);
  await done(page, leg);
  await expect(folded(page, leg)).toBeVisible();
}

test.describe("with the tests' own aircraft", () => {
  test.skip(!process.env.ADMIN_PASSWORD, "ADMIN_PASSWORD is not set");

  test("TRIP-026-R1 an aircraft without room for every traveller is not shown", async ({ page, fleet }) => {
    // Liten has 4 seats, Snabb 5 and Stor 12
    await openPlan(page, 5);
    await expect(aircraftCard(page, "utresan", fleet.large)).toBeVisible();
    await expect(aircraftCard(page, "utresan", fleet.fast)).toBeVisible();
    await expect(aircraftCard(page, "utresan", fleet.small)).toHaveCount(0);
    await expect(page.getByText(/För få platser|Inget plan har plats/)).toHaveCount(0);
  });

  test("TRIP-026-R2 R3 one card per flight, changed by TRIP-043: Välj opens the aircraft's classes in its row, the counter counts up, Fortsätt waits for everyone and folds the card", async ({
    page,
    fleet,
  }) => {
    await openPlan(page, 3, true);
    // Only the outbound card
    await expect(heading(page, "Utresa")).toBeVisible();
    await expect(heading(page, "Hemresa")).toHaveCount(0);

    // Opening an aircraft chooses nothing; the classes are in its row
    const card = aircraftCard(page, "utresan", fleet.fast);
    const choose = card.getByRole("button", { name: "Välj" });
    await choose.focus();
    await page.keyboard.press("Enter");
    await expect(choose).toHaveAttribute("aria-pressed", "true");
    await expect(card.getByRole("region", { name: "Klasser på utresan" })).toBeVisible();
    await expect(card).toContainText(`${fleet.base}`);
    await expect(page).not.toHaveURL(/ut-plan=/);
    await expectNoA11yViolations(page);

    // R3: the counter counts up
    await expect(counter(page, "utresan")).toHaveText("0 av 3 placerade");
    await expect(counter(page, "utresan")).toHaveAttribute("aria-live", "polite");

    // Fortsätt with one of three placed is disabled and says who is missing
    await place(page, "utresan", fleet.base, 1);
    await expect(counter(page, "utresan")).toHaveText("1 av 3 placerade");
    await expect(continueButton(page, "utresan")).toBeDisabled();
    await expect(classList(page, "utresan")).toContainText("Placera ut 2 resenärer till");
    await expect(heading(page, "Hemresa")).toHaveCount(0);

    await place(page, "utresan", fleet.base, 1);
    await expect(counter(page, "utresan")).toHaveText("2 av 3 placerade");
    await place(page, "utresan", fleet.luxury, 1);
    await expect(counter(page, "utresan")).toHaveText("3 av 3 placerade");
    await expect(counter(page, "utresan").locator("svg")).toBeVisible();
    const total = (await classList(page, "utresan").getByText(/^\d[\d\s]*\skr$/).textContent()) ?? "";

    // Fortsätt with everyone placed: the card folds and the return card opens
    await continueButton(page, "utresan").focus();
    await page.keyboard.press("Enter");
    await expect(heading(page, "Hemresa")).toBeFocused();
    await expect(aircraftList(page, "hemresan")).toBeVisible();
    const summary = folded(page, "utresan");
    await expect(summary).toContainText(fleet.fast);
    await expect(summary).toContainText(`${fleet.base}: 2`);
    await expect(summary).toContainText(`${fleet.luxury}: 1`);
    await expect(summary).toContainText(total);
    await expect(classList(page, "utresan")).toHaveCount(0);
  });

  test("TRIP-026-R4 R5 after a reload the done cards are folded and the first one not done is open, an earlier choice opens again, and only another aircraft clears its classes", async ({
    page,
    fleet,
  }) => {
    await openPlan(page, 2, true);
    // R5: after a reload the done cards are folded and the first one not done is open
    await finish(page, "utresan", fleet.large, fleet.base, 2);
    await page.reload();
    await expect(folded(page, "utresan")).toContainText(fleet.large);
    await expect(aircraftList(page, "hemresan")).toBeVisible();

    // With an aircraft chosen, the card opens with its row open
    await chooseAircraft(page, "hemresan", fleet.fast);
    await place(page, "hemresan", fleet.base, 1);
    await page.reload();
    await expect(folded(page, "utresan")).toBeVisible();
    await expect(count(classRow(page, "hemresan", fleet.base))).toHaveText(`1 i ${fleet.base}`);

    // R4: the last Fortsätt goes on to Resenärer; going back, both cards are folded
    await place(page, "hemresan", fleet.base, 1);
    await done(page, "hemresan");
    await expect(page.getByRole("heading", { name: "Resenärer", level: 1 })).toBeVisible();
    await page.goBack();
    await page.reload();
    await expect(folded(page, "utresan")).toBeVisible();
    await expect(folded(page, "hemresan")).toBeVisible();
    const returnSummary = (await folded(page, "hemresan").textContent()) ?? "";

    // Opening the outbound card with the keyboard shows its row with the classes
    await folded(page, "utresan").focus();
    await page.keyboard.press("Enter");
    await expect(heading(page, "Utresa")).toBeFocused();
    await expect(count(classRow(page, "utresan", fleet.base))).toHaveText(`2 i ${fleet.base}`);
    await expect(folded(page, "hemresan")).toHaveText(returnSummary);

    // Another aircraft starts its classes from 0 once someone is placed there; the return card is unchanged
    await chooseAircraft(page, "utresan", fleet.fast);
    await expect(count(classRow(page, "utresan", fleet.base))).toHaveText(`0 i ${fleet.base}`);
    await expect(counter(page, "utresan")).toHaveText("0 av 2 placerade");
    await expect(folded(page, "hemresan")).toHaveText(returnSummary);

    // Fortsätt folds it again; the return card is already folded, so it goes on
    await place(page, "utresan", fleet.base, 2);
    await done(page, "utresan");
    await expect(page.getByRole("heading", { name: "Resenärer", level: 1 })).toBeVisible();
  });
});

test("TRIP-026-R5 the steps are Flyg, Plan och klass, Resenärer and Betala (TRIP-012-R10)", async ({ page }) => {
  await openPlan(page, 1);
  const steps = page.getByRole("list", { name: "Steg" }).getByRole("listitem");
  await expect(steps).toHaveText([/Flyg/, /Plan och klass/, /Resenärer/, /Betala/]);
  await expect(steps.nth(1)).toHaveAttribute("aria-current", "step");
  await expect(steps.nth(0).getByRole("link", { name: "Flyg" })).toBeVisible();
});

