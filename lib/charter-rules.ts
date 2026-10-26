// Regler för charterbokningen (TRIP-014), gemensamma för webbläsaren och
// servern: sökningen och dess adress, vilka resor som går, ankomsten, tilläggen
// för hela bokningen och priset. Servern kontrollerar allt igen med samma
// regler och räknar priset från databasen.

import {
  ADULT_AGE,
  collectProblems,
  type Contact,
  contactProblems,
  fitsForm,
  fitsPerson,
  isAge,
  type Payment,
  PAYMENTS,
  type Person,
  passengerProblems,
  type Problems,
  QUESTIONS,
} from "./booking-rules";
import { arrival, instant } from "./fare-rules";
import { DEPARTURE_AIRPORTS } from "./destinations";
import { isDate, MAX_TRAVELLERS, MIN_TRAVELLERS, type Params } from "./search";

export const CHARTER_PATH = "/charter";
export const CHARTER_BOOKED_PATH = "/charter/bokad";

// Utresan först, sedan hemresan
export const TRIP_NAMES = [
  { title: "Utresa", of: "utresan" },
  { title: "Hemresa", of: "hemresan" },
];

// Flygplatserna man kan resa från (TRIP-014-R1)
export const DEPARTURES = [
  { iata: DEPARTURE_AIRPORTS[0], name: "Stockholm Arlanda" },
  { iata: DEPARTURE_AIRPORTS[1], name: "Köpenhamn Kastrup" },
];

// ---------------------------------------------------------------- Sökningen

// Man reser tur och retur från en flygplats och tillbaka till den. Datumen är "YYYY-MM-DD".
export type CharterSearch = { from: string; outbound: string; return: string; travellers: number };

// De valda resorna: tidtabellernas id. null = inte valt än.
export type CharterChoice = { out: string | null; back: string | null };

export const NO_CHOICE: CharterChoice = { out: null, back: null };

// Sökningen och valen som parametrar i en adress, t.ex.
// /charter/teufelsberg/resor?fran=ARN&utresa=2027-01-11&hemresa=2027-01-16&resenarer=2&ut=ARN-BER-EW488
export function charterParams(search: CharterSearch, choice: CharterChoice = NO_CHOICE) {
  const params = new URLSearchParams({
    fran: search.from,
    utresa: search.outbound,
    hemresa: search.return,
    resenarer: String(search.travellers),
  });
  if (choice.out) params.set("ut", choice.out);
  if (choice.back) params.set("hem", choice.back);
  return params;
}

// Sidorna i flödet: resorna, resenärerna och betalningen
export const resultsUrl = (id: string, search: CharterSearch, choice?: CharterChoice) =>
  `${CHARTER_PATH}/${id}/resor?${charterParams(search, choice)}`;
export const travellersUrl = (id: string, search: CharterSearch, choice?: CharterChoice) =>
  `${CHARTER_PATH}/${id}/boka?${charterParams(search, choice)}`;
export const paymentUrl = (id: string, search: CharterSearch, choice?: CharterChoice) =>
  `${CHARTER_PATH}/${id}/boka/betala?${charterParams(search, choice)}`;

// Sökningen i adressen, eller null om något saknas eller är fel. Att datumen
// går att boka och att resor går då avgör sidan.
export function parseCharterSearch(params: Params): CharterSearch | null {
  const text = (name: string) => (typeof params[name] === "string" ? params[name] : undefined);
  const [from, outbound, back, travellers] = ["fran", "utresa", "hemresa", "resenarer"].map(text);
  if (!from || !DEPARTURE_AIRPORTS.includes(from)) return null;
  if (!outbound || !isDate(outbound) || !back || !isDate(back) || back < outbound) return null;
  const count = Number(travellers);
  if (!travellers || !Number.isInteger(count) || count < MIN_TRAVELLERS || count > MAX_TRAVELLERS) return null;
  return { from, outbound, return: back, travellers: count };
}

// De valda resorna i adressen. Att de finns och passar avgör sidan.
export function parseChoice(params: Params): CharterChoice {
  const text = (name: string) => (typeof params[name] === "string" ? params[name] : null);
  return { out: text("ut"), back: text("hem") };
}

// ---------------------------------------------------------------- Resorna

export type Place = { iata: string; city: string; timezone: string };

// En tidtabell: en resa mellan två flygplatser på vissa veckodagar under en period
export type Timetable = {
  id: string;
  airline: string;
  flights: string[];
  from: Place;
  to: Place;
  stops: Place[];
  validFrom: string;
  validTo: string;
  days: string[];
  departs: string;
  minutes: number;
  price: number;
};

