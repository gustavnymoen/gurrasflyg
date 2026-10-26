import { expect, test, vi } from "vitest";
import { unitTestDbFile } from "./local-db.mjs";
import {
  applyFilters,
  facetCounts,
  filterOptions,
  filtersToParams,
  firstSentence,
  listHref,
  NO_FILTERS,
  parseFilters,
  suggestDestinations,
  tripTo,
  type DestinationCard,
  type Fares,
  type Filters,
} from "./destinations";

// connection() i lib/travel.ts finns bara i en förfrågan till sajten
vi.mock("next/server", () => ({ connection: async () => {} }));

// Kursens resmål ur enhetstesternas databas. lib/db.ts läser adressen när den importeras,
// så travel importeras först när den är satt.
process.env.TURSO_DATABASE_URL = `file:${unitTestDbFile}`;
const { getDestinationCards, getCharterDestination } = await import("./travel");
const cards = await getDestinationCards();
const find = (id: string) => cards.find((c) => c.id === id)!;
const ids = (list: DestinationCard[]) => list.map((c) => c.id);
const filters = (changes: Partial<Filters>): Filters => ({ ...NO_FILTERS, ...changes });

test("TRIP-013-R1 a search finds title, other names, locality, region, country in both languages and tags", () => {
  expect(ids(applyFilters(cards, filters({ q: "field station" })))).toContain("teufelsberg"); // annat namn
  expect(ids(applyFilters(cards, filters({ q: "grunewald" })))).toContain("teufelsberg"); // plats
  expect(ids(applyFilters(cards, filters({ q: "street-art" })))).toContain("teufelsberg"); // tagg
  expect(ids(applyFilters(cards, filters({ q: "Tyskland" })))).toContain("teufelsberg"); // land på svenska
  expect(ids(applyFilters(cards, filters({ q: "Germany" })))).toContain("teufelsberg"); // land på engelska
  expect(applyFilters(cards, filters({ q: "zzzzqx" }))).toEqual([]);
});

test("TRIP-013-R1 case and accents do not matter in a search", () => {
  const same = ids(applyFilters(cards, filters({ q: "BERLIN" })));
  expect(same.length).toBeGreaterThan(0);
  expect(ids(applyFilters(cards, filters({ q: "berlin" })))).toEqual(same);
  expect(ids(applyFilters(cards, filters({ q: "osowka" })))).toContain("project-riese-osowka");
});

test("TRIP-013-R1 the suggestions are at most five, those starting with the text first", () => {
  const suggestions = suggestDestinations(cards, "teufel");
  expect(suggestions.map((c) => c.id)[0]).toBe("teufelsberg");
  expect(suggestDestinations(cards, "a").length).toBeLessThanOrEqual(5);
  expect(suggestDestinations(cards, "field station").map((c) => c.id)).toContain("teufelsberg");
});

test("TRIP-013-R2 filters work alone and together with the search", () => {
  expect(applyFilters(cards, filters({ continent: "Europe" }))).toHaveLength(47);
  const europeGermany = applyFilters(cards, filters({ continent: "Europe", country: "DE" }));
  expect(europeGermany.every((c) => c.country === "DE")).toBe(true);
  const withSearch = applyFilters(cards, filters({ continent: "Europe", q: "berlin" }));
  expect(withSearch.every((c) => c.continent === "Europe")).toBe(true);
  expect(applyFilters(cards, filters({ continent: "Asia", q: "berlin" }))).toEqual([]);
});

test("TRIP-013-R2 the countries to choose are those of the chosen continent, and Antarctica leaves them unchanged", () => {
  const europe = filterOptions(cards, filters({ continent: "Europe" }), "country");
  const countriesInEurope = new Set(cards.filter((c) => c.continent === "Europe").map((c) => c.country));
  expect(new Set(europe.map((o) => o.value))).toEqual(countriesInEurope);

  const all = filterOptions(cards, NO_FILTERS, "country").map((o) => o.value);
  expect(filterOptions(cards, filters({ continent: "Antarctica" }), "country").map((o) => o.value)).toEqual(all);
});

