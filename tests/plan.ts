import { createClient } from "@libsql/client";
import { testDbFile } from "../lib/local-db.mjs";
import { test as base, expect, type Locator, type Page } from "@playwright/test";
import {
  createAddon,
  createAircraft,
  createClass,
  daysFromToday,
  deleteWithConfirmation,
  openResults,
  signIn,
  uniqueName,
} from "./helpers";

// Shared by the tests of /flyg/plan (TRIP-011, TRIP-024, TRIP-026) and the
// booking after it (TRIP-012): the tests' own aircraft and the parts of the page.

// The tests' own classes and aircraft, created once in admin with unique
// names and deleted afterwards, so that they also run against a deployed site:
// a class at 1,00 and one at 2,00, and three aircraft (price and time factors):
// Stor (1,00 and 1,00, 12 seats), Liten (1,50 and 2,00, 4 seats) and
// Snabb (3,00 and 0,30, 5 seats). Stor has three add-ons (TRIP-012): Måltid
// (120 kr) in both classes, Bagage (300 kr) in the 1,00 class and Lounge
// (500 kr) only in the 2,00 class. Only the tests that need them create them,
// so the smoke test writes nothing.
export type Fleet = {
  base: string;
  luxury: string;
  large: string;
  small: string;
  fast: string;
  meal: string;
  bag: string;
  lounge: string;
};

export const test = base.extend<object, { fleet: Fleet }>({
  fleet: [
    async ({ browser }, use, workerInfo) => {
      const { baseURL, extraHTTPHeaders } = workerInfo.project.use;
      const page = await browser.newPage({ baseURL, extraHTTPHeaders, locale: "sv-SE" });
      const fleet = {
        base: uniqueName("Bas"),
        luxury: uniqueName("Lyx"),
        large: uniqueName("Plan Stor"),
        small: uniqueName("Plan Liten"),
        fast: uniqueName("Plan Snabb"),
        meal: uniqueName("Måltid"),
        bag: uniqueName("Bagage"),
        lounge: uniqueName("Lounge"),
      };
      await signIn(page);
      await createClass(page, fleet.base, "1,00");
      await createClass(page, fleet.luxury, "2,00");
      await createAddon(page, fleet.meal, "120", "Varm mat");
      await createAddon(page, fleet.bag, "300", "En väska till");
      await createAddon(page, fleet.lounge, "500", "Soffor och tystnad");
      const classes = (base: number, luxury: number) => [
        { name: fleet.base, seats: base },
        ...(luxury > 0 ? [{ name: fleet.luxury, seats: luxury }] : []),
      ];
      const addons = [
        { name: fleet.meal, className: fleet.base },
        { name: fleet.meal, className: fleet.luxury },
        { name: fleet.bag, className: fleet.base },
        { name: fleet.lounge, className: fleet.luxury },
      ];
      await createAircraft(page, fleet.large, classes(10, 2), addons, { price: "1,00", time: "1,00" });
      await createAircraft(page, fleet.small, classes(4, 0), [], { price: "1,50", time: "2,00" });
      await createAircraft(page, fleet.fast, classes(3, 2), [], { price: "3,00", time: "0,30" });

      await use(fleet);

      // Aircraft first, since they use the classes and add-ons
      await page.goto("/admin");
      const names = [fleet.large, fleet.small, fleet.fast, fleet.base, fleet.luxury, fleet.meal, fleet.bag, fleet.lounge];
      for (const name of names) {
        await deleteWithConfirmation(page, `Ta bort ${name}`);
      }
      await page.close();
    },
    { scope: "worker" },
  ],
});

export const TOMORROW = daysFromToday(1);
export const IN_A_WEEK = daysFromToday(7);
export const searchUrl = (travellers: number, roundTrip: boolean) =>
  `/flyg?fran=ARN&till=LHR&utresa=${TOMORROW}${roundTrip ? `&hemresa=${IN_A_WEEK}` : ""}&resenarer=${travellers}`;

export const flightButtons = (page: Page) => page.getByRole("button", { name: /^\d\d:\d\d / });

// Chooses the first flight (or the first of each) in the results, and returns their departure times
export async function chooseFlights(page: Page, roundTrip: boolean, which = [0, 0]) {
  const times: string[] = [];
  for (const i of roundTrip ? which : which.slice(0, 1)) {
    const card = flightButtons(page).nth(i);
    times.push(((await card.textContent()) ?? "").slice(0, 5));
    await card.click();
    await page.getByRole("button", { name: "Välj" }).click();
  }
  return times;
}

// The search ARN → LHR, the first flight(s), and Fortsätt to aircraft and classes
export async function openPlan(page: Page, travellers: number, roundTrip = false) {
  await openResults(page, searchUrl(travellers, roundTrip));
  const times = await chooseFlights(page, roundTrip);
  await page.getByRole("link", { name: "Fortsätt" }).click();
  await expect(page.getByRole("heading", { name: "Plan för utresan" })).toBeVisible();
  return times;
}

type LegName = "utresan" | "hemresan";

// A flight's card, by its heading "Utresa" or "Hemresa"
export const legCard = (page: Page, leg: LegName) =>
  page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: leg === "utresan" ? "Utresa" : "Hemresa", exact: true, level: 2 }) });
