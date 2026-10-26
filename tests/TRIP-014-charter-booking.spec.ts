import { expect, test, type Locator, type Page } from "@playwright/test";
import { type CharterChoice, type CharterSearch, paymentUrl, resultsUrl, travellersUrl, weekdayOf } from "../lib/charter-rules";
import { addDays, formatShort } from "../lib/dates";
import { daysFromToday, expectNoA11yViolations, runsLocally } from "./helpers";
import { amount, fillAll, inTestDb } from "./plan";

// The rules behind the pages (the search and its address, which trips run, the arrival,
// the extras, the prices, saving) are unit tests in lib/charter-rules.test.ts,
// lib/charter.test.ts and lib/charter-bookings.test.ts; here the pages use them.

// The first Monday at least a week ahead, and not before the timetables start on 1 November,
// with a Saturday the same week to come home on. ARN to BER and back runs every day of the week
// except that EW488 and EW489 (Eurowings) don't run on Saturdays and Sundays.
function tripDays() {
  let monday = daysFromToday(7) < "2026-11-02" ? "2026-11-02" : daysFromToday(7);
  while (weekdayOf(monday) !== "Mon") monday = addDays(monday, 1);
  return { monday, saturday: addDays(monday, 5) };
}
const { monday, saturday } = tripDays();

const search = (over: Partial<CharterSearch> = {}): CharterSearch => ({
  from: "ARN",
  outbound: monday,
  return: saturday,
  travellers: 2,
  ...over,
});
const resultsPage = (id: string, over?: Partial<CharterSearch>, choice?: CharterChoice) =>
  resultsUrl(id, search(over), choice);

// The trips' ids: ARN-BER-SK1122 leaves 06:50 and BER-ARN-SK1123 09:15; both cost less than a day's pay
const SK1122 = "ARN-BER-SK1122";
const SK1123 = "BER-ARN-SK1123";

const region = (page: Page, name: string) => page.getByRole("region", { name, exact: true });
const outbound = (page: Page) => region(page, "Utresa ARN – BER");
const homeward = (page: Page) => region(page, "Hemresa BER – ARN");
const yourTrip = (page: Page) => region(page, "Din resa");
// "Välj SK1122 kl 06:50" in a list
const choose = (list: Locator, flight: string, time: string) =>
  list.getByRole("button", { name: `Välj ${flight} kl ${time}` });
const total = async (page: Page) =>
  amount(await yourTrip(page).locator("p", { hasText: /^Totalt för resan/ }).locator("span").last().textContent());
const alert = (page: Page) => page.getByRole("main").getByRole("alert");

