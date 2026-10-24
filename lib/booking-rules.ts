// Regler för att boka resan (TRIP-012), gemensamma för webbläsaren och servern:
// passagerarna, kontaktpersonen, kontrollerna och priset. Servern kontrollerar
// allt igen med samma regler och räknar priset från databasen.

import { arrival, fare, type FleetAircraft, flightMinutes, type Seating } from "./fare-rules";
import type { Flight } from "./flight-rules";
import type { Search } from "./search";
import { checkChoice, LEG_NAMES, type LegChoice, legDone, legKey } from "./trip";

// Dåliga nerver kostar 1 000 kr per passagerare och flyg (R4)
export const NERVES_PRICE = 1000;
export const NERVES = "Dåliga nerver";
// Högst så många av samma tillägg per passagerare och flyg (R3)
export const MAX_ADDONS = 10;
export const MIN_AGE = 1;
export const MAX_AGE = 120;
// Längsta tillåtna text i ett fält, så att ingen kan skicka in hur mycket som helst
export const MAX_NAME = 100;
export const MAX_ADDRESS = 200;
export const MAX_EMAIL = 254;

export type Payment = "cash" | "collect";
export const PAYMENTS: { value: Payment; label: string }[] = [
  { value: "cash", label: "Cash till piloten" },
  { value: "collect", label: "Vi hämtar pengarna hos dig" },
];

// De tre frågorna som måste kryssas i (R6)
export const QUESTIONS = [
  "Är du försäkrad?",
  "Är alla du bokar åt försäkrade???!",
  "Har du läst våra villkor? Du hittar dom någonstans på sidan.",
];

// Ett tillägg som går att köpa i en klass på ett plan
export type AddonOption = { id: number; name: string; description: string; price: number };

// Ett tillägg och var det går att köpa, som det läses från databasen
export type AddonRow = AddonOption & { aircraftId: number; classId: number };

// Det bokningen behöver veta om ett flyg: avgångens pris per person, planet,
// antalen per klass och tilläggen per klass ({ klassens id: tillägg }).
// key är legKey() i lib/trip.ts.
export type BookingLeg = {
  key: string;
  of: string; // "utresan" eller "hemresan", i meddelandena
  price: number;
  aircraft: FleetAircraft;
  seating: Seating;
  addons: Record<number, AddonOption[]>;
};

// En passagerare på ett flyg: klassen och antal av varje tillägg ({ tilläggets id: antal })
export type PassengerLeg = { classId: number; addons: Record<number, number> };

export type Passenger = {
  firstName: string;
  lastName: string;
  age: string; // "" tills en ålder valts
  nerves: boolean;
  legs: PassengerLeg[];
};

export type Contact = { firstName: string; lastName: string; email: string; phone: string; address: string };

// Allt besökaren fyller i, från resenärerna till betalningen. legKeys säger
// vilka flyg, plan och antal klasserna och tilläggen gäller (R10).
export type BookingForm = {
  requestId: string;
  legKeys: string[];
  passengers: Passenger[];
  contact: Contact;
  checks: boolean[];
  payment: Payment | null;
};

// Flygen som bokningen behöver dem, med priserna från databasen, eller null
// om något flyg inte är klart: planet finns inte längre, har inte plats eller
// alla har inte en klass (TRIP-024-R4)
export function bookingLegs(
  search: Search,
  legs: LegChoice[],
  prices: number[],
  fleet: FleetAircraft[],
  addons: AddonRow[],
): BookingLeg[] | null {
  const { travellers } = search;
  const result = legs.map((choice, i) => {
    const leg = checkChoice(choice, fleet, travellers);
    const aircraft = fleet.find((a) => a.id === leg.aircraftId);
    if (!aircraft || !leg.seating || !legDone(leg, travellers)) return null;
    const classAddons = Object.fromEntries(
      aircraft.classes.map((c) => [
        c.id,
        addons
          .filter((a) => a.aircraftId === aircraft.id && a.classId === c.id)
          .map(({ id, name, description, price }) => ({ id, name, description, price })),
      ]),
    );
    return {
      key: legKey(search, i, leg),
      of: LEG_NAMES[i].of,
      price: prices[i],
      aircraft,
      seating: leg.seating,
      addons: classAddons,
    };
  });
  return result.every((leg) => leg !== null) ? result : null;
}

