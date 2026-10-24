import { createClient } from "@libsql/client";
import { expect, type Locator, type Page } from "@playwright/test";
import { testDbFile } from "../lib/local-db.mjs";
import { expectNoA11yViolations, runsLocally } from "./helpers";
import {
  alert,
  amount,
  chooseAircraft,
  chosenAircraft,
  classRow,
  count,
  done,
  folded,
  type Fleet,
  openBooking,
  openPlan,
  place,
  test,
} from "./plan";

// The rules behind the page (the prices, the checks, what a change clears,
// saving with the database's prices, a double Betala) are unit tests in
// lib/booking-rules.test.ts and lib/bookings.test.ts.

const passenger = (page: Page, n: number) => page.getByRole("region", { name: `Passagerare ${n}`, exact: true });
const legGroup = (card: Locator, leg: "Utresa" | "Hemresa") => card.getByRole("group", { name: leg });
const addonRow = (card: Locator, leg: "Utresa" | "Hemresa", name: string) =>
  legGroup(card, leg).getByRole("listitem").filter({ hasText: name });
// The total for the trip, on /flyg/plan and the booking page. Next.js keeps an
// earlier page hidden in the document, so only the visible one counts.
const total = async (page: Page) =>
  amount(
    await page.locator("main p:visible").filter({ hasText: /^Totalt för resan/ }).locator("span").last().textContent(),
  );
const goOn = (page: Page) => page.getByRole("button", { name: "Till betalning" }).click();

async function fillPassenger(page: Page, n: number, first: string) {
  const card = passenger(page, n);
  await card.getByLabel("Förnamn").fill(first);
  await card.getByLabel("Efternamn").fill("Testsson");
  await card.getByLabel("Ålder").selectOption("40");
}

// Everything on the booking page filled in, for the given number of passengers
async function fillAll(page: Page, passengers: number, email = "anna@exempel.se") {
  for (let n = 1; n <= passengers; n++) await fillPassenger(page, n, `E2E Resenär ${n}`);
  const contact = page.getByRole("region", { name: "Kontaktperson" });
  await contact.getByLabel("Förnamn").fill("Anna");
  await contact.getByLabel("Efternamn").fill("Ek");
  await contact.getByLabel("E-post").fill(email);
  await contact.getByLabel("Telefon").fill("070-123 45 67");
  await contact.getByLabel("Adress").fill("Storgatan 1, 123 45 Byn");
  for (const box of await page.getByRole("region", { name: "Tre viktiga frågor" }).getByRole("checkbox").all()) {
    await box.check();
  }
}

// The test database (npm run test:local): how many bookings a contact has,
// and deleting them, so the tests clean up after themselves
async function inTestDb<T>(fn: (db: ReturnType<typeof createClient>) => Promise<T>) {
  const db = createClient({ url: `file:${testDbFile}` });
  try {
    await db.execute("PRAGMA foreign_keys = ON");
    return await fn(db);
  } finally {
    db.close();
  }
}
const countBookings = (email: string) =>
  inTestDb(async (db) => (await db.execute({ sql: "SELECT id FROM bookings WHERE email = ?", args: [email] })).rows.length);
const deleteBookings = (email: string) =>
  inTestDb((db) => db.execute({ sql: "DELETE FROM bookings WHERE email = ?", args: [email] }));

const twoAndOne = (fleet: Fleet) => ({ [fleet.base]: 1, [fleet.luxury]: 2 });

