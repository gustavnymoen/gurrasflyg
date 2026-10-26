import { expect, type Page } from "@playwright/test";
import { expectNoA11yViolations } from "./helpers";
import {
  aircraftCard,
  aircraftList,
  alert,
  chooseAircraft,
  chosenAircraft,
  classList,
  classRow,
  count,
  counter,
  done,
  folded,
  legCard,
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

// Chooses the aircraft, puts every traveller in the cheapest class and presses Klar
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

  test("TRIP-026-R2 R3 one card per flight: Välj puts the aircraft at the top and its classes below, the counter counts down, Klar says who is missing or folds the card", async ({
    page,
    fleet,
  }) => {
    await openPlan(page, 3, true);
    // Only the outbound card
    await expect(heading(page, "Utresa")).toBeVisible();
    await expect(heading(page, "Hemresa")).toHaveCount(0);

    // Opening an aircraft chooses nothing
    const card = aircraftCard(page, "utresan", fleet.fast);
    const open = card.getByRole("button", { name: new RegExp(fleet.fast) });
    await open.focus();
    await page.keyboard.press("Enter");
    await expect(open).toHaveAttribute("aria-expanded", "true");
    await expect(card).toContainText(`${fleet.base}: 3 platser`);
    await expect(classList(page, "utresan")).toHaveCount(0);
    await expect(page).not.toHaveURL(/ut-plan=/);
    await expectNoA11yViolations(page);

    // Välj with the keyboard: Tab from the card to Välj, then Enter
    const fastTime = (await card.getByText(/landar/).textContent()) ?? "";
    await page.keyboard.press("Tab");
    await expect(card.getByRole("button", { name: "Välj" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(heading(page, "Klasser på utresan")).toBeFocused();
    await expect(page).toHaveURL(/ut-plan=/);

    // The summary at the top of the card: name, time, arrival and price, no comparison
    const chosen = chosenAircraft(page, "utresan");
    await expect(chosen).toContainText(fleet.fast);
    await expect(chosen).toContainText(fastTime);
    await expect(chosen).toContainText(/\d\skr \/ person/);
    await expect(chosen).not.toContainText(/Billigast|Snabbast/);
    await expect(aircraftList(page, "utresan")).toHaveCount(0);
    await expect(legCard(page, "utresan").getByRole("region", { name: "Klasser på utresan" })).toBeVisible();
    await expectNoA11yViolations(page);

    // R3: the counter counts down
    await expect(counter(page, "utresan")).toHaveText("Placera ut 3 resenärer");
    await expect(counter(page, "utresan")).toHaveAttribute("aria-live", "polite");
    await expect(alert(page)).toHaveCount(0);

    // Klar with one of three placed
    await place(page, "utresan", fleet.base, 1);
    await expect(counter(page, "utresan")).toHaveText("Placera ut 2 resenärer");
    const klar = classList(page, "utresan").getByRole("button", { name: "Klar" });
    await klar.focus();
    await page.keyboard.press("Enter");
    await expect(alert(page)).toHaveText("2 resenärer har ingen klass. Lägg till dem i en klass.");
    await expect(klar).toBeFocused();
    await expect(heading(page, "Hemresa")).toHaveCount(0);
    await expectNoA11yViolations(page);

    await place(page, "utresan", fleet.base, 1);
    await expect(counter(page, "utresan")).toHaveText("Placera ut 1 resenär");
    await place(page, "utresan", fleet.luxury, 1);
    await expect(counter(page, "utresan")).toHaveText("Alla resenärer har en klass");
    await expect(counter(page, "utresan").locator("svg")).toBeVisible();
    await expect(alert(page)).toHaveCount(0);
    const total = (await classList(page, "utresan").getByText(/^\d[\d\s]*\skr$/).textContent()) ?? "";

    // Klar with everyone placed: the card folds and the return card opens
    await klar.focus();
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

    // With an aircraft chosen, the card opens with it and the classes
    await chooseAircraft(page, "hemresan", fleet.fast);
    await place(page, "hemresan", fleet.base, 1);
    await page.reload();
    await expect(folded(page, "utresan")).toBeVisible();
    await expect(chosenAircraft(page, "hemresan")).toContainText(fleet.fast);
    await expect(count(classRow(page, "hemresan", fleet.base))).toHaveText(`1 i ${fleet.base}`);

    await place(page, "hemresan", fleet.base, 1);
    await done(page, "hemresan");
    await expect(folded(page, "hemresan")).toBeVisible();
    // R4: both folded, focus on the last one's summary
    await expect(folded(page, "hemresan")).toBeFocused();
    await expectNoA11yViolations(page);
    const returnSummary = (await folded(page, "hemresan").textContent()) ?? "";

    // Opening the outbound card with the keyboard shows its classes
    await folded(page, "utresan").focus();
    await page.keyboard.press("Enter");
    await expect(heading(page, "Klasser på utresan")).toBeFocused();
    await expect(count(classRow(page, "utresan", fleet.base))).toHaveText(`2 i ${fleet.base}`);
    await expect(folded(page, "hemresan")).toHaveText(returnSummary);

    // The same aircraft again keeps the classes
    await chosenAircraft(page, "utresan").click();
    await expect(heading(page, "Plan för utresan")).toBeFocused();
    await chooseAircraft(page, "utresan", fleet.large);
    await expect(count(classRow(page, "utresan", fleet.base))).toHaveText(`2 i ${fleet.base}`);

    // Another aircraft starts its classes from 0; the return card is unchanged
    await chosenAircraft(page, "utresan").click();
    await chooseAircraft(page, "utresan", fleet.fast);
    await expect(count(classRow(page, "utresan", fleet.base))).toHaveText(`0 i ${fleet.base}`);
    await expect(counter(page, "utresan")).toHaveText("Placera ut 2 resenärer");
    await expect(folded(page, "hemresan")).toHaveText(returnSummary);

    // Klar folds it again
    await place(page, "utresan", fleet.base, 2);
    await done(page, "utresan");
    await expect(folded(page, "utresan")).toContainText(fleet.fast);
    await expect(folded(page, "utresan")).toBeFocused();
  });
});

test("TRIP-026-R5 the steps are Flyg, Plan och klass, Resenärer and Betala (TRIP-012-R10)", async ({ page }) => {
  await openPlan(page, 1);
  const steps = page.getByRole("list", { name: "Steg" }).getByRole("listitem");
  await expect(steps).toHaveText([/Flyg/, /Plan och klass/, /Resenärer/, /Betala/]);
  await expect(steps.nth(1)).toHaveAttribute("aria-current", "step");
  await expect(steps.nth(0).getByRole("link", { name: "Flyg" })).toBeVisible();
});