test.describe("the search form", () => {
  test("TRIP-014-R1 the destination page has the form, asks for missing dates and leads to the results", async ({ page }) => {
    await page.goto("/charter/teufelsberg");
    const form = region(page, "Sök resa");
    await expect(form.getByLabel("Avresa från")).toHaveValue("ARN");
    await expect(form.getByLabel("Avresa från").locator("option")).toHaveText(["Stockholm Arlanda (ARN)", "Köpenhamn Kastrup (CPH)"]);
    await expect(form.getByRole("group", { name: "Antal resenärer" })).toContainText("1");
    await expect(form.getByLabel("Utresa")).toHaveValue("");
    await expect(form.getByLabel("Hemresa")).toHaveValue("");
    await expectNoA11yViolations(page);

    // A date missing: marked, with its message under the field, and focus on the first
    await form.getByRole("button", { name: "Sök resor" }).click();
    await expect(alert(page).filter({ hasText: "Välj datum för utresan." })).toBeVisible();
    await expect(alert(page).filter({ hasText: "Välj datum för hemresan." })).toBeVisible();
    await expect(form.getByLabel("Utresa")).toBeFocused();
    await expect(form.getByLabel("Utresa")).toHaveAttribute("aria-invalid", "true");
    await expect(page).toHaveURL(/\/charter\/teufelsberg$/);
    // The calendar opens with the focus; axe reads the page with it closed
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Välj datum" })).toHaveCount(0);
    await expectNoA11yViolations(page);

    // Valid values: the search is in the address
    await form.getByLabel("Utresa").fill(formatShort(monday));
    await form.getByLabel("Utresa").press("Enter");
    await form.getByLabel("Hemresa").fill(formatShort(saturday));
    await form.getByLabel("Hemresa").press("Enter");
    await form.getByRole("button", { name: "Fler resenärer" }).click();
    await form.getByRole("button", { name: "Sök resor" }).click();
    await expect(page).toHaveURL(
      new RegExp(`/charter/teufelsberg/resor\\?fran=ARN&utresa=${monday}&hemresa=${saturday}&resenarer=2$`),
    );
    await expect(page.getByRole("heading", { name: "Välj din resa", level: 1 })).toBeVisible();
  });

  test("TRIP-014-R1 a destination without flights has no form", async ({ page }) => {
    await page.goto("/charter/chernobyl-pripyat");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Chernobyl");
    await expect(region(page, "Sök resa")).toHaveCount(0);
  });

  test("TRIP-014-R2 only days when a trip runs can be chosen, and another airport clears a date that doesn't fit", async ({
    page,
  }) => {
    // Paris Catacombs: ARN–ORY runs on Mondays, Wednesdays, Fridays and Sundays, CPH–ORY on Tuesdays, Thursdays, Saturdays and Sundays
    await page.goto("/charter/paris-catacombs");
    const form = region(page, "Sök resa");
    const outboundField = form.getByLabel("Utresa");
    await outboundField.click();
    const day = (date: string) =>
      page.getByRole("dialog", { name: "Välj datum" }).locator(`[data-day="${date}"]`);
    await expect(day(monday)).not.toHaveAttribute("aria-disabled", "true");
    await expect(day(addDays(monday, 1))).toHaveAttribute("aria-disabled", "true");
    await expect(page.getByRole("switch", { name: "Tur och retur" })).toHaveCount(0);

    // A typed day without a trip says so
    await outboundField.fill(formatShort(addDays(monday, 1)));
    await outboundField.press("Enter");
    await expect(alert(page).filter({ hasText: "Det går ingen resa den dagen." })).toBeVisible();

    await outboundField.fill(formatShort(monday));
    await outboundField.press("Enter");
    await form.getByLabel("Hemresa").fill(formatShort(addDays(monday, 2)));
    await form.getByLabel("Hemresa").press("Enter");
    await expect(outboundField).toHaveValue(formatShort(monday));
    await expect(form.getByLabel("Hemresa")).toHaveValue(formatShort(addDays(monday, 2)));

    // From Köpenhamn neither day has a trip
    await form.getByLabel("Avresa från").selectOption("CPH");
    await expect(form.getByLabel("Utresa")).toHaveValue("");
    await expect(form.getByLabel("Hemresa")).toHaveValue("");
  });
});