const emptyPassenger = (): Passenger => ({ firstName: "", lastName: "", age: "", nerves: false, legs: [] });

export const emptyForm = (requestId: string): BookingForm => ({
  requestId,
  legKeys: [],
  passengers: [],
  contact: { firstName: "", lastName: "", email: "", phone: "", address: "" },
  checks: QUESTIONS.map(() => false),
  payment: null,
});

// Ett sparat formulär (sessionStorage), om det har formuläret form. Något
// annat (t.ex. från en äldre version av sidan) räknas som inget.
export function asForm(value: unknown): BookingForm | null {
  const form = value as BookingForm | null;
  const ok =
    typeof form === "object" &&
    form !== null &&
    typeof form.requestId === "string" &&
    Array.isArray(form.legKeys) &&
    Array.isArray(form.passengers) &&
    typeof form.contact === "object" &&
    form.contact !== null &&
    Array.isArray(form.checks);
  return ok ? form : null;
}

// Passagerarnas klasser från början: antalen från plan och klass, den dyraste
// klassen först, t.ex. 2 Business och 1 Ekonomi -> Business, Business, Ekonomi (R2)
export function firstClasses(aircraft: FleetAircraft, seating: Seating): number[] {
  return aircraft.classes
    .toSorted((a, b) => b.pricePercent - a.pricePercent || a.id - b.id)
    .flatMap((c) => Array<number>(seating[c.id] ?? 0).fill(c.id));
}

// Formuläret för resan som den ser ut nu (R10). Namn, åldrar, Dåliga nerver
// och kontaktpersonen finns kvar. Är ett flyg, dess plan eller antalen per
// klass ändrade börjar flygets klasser om och dess tillägg tas bort; de
// andra flygen ändras inte.
export function fitForm(form: BookingForm, legs: BookingLeg[], travellers: number): BookingForm {
  const classes = legs.map((leg) => firstClasses(leg.aircraft, leg.seating));
  const passengers = Array.from({ length: travellers }, (_, p) => {
    const passenger = form.passengers[p] ?? emptyPassenger();
    return {
      ...passenger,
      legs: legs.map((leg, i) =>
        form.legKeys[i] === leg.key && passenger.legs[i] ? passenger.legs[i] : { classId: classes[i][p], addons: {} },
      ),
    };
  });
  return { ...form, legKeys: legs.map((leg) => leg.key), passengers };
}

// Ny klass för en passagerare på ett flyg: tillägg som inte går att köpa i
// den nya klassen tas bort (R3)
export function changeClass(passenger: Passenger, legIndex: number, leg: BookingLeg, classId: number): Passenger {
  const allowed = new Set((leg.addons[classId] ?? []).map((a) => a.id));
  const old = passenger.legs[legIndex];
  const addons = Object.fromEntries(Object.entries(old.addons).filter(([id]) => allowed.has(Number(id))));
  return { ...passenger, legs: passenger.legs.with(legIndex, { classId, addons }) };
}

// ---------------------------------------------------------------- Priset

// Priset per person i en klass på flyget: avgångens pris × planets × klassens faktor (R8)
export function seatPrice(leg: BookingLeg, classId: number) {
  const cabinClass = leg.aircraft.classes.find((c) => c.id === classId);
  return cabinClass ? fare(leg.price, leg.aircraft.pricePercent, cabinClass.pricePercent) : 0;
}

// De valda tilläggen för en passagerare på ett flyg, med pris per styck
export function chosenAddons(leg: BookingLeg, passengerLeg: PassengerLeg) {
  return (leg.addons[passengerLeg.classId] ?? [])
    .map((addon) => ({ addon, count: passengerLeg.addons[addon.id] ?? 0 }))
    .filter(({ count }) => count > 0);
}

