// Charterresmålen i listan och på sidorna: sökning, filter, adress, pris och
// flygplats (TRIP-013). Ren logik utan databas, så att både servern och
// webbläsaren kan använda den. Databasen läses i lib/travel.ts.
import type { Destination } from "./travel";
import { ACCESS_NAMES, CATEGORY_NAMES, CONTINENT_NAMES, countryName, swedishName } from "./destination-names";

// Charterresorna startar från Stockholm Arlanda och Köpenhamn
export const DEPARTURE_AIRPORTS = ["ARN", "CPH"];

// Texten när det inte finns några flyg (TRIP-013-R8). Den gäller varje resmål
// utan tidtabeller, inte ett visst resmål.
export const NO_FLIGHTS_TEXT = "Inga flyg dit just nu, luftrummet är stängt. Du får ta dig dit på egen hand.";

// Antarktis har inget land att välja: dess resmål listas direkt (TRIP-013-R2, R3)
const CONTINENT_WITHOUT_COUNTRIES = "Antarctica";

// Det ett resmål i en lista behöver. Beskrivningen är bara första meningen
// och priset är null när det inte finns några flyg dit.
export type DestinationCard = {
  id: string;
  title: string;
  aliases: string[];
  locality: string;
  region: string;
  country: string;
  countryNameEn: string;
  continent: string;
  category: string;
  access: string;
  tags: string[];
  summary: string;
  photo: string | null;
  price: number | null;
};

// Billigaste pris per flygplats: dit från Arlanda eller Köpenhamn, och hem dit
export type Fares = { out: Map<string, number>; back: Map<string, number> };

// Flygplatsen besökaren flyger till och priset för en tur och retur per person.
// Närmaste flygplatsen om det går flyg dit från Arlanda eller Köpenhamn, annars
// porten (gateway). Går det inga flyg dit alls är resultatet null (TRIP-013-R6).
export type Trip = { airport: { iata: string; name: string }; viaGateway: boolean; price: number };

// Pick: det räcker med resmålets flygplatser, så att testerna kan ge ett litet objekt
export function tripTo(d: Pick<Destination, "nearest_airport" | "gateway_airport">, fares: Fares): Trip | null {
  const options = [
    { airport: d.nearest_airport, viaGateway: false },
    ...(d.gateway_airport ? [{ airport: d.gateway_airport, viaGateway: true }] : []),
  ];
  for (const { airport, viaGateway } of options) {
    const out = fares.out.get(airport.iata);
    const back = fares.back.get(airport.iata);
    if (out !== undefined && back !== undefined) {
      return { airport: { iata: airport.iata, name: airport.name }, viaGateway, price: out + back };
    }
  }
  return null;
}

// Första meningen: till och med första punkten, frågetecknet eller
// utropstecknet som följs av ett mellanslag eller slutet
export function firstSentence(text: string) {
  return text.match(/^[\s\S]*?[.!?](?=\s|$)/)?.[0] ?? text;
}

export function toCard(d: Destination, trip: Trip | null): DestinationCard {
  return {
    id: d.id,
    title: d.title,
    aliases: d.aliases,
    locality: d.locality,
    region: d.region,
    country: d.country,
    countryNameEn: d.country_name,
    continent: d.continent,
    category: d.category,
    access: d.access,
    tags: d.tags,
    summary: firstSentence(d.description),
    photo: d.image?.src ?? null,
    price: trip?.price ?? null,
  };
}

// Sökningen och filtren, och deras adress (TRIP-013-R2)
export type Filters = {
  q: string;
  continent: string | null;
  country: string | null;
  access: string | null;
  category: string | null;
};

export const NO_FILTERS: Filters = { q: "", continent: null, country: null, access: null, category: null };

export type FilterKey = Exclude<keyof Filters, "q">;

// Parametrarnas namn i adressen, t.ex. /charter?sok=berlin&varldsdel=Europe
const PARAM_NAMES: Record<keyof Filters, string> = {
  q: "sok",
  continent: "varldsdel",
  country: "land",
  access: "tillgang",
  category: "kategori",
};

export function filtersToParams(filters: Filters) {
  const params = new URLSearchParams();
  for (const key of Object.keys(PARAM_NAMES) as (keyof Filters)[]) {
    const value = filters[key];
    if (value) params.set(PARAM_NAMES[key], value);
  }
  return params;
}

export const hasFilters = (filters: Filters) => filtersToParams(filters).size > 0;

