"use client";

import type { useRouter } from "next/navigation";
import { type AgentAction, type AgentContext, isFlightUrl, isMyBookingUrl, MAX_URL_LENGTH, NOT_READY_TEXT, safeActions } from "@/lib/agent-rules";
import {
  asForm,
  type BookingForm,
  emptyForm,
  emptyPassenger,
  type PassengerLeg,
  travellerProblems,
} from "@/lib/booking-rules";
import {
  asCharterForm,
  type CharterForm,
  charterProblems,
  emptyCharterForm,
  fitTravellers,
  parseCharterSearch,
  parseChoice,
  withoutUnavailable,
} from "@/lib/charter-rules";
import { parseSearch } from "@/lib/search";
import { bookCharter } from "../charter/book";
import { currentBooking } from "../min-bokning/bookingBridge";
import { saveCharterForm } from "../charter/form";
import { bookFlight } from "../flyg/boka/book";
import { CHARTER_FORM_KEY, FORM_KEY, getStored, store } from "../flyg/boka/store";

// Chattens del av agentläget (TRIP-030, TRIP-036): vilken sida och vilka val som följer med en fråga, att utföra
// åtgärderna som kommer tillbaka, och att boka med knappen. Flygens och charterns formulär ligger på var sin
// nyckel i fliken och sidans adress säger vilket som gäller. Inget personligt lämnar sidan härifrån.

type Router = ReturnType<typeof useRouter>;

const params = () => Object.fromEntries(new URLSearchParams(location.search));
const onFlight = () => isFlightUrl(location.pathname);
const savedCharter = () => asCharterForm(getStored(CHARTER_FORM_KEY));
const savedFlight = () => asForm(getStored(FORM_KEY));
const saveFlight = (form: BookingForm) => store(FORM_KEY, form);

// Resenärernas antal ur adressen, och formuläret anpassat till dem: payment och om det stämmer (R4)
function formState() {
  if (onFlight()) {
    const form = savedFlight();
    const travellers = parseSearch(params())?.travellers;
    const fitted = form && travellers ? { ...form, passengers: Array.from({ length: travellers }, (_, p) => form.passengers[p] ?? emptyPassenger()) } : null;
    const people = fitted?.passengers ?? [];
    return {
      extras: [],
      payment: form?.payment ?? null,
      valid: !!fitted && Object.keys(travellerProblems(fitted, [])).length === 0,
      ...choiceOf(form?.legKeys, people),
      nerves: people.filter((p) => p.nerves).length,
    };
  }
  const form = savedCharter();
  const travellers = parseCharterSearch(params())?.travellers;
  const fitted = form && travellers ? fitTravellers(form, travellers) : null;
  return {
    extras: form?.extras ?? [],
    payment: form?.payment ?? null,
    valid: !!fitted && Object.keys(charterProblems(fitted, [])).length === 0,
    ...choiceOf(form?.legKeys, fitted?.passengers ?? []),
  };
}

// Klasserna och tilläggen per resenär och resa, utan namn, åldrar eller annat personligt (TRIP-044-R2)
function choiceOf(legKeys: string[] | undefined, people: { legs: PassengerLeg[] }[]) {
  return legKeys?.length && people.length > 0 ? { choice: { legKeys, passengers: people.map((p) => p.legs) } } : {};
}

// Sidan och det icke-personliga besökaren valt (R4). Formuläret går inte med, bara om det stämmer.
export function readContext(): AgentContext {
  const full = location.pathname + location.search;
  const url = full.length > MAX_URL_LENGTH ? "/okand" : full;
  // Min bokning har inget formulär: bara utdraget av bokningen som hittats, om en är det (TRIP-037-R4)
  if (isMyBookingUrl(url)) {
    const booking = currentBooking()?.extract;
    return { url, extras: [], payment: null, valid: false, ...(booking && { booking }) };
  }
  return { url, ...formState() };
}

