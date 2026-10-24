import { expect, test } from "vitest";
import {
  asForm,
  type BookingForm,
  type BookingLeg,
  bookingLegs,
  bookingSummary,
  bookingTotal,
  changeClass,
  emptyForm,
  firstClasses,
  fitForm,
  fitsTrip,
  isEmail,
  isPhone,
  NERVES_PRICE,
  paymentProblems,
  travellerProblems,
} from "./booking-rules";
import type { FleetAircraft } from "./fare-rules";
import type { Flight } from "./flight-rules";
import { legKey } from "./trip";

const ECONOMY = { id: 1, name: "Ekonomi", capacity: 10, pricePercent: 100 };
const BUSINESS = { id: 2, name: "Business", capacity: 4, pricePercent: 150 };
const PLANE: FleetAircraft = { id: 7, name: "Hindenburg", pricePercent: 120, timePercent: 400, classes: [ECONOMY, BUSINESS] };
const MEAL = { id: 11, name: "Måltid", description: "Varm mat", price: 120 };
const BAG = { id: 12, name: "Extra bagage", description: "En väska till", price: 300 };
const LOUNGE = { id: 13, name: "Lounge", description: "Bara Business", price: 500 };

// 2 i Business och 1 i Ekonomi, Måltid och Extra bagage i båda klasserna, Lounge bara i Business
const SEARCH = { from: "ARN", to: "LHR", outbound: "2026-11-13", return: "2026-11-20", travellers: 3 };
const outbound = { time: "07:20", aircraftId: 7, seating: { 1: 1, 2: 2 } };
const leg = (choice = outbound, of = "utresan", price = 1000, search = SEARCH): BookingLeg => ({
  key: legKey(search, of === "utresan" ? 0 : 1, choice),
  of,
  price,
  aircraft: PLANE,
  seating: choice.seating,
  addons: { 1: [MEAL, BAG], 2: [MEAL, BAG, LOUNGE] },
});
const LEGS = [leg()];

// Ett ifyllt formulär för tre resenärer
function filled(legs = LEGS): BookingForm {
  const form = fitForm(emptyForm("abc-123-def"), legs, 3);
  return {
    ...form,
    passengers: form.passengers.map((p, i) => ({ ...p, firstName: `Anna ${i}`, lastName: "Ek", age: "34" })),
    contact: { firstName: "Anna", lastName: "Ek", email: "anna@exempel.se", phone: "070-123 45 67", address: "Gatan 1, Byn" },
    checks: [true, true, true],
    payment: "cash",
  };
}

test("TRIP-012-R2 the passengers start in the chosen numbers, the most expensive class first", () => {
  expect(firstClasses(PLANE, { 1: 1, 2: 2 })).toEqual([2, 2, 1]);
  const form = fitForm(emptyForm(""), LEGS, 3);
  expect(form.passengers.map((p) => p.legs[0].classId)).toEqual([2, 2, 1]);
  expect(form.passengers.map((p) => p.legs[0].addons)).toEqual([{}, {}, {}]);
});

test("TRIP-012-R2 the numbers per class must match the chosen ones, also after a swap", () => {
  const form = filled();
  expect(travellerProblems(form, LEGS)).toEqual({});

  // Passagerare 1 till Ekonomi: 1 i Business och 2 i Ekonomi
  const one = { ...form, passengers: form.passengers.with(0, changeClass(form.passengers[0], 0, LEGS[0], 1)) };
  expect(travellerProblems(one, LEGS)).toEqual({
    "klasser-0": "På utresan ska 1 sitta i Ekonomi, men 2 gör det. Byt klass för någon passagerare.",
  });

  // Och Passagerare 3 till Business: bytt plats, och antalen stämmer igen
  const swapped = { ...one, passengers: one.passengers.with(2, changeClass(one.passengers[2], 0, LEGS[0], 2)) };
  expect(travellerProblems(swapped, LEGS)).toEqual({});
});

test("TRIP-012-R2 a passenger needs a first name, a last name and an age", () => {
  const form = filled();
  const missing = { ...form, passengers: form.passengers.with(1, { ...form.passengers[1], lastName: " ", age: "" }) };
  expect(travellerProblems(missing, LEGS)).toEqual({
    "p1-efternamn": "Skriv passagerarens efternamn.",
    "p1-alder": "Välj passagerarens ålder.",
  });
  const old = { ...form, passengers: form.passengers.with(0, { ...form.passengers[0], age: "121" }) };
  expect(Object.keys(travellerProblems(old, LEGS))).toEqual(["p0-alder"]);
  const long = { ...form, passengers: form.passengers.with(0, { ...form.passengers[0], firstName: "A".repeat(101) }) };
  expect(travellerProblems(long, LEGS)).toEqual({ "p0-fornamn": "Högst 100 tecken." });
});

