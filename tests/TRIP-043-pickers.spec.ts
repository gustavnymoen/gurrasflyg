import { expect, type Page } from "@playwright/test";
import { NO_CHOICE, resultsUrl } from "../lib/charter-rules";
import { expectNoA11yViolations, openResults } from "./helpers";
import {
  aircraftCard,
  aircraftCards,
  charterSearch,
  chooseAircraft,
  classList,
  classRow,
  continueButton,
  count,
  counter,
  done,
  flightButtons,
  folded,
  openCharterPlan,
  openPlan,
  place,
  searchUrl,
  test,
} from "./plan";

// The rules behind the steps (only one aircraft holds travellers, who is placed, which card is open
// after a reload) are unit tests in lib/trip.test.ts and lib/fare-rules.test.ts; here the pages use them.

const heading = (page: Page, name: string) => page.getByRole("heading", { name, exact: true });
const tripsUrl = () => resultsUrl("teufelsberg", charterSearch(2), NO_CHOICE);
const showMore = (page: Page, name: string) => page.getByRole("button", { name: `Visa mer om ${name}` });

test.describe("departures in flight booking", () => {
  test("TRIP-043-R1 R2 R3 every flight has a Välj without unfolding, unfolding shows more and chooses nothing, the return list comes after the outbound", async ({
    page,
  }) => {
    await openResults(page, searchUrl(1, true));
    const choose = flightButtons(page);
    const rows = await choose.count();
    expect(rows).toBeGreaterThan(1);
    // R1: a Välj on every row, named after its flight
    for (const button of await choose.all()) await expect(button).toHaveAccessibleName(/^Välj [A-Z0-9 ]+ kl \d\d:\d\d$/);
    await expect(page.getByRole("heading", { level: 2, name: /^Hemresa/ })).toHaveCount(0);

    // R2: the unfold control is a separate button; it shows the details and chooses nothing
    const name = ((await choose.first().getAttribute("aria-label")) ?? "").slice("Välj ".length);
    const more = showMore(page, name);
    await expect(more).toHaveAttribute("aria-expanded", "false");
    await more.click();
    await expect(more).toHaveAttribute("aria-expanded", "true");
    const details = page.locator(`#${await more.getAttribute("aria-controls")}`);
    await expect(details.getByText("Flygnummer")).toBeVisible();
    await expect(details.getByText("Datum")).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: /^Hemresa/ })).toHaveCount(0);
    await expectNoA11yViolations(page);
    await more.click();
    await expect(more).toHaveAttribute("aria-expanded", "false");

    // R1: one click on Välj chooses; R3: now the return list
    await choose.first().click();
    await expect(page.getByRole("heading", { level: 2, name: /^Hemresa/ })).toBeVisible();
    // The return flights have a Välj too
    await expect(flightButtons(page).first()).toBeVisible();
    await flightButtons(page).first().click();
    await expect(page.getByRole("heading", { name: "Din resa" })).toBeVisible();
  });
});

test.describe("departures in charter", () => {
  test("TRIP-043-R1 R2 R3 every trip has a Välj, unfolding shows what does not fit on the row and chooses nothing, the return list comes after the outbound", async ({
    page,
  }) => {
    await page.goto(tripsUrl());
    await expect(heading(page, "Utresa ARN – BER")).toBeVisible();
    await expect(heading(page, "Hemresa BER – ARN")).toHaveCount(0);
    const first = flightButtons(page).first();
    await expect(first).toBeVisible();
    for (const button of await flightButtons(page).all()) await expect(button).toHaveAccessibleName(/^Välj [A-Z0-9, -]+ kl \d\d:\d\d$/);

    // R2: airline, flight number, stops and date are in the unfold
    const name = ((await first.getAttribute("aria-label")) ?? "").slice("Välj ".length);
    const more = showMore(page, name);
    await more.click();
    await expect(more).toHaveAttribute("aria-expanded", "true");
    const details = page.locator(`#${await more.getAttribute("aria-controls")}`);
    for (const term of ["Flygbolag", "Flygnummer", "Byten", "Datum"]) await expect(details.getByText(term)).toBeVisible();
    await expect(heading(page, "Hemresa BER – ARN")).toHaveCount(0);
    await expectNoA11yViolations(page);

    // R1, R3: Välj chooses without unfolding, and then the return trips come
    await first.click();
    await expect(first).toHaveAttribute("aria-pressed", "true");
    await expect(heading(page, "Hemresa BER – ARN")).toBeVisible();
  });
});