// En passagerares pris på ett flyg: platsen, tilläggen och Dåliga nerver (R3, R4)
export function passengerLegPrice(leg: BookingLeg, passenger: Passenger, legIndex: number) {
  const passengerLeg = passenger.legs[legIndex];
  const addons = chosenAddons(leg, passengerLeg).reduce((sum, { addon, count }) => sum + addon.price * count, 0);
  return seatPrice(leg, passengerLeg.classId) + addons + (passenger.nerves ? NERVES_PRICE : 0);
}

// Priset för hela resan, som räknas om direkt när något väljs (R1)
export const bookingTotal = (form: BookingForm, legs: BookingLeg[]) =>
  form.passengers.reduce(
    (sum, passenger) => sum + legs.reduce((s, leg, i) => s + passengerLegPrice(leg, passenger, i), 0),
    0,
  );

// ---------------------------------------------------------------- Kontroller

// Fel per fält: { fältets id: vad besökaren ska göra }. Id:t är också fältets id på sidan.
export type Problems = Record<string, string>;

export const fieldIds = {
  firstName: (p: number) => `p${p}-fornamn`,
  lastName: (p: number) => `p${p}-efternamn`,
  age: (p: number) => `p${p}-alder`,
  classes: (legIndex: number) => `klasser-${legIndex}`,
  contact: (field: keyof Contact) => `kontakt-${field}`,
  question: (i: number) => `fraga-${i}`,
  payment: "betalning",
};

export const isEmail = (text: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.trim());
// Siffror, mellanslag, bindestreck och ett inledande +, minst 7 siffror (R5)
export const isPhone = (text: string) => /^\+?[\d\s-]+$/.test(text.trim()) && text.replace(/\D/g, "").length >= 7;

function textProblem(text: string, max: number, missing: string) {
  if (text.trim() === "") return missing;
  if (text.length > max) return `Högst ${max} tecken.`;
  return null;
}

// Stämmer antalen per klass på ett flyg med plan och klass? Annars vad som är fel (R2)
function classProblem(form: BookingForm, leg: BookingLeg, legIndex: number) {
  for (const c of leg.aircraft.classes) {
    const wanted = leg.seating[c.id] ?? 0;
    const has = form.passengers.filter((p) => p.legs[legIndex]?.classId === c.id).length;
    if (has !== wanted) {
      return `På ${leg.of} ska ${wanted} sitta i ${c.name}, men ${has} gör det. Byt klass för någon passagerare.`;
    }
  }
  return null;
}

// Det som måste stämma för att gå vidare till betalningen (R2, R5, R6)
export function travellerProblems(form: BookingForm, legs: BookingLeg[]): Problems {
  const problems: Problems = {};
  const add = (id: string, problem: string | null) => {
    if (problem) problems[id] = problem;
  };
  form.passengers.forEach((p, i) => {
    add(fieldIds.firstName(i), textProblem(p.firstName, MAX_NAME, "Skriv passagerarens förnamn."));
    add(fieldIds.lastName(i), textProblem(p.lastName, MAX_NAME, "Skriv passagerarens efternamn."));
    add(fieldIds.age(i), isAge(p.age) ? null : "Välj passagerarens ålder.");
  });
  legs.forEach((leg, i) => add(fieldIds.classes(i), classProblem(form, leg, i)));

  const { contact } = form;
  add(fieldIds.contact("firstName"), textProblem(contact.firstName, MAX_NAME, "Skriv ditt förnamn."));
  add(fieldIds.contact("lastName"), textProblem(contact.lastName, MAX_NAME, "Skriv ditt efternamn."));
  add(
    fieldIds.contact("email"),
    textProblem(contact.email, MAX_EMAIL, "Skriv din e-postadress.") ??
      (isEmail(contact.email) ? null : "Skriv en hel e-postadress, t.ex. anna@exempel.se."),
  );
  add(
    fieldIds.contact("phone"),
    textProblem(contact.phone, MAX_NAME, "Skriv ditt telefonnummer.") ??
      (isPhone(contact.phone) ? null : "Skriv ett telefonnummer med minst 7 siffror, t.ex. 070-123 45 67."),
  );
  add(fieldIds.contact("address"), textProblem(contact.address, MAX_ADDRESS, "Skriv din adress."));

  QUESTIONS.forEach((_, i) => add(fieldIds.question(i), form.checks[i] ? null : "Kryssa i rutan för att gå vidare."));
  return problems;
}