test.describe("with the tests' own aircraft", () => {
  test.skip(!process.env.ADMIN_PASSWORD, "ADMIN_PASSWORD is not set");

  test("TRIP-012-R1 Fortsätt comes when every card is folded and opens the booking page", async ({ page, fleet }) => {
    await openPlan(page, 1, true);
    await chooseAircraft(page, "utresan", fleet.large);
    await place(page, "utresan", fleet.base, 1);
    await done(page, "utresan");
    await chooseAircraft(page, "hemresan", fleet.large);
    await place(page, "hemresan", fleet.luxury, 1);
    // Everyone has a class, but the return card is still open
    await expect(page.getByText("Tryck Klar på varje flyg för att gå vidare.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Fortsätt" })).toHaveCount(0);
    await done(page, "hemresan");
    await expect(folded(page, "hemresan")).toBeVisible();
    const tripTotal = await total(page);

    await page.getByRole("link", { name: "Fortsätt" }).click();
    await expect(page.getByRole("heading", { name: "Resenärer", level: 1 })).toBeVisible();
    const steps = page.getByRole("list", { name: "Steg" }).getByRole("listitem");
    await expect(steps).toHaveText([/Flyg/, /Plan och klass/, /Resenärer/, /Betala/]);
    await expect(steps.nth(2)).toHaveAttribute("aria-current", "step");
    const trip = page.getByRole("region", { name: "Din resa" });
    await expect(trip.getByText(fleet.large)).toHaveCount(2);
    await expect(trip.getByText(/landar/)).toHaveCount(2);
    await expect(trip.getByText(`${fleet.base}: 1`)).toBeVisible();
    await expect(trip.getByText(`${fleet.luxury}: 1`)).toBeVisible();
    expect(await total(page)).toBe(tripTotal);
    await expectNoA11yViolations(page);
  });

  test("TRIP-012-R2 the passengers start in the chosen classes, and missing fields are red", async ({ page, fleet }) => {
    await openBooking(page, fleet.large, twoAndOne(fleet));
    const classOf = (n: number) => legGroup(passenger(page, n), "Utresa").getByLabel("Klass");
    // The most expensive class first
    await expect(classOf(1).locator("option:checked")).toHaveText(new RegExp(fleet.luxury));
    await expect(classOf(2).locator("option:checked")).toHaveText(new RegExp(fleet.luxury));
    await expect(classOf(3).locator("option:checked")).toHaveText(new RegExp(fleet.base));

    // Passagerare 1 without a last name or age
    await fillAll(page, 3);
    const first = passenger(page, 1);
    await first.getByLabel("Efternamn").fill("");
    await first.getByLabel("Ålder").selectOption("");
    await goOn(page);
    await expect(page).toHaveURL(/\/flyg\/boka\?/);
    await expect(first.getByLabel("Efternamn")).toBeFocused();
    await expect(first.getByLabel("Efternamn")).toHaveAttribute("aria-invalid", "true");
    await expect(first.getByLabel("Efternamn")).toHaveAccessibleDescription("Skriv passagerarens efternamn.");
    await expect(first.getByLabel("Ålder")).toHaveAccessibleDescription("Välj passagerarens ålder.");
    await expectNoA11yViolations(page);
    await fillPassenger(page, 1, "E2E Resenär 1");

    // Swapping only Passagerare 1 gives the wrong numbers; swapping 3 too makes them match
    // The classes are listed cheapest first
    await classOf(1).selectOption({ index: 0 });
    await goOn(page);
    const wrong = `På utresan ska 1 sitta i ${fleet.base}, men 2 gör det. Byt klass för någon passagerare.`;
    await expect(alert(page).filter({ hasText: wrong })).toBeVisible();
    await expect(classOf(1)).toBeFocused();
    await classOf(3).selectOption({ index: 1 });
    await expect(alert(page)).toHaveCount(0);
    await goOn(page);
    await expect(page).toHaveURL(/\/flyg\/boka\/betala\?/);
  });

  test("TRIP-012-R3 the add-ons of the passenger's class are offered and added to the total", async ({ page, fleet }) => {
    await openBooking(page, fleet.large, twoAndOne(fleet));
    const third = passenger(page, 3);
    // Passagerare 3 sits in the 1,00 class: Måltid and Bagage, not Lounge
    await expect(addonRow(third, "Utresa", fleet.meal)).toContainText("Varm mat");
    await expect(addonRow(third, "Utresa", fleet.meal)).toContainText("120 kr / st");
    await expect(addonRow(third, "Utresa", fleet.bag)).toBeVisible();
    await expect(addonRow(third, "Utresa", fleet.lounge)).toHaveCount(0);
    await expect(addonRow(passenger(page, 1), "Utresa", fleet.lounge)).toBeVisible();

    const before = await total(page);
    const meal = addonRow(third, "Utresa", fleet.meal);
    await meal.getByRole("button", { name: `Fler ${fleet.meal}` }).click();
    await meal.getByRole("button", { name: `Fler ${fleet.meal}` }).click();
    await addonRow(third, "Utresa", fleet.bag).getByRole("button", { name: `Fler ${fleet.bag}` }).click();
    await expect(meal.locator("[aria-live]")).toHaveText(`2 ${fleet.meal}`);
    expect(await total(page)).toBe(before + 2 * 120 + 300);
  });

  test("TRIP-012-R4 Dåliga nerver adds 1 000 kr per flight, and its tip is shown on focus", async ({ page, fleet }) => {
    await openBooking(page, fleet.large, { [fleet.base]: 1 }, true);
    const nerves = passenger(page, 1).getByRole("checkbox", { name: "Dåliga nerver" });
    const tip = page.getByRole("tooltip");
    await expect(tip).toBeHidden();
    await nerves.focus();
    await expect(tip).toHaveText("Flyget blir mindre spännande, men kostar 1 000 kr mer");
    await expect(nerves).toHaveAccessibleDescription("Flyget blir mindre spännande, men kostar 1 000 kr mer");
    await expectNoA11yViolations(page);
    await page.keyboard.press("Escape");
    await expect(tip).toBeHidden();

    const before = await total(page);
    await page.keyboard.press("Space");
    await expect(nerves).toBeChecked();
    expect(await total(page)).toBe(before + 2000);
    await nerves.blur();
    await nerves.hover();
    await expect(tip).toBeVisible();
  });

  test("TRIP-012-R5 R6 a wrong e-mail and an unticked question keep the traveller on the page", async ({ page, fleet }) => {
    await openBooking(page, fleet.large, { [fleet.base]: 1 });
    await fillAll(page, 1, "anna@");
    const questions = page.getByRole("region", { name: "Tre viktiga frågor" }).getByRole("checkbox");
    await questions.nth(1).uncheck();
    await goOn(page);
    await expect(page).toHaveURL(/\/flyg\/boka\?/);
    const email = page.getByRole("region", { name: "Kontaktperson" }).getByLabel("E-post");
    await expect(email).toBeFocused();
    await expect(email).toHaveAccessibleDescription("Skriv en hel e-postadress, t.ex. anna@exempel.se.");
    await expect(questions.nth(1)).toHaveAccessibleDescription("Kryssa i rutan för att gå vidare.");
    await expect(questions.nth(0)).not.toHaveAttribute("aria-invalid");

    await email.fill("anna@exempel.se");
    await goOn(page);
    await expect(questions.nth(1)).toBeFocused();
    await questions.nth(1).check();
    await goOn(page);
    await expect(page).toHaveURL(/\/flyg\/boka\/betala\?/);
  });

  test("TRIP-012-R10 another aircraft clears that flight's add-ons, and keeps the names and the contact", async ({
    page,
    fleet,
  }) => {
    await openBooking(page, fleet.large, { [fleet.base]: 1 }, true);
    await fillAll(page, 1);
    const card = passenger(page, 1);
    await addonRow(card, "Utresa", fleet.meal).getByRole("button", { name: `Fler ${fleet.meal}` }).click();
    await addonRow(card, "Hemresa", fleet.bag).getByRole("button", { name: `Fler ${fleet.bag}` }).click();

    // Back to Plan och klass and on without a change keeps everything
    await page.getByRole("link", { name: "Plan och klass" }).click();
    await page.getByRole("link", { name: "Fortsätt" }).click();
    await expect(addonRow(card, "Utresa", fleet.meal).locator("[aria-live]")).toHaveText(`1 ${fleet.meal}`);

    // Another aircraft on the outbound flight
    await page.getByRole("link", { name: "Plan och klass" }).click();
    await folded(page, "utresan").click();
    await chosenAircraft(page, "utresan").click();
    await chooseAircraft(page, "utresan", fleet.fast);
    await expect(count(classRow(page, "utresan", fleet.base))).toHaveText(`0 i ${fleet.base}`);
    await place(page, "utresan", fleet.base, 1);
    await done(page, "utresan");
    await page.getByRole("link", { name: "Fortsätt" }).click();

    await expect(legGroup(card, "Utresa").getByText("Inga tillägg i den här klassen.")).toBeVisible();
    await expect(addonRow(card, "Hemresa", fleet.bag).locator("[aria-live]")).toHaveText(`1 ${fleet.bag}`);
    await expect(card.getByLabel("Förnamn")).toHaveValue("E2E Resenär 1");
    await expect(page.getByRole("region", { name: "Kontaktperson" }).getByLabel("E-post")).toHaveValue("anna@exempel.se");
  });
});

