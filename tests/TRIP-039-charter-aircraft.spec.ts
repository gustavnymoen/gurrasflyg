import { expect, type Page } from "@playwright/test";
import { paymentUrl, travellersUrl, NO_CHOICE } from "../lib/charter-rules";
import { expectNoA11yViolations, runsLocally } from "./helpers";
import {
  aircraftCard,
  aircraftCards,
  amount,
  cardMinutes,
  cardPrice,
  charterSearch,
  chooseAircraft,
  classRow,
  count,
  counter,
  done,
  fillAll,
  fillPassenger,
  folded,
  inTestDb,
  openCharterBooking,
  openCharterPlan,
  passenger,
  place,
  SK1122,
  SK1123,
  test,
} from "./plan";

// The rules (the price with the factors, the places, the address, the checks of the server and the saving) are unit
// tests in lib/charter-rules.test.ts, lib/charter-bookings.test.ts and db/migrations/013_charter_aircraft.test.ts;
// here the plan step and the pages after it use them. The tests use the TRIP-014 trips (ARN-BER-SK1122, 1 190 kr,
// 06:50, 100 minutes; BER-ARN-SK1123, 1 090 kr) and the tests' own aircraft (tests/plan.ts): Stor 1,00 and 1,00
// with 10 + 2 seats, Liten 1,50 and 2,00 with 4, Snabb 3,00 and 0,30 with 3 + 2; the classes 1,00 and 2,00.

const FLIGHT_TIME = /1 h 40 min · landar 08:30/;
// The total for the trip at the bottom of the plan step, or in Din resa on Resenärer; polled, since it follows the page.
// Only the visible one: Next.js keeps the earlier steps in the page, hidden, with totals of their own.
const tripTotal = (page: Page) =>
  expect.poll(async () =>
    amount(
      await page
        .getByText(/^Totalt för resan, \d+ resenärer?$/)
        .filter({ visible: true })
        .locator("xpath=following-sibling::*[1]")
        .textContent(),
    ),
  );
const region = (page: Page, name: string) => page.getByRole("region", { name, exact: true });
const overview = (page: Page) => region(page, "Din resa");