test.describe("the results", () => {
  test("TRIP-014-R1 an address with something missing or wrong shows no search", async ({ page }) => {
    for (const bad of [
      resultsPage("teufelsberg").replace("fran=ARN", "fran=LHR"),
      resultsPage("teufelsberg", { travellers: 11 }),
      resultsPage("teufelsberg").replace(`utresa=${monday}`, "utresa=2027-02-30"),
    ]) {
      await page.goto(bad);
      await expect(page.getByRole("main")).toContainText("Sökningen saknar något. Börja med att välja en destination.");
      await expect(page.getByRole("link", { name: "Till charterresorna" })).toHaveAttribute("href", "/charter");
      await expect(page.getByRole("button", { name: /^Välj / })).toHaveCount(0);
    }
    await expectNoA11yViolations(page);
  });

  test("TRIP-014-R3 R4 the trips of the day with their airline, numbers, times, travel time and changes, sorted either way", async ({
    page,
  }) => {
    await page.goto(resultsPage("teufelsberg"));
    await expect(outbound(page).getByRole("listitem")).toHaveCount(4);
    for (const [flight, time] of [
      ["SK1122", "06:50"],
      ["EW488", "07:00"],
      ["SK2291", "14:00"],
      ["DY6077", "14:45"],
    ]) {
      await expect(choose(outbound(page), flight, time)).toBeVisible();
    }
    const card = outbound(page).getByRole("listitem").filter({ has: page.getByRole("button", { name: "Välj SK1122 kl 06:50" }) });
    await expect(card).toContainText("SAS · SK1122");
    await expect(card).toContainText("06:50");
    await expect(card).toContainText("08:30");
    await expect(card).toContainText("1 h 40 min");
    await expect(card).toContainText("Direkt");
    await expect(card).toContainText(/1\s190\skr \/ person/);
    await expectNoA11yViolations(page);

    // Sorted by price, without a new search, and read out; equal prices by time
    const order = () => outbound(page).getByRole("button", { name: /^Välj / });
    await expect(order().first()).toHaveAccessibleName("Välj SK1122 kl 06:50");
    await page.getByRole("radio", { name: "Pris" }).check({ force: true });
    await expect(order().first()).toHaveAccessibleName("Välj DY6077 kl 14:45");
    await expect(order().nth(1)).toHaveAccessibleName("Välj SK1122 kl 06:50");
    await expect(order().nth(2)).toHaveAccessibleName("Välj SK2291 kl 14:00");
    await expect(page.getByRole("status").filter({ hasText: "Sorterat på pris." })).toBeAttached();
    await expect(page.getByRole("radio", { name: "Pris" })).toBeFocused();

    // A Saturday has no EW488
    await page.goto(resultsPage("teufelsberg", { outbound: saturday, return: addDays(saturday, 1) }));
    await expect(outbound(page).getByRole("listitem")).toHaveCount(3);
    await expect(choose(outbound(page), "EW488", "07:00")).toHaveCount(0);
  });

  test("TRIP-014-R3 R4 a change in Frankfurt, the arrival in Windhoek's time, and a day without trips", async ({ page }) => {
    // ARN to WDH: 06:25 with 840 min lands at 21:25 in Windhoek on Mondays in winter
    await page.goto(resultsPage("kolmanskop"));
    const list = region(page, "Utresa ARN – WDH");
    // Winter, before the change to summer time on 28 March 2027: 21:25; after it 20:25
    const winter = monday < "2027-03-28";
    await expect(list).toContainText("06:25");
    await expect(list).toContainText(winter ? "21:25" : "20:25");
    await expect(list).toContainText("14 h");
    await expect(list).toContainText("1 byte i Frankfurt");

    // The day after has no trip (ARN–WDH runs on Mondays, Wednesdays, Fridays and Sundays)
    await page.goto(resultsPage("kolmanskop", { outbound: addDays(monday, 1), return: addDays(monday, 5) }));
    await expect(page.getByRole("main")).toContainText("Inga resor den här dagen.");
    await expect(page.getByRole("link", { name: "Tillbaka till sökningen" })).toHaveAttribute("href", "/charter/kolmanskop");
    await expectNoA11yViolations(page);
  });

  test("TRIP-014-R5 choosing the trips, Din resa with the total, and the choices kept in the address", async ({ page }) => {
    await page.goto(resultsPage("teufelsberg"));
    await expect(homeward(page)).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Fortsätt" })).toHaveCount(0);
    const steps = page.getByRole("list", { name: "Steg" }).getByRole("listitem");
    await expect(steps).toHaveText([/Resa/, /Resenärer/, /Betala/]);
    await expect(steps.nth(0)).toHaveAttribute("aria-current", "step");

    // The outbound trip opens the return list; Fortsätt waits for the return trip
    await choose(outbound(page), "SK1122", "06:50").click();
    await expect(choose(outbound(page), "SK1122", "06:50")).toHaveAttribute("aria-pressed", "true");
    await expect(choose(outbound(page), "SK1122", "06:50")).toBeFocused();
    await expect(page.getByRole("status").filter({ hasText: "Utresa vald" })).toBeAttached();
    await expect(homeward(page)).toBeVisible();
    await expect(page.getByRole("link", { name: "Fortsätt" })).toHaveCount(0);
    await expect(yourTrip(page)).toContainText("Inte vald än");

    await choose(homeward(page), "SK1123", "09:15").click();
    await expect(page.getByRole("link", { name: "Fortsätt" })).toBeVisible();
    // (1 190 + 1 090) kr per person, two travellers
    expect(await total(page)).toBe((1190 + 1090) * 2);
    await expect(page).toHaveURL(new RegExp(`ut=${SK1122}&hem=${SK1123}$`));
    await expectNoA11yViolations(page);

    // Reloaded, the choices are still there
    await page.reload();
    await expect(choose(outbound(page), "SK1122", "06:50")).toHaveAttribute("aria-pressed", "true");
    await expect(choose(homeward(page), "SK1123", "09:15")).toHaveAttribute("aria-pressed", "true");
    expect(await total(page)).toBe((1190 + 1090) * 2);
  });

  test("TRIP-014-R3 R5 the return list has only trips after the outbound has landed, and a changed outbound clears a return that no longer fits", async ({
    page,
  }) => {
    // The same day both ways: SK1122 lands 08:30 in Berlin, DY6077 at 16:25
    await page.goto(resultsPage("teufelsberg", { return: monday }));
    await choose(outbound(page), "SK1122", "06:50").click();
    await expect(homeward(page).getByRole("button", { name: /^Välj / })).toHaveCount(4);
    await choose(homeward(page), "SK1123", "09:15").click();
    await expect(page.getByRole("link", { name: "Fortsätt" })).toBeVisible();

    await choose(outbound(page), "DY6077", "14:45").click();
    await expect(homeward(page).getByRole("button", { name: /^Välj / })).toHaveCount(2);
    await expect(choose(homeward(page), "SK1123", "09:15")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Fortsätt" })).toHaveCount(0);
    // The outbound choice stays
    await expect(choose(outbound(page), "DY6077", "14:45")).toHaveAttribute("aria-pressed", "true");
    await expect(page).toHaveURL(/ut=ARN-BER-DY6077$/);
  });
});

test.describe("Resenärer and the extras", () => {
  const choice = { out: SK1122, back: SK1123 };
  const bookingPage = (travellers = 2) => travellersUrl("teufelsberg", search({ travellers }), choice);
  const passenger = (page: Page, n: number) => region(page, `Passagerare ${n}`);
  const extra = (page: Page, name: string) => page.getByRole("checkbox", { name });

  test("TRIP-014-R5 R6 the steps link back, and the page has the passengers, the contact and the three questions", async ({
    page,
  }) => {
    await page.goto(bookingPage());
    await expect(page.getByRole("heading", { name: "Resenärer", level: 1 })).toBeVisible();
    const steps = page.getByRole("list", { name: "Steg" }).getByRole("listitem");
    await expect(steps.nth(1)).toHaveAttribute("aria-current", "step");
    await expect(steps.nth(0).getByRole("link", { name: "Resa" })).toHaveAttribute("href", /\/resor\?.*ut=ARN-BER-SK1122&hem=BER-ARN-SK1123$/);
    await expect(passenger(page, 1)).toBeVisible();
    await expect(passenger(page, 2)).toBeVisible();
    await expect(region(page, "Kontaktperson")).toBeVisible();
    await expect(region(page, "Tre viktiga frågor")).toBeVisible();
    await expect(page.getByText("Dåliga nerver")).toHaveCount(0);
    await expect(page.getByLabel("Klass")).toHaveCount(0);

    // Something missing: marked, read out, and focus on the first
    await page.getByRole("button", { name: "Till betalning" }).click();
    await expect(passenger(page, 1).getByLabel("Förnamn")).toBeFocused();
    await expect(passenger(page, 1).getByLabel("Förnamn")).toHaveAttribute("aria-invalid", "true");
    await expect(alert(page).filter({ hasText: "Skriv passagerarens förnamn." }).first()).toBeVisible();
    await expect(alert(page).filter({ hasText: "Välj passagerarens ålder." }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Till betalning" })).toBeVisible();
    await expectNoA11yViolations(page);
  });

  test("TRIP-014-R7 the extras add up for every traveller, Dryckespaket XXXL waits for adults, and it is removed when a traveller turns out to be a child", async ({
    page,
  }) => {
    await page.goto(bookingPage());
    const base = (1190 + 1090) * 2;
    await extra(page, "Den ultimata upplevelsen").check();
    await extra(page, "Bear Grylls Experience").check();
    // Neither turns the other off, and each is listed with its sum
    await expect(extra(page, "Den ultimata upplevelsen")).toBeChecked();
    await expect(extra(page, "Bear Grylls Experience")).toBeChecked();
    expect(await total(page)).toBe(base + 2 * 1000 + 2 * 2000);
    const listed = yourTrip(page).getByRole("list", { name: "Tillägg" });
    await expect(listed).toContainText(/Den ultimata upplevelsen\s*2\s000\skr/);
    await expect(listed).toContainText(/Bear Grylls Experience\s*4\s000\skr/);
    await extra(page, "Bear Grylls Experience").uncheck();
    expect(await total(page)).toBe(base + 2 * 1000);

    // Under 18: unavailable, but reachable, with the reason as its description
    await passenger(page, 1).getByLabel("Ålder").selectOption("40");
    await passenger(page, 2).getByLabel("Ålder").selectOption("12");
    const drinks = extra(page, "Dryckespaket XXXL");
    await expect(drinks).toHaveAttribute("aria-disabled", "true");
    await expect(drinks).toHaveAccessibleDescription(/Går inte att välja när någon resenär är under 18 år/);
    await drinks.focus();
    await expect(drinks).toBeFocused();
    await drinks.click({ force: true });
    await expect(drinks).not.toBeChecked();

    // Chosen with adults only, then removed with a message when an age changes
    await passenger(page, 2).getByLabel("Ålder").selectOption("30");
    await expect(drinks).not.toHaveAttribute("aria-disabled", "true");
    await drinks.check();
    expect(await total(page)).toBe(base + 2 * 1000 + 2 * 4000);
    await passenger(page, 2).getByLabel("Ålder").selectOption("17");
    await expect(drinks).not.toBeChecked();
    await expect(page.getByRole("status").filter({ hasText: "Dryckespaket XXXL är borttaget" })).toBeVisible();
    expect(await total(page)).toBe(base + 2 * 1000);
    await expectNoA11yViolations(page);
  });

  test("TRIP-014-R6 R10 the form is kept in the tab only, fitted to the number of travellers, and Avbryt asks before throwing it away", async ({
    page,
  }) => {
    await page.goto(bookingPage());
    await passenger(page, 1).getByLabel("Förnamn").fill("E2E Anna");
    await passenger(page, 2).getByLabel("Förnamn").fill("E2E Bo");
    await page.reload();
    await expect(passenger(page, 1).getByLabel("Förnamn")).toHaveValue("E2E Anna");
    expect(page.url()).not.toContain("Anna");
    expect(await page.evaluate(() => sessionStorage.getItem("gurrasflyg-charter"))).toContain("E2E Anna");

    // Three travellers add one, one removes two; the first is kept
    await page.goto(bookingPage(3));
    await expect(passenger(page, 3).getByLabel("Förnamn")).toHaveValue("");
    await expect(passenger(page, 1).getByLabel("Förnamn")).toHaveValue("E2E Anna");
    await page.goto(bookingPage(1));
    await expect(passenger(page, 2)).toHaveCount(0);
    await expect(passenger(page, 1).getByLabel("Förnamn")).toHaveValue("E2E Anna");

    const dialog = page.getByRole("dialog", { name: "Är du säker?" });
    const avbryt = page.getByRole("banner").getByRole("button", { name: "Avbryt" });
    await avbryt.click();
    await dialog.getByRole("button", { name: "Nej, fortsätt" }).click();
    await expect(dialog).toHaveCount(0);
    await expect(passenger(page, 1).getByLabel("Förnamn")).toHaveValue("E2E Anna");
    await avbryt.click();
    await dialog.getByRole("button", { name: "Ja, avbryt" }).click();
    await expect(page).toHaveURL(/\/charter$/);
    expect(await page.evaluate(() => sessionStorage.getItem("gurrasflyg-charter"))).toBeNull();
  });
});

test.describe("Betala and the summary", () => {
  const choice = { out: SK1122, back: SK1123 };
  const email = "e2e-charter@exempel.se";

  test("TRIP-014-R8 R9 R10 Betala asks for a payment method, saves the booking with the booking number CH-, and the summary shows it once", async ({
    page,
  }) => {
    test.skip(!runsLocally, "saves a booking, and deletes it from the test database");
    await page.goto(travellersUrl("teufelsberg", search({ travellers: 1 }), choice));
    await fillAll(page, 1, email);
    await page.getByRole("checkbox", { name: "Bear Grylls Experience" }).check();
    await page.getByRole("button", { name: "Till betalning" }).click();
    await expect(page.getByRole("heading", { name: "Betala", level: 1 })).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`${paymentUrl("teufelsberg", search({ travellers: 1 }), choice)}$`.replace("?", "\\?")));

    // The price list splits "Att betala" in six rows that add up
    const toPay = (1190 + 1090 + 2000) * 1;
    const rows = page.locator("main dl:visible");
    expect((await rows.locator("dd").allTextContents()).map(amount).reduce((a, b) => a + b, 0)).toBe(toPay);
    await expect(rows.locator("dt")).toHaveCount(6);
    await expect(yourTrip(page)).toContainText("Bear Grylls Experience");

    // Without a method: a message, and focus on the first
    await page.getByRole("button", { name: "Betala", exact: true }).click();
    await expect(alert(page).filter({ hasText: "Välj hur du vill betala." })).toBeVisible();
    await expect(page.getByRole("radio", { name: "Cash till piloten" })).toBeFocused();
    await expectNoA11yViolations(page);

    try {
      await page.getByRole("radio", { name: "Cash till piloten" }).check();
      await page.getByRole("button", { name: "Betala", exact: true }).click();
      await expect(page).toHaveURL(/\/charter\/bokad$/);
      await expect(page.getByRole("heading", { name: "Tack för din bokning!" })).toBeVisible();
      const number = (await page.getByText(/^Bokningsnummer/).textContent())!.replace("Bokningsnummer", "").trim();
      expect(number).toMatch(/^CH-[A-HJ-NP-Z2-9]{6}$/);
      await expect(page.getByRole("main")).toContainText("Cash till piloten");
      await expect(page.getByRole("main")).toContainText("Bear Grylls Experience");
      await expect(page.getByRole("main")).toContainText(email);
      await expect(region(page, "Resor")).toContainText("SK1122");
      await expect(page.getByRole("main")).toContainText(new RegExp(`${String(toPay).replace(/(\d)(?=(\d{3})$)/, "$1\\s")}\\skr`));
      await expectNoA11yViolations(page);

      // What is saved is the booking, its trips, travellers and extras, with prices from the database
      const saved = await inTestDb(async (db) => {
        const booking = (await db.execute({ sql: "SELECT id, total FROM charter_bookings WHERE booking_number = ?", args: [number] })).rows[0];
        const trips = await db.execute({ sql: "SELECT timetable_id, price FROM charter_booking_trips WHERE booking_id = ? ORDER BY position", args: [booking.id] });
        const extras = await db.execute({ sql: "SELECT code, price FROM charter_booking_extras WHERE booking_id = ?", args: [booking.id] });
        return { total: booking.total, trips: trips.rows.map((r) => [r.timetable_id, r.price]), extras: extras.rows.map((r) => [r.code, r.price]) };
      });
      expect(saved).toEqual({ total: toPay, trips: [[SK1122, 1190], [SK1123, 1090]], extras: [["grylls", 2000]] });

      // The summary is shown only in the tab where the booking was made
      await page.context().newPage().then(async (other) => {
        await other.goto("/charter/bokad");
        await expect(other.getByRole("heading", { name: "Ingen bokning" })).toBeVisible();
        await expect(other.getByText("Det finns ingen bokning att visa här. En bokning visas bara direkt efter att den är gjord.")).toBeVisible();
        await other.close();
      });
    } finally {
      await inTestDb((db) => db.execute({ sql: "DELETE FROM charter_bookings WHERE email = ?", args: [email] }));
    }
  });
});

// Read-only, so it also runs against the preview and the live site: the form on a destination page leads
// to results with trips that can be chosen. It never pays. The date is a week from today (not before the
// timetables start), so it needs today to be inside the timetables' period, which ends on 30 April 2027.
test("TRIP-014-R1 @smoke a destination's form leads to results with trips that can be chosen", async ({ page }) => {
  const start = daysFromToday(7) < "2026-11-02" ? "2026-11-02" : daysFromToday(7);
  await page.goto("/charter/teufelsberg");
  const form = region(page, "Sök resa");
  await form.getByLabel("Utresa").fill(formatShort(start));
  await form.getByLabel("Utresa").press("Enter");
  await form.getByLabel("Hemresa").fill(formatShort(addDays(start, 2)));
  await form.getByLabel("Hemresa").press("Enter");
  await form.getByRole("button", { name: "Sök resor" }).click();
  await expect(page.getByRole("heading", { name: "Välj din resa", level: 1 })).toBeVisible();
  await expect(outbound(page).getByRole("button", { name: /^Välj / }).first()).toBeVisible();
  await outbound(page).getByRole("button", { name: /^Välj / }).first().click();
  await expect(homeward(page).getByRole("button", { name: /^Välj / }).first()).toBeVisible();
});