// Det som måste stämma för att betala (R7)
export function paymentProblems(form: BookingForm): Problems {
  return form.payment ? {} : { [fieldIds.payment]: "Välj hur du vill betala." };
}

const isAge = (age: string) => /^\d+$/.test(age) && Number(age) >= MIN_AGE && Number(age) <= MAX_AGE;

// Har formuläret rätt form för resan? Servern kontrollerar det innan något
// annat, eftersom vad som helst kan skickas till den: rätt antal passagerare
// och flyg, klasser som finns på planet, och bara tillägg som går att köpa i
// passagerarens klass, högst 10 av varje (R3, R8).
export function fitsTrip(form: BookingForm, legs: BookingLeg[], travellers: number) {
  const text = (value: unknown) => typeof value === "string";
  if (typeof form !== "object" || form === null) return false;
  const { contact } = form;
  return (
    text(form.requestId) &&
    /^[\w-]{8,64}$/.test(form.requestId) &&
    Array.isArray(form.passengers) &&
    form.passengers.length === travellers &&
    form.passengers.every(
      (p) =>
        text(p.firstName) &&
        text(p.lastName) &&
        text(p.age) &&
        typeof p.nerves === "boolean" &&
        Array.isArray(p.legs) &&
        p.legs.length === legs.length &&
        legs.every((leg, i) => fitsLeg(leg, p.legs[i])),
    ) &&
    [contact?.firstName, contact?.lastName, contact?.email, contact?.phone, contact?.address].every(text) &&
    Array.isArray(form.checks) &&
    form.checks.every((c) => typeof c === "boolean") &&
    (form.payment === null || PAYMENTS.some((p) => p.value === form.payment))
  );
}

function fitsLeg(leg: BookingLeg, passengerLeg: PassengerLeg | undefined) {
  if (!passengerLeg || !leg.aircraft.classes.some((c) => c.id === passengerLeg.classId)) return false;
  if (typeof passengerLeg.addons !== "object" || passengerLeg.addons === null) return false;
  const allowed = leg.addons[passengerLeg.classId] ?? [];
  return Object.entries(passengerLeg.addons).every(
    ([id, count]) =>
      allowed.some((a) => a.id === Number(id)) && Number.isInteger(count) && count >= 0 && count <= MAX_ADDONS,
  );
}

// ---------------------------------------------------------------- Sammanfattningen

// Det som visas direkt efter bokningen (R9)
export type BookingSummary = {
  bookingNumber: string;
  legs: { title: string; flight: Flight; aircraft: string; minutes: number; arrival: { time: string; days: number } }[];
  passengers: {
    name: string;
    age: string;
    legs: { className: string; addons: { name: string; count: number }[] }[];
  }[];
  contact: Contact;
  payment: string;
  total: number;
};

export function bookingSummary(
  bookingNumber: string,
  form: BookingForm,
  legs: BookingLeg[],
  flights: Flight[],
): BookingSummary {
  return {
    bookingNumber,
    legs: legs.map((leg, i) => {
      const minutes = flightMinutes(flights[i].routeMinutes, leg.aircraft.timePercent);
      return {
        title: LEG_NAMES[i].title,
        flight: flights[i],
        aircraft: leg.aircraft.name,
        minutes,
        arrival: arrival(flights[i], minutes),
      };
    }),
    passengers: form.passengers.map((p) => ({
      name: `${p.firstName.trim()} ${p.lastName.trim()}`,
      age: p.age,
      legs: legs.map((leg, i) => ({
        className: leg.aircraft.classes.find((c) => c.id === p.legs[i].classId)?.name ?? "",
        addons: [
          ...chosenAddons(leg, p.legs[i]).map(({ addon, count }) => ({ name: addon.name, count })),
          ...(p.nerves ? [{ name: NERVES, count: 1 }] : []),
        ],
      })),
    })),
    contact: form.contact,
    payment: PAYMENTS.find((p) => p.value === form.payment)?.label ?? "",
    total: bookingTotal(form, legs),
  };
}