// Den del av en tidtabell som avgör vilka dagar den går
export type Schedule = Pick<Timetable, "validFrom" | "validTo" | "days">;

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function weekdayOf(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

// Går tidtabellen den här dagen: inom perioden och på en av veckodagarna (R2)
export const runsOn = (t: Schedule, date: string) =>
  date >= t.validFrom && date <= t.validTo && t.days.includes(weekdayOf(date));

// En resa en viss dag, som den visas och jämförs. Ankomsten räknas från avgången
// och restiden i ankomstflygplatsens tidszon, aldrig från kursdatans "arrives" (R4).
export type CharterTrip = {
  id: string;
  airline: string;
  flights: string[];
  date: string;
  time: string;
  minutes: number;
  price: number;
  from: Place;
  to: Place;
  stops: string[]; // städerna man byter i, i ordning
  arrival: { time: string; days: number };
  departsAt: number; // millisekunder sedan 1970
  arrivesAt: number;
};

export function makeTrip(t: Timetable, date: string): CharterTrip {
  const departsAt = instant(date, t.departs, t.from.timezone);
  return {
    id: t.id,
    airline: t.airline,
    flights: t.flights,
    date,
    time: t.departs,
    minutes: t.minutes,
    price: t.price,
    from: t.from,
    to: t.to,
    stops: t.stops.map((s) => s.city),
    arrival: arrival({ date, time: t.departs, from: t.from, to: t.to }, t.minutes),
    departsAt,
    arrivesAt: departsAt + t.minutes * 60_000,
  };
}

// "Direkt", "1 byte i Frankfurt", "2 byten i Frankfurt och Wien"
export function stopsText(stops: string[]) {
  if (stops.length === 0) return "Direkt";
  const cities = new Intl.ListFormat("sv", { style: "long", type: "conjunction" }).format(stops);
  return `${stops.length} ${stops.length === 1 ? "byte" : "byten"} i ${cities}`;
}

export type SortBy = "time" | "price";

// Tidigast först, eller billigast först (samma pris: tidigast först) (R3)
export function sortTrips(trips: CharterTrip[], by: SortBy) {
  return trips.toSorted((a, b) => (by === "price" && a.price - b.price) || a.time.localeCompare(b.time));
}

// Hemresorna som går efter att utresan har landat, samma dag eller en senare (R3)
export const tripsAfter = (back: CharterTrip[], outbound: CharterTrip | undefined) =>
  outbound ? back.filter((t) => t.departsAt > outbound.arrivesAt) : back;

// Det valda ut- och hemresan som finns i listorna, och hemresan bara om den passar utresan (R5)
export function chosenTrips(choice: CharterChoice, out: CharterTrip[], back: CharterTrip[]) {
  const outbound = out.find((t) => t.id === choice.out);
  const home = outbound ? tripsAfter(back, outbound).find((t) => t.id === choice.back) : undefined;
  return { outbound, home };
}

// ---------------------------------------------------------------- Tilläggen

export const MINOR_TEXT = "Går inte att välja när någon resenär är under 18 år";

// Tilläggen för hela bokningen, definierade här och inte i databasen eller admin (R7).
// Priset är per person och gäller alla resenärer.
export const EXTRAS = [
  {
    code: "ultimate",
    name: "Den ultimata upplevelsen",
    description: "Vår guide förbereder något extraordinärt till din resa.",
    price: 1000,
    adultsOnly: false,
  },
  {
    code: "grylls",
    name: "Bear Grylls Experience",
    description:
      "Utan guide. Du blir lämnad i vildmarken på väg till destinationen och får själv hitta dit – på egen risk! 2 000 kr per person för extra försäkring.",
    price: 2000,
    adultsOnly: false,
  },
  {
    code: "drinks",
    name: "Dryckespaket XXXL",
    description: "Dryck så det räcker hela resan.",
    price: 4000,
    adultsOnly: true,
  },
];

export const extraByCode = (code: string) => EXTRAS.find((e) => e.code === code);

// Är någon resenär under 18? En ålder som inte valts än räknas inte.
export const anyMinor = (passengers: Pick<Person, "age">[]) =>
  passengers.some((p) => isAge(p.age) && Number(p.age) < ADULT_AGE);

// De valda tilläggen med summan för alla resenärer, i den ordning de har i listan
export function extraRows(codes: string[], travellers: number) {
  return EXTRAS.filter((e) => codes.includes(e.code)).map((e) => ({
    code: e.code,
    name: e.name,
    price: e.price,
    sum: e.price * travellers,
  }));
}

// Priset för hela resan: ut- och hemresan per person, och tilläggen per person (R5, R7)
export function charterTotal(tripPrices: number[], extras: string[], travellers: number) {
  const perPerson = tripPrices.reduce((sum, p) => sum + p, 0) + extraRows(extras, 1).reduce((s, e) => s + e.sum, 0);
  return perPerson * travellers;
}

// ---------------------------------------------------------------- Formuläret

// Allt besökaren fyller i, från resenärerna till betalningen (R6). Tilläggen är koderna ur EXTRAS.
export type CharterForm = {
  requestId: string;
  passengers: Person[];
  contact: Contact;
  checks: boolean[];
  extras: string[];
  payment: Payment | null;
};

export const emptyCharterForm = (requestId: string): CharterForm => ({
  requestId,
  passengers: [],
  contact: { firstName: "", lastName: "", email: "", phone: "", address: "" },
  checks: QUESTIONS.map(() => false),
  extras: [],
  payment: null,
});

export function asCharterForm(value: unknown): CharterForm | null {
  const form = value as CharterForm | null;
  const ok =
    typeof form === "object" &&
    form !== null &&
    typeof form.requestId === "string" &&
    Array.isArray(form.passengers) &&
    Array.isArray(form.extras) &&
    typeof form.contact === "object" &&
    form.contact !== null &&
    Array.isArray(form.checks);
  return ok ? form : null;
}

// Formuläret för resan som den ser ut nu: ett ändrat antal resenärer lägger till
// eller tar bort resenärer och resten finns kvar (R6). Ett tillägg som inte går
// att välja med de resenärerna tas bort (R7).
export function fitCharterForm(form: CharterForm, travellers: number): CharterForm {
  const passengers = Array.from({ length: travellers }, (_, i) => form.passengers[i] ?? emptyPerson());
  return { ...form, passengers, extras: withoutUnavailable(form.extras, passengers) };
}

// Tilläggen som går att ha när de här resenärerna reser: vuxentilläggen försvinner om någon är under 18
export const withoutUnavailable = (extras: string[], passengers: Pick<Person, "age">[]) =>
  anyMinor(passengers) ? extras.filter((code) => !extraByCode(code)?.adultsOnly) : extras;

const emptyPerson = (): Person => ({ firstName: "", lastName: "", age: "" });

// Det som måste stämma för att gå vidare till betalningen (R6)
export function charterProblems(form: CharterForm): Problems {
  return collectProblems((add) => {
    passengerProblems(form.passengers, add);
    contactProblems(form.contact, form.checks, add);
  });
}

// Är tilläggen tillåtna? Annars varför inte. Servern kontrollerar det, inte bara sidan (R7).
export function extrasProblem(form: { extras: string[]; passengers: Pick<Person, "age">[] }) {
  if (!form.extras.every((code) => typeof code === "string" && extraByCode(code))) return "Okänt tillägg.";
  if (new Set(form.extras).size !== form.extras.length) return "Samma tillägg flera gånger.";
  const drinks = EXTRAS.find((e) => e.adultsOnly);
  if (drinks && form.extras.includes(drinks.code) && anyMinor(form.passengers)) return MINOR_TEXT;
  return null;
}

// Har formuläret rätt form för resan? Servern kontrollerar det innan något
// annat, eftersom vad som helst kan skickas till den (R8).
export function fitsCharterForm(form: CharterForm, travellers: number) {
  return (
    fitsForm(form) &&
    Array.isArray(form.passengers) &&
    form.passengers.length === travellers &&
    form.passengers.every(fitsPerson) &&
    Array.isArray(form.extras) &&
    form.extras.every((code) => typeof code === "string")
  );
}

// ---------------------------------------------------------------- Sammanfattningen

// Det som visas direkt efter bokningen (R9)
export type CharterSummary = {
  bookingNumber: string;
  destination: string;
  trips: { title: string; trip: CharterTrip }[];
  passengers: { name: string; age: string }[];
  extras: { name: string; sum: number }[];
  contact: Contact;
  payment: string;
  total: number;
};

export function charterSummary(
  bookingNumber: string,
  destination: string,
  form: CharterForm,
  trips: CharterTrip[],
): CharterSummary {
  return {
    bookingNumber,
    destination,
    trips: trips.map((trip, i) => ({ title: TRIP_NAMES[i].title, trip })),
    passengers: form.passengers.map((p) => ({ name: `${p.firstName.trim()} ${p.lastName.trim()}`, age: p.age })),
    extras: extraRows(form.extras, form.passengers.length).map(({ name, sum }) => ({ name, sum })),
    contact: form.contact,
    payment: PAYMENTS.find((p) => p.value === form.payment)?.label ?? "",
    total: charterTotal(
      trips.map((t) => t.price),
      form.extras,
      form.passengers.length,
    ),
  };
}