export const aircraftList = (page: Page, leg: LegName) => page.getByRole("region", { name: `Plan för ${leg}` });
// The aircraft cards in the list (each has a button that opens it)
export const aircraftCards = (page: Page, leg: LegName) =>
  aircraftList(page, leg).getByRole("listitem").filter({ has: page.locator("button[aria-expanded]") });
export const aircraftCard = (page: Page, leg: LegName, name: string) =>
  aircraftCards(page, leg).filter({ hasText: name });
export const classList = (page: Page, leg: LegName) => page.getByRole("region", { name: `Klasser på ${leg}` });
export const classRow = (page: Page, leg: LegName, name: string) =>
  classList(page, leg).getByRole("listitem").filter({ hasText: name });
export const count = (row: Locator) => row.locator("[aria-live]");
// "Placera ut 3 resenärer" or "Alla resenärer har en klass"
export const counter = (page: Page, leg: LegName) => classList(page, leg).getByText(/^Placera ut|^Alla resenärer/);
// The chosen aircraft at the top of an open card, and a folded card's summary
export const chosenAircraft = (page: Page, leg: LegName) => legCard(page, leg).getByRole("button", { name: /^Valt plan/ });
export const folded = (page: Page, leg: LegName) => legCard(page, leg).getByRole("button", { name: /^Klart för/ });

// A message on the page (Next.js has an alert of its own, outside main, that announces new pages)
export const alert = (page: Page) => page.getByRole("main").getByRole("alert");

// "4 668 kr / person · 10 platser" -> 4668
export const amount = (text: string | null) => Number((text ?? "").replace(/kr.*$/, "").replace(/\s/g, ""));
// "9 h 20 min", "2 h" or "42 min" -> minutes
export const minutes = (text: string) => {
  const [, h, m] = text.match(/(?:(\d+) h)?\s*(?:(\d+) min)?/)!;
  return Number(h ?? 0) * 60 + Number(m ?? 0);
};
// The price per person on an aircraft card ("3 890 kr") or a class row ("4 668 kr / person · 10 platser")
export async function cardPrice(card: Locator) {
  return amount(await card.getByText(/^\d[\d\s]*\skr/).first().textContent());
}
// The flight time on an aircraft card ("2 h 20 min · landar 09:40")
export async function cardMinutes(card: Locator) {
  return minutes((await card.getByText(/landar/).textContent()) ?? "");
}

// Opens an aircraft and presses Välj: its classes appear with focus on their heading
export async function chooseAircraft(page: Page, leg: LegName, name: string) {
  const card = aircraftCard(page, leg, name);
  await card.getByRole("button", { name: new RegExp(name) }).click();
  await card.getByRole("button", { name: "Välj" }).click();
  await expect(page.getByRole("heading", { name: `Klasser på ${leg}` })).toBeFocused();
}

// Klar on a flight
export const done = (page: Page, leg: LegName) => classList(page, leg).getByRole("button", { name: "Klar" }).click();

// Puts n more travellers in a class with Fler, one at a time: each click
// waits until the page shows the new number, which it reads back from the address
export async function place(page: Page, leg: LegName, name: string, n: number) {
  const row = classRow(page, leg, name);
  const before = Number(((await count(row).textContent()) ?? "").split(" ")[0]);
  for (let i = 1; i <= n; i++) {
    await row.getByRole("button", { name: `Fler i ${name}` }).click();
    await expect(count(row)).toHaveText(`${before + i} i ${name}`);
  }
}

// Every flight done the same way: the aircraft, the travellers per class
// ({ class: number }) and Klar. Then Fortsätt to the booking page (TRIP-012).
export async function openBooking(page: Page, aircraft: string, seating: Record<string, number>, roundTrip = false) {
  const travellers = Object.values(seating).reduce((sum, n) => sum + n, 0);
  await openPlan(page, travellers, roundTrip);
  for (const leg of roundTrip ? (["utresan", "hemresan"] as const) : (["utresan"] as const)) {
    await chooseAircraft(page, leg, aircraft);
    for (const [name, n] of Object.entries(seating)) await place(page, leg, name, n);
    await done(page, leg);
  }
  await page.getByRole("link", { name: "Fortsätt" }).click();
  await expect(page.getByRole("heading", { name: "Resenärer", level: 1 })).toBeVisible();
}

// The booking page filled in (TRIP-012, TRIP-027)
export const passenger = (page: Page, n: number) => page.getByRole("region", { name: `Passagerare ${n}`, exact: true });

export async function fillPassenger(page: Page, n: number, first: string) {
  const card = passenger(page, n);
  await card.getByLabel("Förnamn").fill(first);
  await card.getByLabel("Efternamn").fill("Testsson");
  await card.getByLabel("Ålder").selectOption("40");
}

// Everything on the booking page filled in, for the given number of passengers
export async function fillAll(page: Page, passengers: number, email = "anna@exempel.se") {
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
export async function inTestDb<T>(fn: (db: ReturnType<typeof createClient>) => Promise<T>) {
  const db = createClient({ url: `file:${testDbFile}` });
  try {
    await db.execute("PRAGMA foreign_keys = ON");
    return await fn(db);
  } finally {
    db.close();
  }
}
export const countBookings = (email: string) =>
  inTestDb(async (db) => (await db.execute({ sql: "SELECT id FROM bookings WHERE email = ?", args: [email] })).rows.length);
export const deleteBookings = (email: string) =>
  inTestDb((db) => db.execute({ sql: "DELETE FROM bookings WHERE email = ?", args: [email] }));
