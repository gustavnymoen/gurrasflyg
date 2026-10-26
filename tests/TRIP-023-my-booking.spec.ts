import { expect, test, type Page } from "@playwright/test";
import { formatPrice } from "../lib/format";
import { expectNoA11yViolations, runsLocally } from "./helpers";
import { farBack, inHours, removeSeed, type Seed, seedCharterBooking, seedFlightBooking } from "./my-booking-data";
import { inTestDb } from "./plan";

// The rules (the 24 hours, the lottery, the amounts, the ticking, the guess
// limit and the refusals of the server) are unit tests in lib/cancel-rules.test.ts
// and lib/my-booking.test.ts. Here the pages show them. The tests that need a
// booking write one straight into the test database, so they run only against
// the local test server, and every seed is deleted afterwards.

// "1 240 kr" as a pattern: the page separates thousands with a non-breaking space
const kr = (amount: number) => new RegExp(formatPrice(amount).replace(/\s/g, "\\s"));

const menuButton = (page: Page) => page.getByRole("banner").getByRole("button", { name: "Meny" });
const menu = (page: Page) => page.getByRole("navigation", { name: "Meny" });
// The question of the cancel button, and the one before leaving a booking (a plain dialog)
const dialog = (page: Page) => page.getByRole("alertdialog", { name: "Är du säker?" });
const leaveDialog = (page: Page) => page.getByRole("dialog", { name: "Är du säker?" });
// A card by its heading: Utresa, Hemresa, Resenärer …
const card = (page: Page, name: string) => page.getByRole("region", { name, exact: true });
const LOST = /Du måste betala fullt pris ändå/;
const WON = /Grattis! Vi får se om du får några pengar tillbaka – du får det!/;

async function lookUp(page: Page, seed: Pick<Seed, "number" | "lastName">) {
  await page.goto("/min-bokning");
  await page.getByLabel("Bokningsnummer").fill(seed.number);
  await page.getByLabel("Efternamn").fill(seed.lastName);
  await page.getByRole("button", { name: "Visa min bokning" }).click();
  await expect(page.getByRole("heading", { name: "Din bokning" })).toBeVisible();
}

// Tick, press Avboka and answer Ja: waits for the outcome, which is a draw and
// can't be steered in production, and returns whether it was a win
async function cancelTicked(page: Page) {
  await page.getByRole("button", { name: "Avboka", exact: true }).click();
  await dialog(page).getByRole("button", { name: "Ja, avboka" }).click();
  await expect(dialog(page)).toBeHidden();
  const notice = page.getByText(new RegExp(`${WON.source}|${LOST.source}`));
  await expect(notice).toBeVisible();
  return WON.test((await notice.textContent()) ?? "");
}

test("TRIP-023-R1 @smoke the menu opens with Start, Min bokning and Admin, and Min bokning shows its form", async ({ page }) => {
  await page.goto("/");
  await menuButton(page).click();
  await expect(menu(page).getByRole("link")).toHaveText(["Start", "Min bokning", "Admin"]);
  await menu(page).getByRole("link", { name: "Min bokning" }).click();
  await expect(page).toHaveURL(/\/min-bokning$/);
  await expect(page.getByRole("heading", { name: "Min bokning" })).toBeVisible();
  await expect(page.getByLabel("Bokningsnummer")).toBeVisible();
  await expect(page.getByLabel("Efternamn")).toBeVisible();
});