// Adressen är aldrig att lita på: ett värde som inget resmål har ignoreras
export function parseFilters(params: URLSearchParams, cards: DestinationCard[]): Filters {
  const known = (key: FilterKey) => new Set(cards.map((card) => card[key]));
  const read = (key: FilterKey) => {
    const value = params.get(PARAM_NAMES[key]);
    return value !== null && known(key).has(value) ? value : null;
  };
  return {
    q: params.get(PARAM_NAMES.q)?.trim() ?? "",
    continent: read("continent"),
    country: read("country"),
    access: read("access"),
    category: read("category"),
  };
}

// Sökning utan hänsyn till versaler och accenter ("osowka" hittar "Osówka")
const fold = (text: string) => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

// Allt en sökning letar i: titel, andra namn, plats, region, landet på svenska
// och engelska, och taggar
const searchText = (card: DestinationCard) =>
  fold(
    [card.title, ...card.aliases, card.locality, card.region, countryName(card.country), card.countryNameEn, ...card.tags]
      .join("\n"),
  );

// Varje ord i söktexten ska finnas någonstans i texten
export function matchesSearch(card: DestinationCard, q: string) {
  const words = fold(q).split(/\s+/).filter(Boolean);
  const text = searchText(card);
  return words.every((word) => text.includes(word));
}

// Resmålen som söktexten och filtren ger. "except" lämnar ett filter utanför,
// för att räkna vad varje val i det filtret skulle ge.
export function applyFilters(cards: DestinationCard[], filters: Filters, except?: FilterKey) {
  return cards.filter(
    (card) =>
      matchesSearch(card, filters.q) &&
      (["continent", "country", "access", "category"] as const).every(
        (key) => key === except || filters[key] === null || card[key] === filters[key],
      ),
  );
}

// Antal resmål per val i ett filter, tillsammans med övriga filter och sökningen
export function facetCounts(cards: DestinationCard[], filters: Filters, key: FilterKey) {
  const counts = new Map<string, number>();
  for (const card of applyFilters(cards, filters, key)) counts.set(card[key], (counts.get(card[key]) ?? 0) + 1);
  return counts;
}

// Länderna under Land: bara de som har resmål i vald världsdel (alla länder
// när ingen världsdel är vald, och för Antarktis som inte har några länder)
function countriesToChoose(cards: DestinationCard[], continent: string | null) {
  const inContinent =
    continent && continent !== CONTINENT_WITHOUT_COUNTRIES ? cards.filter((c) => c.continent === continent) : cards;
  return [...new Set(inContinent.map((card) => card.country))];
}

const NAMES: Record<FilterKey, (value: string) => string> = {
  continent: (value) => swedishName(CONTINENT_NAMES, value),
  country: countryName,
  access: (value) => swedishName(ACCESS_NAMES, value),
  category: (value) => swedishName(CATEGORY_NAMES, value),
};

// Valen i ett filter med antal, i namnordning (TRIP-013-R2). Det valda valet
// finns alltid med, också när det inte ger något.
export function filterOptions(cards: DestinationCard[], filters: Filters, key: FilterKey) {
  const counts = facetCounts(cards, filters, key);
  const values = key === "country" ? countriesToChoose(cards, filters.continent) : cards.map((card) => card[key]);
  const selected = filters[key];
  return [...new Set(selected ? [...values, selected] : values)]
    .map((value) => ({ value, name: NAMES[key](value), count: counts.get(value) ?? 0 }))
    .toSorted((a, b) => bySwedish(a.name, b.name));
}

const bySwedish = (a: string, b: string) => a.localeCompare(b, "sv");

// Förslagen i sökfältet: resmål vars titel börjar med söktexten först
export function suggestDestinations(cards: DestinationCard[], q: string, limit = 5) {
  const start = fold(q.trim());
  return cards
    .filter((card) => matchesSearch(card, q))
    .toSorted((a, b) => Number(fold(b.title).startsWith(start)) - Number(fold(a.title).startsWith(start)))
    .slice(0, limit);
}

// Länken tillbaka till listan från ett resmåls sida: sökningen och filtren i
// adressen följer med, och bara de (TRIP-013-R7)
export function listHref(params: Record<string, string | string[] | undefined>) {
  const kept = new URLSearchParams();
  for (const name of Object.values(PARAM_NAMES)) {
    const value = params[name];
    if (typeof value === "string" && value !== "") kept.set(name, value);
  }
  return kept.size > 0 ? `/charter?${kept}` : "/charter";
}
