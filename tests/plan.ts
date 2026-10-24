import { test as base, expect, type Locator, type Page } from "@playwright/test";
import { createAircraft, createClass, daysFromToday, deleteWithConfirmation, openResults, signIn, uniqueName } from "./helpers";

// Shared by the tests of /flyg/plan (TRIP-011, TRIP-024, TRIP-026): the tests'
// own aircraft and the parts of the page.

// The tests' own classes and aircraft, created once in admin with unique
// names and deleted afterwards, so that they also run against a deployed site:
// a class at 1,00 and one at 2,00, and three aircraft (price and time factors):
// Stor (1,00 and 1,00, 12 seats), Liten (1,50 and 2,00, 4 seats) and
// Snabb (3,00 and 0,30, 5 seats). Only the tests that need them create them,
// so the smoke test writes nothing.
export type Fleet = { base: string; luxury: string; large: string; small: string; fast: string };

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
      };
      await signIn(page);
      await createClass(page, fleet.base, "1,00");
      await createClass(page, fleet.luxury, "2,00");
      const classes = (base: number, luxury: number) => [
        { name: fleet.base, seats: base },
        ...(luxury > 0 ? [{ name: fleet.luxury, seats: luxury }] : []),
      ];
      await createAircraft(page, fleet.large, classes(10, 2), [], { price: "1,00", time: "1,00" });
      await createAircraft(page, fleet.small, classes(4, 0), [], { price: "1,50", time: "2,00" });
      await createAircraft(page, fleet.fast, classes(3, 2), [], { price: "3,00", time: "0,30" });

      await use(fleet);

      // Aircraft first, since they use the classes
      await page.goto("/admin");
      for (const name of [fleet.large, fleet.small, fleet.fast, fleet.base, fleet.luxury]) {
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