test("TRIP-023-R1 the menu button says if the list is open, the keyboard and Escape work, and a click outside closes it", async ({
  page,
}) => {
  await page.goto("/");
  const button = menuButton(page);
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(menu(page)).toHaveCount(0);

  // The keyboard
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await expect(menu(page).getByRole("link")).toHaveText(["Start", "Min bokning", "Admin"]);
  await expectNoA11yViolations(page);
  await page.keyboard.press("Tab");
  await expect(menu(page).getByRole("link", { name: "Start" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu(page)).toHaveCount(0);
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(button).toBeFocused();

  // A click opens, a click outside closes and gives the button its focus back
  await button.click();
  await expect(menu(page)).toBeVisible();
  await page.getByRole("main").click({ position: { x: 5, y: 300 } });
  await expect(menu(page)).toHaveCount(0);
  await expect(button).toBeFocused();

  // The footer no longer links to Start and Admin
  const footer = page.getByRole("contentinfo");
  await expect(footer.getByRole("link", { name: "Admin" })).toHaveCount(0);
  await expect(footer.getByRole("link", { name: "Start" })).toHaveCount(0);
  await expect(footer.getByRole("button", { name: "Start" })).toHaveCount(0);

  // The same on a phone: the list is inside the window
  await page.setViewportSize({ width: 375, height: 812 });
  await button.click();
  const box = (await menu(page).boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(375);
  await expectNoA11yViolations(page);
});

test("TRIP-023-R1 in the middle of a booking a link in the menu asks Är du säker? first, and drops the booking only if the visitor agrees", async ({
  page,
}) => {
  await page.goto("/charter");
  await menuButton(page).click();
  await menu(page).getByRole("button", { name: "Min bokning" }).click();
  await expect(leaveDialog(page)).toBeVisible();
  await expectNoA11yViolations(page);
  await leaveDialog(page).getByRole("button", { name: "Nej, fortsätt" }).click();
  await expect(page).toHaveURL(/\/charter$/);
  await menu(page).getByRole("button", { name: "Min bokning" }).click();
  await leaveDialog(page).getByRole("button", { name: "Ja, avbryt" }).click();
  await expect(page).toHaveURL(/\/min-bokning$/);
});

test.describe("with a booking in the test database", () => {
  test.skip(!runsLocally, "Writes to the test database: only against the local test server");

  let seed: Seed | undefined;
  test.afterEach(async () => {
    if (seed) await removeSeed(seed);
    seed = undefined;
  });

  test("TRIP-023-R2 R4 R5 a wrong number and a wrong last name give the same answer and keep the fields, an empty field is named, and a found booking is not in the address", async ({
    browser,
  }) => {
    seed = await seedFlightBooking();
    const charter = await seedCharterBooking();
    // An address of its own, so that the wrong attempts here don't lock the other tests out
    const ip = `203.0.113.${Date.now() % 250}`;
    const context = await browser.newContext({ extraHTTPHeaders: { "x-forwarded-for": ip } });
    try {
      const page = await context.newPage();
      await page.goto("/min-bokning");
      await expectNoA11yViolations(page);
      const send = page.getByRole("button", { name: "Visa min bokning" });

      await send.click();
      await expect(page.getByText("Skriv bokningsnumret.")).toBeVisible();
      await page.getByLabel("Bokningsnummer").fill(seed.number);
      await send.click();
      await expect(page.getByText("Skriv efternamnet.")).toBeVisible();
      await expectNoA11yViolations(page);

      const notFound = page.getByText("Vi hittar ingen bokning med de uppgifterna.");
      await page.getByLabel("Efternamn").fill("Fel");
      await send.click();
      await expect(notFound).toBeVisible();
      await expect(page.getByLabel("Bokningsnummer")).toHaveValue(seed.number);
      await expect(page.getByLabel("Efternamn")).toHaveValue("Fel");
      await page.getByLabel("Bokningsnummer").fill("ZZZZZZ");
      await page.getByLabel("Efternamn").fill(seed.lastName);
      await send.click();
      await expect(notFound).toBeVisible();
      await expect(page.getByLabel("Bokningsnummer")).toHaveValue("ZZZZZZ");
      await expectNoA11yViolations(page);

      // Any case and spaces around; the flight booking is shown whole, and nothing of it is in the address
      await page.getByLabel("Bokningsnummer").fill(`  ${seed.number.toLowerCase()} `);
      await page.getByLabel("Efternamn").fill(seed.lastName.toUpperCase());
      await send.click();
      await expect(page.getByRole("heading", { name: "Din bokning" })).toBeVisible();
      await expect(page.getByText(seed.number)).toBeVisible();
      await expect(page).toHaveURL(/\/min-bokning$/);
      await expect(card(page, "Utresa")).toContainText("ARN Stockholm – LHR London");
      await expect(card(page, "Hemresa")).toContainText("LHR London – ARN Stockholm");
      await expect(card(page, "Utresa")).toContainText(kr(1240));
      await expect(card(page, "Utresa")).toContainText(/2 × Måltid\s/);
      await expect(card(page, "Kontaktperson")).toContainText(`${seed.email}`);
      await expect(page.getByText("Cash till piloten")).toBeVisible();
      await expect(page.getByText("Totalt", { exact: true }).locator("xpath=..")).toContainText(kr(seed.total));
      await expectNoA11yViolations(page);

      // A reload starts again from the form
      await page.reload();
      await expect(page.getByRole("heading", { name: "Min bokning" })).toBeVisible();
      await expect(page.getByLabel("Bokningsnummer")).toHaveValue("");

      // A charter booking is found by the same field
      await page.getByLabel("Bokningsnummer").fill(charter.number);
      await page.getByLabel("Efternamn").fill(charter.lastName);
      await send.click();
      await expect(page.getByRole("heading", { name: "Din bokning" })).toBeVisible();
      await expect(card(page, "Resor")).toContainText("Utresa");
      await expect(card(page, "Resor")).toContainText("Hemresa");
      await expect(card(page, "Resenärer")).toContainText("Anna Testsson");
      await expect(card(page, "Tillägg")).toContainText(/Den ultimata upplevelsen\s*1\s000\skr per person/);
      await expect(page.getByText("Vi hämtar pengarna hos dig")).toBeVisible();
      await expect(page.getByText("Totalt", { exact: true }).locator("xpath=..")).toContainText(kr(charter.total));
      await expectNoA11yViolations(page);
    } finally {
      await context.close();
      await inTestDb((db) => db.execute({ sql: "DELETE FROM login_attempts WHERE ip = ?", args: [`uppslag:${ip}`] }));
      await removeSeed(charter);
    }
  });

  test("TRIP-023-R3 the sixth lookup from an address is refused after 5 wrong ones, even with the right number and last name", async ({
    browser,
  }) => {
    seed = await seedFlightBooking();
    const ip = `203.0.113.${(Date.now() + 100) % 250}`;
    const context = await browser.newContext({ extraHTTPHeaders: { "x-forwarded-for": ip } });
    try {
      const page = await context.newPage();
      await page.goto("/min-bokning");
      const send = page.getByRole("button", { name: "Visa min bokning" });
      await page.getByLabel("Bokningsnummer").fill(seed.number);
      await page.getByLabel("Efternamn").fill("Fel");
      for (let i = 0; i < 5; i++) {
        await send.click();
        await expect(page.getByText("Vi hittar ingen bokning med de uppgifterna.")).toBeVisible();
        await expect(send).toBeEnabled();
      }
      await page.getByLabel("Efternamn").fill(seed.lastName);
      await send.click();
      await expect(page.getByText(/^För många försök\. Försök igen om (14|15) minuter\.$/)).toBeVisible();
      await expect(page.getByRole("heading", { name: "Din bokning" })).toHaveCount(0);
      await expectNoA11yViolations(page);
    } finally {
      await context.close();
      await inTestDb((db) => db.execute({ sql: "DELETE FROM login_attempts WHERE ip = ?", args: [`uppslag:${ip}`] }));
    }
  });

  test("TRIP-023-R6 R9 R10 R11 ticking a flight ticks its passengers, the page tells the rules before the click, a dialog confirms, and cancelled parts stay shown", async ({
    page,
  }) => {
    seed = await seedFlightBooking();
    await lookUp(page, seed);
    const out = card(page, "Utresa");
    const back = card(page, "Hemresa");
    const cancel = page.getByRole("button", { name: "Avboka", exact: true });
    const panel = card(page, "Avboka");

    // Nothing ticked: the button is disabled and the rules are told anyway
    await expect(cancel).toBeDisabled();
    await expect(panel).toContainText("50/50");
    await expect(panel).toContainText("Förlorar du betalar du fullt pris ändå");

    // A flight ticked takes all its passengers; one passenger only that seat
    await out.getByRole("checkbox", { name: "Avboka utresan" }).check();
    await expect(out.getByRole("checkbox", { name: /Anna Testsson/ })).toBeChecked();
    await expect(out.getByRole("checkbox", { name: /Bo Testsson/ })).toBeChecked();
    await expect(back.getByRole("checkbox", { name: /Anna Testsson/ })).not.toBeChecked();
    await expect(panel).toContainText(kr(1000 + 1240));
    await out.getByRole("checkbox", { name: "Avboka utresan" }).uncheck();
    await expect(out.getByRole("checkbox", { name: /Bo Testsson/ })).not.toBeChecked();
    await expect(cancel).toBeDisabled();

    await out.getByRole("checkbox", { name: /Bo Testsson/ }).check();
    await expect(out.getByRole("checkbox", { name: /Anna Testsson/ })).not.toBeChecked();
    // What is ticked, what it is worth, and the lottery, before the click (add-ons count)
    await expect(panel).toContainText("Utresa: Bo Testsson");
    await expect(panel).toContainText(kr(1240));
    await expect(panel).toContainText(/Vinner du får du .*1\s240\skr.* tillbaka/);
    await expectNoA11yViolations(page);

    // The dialog repeats it; Escape and Nej change nothing
    await cancel.click();
    await expect(dialog(page)).toContainText("Utresa: Bo Testsson");
    await expect(dialog(page)).toContainText(kr(1240));
    await expect(dialog(page)).toContainText("50/50");
    await expect(dialog(page)).toContainText("Det går inte att ångra");
    await expectNoA11yViolations(page);
    await page.keyboard.press("Escape");
    await expect(dialog(page)).toBeHidden();
    await cancel.click();
    await dialog(page).getByRole("button", { name: "Nej" }).click();
    await expect(dialog(page)).toBeHidden();
    await expect(out.getByRole("checkbox", { name: /Bo Testsson/ })).toBeChecked();
    await expect(page.getByText("Avbokad")).toHaveCount(0);

    // Ja: the draw is the server's. Either outcome, and the numbers follow it.
    const won = await cancelTicked(page);
    await expect(out.getByText("Avbokad")).toHaveCount(1);
    await expect(out.getByRole("checkbox")).toHaveCount(2); // the flight and Anna's seat; Bo's is struck through
    await expect(back.getByText("Avbokad")).toHaveCount(0);
    const refunded = won ? 1240 : 0;
    const totals = card(page, "Pris");
    await expect(totals).toContainText(kr(seed.total));
    await expect(totals.getByText("Återbetalat").locator("xpath=..")).toContainText(kr(refunded));
    await expect(totals.getByText("Kvar att betala").locator("xpath=..")).toContainText(kr(seed.total - refunded));
    await expect(card(page, "Avbokningar")).toContainText(won ? /Du fick .*1\s240\skr.* tillbaka/ : "Du fick inget tillbaka");
    await expectNoA11yViolations(page);

    // The rest of the booking: every flight cancelled makes the booking Avbokad, with nothing left to tick
    await out.getByRole("checkbox", { name: "Avboka utresan" }).check();
    await back.getByRole("checkbox", { name: "Avboka hemresan" }).check();
    await expect(panel).toContainText(kr(1000 + 1600));
    await cancelTicked(page);
    await expect(page.getByRole("checkbox")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Avboka", exact: true })).toHaveCount(0);
    await expect(page.getByRole("paragraph").filter({ hasText: /^Bokningsnummer/ })).toContainText("Avbokad");
    await expect(card(page, "Avbokningar").getByRole("listitem")).toHaveCount(2);
    await expectNoA11yViolations(page);

    // Looked up again, it is still there with its history
    await lookUp(page, seed);
    await expect(page.getByRole("checkbox")).toHaveCount(0);
    await expect(card(page, "Avbokningar").getByRole("listitem")).toHaveCount(2);
  });

  test("TRIP-023-R7 R10 a charter booking is cancelled as a whole trip or by traveller, never one trip alone", async ({ page }) => {
    seed = await seedCharterBooking();
    await lookUp(page, seed);
    const travellers = card(page, "Resenärer");
    const cancel = page.getByRole("button", { name: "Avboka", exact: true });
    const panel = card(page, "Avboka");

    // No box for the outbound or the return trip alone
    await expect(page.getByRole("checkbox", { name: /utresa|hemresa/i })).toHaveCount(0);
    await expect(page.getByRole("checkbox")).toHaveCount(3);

    // The whole trip ticks every traveller
    await travellers.getByRole("checkbox", { name: "Avboka hela resan" }).check();
    await expect(travellers.getByRole("checkbox", { name: /Anna Testsson/ })).toBeChecked();
    await expect(travellers.getByRole("checkbox", { name: /Bo Testsson/ })).toBeChecked();
    await expect(panel).toContainText(kr(17_000));
    await travellers.getByRole("checkbox", { name: "Avboka hela resan" }).uncheck();
    await expect(cancel).toBeDisabled();

    // One traveller: both trips and the extras, per person
    await travellers.getByRole("checkbox", { name: /Anna Testsson/ }).check();
    await expect(panel).toContainText(kr(8500));
    await expectNoA11yViolations(page);
    const won = await cancelTicked(page);
    await expect(travellers.getByText("Avbokad")).toHaveCount(1);
    await expect(travellers.getByRole("checkbox", { name: /Anna Testsson/ })).toHaveCount(0);
    await expect(travellers.getByRole("checkbox", { name: /Bo Testsson/ })).not.toBeChecked();
    const totals = card(page, "Pris");
    await expect(totals.getByText("Kvar att betala").locator("xpath=..")).toContainText(kr(won ? 8500 : 17_000));
    await expectNoA11yViolations(page);

    // The last traveller: the booking is cancelled
    await travellers.getByRole("checkbox", { name: "Avboka hela resan" }).check();
    await cancelTicked(page);
    await expect(page.getByRole("checkbox")).toHaveCount(0);
    await expect(page.getByRole("paragraph").filter({ hasText: /^Bokningsnummer/ })).toContainText("Avbokad");
  });

  test("TRIP-023-R8 a flight that leaves within 24 hours, or has left, is greyed out with the reason", async ({
    page,
  }) => {
    // The outbound left 5 hours ago and the return leaves in 5 hours: both are too late
    seed = await seedFlightBooking(inHours(-5), inHours(5));
    await lookUp(page, seed);
    const out = card(page, "Utresa");
    const back = card(page, "Hemresa");
    for (const flight of [out, back]) {
      await expect(flight).toContainText("Det är för sent att avboka");
      for (const box of await flight.getByRole("checkbox").all()) {
        await expect(box).toHaveAttribute("aria-disabled", "true");
        // aria-disabled, not disabled: the box takes focus, and a click does nothing
        await box.click({ force: true });
        await expect(box).not.toBeChecked();
      }
    }
    await expect(out.getByRole("checkbox", { name: "Avboka utresan" })).toHaveAccessibleDescription("Det är för sent att avboka");
    await expect(page.getByRole("button", { name: "Avboka", exact: true })).toBeDisabled();
    await expectNoA11yViolations(page);
  });

  test("TRIP-023-R8 a booking with one flight far ahead can cancel only that one", async ({ page }) => {
    seed = await seedFlightBooking(inHours(5), farBack);
    await lookUp(page, seed);
    await expect(card(page, "Utresa").getByRole("checkbox", { name: "Avboka utresan" })).toHaveAttribute("aria-disabled", "true");
    await expect(card(page, "Hemresa").getByRole("checkbox", { name: "Avboka hemresan" })).not.toHaveAttribute("aria-disabled", "true");
    await card(page, "Hemresa").getByRole("checkbox", { name: "Avboka hemresan" }).check();
    await expect(card(page, "Avboka")).toContainText(kr(1600));
    await cancelTicked(page);
    // The flight and both its seats are marked
    await expect(card(page, "Hemresa").getByText("Avbokad")).toHaveCount(3);
    // The outbound is not cancelled and stays too late
    await expect(card(page, "Utresa").getByText("Avbokad")).toHaveCount(0);
  });

  test("TRIP-023-R8 a charter booking whose outbound trip is within 24 hours cannot be cancelled", async ({ page }) => {
    // The outbound date is today (the timetable's time decides, but a trip today is in the past or within 24 hours)
    seed = await seedCharterBooking(inHours(0).date, farBack.date);
    await lookUp(page, seed);
    await expect(card(page, "Resenärer")).toContainText("Det är för sent att avboka");
    for (const box of await page.getByRole("checkbox").all()) await expect(box).toHaveAttribute("aria-disabled", "true");
    await expectNoA11yViolations(page);
  });
});
