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

// Sökningen och filtren, och deras adress (TRIP-013-R2). Ett filter har inga,
// ett eller flera val (TRIP-034-R2): "något av" inom ett filter, "alla" mellan filter.
export type Filters = {
  q: string;
  continent: string[];
  country: string[];
  access: string[];
  category: string[];
};

export const NO_FILTERS: Filters = { q: "", continent: [], country: [], access: [], category: [] };

export type FilterKey = Exclude<keyof Filters, "q">;

const FILTER_KEYS: FilterKey[] = ["continent", "country", "access", "category"];

// Parametrarnas namn i adressen, t.ex. /charter?sok=berlin&varldsdel=Europe&varldsdel=Asia
const PARAM_NAMES: Record<keyof Filters, string> = {
  q: "sok",
  continent: "varldsdel",
  country: "land",
  access: "tillgang",
  category: "kategori",
};

export function filtersToParams(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.q) params.set(PARAM_NAMES.q, filters.q);
  for (const key of FILTER_KEYS) for (const value of filters[key]) params.append(PARAM_NAMES[key], value);
  return params;
}

export const hasFilters = (filters: Filters) => filtersToParams(filters).size > 0;

// Adressen är aldrig att lita på: ett värde som inget resmål har ignoreras
export function parseFilters(params: URLSearchParams, cards: DestinationCard[]): Filters {
  const known = (key: FilterKey) => new Set(cards.map((card) => card[key]));
  const read = (key: FilterKey) => [...new Set(params.getAll(PARAM_NAMES[key]))].filter((value) => known(key).has(value));
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
      FILTER_KEYS.every((key) => key === except || filters[key].length === 0 || filters[key].includes(card[key])),
  );
}

// Antal resmål per val i ett filter, tillsammans med övriga filter och sökningen
export function facetCounts(cards: DestinationCard[], filters: Filters, key: FilterKey) {
  const counts = new Map<string, number>();
  for (const card of applyFilters(cards, filters, key)) counts.set(card[key], (counts.get(card[key]) ?? 0) + 1);
  return counts;
}

// Länderna under Land: bara de som har resmål i valda världsdelar (alla länder
// när ingen världsdel är vald, och när bara Antarktis är vald, som inte har några länder)
function countriesToChoose(cards: DestinationCard[], continents: string[]) {
  const withCountries = continents.filter((continent) => continent !== CONTINENT_WITHOUT_COUNTRIES);
  const inContinents = withCountries.length > 0 ? cards.filter((c) => withCountries.includes(c.continent)) : cards;
  return [...new Set(inContinents.map((card) => card.country))];
}

// Filtren när besökaren ändrar valen i ett filter. Ett land som inte hör till de
// valda världsdelarna väljs bort, de övriga valen står kvar (TRIP-034-R4).
export function withChoices(cards: DestinationCard[], filters: Filters, key: FilterKey, values: string[]): Filters {
  const next = { ...filters, [key]: values };
  if (key === "continent") {
    const countries = countriesToChoose(cards, values);
    next.country = filters.country.filter((country) => countries.includes(country));
  }
  return next;
}

const NAMES: Record<FilterKey, (value: string) => string> = {
  continent: (value) => swedishName(CONTINENT_NAMES, value),
  country: countryName,
  access: (value) => swedishName(ACCESS_NAMES, value),
  category: (value) => swedishName(CATEGORY_NAMES, value),
};

// Valen i ett filter med antal, i namnordning (TRIP-013-R2). Bara val som ger
// minst ett resmål visas (TRIP-034-R4), och de valda finns alltid med, också
// när de inte ger något, så att de går att välja bort.
export function filterOptions(cards: DestinationCard[], filters: Filters, key: FilterKey) {
  const counts = facetCounts(cards, filters, key);
  const values = key === "country" ? countriesToChoose(cards, filters.continent) : cards.map((card) => card[key]);
  return [...new Set([...values, ...filters[key]])]
    .filter((value) => counts.has(value) || filters[key].includes(value))
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
// adressen följer med, och bara de (TRIP-013-R7). Ett filter kan ha flera värden.
export function listHref(params: Record<string, string | string[] | undefined>) {
  const kept = new URLSearchParams();
  for (const [key, name] of Object.entries(PARAM_NAMES)) {
    // Söktexten är en enda text, filtren kan vara flera
    const values = key === "q" ? [params[name]].filter((v) => typeof v === "string") : [params[name]].flat();
    for (const value of values) if (value) kept.append(name, value);
  }
  return kept.size > 0 ? `/charter?${kept}` : "/charter";
}