test("TRIP-012-R5 the contact's e-mail and phone number are checked", () => {
  expect(isEmail("anna@exempel.se")).toBe(true);
  for (const email of ["anna@", "anna", "@exempel.se", "anna@exempel", "an na@exempel.se"]) {
    expect(isEmail(email)).toBe(false);
  }
  expect(isPhone("070-123 45 67")).toBe(true);
  expect(isPhone("+46 70 123 45 67")).toBe(true);
  for (const phone of ["123456", "070 12a 45 67", "46+70 123 45 67", ""]) {
    expect(isPhone(phone)).toBe(false);
  }

  const form = filled();
  const wrong = { ...form, contact: { ...form.contact, email: "anna@", phone: "12", address: "" } };
  expect(travellerProblems(wrong, LEGS)).toEqual({
    "kontakt-email": "Skriv en hel e-postadress, t.ex. anna@exempel.se.",
    "kontakt-phone": "Skriv ett telefonnummer med minst 7 siffror, t.ex. 070-123 45 67.",
    "kontakt-address": "Skriv din adress.",
  });
});

test("TRIP-012-R6 every question must be ticked", () => {
  const form = { ...filled(), checks: [true, false, true] };
  expect(travellerProblems(form, LEGS)).toEqual({ "fraga-1": "Kryssa i rutan för att gå vidare." });
});

test("TRIP-012-R7 a payment method must be chosen", () => {
  expect(paymentProblems({ ...filled(), payment: null })).toEqual({ betalning: "Välj hur du vill betala." });
  expect(paymentProblems(filled())).toEqual({});
});

test("TRIP-012-R3 R8 the total is the departure × the aircraft's × the class's factor, plus the add-ons", () => {
  const form = filled();
  // Business 1 000 × 1,20 × 1,50 = 1 800 kr, Ekonomi 1 000 × 1,20 = 1 200 kr
  expect(bookingTotal(form, LEGS)).toBe(1800 + 1800 + 1200);

  // 2 Måltid och 1 Extra bagage för Passagerare 3
  const third = form.passengers[2];
  const withAddons = {
    ...form,
    passengers: form.passengers.with(2, { ...third, legs: [{ ...third.legs[0], addons: { 11: 2, 12: 1 } }] }),
  };
  expect(bookingTotal(withAddons, LEGS)).toBe(4800 + 2 * 120 + 300);
});

test("TRIP-012-R3 a new class keeps only the add-ons that can be bought in it", () => {
  const form = filled();
  const first = form.passengers[0];
  const chosen = { ...first, legs: [{ classId: 2, addons: { 11: 1, 13: 2 } }] };
  expect(changeClass(chosen, 0, LEGS[0], 1).legs[0]).toEqual({ classId: 1, addons: { 11: 1 } });
});

test("TRIP-012-R4 Dåliga nerver costs 1 000 kr per flight for the passenger", () => {
  const back = { time: "18:45", aircraftId: 7, seating: { 1: 1, 2: 2 } };
  const legs = [leg(), leg(back, "hemresan")];
  const form = filled(legs);
  const nervous = { ...form, passengers: form.passengers.with(0, { ...form.passengers[0], nerves: true }) };
  expect(NERVES_PRICE).toBe(1000);
  expect(bookingTotal(nervous, legs) - bookingTotal(form, legs)).toBe(2000);
});

test("TRIP-012-R10 another aircraft or other numbers start that flight over; names and the other flight are kept", () => {
  const back = { time: "18:45", aircraftId: 7, seating: { 1: 1, 2: 2 } };
  const legs = [leg(), leg(back, "hemresan")];
  const form = filled(legs);
  const p = form.passengers[2];
  const chosen = {
    ...form,
    passengers: form.passengers.with(2, {
      ...p,
      nerves: true,
      legs: [
        { classId: 1, addons: { 11: 2 } },
        { classId: 1, addons: { 12: 1 } },
      ],
    }),
  };

  // Ingenting ändrat: allt finns kvar
  expect(fitForm(chosen, legs, 3)).toEqual(chosen);

  // Andra antal på utresan: utresans klasser börjar om och tilläggen tas bort
  const changed = { ...outbound, seating: { 1: 2, 2: 1 } };
  const fitted = fitForm(chosen, [leg(changed), legs[1]], 3);
  expect(fitted.passengers.map((x) => x.legs[0])).toEqual([
    { classId: 2, addons: {} },
    { classId: 1, addons: {} },
    { classId: 1, addons: {} },
  ]);
  expect(fitted.passengers[2].legs[1]).toEqual({ classId: 1, addons: { 12: 1 } });
  expect(fitted.passengers[2]).toMatchObject({ firstName: "Anna 2", lastName: "Ek", age: "34", nerves: true });
  expect(fitted.contact).toEqual(form.contact);

  // Ett annat plan, en annan avgång, ett annat datum eller en annan rutt gör samma sak
  const cleared = (legs: BookingLeg[]) => fitForm(chosen, legs, 3).passengers[2].legs[0].addons;
  expect(cleared([leg({ ...outbound, aircraftId: 8 }), legs[1]])).toEqual({});
  expect(cleared([leg({ ...outbound, time: "09:00" }), legs[1]])).toEqual({});
  expect(cleared([leg(outbound, "utresan", 1000, { ...SEARCH, outbound: "2026-11-14" }), legs[1]])).toEqual({});
  expect(cleared([leg(outbound, "utresan", 1000, { ...SEARCH, to: "CDG" }), legs[1]])).toEqual({});
});