test("TRIP-013-R2 a choice's count is what it gives together with the other filters and the search", () => {
  const selected = filters({ continent: "Europe", q: "berlin" });
  for (const key of ["continent", "country", "access", "category"] as const) {
    for (const option of filterOptions(cards, selected, key)) {
      const given = applyFilters(cards, { ...selected, [key]: option.value });
      expect(option.count).toBe(given.length);
    }
  }
  // Samma räkning med en enskild fråga
  expect(facetCounts(cards, NO_FILTERS, "continent").get("Europe")).toBe(47);
});

test("TRIP-013-R2 the search and filters are written to and read from the address", () => {
  const selected = filters({ q: "berlin", continent: "Europe", country: "DE", access: "Open", category: "Prison" });
  const params = filtersToParams(selected);
  expect(params.toString()).toBe("sok=berlin&varldsdel=Europe&land=DE&tillgang=Open&kategori=Prison");
  expect(parseFilters(params, cards)).toEqual(selected);
  expect(filtersToParams(NO_FILTERS).toString()).toBe("");
});

test("TRIP-013-R2 an unknown value in the address is ignored", () => {
  const params = new URLSearchParams("sok=berlin&varldsdel=Atlantis&land=XX&tillgang=Free&kategori=Zoo");
  expect(parseFilters(params, cards)).toEqual(filters({ q: "berlin" }));
});

test("TRIP-013-R5 a card has the first sentence of the description", () => {
  expect(firstSentence("A hill. It is old.")).toBe("A hill.");
  expect(firstSentence("Is it open? Yes.")).toBe("Is it open?");
  expect(firstSentence("No full stop")).toBe("No full stop");
  expect(find("teufelsberg").summary).toBe(
    "A Cold War listening station on a hill of wartime rubble in Berlin, now covered in street art.",
  );
  expect(find("project-riese-osowka").photo).toBeNull();
});

test("TRIP-013-R6 the från price is the cheapest timetable there plus the cheapest back", () => {
  expect(find("teufelsberg").price).toBe(780);
  const prices = cards.map((c) => c.price).filter((p) => p !== null);
  expect(Math.min(...prices)).toBe(780);
  expect(Math.max(...prices)).toBe(22680);
});

test("TRIP-013-R6 the airport is the nearest, or the gateway when no timetable goes to the nearest", async () => {
  const teufelsberg = await getCharterDestination("teufelsberg");
  expect(teufelsberg?.trip?.airport.iata).toBe("BER");
  expect(teufelsberg?.trip?.viaGateway).toBe(false);

  expect(cards.filter((c) => c.price !== null)).toHaveLength(95);
  const gateways = (await Promise.all(cards.map((c) => getCharterDestination(c.id)))).filter((d) => d?.trip?.viaGateway);
  expect(gateways).toHaveLength(24);

  const fares: Fares = { out: new Map([["GW", 100]]), back: new Map([["GW", 50]]) };
  const trip = tripTo(
    { nearest_airport: { iata: "NR", name: "Near", distance_km: 10 }, gateway_airport: { iata: "GW", name: "Gate" } },
    fares,
  );
  expect(trip).toEqual({ airport: { iata: "GW", name: "Gate" }, viaGateway: true, price: 150 });
});

test("TRIP-013-R6 and R8 a destination without timetables has no price and no airport to fly to", async () => {
  expect(find("chernobyl-pripyat").price).toBeNull();
  const chernobyl = await getCharterDestination("chernobyl-pripyat");
  expect(chernobyl?.trip).toBeNull();
  expect(chernobyl?.destination.nearest_airport).toMatchObject({ iata: "KBP", distance_km: 170 });
  expect(cards.filter((c) => c.price === null).map((c) => c.id)).toEqual(["chernobyl-pripyat"]);
  expect(await getCharterDestination("does-not-exist")).toBeNull();
});

test("TRIP-013-R7 the link back to the list keeps the search and filters", () => {
  expect(listHref({ sok: "berlin", varldsdel: "Europe", other: "x" })).toBe("/charter?sok=berlin&varldsdel=Europe");
  expect(listHref({})).toBe("/charter");
  expect(listHref({ sok: ["a", "b"] })).toBe("/charter");
});