// Har besökaren ändrat sidan eller valen sedan frågan skickades? Då släpps åtgärderna (R4).
export const sameContext = (a: AgentContext, b: AgentContext) => JSON.stringify(a) === JSON.stringify(b);

// Resenärernas klasser och tillägg från Agneta in i formuläret; resenärerna som finns behåller namn och ålder.
function charterWithAddons(form: CharterForm, { legKeys, passengers }: { legKeys: string[]; passengers: PassengerLeg[][] }): CharterForm {
  const fitted = fitTravellers(form, passengers.length);
  return { ...fitted, legKeys, passengers: fitted.passengers.map((person, i) => ({ ...person, legs: passengers[i] })) };
}

function flightWithAddons(form: BookingForm, { legKeys, passengers }: { legKeys: string[]; passengers: PassengerLeg[][] }): BookingForm {
  return { ...form, legKeys, passengers: passengers.map((legs, i) => ({ ...(form.passengers[i] ?? emptyPassenger()), legs })) };
}

// Utför åtgärderna: formuläret först, sidan sist. Varje åtgärd kontrolleras en gång till (R3).
export function applyActions(actions: AgentAction[], router: Router) {
  const flight = onFlight();
  for (const action of safeActions(actions)) {
    if (action.type === "goto") router.push(action.url);
    else if (action.type === "tick") currentBooking()?.tick(action.ids); // sidan kryssar bara det som går att avboka (TRIP-037-R5)
    else if (flight) {
      const form = savedFlight() ?? emptyForm("");
      if (action.type === "payment") saveFlight({ ...form, payment: action.payment });
      if (action.type === "addons") saveFlight(flightWithAddons(form, action)); // TRIP-036-R4
    } else {
      const form = savedCharter() ?? emptyCharterForm("");
      if (action.type === "extras") saveCharterForm({ ...form, extras: withoutUnavailable(action.extras, form.passengers) }); // dryckespaketet aldrig med någon under 18 (R6)
      if (action.type === "payment") saveCharterForm({ ...form, payment: action.payment });
      if (action.type === "addons") saveCharterForm(charterWithAddons(form, action)); // TRIP-040-R4
    }
  }
}

// Boka och betala-knappen (R8): bokar från sidans adress och formuläret med samma åtgärd som Betala.
// Kräver att sidan är betalning (TRIP-038-R2) med alla resor valda, ett giltigt formulär och ett betalsätt.
export async function bookNow(router: Router): Promise<{ error: string } | { bookingNumber: string }> {
  const state = formState();
  if (!state.valid || !state.payment) return { error: NOT_READY_TEXT };
  if (onFlight()) return bookFlightNow(router);
  const [, , id, step, last] = location.pathname.split("/");
  const search = parseCharterSearch(params());
  const choice = parseChoice(params());
  const form = savedCharter();
  if (step !== "boka" || last !== "betala" || !id || !search || !choice.out || !choice.back || !form) return { error: NOT_READY_TEXT };
  // Ett id för bokningen, så att två tryck blir en bokning
  const ready = { ...fitTravellers(form, search.travellers), requestId: form.requestId || crypto.randomUUID() };
  saveCharterForm(ready);
  return bookCharter(router, id, search, choice, ready);
}

// Flygen: betalsidan med flygen valda i adressen (att de finns och har plan avgör servern, som i Betala)
async function bookFlightNow(router: Router) {
  const form = savedFlight();
  const search = parseSearch(params());
  if (location.pathname !== "/flyg/boka/betala" || !form || !search || !params().ut || (search.return && !params().hem)) return { error: NOT_READY_TEXT };
  const ready = {
    ...form,
    passengers: Array.from({ length: search.travellers }, (_, p) => form.passengers[p] ?? emptyPassenger()),
    requestId: form.requestId || crypto.randomUUID(),
  };
  saveFlight(ready);
  return bookFlight(router, location.search.slice(1), ready);
}