test.describe("booking, which writes to the test database", () => {
  test.skip(!process.env.ADMIN_PASSWORD || !runsLocally, "Creates bookings: only against the local test server");

  test("TRIP-012-R7 R8 R9 the payment method, going back, Betala and the summary", async ({ page, fleet, browser }) => {
    const email = `e2e-${Date.now()}@exempel.se`;
    try {
      await openBooking(page, fleet.large, twoAndOne(fleet));
      await fillAll(page, 3, email);
      const third = passenger(page, 3);
      await addonRow(third, "Utresa", fleet.meal).getByRole("button", { name: `Fler ${fleet.meal}` }).click();
      await passenger(page, 1).getByRole("checkbox", { name: "Dåliga nerver" }).check();
      const bookingTotal = await total(page);
      await goOn(page);

      // The payment page: the total and two methods; Betala without one asks for one
      await expect(page.getByRole("heading", { name: "Betala", level: 1 })).toBeVisible();
      await expect(page.getByText("Att betala").locator("..")).toContainText(
        new Intl.NumberFormat("sv-SE").format(bookingTotal),
      );
      const methods = page.getByRole("group", { name: "Hur vill du betala?" }).getByRole("radio");
      await expect(methods).toHaveCount(2);
      await page.getByRole("button", { name: "Betala" }).click();
      await expect(alert(page)).toHaveText("Välj hur du vill betala.");
      await expect(methods.first()).toBeFocused();
      await expectNoA11yViolations(page);

      // Back to the booking page: everything is still there
      await page.getByRole("link", { name: "Tillbaka till resenärerna" }).click();
      await expect(passenger(page, 2).getByLabel("Förnamn")).toHaveValue("E2E Resenär 2");
      await expect(addonRow(third, "Utresa", fleet.meal).locator("[aria-live]")).toHaveText(`1 ${fleet.meal}`);
      await goOn(page);

      // Betala, twice in a row, gives one booking
      await page.getByRole("radio", { name: "Vi hämtar pengarna hos dig" }).check();
      await page.getByRole("button", { name: "Betala" }).dblclick();
      await expect(page.getByRole("heading", { name: "Tack för din bokning!" })).toBeVisible();
      await expect(page).toHaveURL(/\/flyg\/bokad$/);

      const number = page.getByText(/^Bokningsnummer/);
      await expect(number).toHaveText(/^Bokningsnummer [A-HJ-NP-Z2-9]{6}$/);
      await expect(page.getByRole("region", { name: "Flyg" })).toContainText(fleet.large);
      const passengers = page.getByRole("region", { name: "Passagerare" });
      await expect(passengers).toContainText("E2E Resenär 1 Testsson, 40 år");
      await expect(passengers).toContainText(`Utresa: ${fleet.luxury} · Dåliga nerver`);
      await expect(passengers).toContainText(`Utresa: ${fleet.base} · ${fleet.meal}`);
      await expect(page.getByRole("region", { name: "Kontaktperson" })).toContainText(email);
      await expect(page.getByText("Vi hämtar pengarna hos dig")).toBeVisible();
      await expect(page.getByText("Totalt", { exact: true }).locator("..")).toContainText(
        new Intl.NumberFormat("sv-SE").format(bookingTotal),
      );
      await expectNoA11yViolations(page);

      // Another visitor, with a browser of their own, sees no booking at the summary's address
      const visitor = await browser.newContext();
      const other = await visitor.newPage();
      await other.goto(page.url());
      await expect(other.getByRole("heading", { name: "Ingen bokning" })).toBeVisible();
      await expect(other.getByText(email)).toHaveCount(0);
      await expectNoA11yViolations(other);
      await visitor.close();

      // The double click saved one booking
      expect(await countBookings(email)).toBe(1);
    } finally {
      await deleteBookings(email);
    }
  });
});

test("TRIP-012-R1 @smoke the booking page loads for a chosen trip", async ({ page }) => {
  await openPlan(page, 1);
  const list = page.getByRole("region", { name: "Plan för utresan" });
  await list.getByRole("button", { expanded: false }).first().click();
  await list.getByRole("button", { name: "Välj" }).click();
  await page.getByRole("region", { name: "Klasser på utresan" }).getByRole("button", { name: /^Fler i/ }).first().click();
  await page.getByRole("button", { name: "Klar" }).click();
  await page.getByRole("link", { name: "Fortsätt" }).click();
  await expect(page.getByRole("region", { name: "Passagerare 1" })).toBeVisible();
});