test("TRIP-039-R1 R2 R3 the plan step: only aircraft with room, the departure's own flight time whatever the time factor, prices from both factors, and the choices in the address", async ({
  page,
  fleet,
}) => {
  // Five travellers: Liten (4 seats) is not offered, Stor (12) and Snabb (5) are
  await openCharterPlan(page, 5);
  await expect(page.getByRole("list", { name: "Steg" }).getByRole("listitem")).toHaveText([/Resa/, /Plan och klass/, /Resenärer/, /Betala/]);
  await expect(page.getByRole("list", { name: "Steg" }).getByRole("listitem").nth(1)).toHaveAttribute("aria-current", "step");
  await expect(aircraftCard(page, "utresan", fleet.large)).toBeVisible();
  await expect(aircraftCard(page, "utresan", fleet.fast)).toBeVisible();
  await expect(aircraftCard(page, "utresan", fleet.small)).toHaveCount(0);
  await expect(overview(page)).not.toContainText(fleet.large);

  // R2: Snabb's factor 0,30 would make 100 minutes 30; the card shows the departure's own time, arrival and price
  const stor = aircraftCard(page, "utresan", fleet.large);
  const snabb = aircraftCard(page, "utresan", fleet.fast);
  expect(await cardMinutes(stor)).toBe(100);
  expect(await cardMinutes(snabb)).toBe(100);
  await expect(stor).toContainText(FLIGHT_TIME);
  await expect(snabb).toContainText(FLIGHT_TIME);
  // R3: the departure's price with the aircraft's factor in the cheapest class: 1 190 × 1,00 and 1 190 × 3,00
  expect(await cardPrice(stor)).toBe(1190);
  expect(await cardPrice(snabb)).toBe(3570);
  await expectNoA11yViolations(page);

  // The classes under the chosen aircraft: 1 190 and 2 380, three in the first and two in the second
  await chooseAircraft(page, "utresan", fleet.large);
  await expect(overview(page)).toContainText(fleet.large);
  await expect(classRow(page, "utresan", fleet.luxury)).toContainText(/2\s380\skr \/ person/);
  await place(page, "utresan", fleet.base, 3);
  await expect(counter(page, "utresan")).toHaveText("Placera ut 2 resenärer");
  await place(page, "utresan", fleet.luxury, 2);
  await expect(counter(page, "utresan")).toHaveText("Alla resenärer har en klass");
  await expect(overview(page)).toContainText(`${fleet.large} · ${fleet.base}: 3 · ${fleet.luxury}: 2`);
  await expectNoA11yViolations(page);
  // The address has the choice (the trips are kept), and it survives a reload with the card open
  await expect(page).toHaveURL(new RegExp(`/charter/teufelsberg/plan\\?.*ut=${SK1122}&hem=${SK1123}&ut-plan=\\d+&ut-klasser=`));
  await done(page, "utresan");
  await expect(folded(page, "utresan")).toContainText(`${fleet.base}: 3 · ${fleet.luxury}: 2`);
  await expect(page.getByRole("link", { name: "Fortsätt" })).toHaveCount(0);

  // The return trip the same way; the totals follow: 3 × 1 190 + 2 × 2 380 and 3 × 1 090 + 2 × 2 180
  await chooseAircraft(page, "hemresan", fleet.large);
  await place(page, "hemresan", fleet.base, 3);
  await place(page, "hemresan", fleet.luxury, 2);
  await done(page, "hemresan");
  await tripTotal(page).toBe(3 * 1190 + 2 * 2380 + 3 * 1090 + 2 * 2180);
  await page.reload();
  await expect(folded(page, "utresan")).toBeVisible();
  await expect(folded(page, "hemresan")).toBeVisible();
  await tripTotal(page).toBe(3 * 1190 + 2 * 2380 + 3 * 1090 + 2 * 2180);
  await expectNoA11yViolations(page);
  const next = page.getByRole("link", { name: "Fortsätt" });
  await expect(next).toHaveAttribute("href", new RegExp(`/charter/teufelsberg/boka\\?.*ut-plan=\\d+&ut-klasser=.*hem-plan=\\d+&hem-klasser=`));

  // R3: an address with an aircraft that doesn't exist, or with numbers that don't fit, is not trusted
  const url = new URL(page.url());
  const planId = url.searchParams.get("ut-plan")!;
  url.searchParams.set("ut-plan", "999999");
  await page.goto(url.pathname + url.search);
  await expect(page.getByRole("heading", { name: "Plan för utresan" })).toBeVisible();
  await expect(folded(page, "hemresan")).toBeVisible();
  url.searchParams.set("ut-plan", planId);
  url.searchParams.set("ut-klasser", `${planId}:99`);
  await page.goto(url.pathname + url.search);
  await expect(page.getByRole("heading", { name: "Plan för utresan" }).or(page.getByRole("heading", { name: "Klasser på utresan" }))).toBeVisible();
  await expect(folded(page, "utresan")).toHaveCount(0);
});