test("TRIP-012-R8 the server refuses an add-on not allowed in the class, too many, or the wrong passengers", () => {
  const form = filled();
  expect(fitsTrip(form, LEGS, 3)).toBe(true);
  const withAddon = (addons: Record<number, number>, classId = 1) => ({
    ...form,
    passengers: form.passengers.with(2, { ...form.passengers[2], legs: [{ classId, addons }] }),
  });
  // Lounge går bara att köpa i Business
  expect(fitsTrip(withAddon({ 13: 1 }), LEGS, 3)).toBe(false);
  expect(fitsTrip(withAddon({ 99: 1 }), LEGS, 3)).toBe(false);
  expect(fitsTrip(withAddon({ 11: 11 }), LEGS, 3)).toBe(false);
  expect(fitsTrip(withAddon({ 11: 1.5 }), LEGS, 3)).toBe(false);
  expect(fitsTrip(withAddon({ 11: 10 }), LEGS, 3)).toBe(true);
  expect(fitsTrip(withAddon({}, 3), LEGS, 3)).toBe(false);
  expect(fitsTrip(form, LEGS, 2)).toBe(false);
  expect(fitsTrip({ ...form, requestId: "x" }, LEGS, 3)).toBe(false);
  expect(fitsTrip(null as unknown as BookingForm, LEGS, 3)).toBe(false);
  expect(asForm({ passengers: "x" })).toBeNull();
  expect(asForm(form)).toBe(form);
});

test("TRIP-012-R8 a flight that is no longer done or whose aircraft is gone can't be booked", () => {
  const rows = [{ ...MEAL, aircraftId: 7, classId: 1 }];
  const [booked] = bookingLegs(SEARCH, [outbound], [1000], [PLANE], rows)!;
  expect(booked).toMatchObject({ price: 1000, aircraft: PLANE, seating: outbound.seating, addons: { 1: [MEAL], 2: [] } });
  expect(bookingLegs(SEARCH, [outbound], [1000], [], rows)).toBeNull();
  expect(bookingLegs(SEARCH, [{ ...outbound, seating: { 1: 1 } }], [1000], [PLANE], rows)).toBeNull();
});

test("TRIP-012-R9 the summary has the flights, passengers with classes and add-ons, contact, payment and total", () => {
  const airport = { iata: "ARN", name: "Arlanda", city: "Stockholm", country: "Sverige", timezone: "Europe/Stockholm" };
  const flight: Flight = {
    id: "1-07:20",
    number: "GF 11",
    date: "2026-11-13",
    time: "07:20",
    price: 1000,
    fromPrice: 1000,
    routeMinutes: 140,
    from: airport,
    to: { ...airport, iata: "LHR", city: "London", timezone: "Europe/London" },
  };
  const form = filled();
  const third = form.passengers[2];
  const chosen = {
    ...form,
    passengers: form.passengers.with(2, { ...third, nerves: true, legs: [{ ...third.legs[0], addons: { 11: 2 } }] }),
  };
  const summary = bookingSummary("K7M2QX", chosen, LEGS, [flight]);
  expect(summary).toMatchObject({
    bookingNumber: "K7M2QX",
    legs: [{ title: "Utresa", aircraft: "Hindenburg", minutes: 560, arrival: { time: "15:40", days: 0 } }],
    contact: chosen.contact,
    payment: "Cash till piloten",
    total: 4800 + 240 + 1000,
  });
  expect(summary.passengers[2]).toEqual({
    name: "Anna 2 Ek",
    age: "34",
    legs: [{ className: "Ekonomi", addons: [{ name: "Måltid", count: 2 }, { name: "Dåliga nerver", count: 1 }] }],
  });
});