test.describe("the aircraft step with the tests' own aircraft", () => {
  test.skip(!process.env.ADMIN_PASSWORD, "ADMIN_PASSWORD is not set");

  test("TRIP-043-R4 R5 R9 compact rows with Välj, the classes open in the row, one row at a time, an explanation and a counter", async ({
    page,
    fleet,
  }) => {
    await openPlan(page, 3, true);
    // R9: the text at the top
    await expect(page.getByText("Välj plan och fördela resenärerna på klasser. Hemresan kommer sedan.")).toBeVisible();

    // R4: a row per aircraft with name, price, flight time, seats and Välj; the classes are not shown yet
    const large = aircraftCard(page, "utresan", fleet.large);
    const fast = aircraftCard(page, "utresan", fleet.fast);
    for (const row of [large, fast]) {
      await expect(row.getByRole("button", { name: /^Välj / })).toBeVisible();
      await expect(row).toContainText(/\d\skr \/ person/);
      await expect(row).toContainText(/landar/);
    }
    await expect(large).toContainText("12 platser");
    await expect(fast).toContainText("5 platser");
    // The comparison badges stay in flight booking
    await expect(aircraftCards(page, "utresan").filter({ hasText: "Billigast" })).toHaveCount(1);
    await expect(aircraftCards(page, "utresan").filter({ hasText: "Snabbast" })).toHaveCount(1);
    await expect(classList(page, "utresan")).toHaveCount(0);

    // R5: Välj opens the row with its classes and the counter; nothing is written to the address
    const välj = fast.getByRole("button", { name: `Välj ${fleet.fast}` });
    await välj.click();
    await expect(välj).toHaveAttribute("aria-pressed", "true");
    await expect(fast.getByRole("region", { name: "Klasser på utresan" })).toBeVisible();
    await expect(classRow(page, "utresan", fleet.base)).toContainText("3 platser");
    await expect(classRow(page, "utresan", fleet.luxury)).toContainText("2 platser");
    await expect(counter(page, "utresan")).toHaveText("0 av 3 placerade");
    await expect(counter(page, "utresan")).toHaveAttribute("aria-live", "polite");
    await expect(page).not.toHaveURL(/ut-plan=/);
    // There is no separate block for the chosen aircraft
    await expect(page.getByText("Valt plan")).toHaveCount(0);
    await expectNoA11yViolations(page);

    // Only one row is open: opening another folds the first, and nothing changes in the address
    await large.getByRole("button", { name: `Välj ${fleet.large}` }).click();
    await expect(classList(page, "utresan")).toHaveCount(1);
    await expect(fast.getByRole("region", { name: "Klasser på utresan" })).toHaveCount(0);
    await expect(large.getByRole("region", { name: "Klasser på utresan" })).toBeVisible();
    await expect(page).not.toHaveURL(/ut-plan=/);

    // The price follows the numbers (as before), and the counter counts what is placed
    await place(page, "utresan", fleet.base, 2);
    await expect(counter(page, "utresan")).toHaveText("2 av 3 placerade");
    await expect(classList(page, "utresan").getByText(/^\d[\d\s]*\skr$/)).not.toHaveText("0 kr");
  });

  test("TRIP-043-R6 placing a traveller in another aircraft moves everyone there, and opening a row alone changes nothing", async ({
    page,
    fleet,
  }) => {
    await openPlan(page, 3);
    await chooseAircraft(page, "utresan", fleet.large);
    await place(page, "utresan", fleet.base, 2);
    const large = new URL(page.url()).searchParams;
    expect(large.get("ut-klasser")).toMatch(/^\d+:2$/);

    // Opening Snabb places no one: Stor keeps its travellers, the address is the same
    await chooseAircraft(page, "utresan", fleet.fast);
    await expect(count(classRow(page, "utresan", fleet.base))).toHaveText(`0 i ${fleet.base}`);
    await expect(counter(page, "utresan")).toHaveText("0 av 3 placerade");
    expect(new URL(page.url()).searchParams.get("ut-plan")).toBe(large.get("ut-plan"));
    await chooseAircraft(page, "utresan", fleet.large);
    await expect(count(classRow(page, "utresan", fleet.base))).toHaveText(`2 i ${fleet.base}`);

    // One traveller in Snabb: the two in Stor are removed, in the address too
    await chooseAircraft(page, "utresan", fleet.fast);
    await place(page, "utresan", fleet.luxury, 1);
    const fast = new URL(page.url()).searchParams;
    expect(fast.get("ut-plan")).not.toBe(large.get("ut-plan"));
    expect(fast.get("ut-klasser")).toMatch(/^\d+:1$/);
    await expect(counter(page, "utresan")).toHaveText("1 av 3 placerade");
    await chooseAircraft(page, "utresan", fleet.large);
    await expect(count(classRow(page, "utresan", fleet.base))).toHaveText(`0 i ${fleet.base}`);
  });

  test("TRIP-043-R7 R8 Fortsätt is disabled until everyone has a class and then folds the flight, the return flight comes after, the last Fortsätt goes to Resenärer, a changed outbound keeps the return", async ({
    page,
    fleet,
  }) => {
    await openPlan(page, 3, true);
    // R8: no return flight yet
    await expect(heading(page, "Hemresa")).toHaveCount(0);

    // R7: disabled, and it says how many are left
    await chooseAircraft(page, "utresan", fleet.fast);
    await expect(continueButton(page, "utresan")).toBeDisabled();
    await expect(classList(page, "utresan")).toContainText("Placera ut 3 resenärer till");
    await place(page, "utresan", fleet.base, 2);
    await expect(continueButton(page, "utresan")).toBeDisabled();
    await expect(classList(page, "utresan")).toContainText("Placera ut 1 resenär till");
    await expect(continueButton(page, "utresan")).toHaveAccessibleDescription("Placera ut 1 resenär till");
    await expect(page.getByRole("button", { name: "Klar", exact: true })).toHaveCount(0);
    await place(page, "utresan", fleet.luxury, 1);
    await expect(continueButton(page, "utresan")).toBeEnabled();
    await expect(counter(page, "utresan")).toHaveText("3 av 3 placerade");
    await expectNoA11yViolations(page);

    // Fortsätt folds the flight into a summary and shows the return flight
    await done(page, "utresan");
    await expect(heading(page, "Hemresa")).toBeFocused();
    await expect(folded(page, "utresan")).toContainText(fleet.fast);
    await expect(folded(page, "utresan")).toContainText(`${fleet.base}: 2`);
    await expect(aircraftCard(page, "hemresan", fleet.large)).toBeVisible();
    await expectNoA11yViolations(page);

    // The return flight is chosen but not continued; the outbound is changed
    await chooseAircraft(page, "hemresan", fleet.large);
    await place(page, "hemresan", fleet.base, 3);
    const back = new URL(page.url()).searchParams.get("hem-klasser");
    await folded(page, "utresan").click();
    await chooseAircraft(page, "utresan", fleet.large);
    await place(page, "utresan", fleet.base, 3);
    await done(page, "utresan");
    // R8: the return flight is as it was
    await expect(heading(page, "Hemresa")).toBeFocused();
    await expect(count(classRow(page, "hemresan", fleet.base))).toHaveText(`3 i ${fleet.base}`);
    expect(new URL(page.url()).searchParams.get("hem-klasser")).toBe(back);

    // The box with the total has no button of its own; the last Fortsätt goes straight to Resenärer
    await expect(page.getByRole("link", { name: "Fortsätt" })).toHaveCount(0);
    await expect(page.getByText(/^Totalt för resan, 3 resenärer$/)).toBeVisible();
    await done(page, "hemresan");
    await expect(page.getByRole("heading", { name: "Resenärer", level: 1 })).toBeVisible();
  });

  test("TRIP-043-R7 a one-way trip goes to Resenärer at the first Fortsätt", async ({ page, fleet }) => {
    await openPlan(page, 1);
    await expect(page.getByText("Välj plan och fördela resenärerna på klasser.", { exact: true })).toBeVisible();
    await chooseAircraft(page, "utresan", fleet.large);
    await place(page, "utresan", fleet.base, 1);
    await done(page, "utresan");
    await expect(page.getByRole("heading", { name: "Resenärer", level: 1 })).toBeVisible();
  });

  test("TRIP-043-R10 the charter aircraft step works the same, without Snabbast", async ({ page, fleet }) => {
    await openCharterPlan(page, 2);
    await expect(page.getByText("Välj plan och fördela resenärerna på klasser. Hemresan kommer sedan.")).toBeVisible();
    await expect(aircraftCards(page, "utresan").filter({ hasText: "Snabbast" })).toHaveCount(0);
    await expect(heading(page, "Hemresa")).toHaveCount(0);

    for (const leg of ["utresan", "hemresan"] as const) {
      await chooseAircraft(page, leg, fleet.large);
      await expect(counter(page, leg)).toHaveText("0 av 2 placerade");
      await expect(continueButton(page, leg)).toBeDisabled();
      await place(page, leg, fleet.base, 2);
      await expect(continueButton(page, leg)).toBeEnabled();
      if (leg === "utresan") await expectNoA11yViolations(page);
      await done(page, leg);
      if (leg === "utresan") await expect(folded(page, leg)).toBeVisible();
    }
    await expect(page.getByRole("heading", { name: "Resenärer", level: 1 })).toBeVisible();
  });
});