test("TRIP-039-R6 an address without an aircraft and classes leads to the plan step with the trips kept, and nothing is chosen for the visitor", async ({
  page,
  fleet,
}) => {
  const search = charterSearch(2);
  const noPlans = { ...NO_CHOICE, out: SK1122, back: SK1123 };
  for (const url of [travellersUrl("teufelsberg", search, noPlans), paymentUrl("teufelsberg", search, noPlans)]) {
    await page.goto(url);
    await expect(page).toHaveURL(new RegExp(`/charter/teufelsberg/plan\\?fran=ARN&.*ut=${SK1122}&hem=${SK1123}$`));
    await expect(page.getByRole("heading", { name: "Välj plan och klass", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Plan för utresan" })).toBeVisible();
    await expect(aircraftCards(page, "utresan").first()).toBeVisible();
    await expect(page.getByRole("region", { name: /^Klasser på/ })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Fortsätt" })).toHaveCount(0);
  }

  // One trip planned and the other not: the planned one is kept, the other is asked for
  await openCharterBooking(page, fleet.large, { [fleet.base]: 2 });
  const url = new URL(page.url());
  url.searchParams.delete("hem-plan");
  await page.goto(url.pathname + url.search);
  await expect(page).toHaveURL(/\/plan\?/);
  await expect(folded(page, "utresan")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Plan för hemresan" })).toBeVisible();
  await expectNoA11yViolations(page);
});

test("TRIP-039-R4 R5 R8 the class is only text on Resenärer, the class add-ons come next to the extras and into the total and the summary, and going back to change the classes tells which add-ons went", async ({
  page,
  fleet,
}) => {
  test.skip(!runsLocally, "saves a booking, and deletes it from the test database");
  const email = "e2e-charter-plan@exempel.se";
  try {
    // Two travellers: the first sits in the dearest class on both trips, the second in the cheapest
    await openCharterBooking(page, fleet.large, { [fleet.base]: 1, [fleet.luxury]: 1 });
    const first = passenger(page, 1);
    const second = passenger(page, 2);
    await expect(first.getByRole("group", { name: "Utresa" })).toContainText(`Klass: ${fleet.luxury}`);
    await expect(first.getByRole("group", { name: "Hemresa" })).toContainText(`Klass: ${fleet.luxury}`);
    await expect(second.getByRole("group", { name: "Utresa" })).toContainText(`Klass: ${fleet.base}`);
    // No choice of class, and a link back to the plan step
    await expect(page.getByLabel("Klass")).toHaveCount(0);
    await expect(page.getByRole("combobox", { name: "Klass" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Ändra plan och klasser" })).toHaveAttribute("href", /\/plan\?.*ut-plan=\d+/);
    // The add-ons are those of the traveller's class: Lounge only in the dearest class, Bagage only in the cheapest
    await expect(first.getByRole("group", { name: "Utresa" })).toContainText(fleet.lounge);
    await expect(first.getByRole("group", { name: "Utresa" })).not.toContainText(fleet.bag);
    await expect(second.getByRole("group", { name: "Utresa" })).toContainText(fleet.bag);
    await expect(second.getByRole("group", { name: "Utresa" })).not.toContainText(fleet.lounge);
    await expectNoA11yViolations(page);

    // The seats: (2 380 + 2 180) + (1 190 + 1 090) = 6 840. Add-ons: 2 Måltid out and a Lounge back for the first
    // traveller, a Bagage out for the second; and the extra Bear Grylls for both, next to them
    const seats = 2380 + 2180 + 1190 + 1090;
    await tripTotal(page).toBe(seats);
    const more = (group: ReturnType<typeof passenger>, leg: "Utresa" | "Hemresa", name: string) =>
      group.getByRole("group", { name: leg }).getByRole("button", { name: `Fler ${name}` });
    await more(first, "Utresa", fleet.meal).click();
    await more(first, "Utresa", fleet.meal).click();
    await more(first, "Hemresa", fleet.lounge).click();
    await more(second, "Utresa", fleet.bag).click();
    await page.getByRole("checkbox", { name: "Bear Grylls Experience" }).check();
    const addons = 2 * 120 + 500 + 300;
    await tripTotal(page).toBe(seats + addons + 2 * 2000);
    await expect(overview(page).getByRole("list", { name: "Tillägg" })).toContainText(/Bear Grylls Experience\s*4\s000\skr/);

    // R8: back to the plan step, move the first traveller to the cheapest class on the outbound trip
    await fillPassenger(page, 1, "E2E Anna");
    await page.getByRole("link", { name: "Ändra plan och klasser" }).click();
    await expect(folded(page, "utresan")).toBeVisible();
    await folded(page, "utresan").click();
    await classRow(page, "utresan", fleet.luxury).getByRole("button", { name: `Färre i ${fleet.luxury}` }).click();
    await expect(count(classRow(page, "utresan", fleet.luxury))).toHaveText(`0 i ${fleet.luxury}`);
    await place(page, "utresan", fleet.base, 1);
    await done(page, "utresan");
    await page.getByRole("link", { name: "Fortsätt" }).click();
    await expect(page.getByRole("heading", { name: "Resenärer", level: 1 })).toBeVisible();

    // The page tells which add-ons of the classes were removed, the rest of the form is kept
    const notice = page.getByRole("status").filter({ hasText: "Dessa tillägg togs bort" });
    await expect(notice).toContainText(`Passagerare 1, utresan: ${fleet.meal} (2 st)`);
    await expect(notice).toContainText(`Passagerare 2, utresan: ${fleet.bag}`);
    await expect(notice).not.toContainText("hemresan");
    await expect(first.getByLabel("Förnamn")).toHaveValue("E2E Anna");
    await expect(page.getByRole("checkbox", { name: "Bear Grylls Experience" })).toBeChecked();
    await expect(first.getByRole("group", { name: "Utresa" })).toContainText(`Klass: ${fleet.base}`);
    // The return trip was not changed: its Lounge is still there
    await expect(first.getByRole("group", { name: "Hemresa" })).toContainText(fleet.lounge);
    await tripTotal(page).toBe(1190 + 2180 + 1190 + 1090 + 500 + 2 * 2000);
    await expectNoA11yViolations(page);

    // Booked: the summary shows each trip's aircraft and classes, each traveller's class and add-ons, and the total
    await fillAll(page, 2, email);
    await page.getByRole("button", { name: "Till betalning" }).click();
    await page.getByRole("radio", { name: "Cash till piloten" }).check();
    await page.getByRole("button", { name: "Betala", exact: true }).click();
    await expect(page).toHaveURL(/\/charter\/bokad$/);
    await expect(region(page, "Resor")).toContainText(`${fleet.large} · ${fleet.base}: 2`);
    await expect(region(page, "Resor")).toContainText(`${fleet.large} · ${fleet.base}: 1 · ${fleet.luxury}: 1`);
    await expect(region(page, "Resenärer")).toContainText(`Hemresa: ${fleet.luxury} · ${fleet.lounge}`);
    await expect(page.getByText("Totalt", { exact: true }).locator("xpath=..")).toContainText(
      new RegExp(String(1190 + 2180 + 1190 + 1090 + 500 + 4000).replace(/(\d)(?=(\d{3})$)/, "$1\\s")),
    );
    await expectNoA11yViolations(page);

    // What is saved: the aircraft on both trips, a seat per traveller and trip, and the kept add-on
    const saved = await inTestDb(async (db) => {
      const id = (await db.execute({ sql: "SELECT id FROM charter_bookings WHERE email = ?", args: [email] })).rows[0].id;
      const rows = async (sql: string) => (await db.execute({ sql, args: [id] })).rows.map((r) => Object.values(r));
      return {
        aircraft: await rows("SELECT COUNT(*) FROM charter_booking_trips WHERE booking_id = ? AND aircraft_id IS NOT NULL"),
        seats: await rows("SELECT COUNT(*) FROM charter_booking_seats s JOIN charter_booking_trips t ON t.id = s.booking_trip_id WHERE t.booking_id = ?"),
        addons: await rows(
          `SELECT a.count FROM charter_booking_addons a JOIN charter_booking_seats s ON s.id = a.booking_seat_id
           JOIN charter_booking_trips t ON t.id = s.booking_trip_id WHERE t.booking_id = ?`,
        ),
      };
    });
    expect(saved).toEqual({ aircraft: [[2]], seats: [[4]], addons: [[1]] });
  } finally {
    await inTestDb((db) => db.execute({ sql: "DELETE FROM charter_bookings WHERE email = ?", args: [email] }));
  }
});

test("TRIP-039-R7 a summary from before the plan step is shown as it was, with no aircraft and no classes made up", async ({ page }) => {
  // The shape of a summary saved by TRIP-014: trips and travellers without aircraft and classes
  await page.goto("/charter/bokad");
  await page.evaluate(() => {
    const place = (iata: string, city: string) => ({ iata, city, timezone: "Europe/Stockholm" });
    const trip = (title: string, from: ReturnType<typeof place>, to: ReturnType<typeof place>) => ({
      title,
      trip: { id: "T1", airline: "SAS", flights: ["SK1122"], date: "2027-01-11", time: "06:50", minutes: 100, price: 1190, from, to, stops: [], arrival: { time: "08:30", days: 0 } },
    });
    sessionStorage.setItem(
      "gurrasflyg-charter-bokad",
      JSON.stringify({
        bookingNumber: "CH-K7M2QX",
        destination: "Teufelsberg",
        trips: [trip("Utresa", place("ARN", "Stockholm"), place("BER", "Berlin")), trip("Hemresa", place("BER", "Berlin"), place("ARN", "Stockholm"))],
        passengers: [{ name: "Anna Ek", age: "40" }],
        extras: [],
        contact: { firstName: "Anna", lastName: "Ek", email: "anna@exempel.se", phone: "070-123 45 67", address: "Gatan 1" },
        payment: "Cash till piloten",
        total: 2280,
      }),
    );
  });
  await page.reload();
  await expect(page.getByRole("heading", { name: "Tack för din bokning!" })).toBeVisible();
  await expect(region(page, "Resor")).toContainText("SK1122");
  await expect(region(page, "Resenärer")).toContainText("Anna Ek, 40 år");
  await expect(region(page, "Resenärer")).not.toContainText("Utresa:");
  await expectNoA11yViolations(page);
});

test("TRIP-039-R3 the plan step and Resenärer fit a 320 px screen", async ({ page, fleet }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  const sideways = () => page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  await openCharterPlan(page, 2);
  expect(await sideways()).toBe(false);
  await chooseAircraft(page, "utresan", fleet.large);
  expect(await sideways()).toBe(false);
  await openCharterBooking(page, fleet.large, { [fleet.base]: 1, [fleet.luxury]: 1 });
  expect(await sideways()).toBe(false);
});
