// Resan som besökaren sätter ihop steg för steg (TRIP-011-R1, R10): de valda
// flygen och planet och klasserna för varje flyg. Allt står i adressen efter
// sökningen, så att sidan går att ladda om och besökaren kan gå tillbaka till
// flygen utan att något försvinner, t.ex.
// /flyg/plan?fran=ARN&till=LHR&utresa=2026-11-13&resenarer=2&ut=07:20&ut-plan=3&ut-klasser=1:2

import { canSeat, type FleetAircraft, placed, type Seating, validSeating } from "./fare-rules";
import { type Params, RESULTS_PATH, type Search, searchParams } from "./search";

export const PLAN_PATH = "/flyg/plan";
// Resenärerna och betalningen (TRIP-012)
export const BOOKING_PATH = "/flyg/boka";
export const PAYMENT_PATH = "/flyg/boka/betala";

// Ett valt flyg (avgångstiden; rutten följer av sökningen) och planet och
// antalen per klass för det. null = inte valt än.
export type LegChoice = { time: string; aircraftId: number | null; seating: Seating | null };

// Hur ett flygs kort på /flyg/plan visas (TRIP-026): inte än (ett tidigare
// flyg är inte klart), öppet med planen, öppet med det valda planet och
// klasserna, eller hopfällt till en sammanfattning
export type LegView = "hidden" | "aircraft" | "classes" | "folded";

// Utresan först, sedan hemresan
const LEGS = ["ut", "hem"] as const;

// Utresan och hemresan: namnet i adressen och i rubrikerna, med och utan stor bokstav
export const LEG_NAMES = [
  { key: "ut", title: "Utresa", of: "utresan" },
  { key: "hem", title: "Hemresa", of: "hemresan" },
];

function tripParams(search: Search, legs: LegChoice[]) {
  const params = searchParams(search);
  legs.forEach((leg, i) => {
    const name = LEGS[i];
    params.set(name, leg.time);
    if (leg.aircraftId !== null) params.set(`${name}-plan`, String(leg.aircraftId));
    if (leg.seating !== null) params.set(`${name}-klasser`, writeSeating(leg.seating));
  });
  return params;
}

// Sidan för plan och klasser
export const planUrl = (search: Search, legs: LegChoice[]) => `${PLAN_PATH}?${tripParams(search, legs)}`;

// Tillbaka till flygen, med allt som valts efter dem
export const resultsUrl = (search: Search, legs: LegChoice[]) => `${RESULTS_PATH}?${tripParams(search, legs)}`;

// Resenärerna och betalningen för resan (TRIP-012-R1, R10)
export const bookingUrl = (search: Search, legs: LegChoice[]) => `${BOOKING_PATH}?${tripParams(search, legs)}`;
export const paymentUrl = (search: Search, legs: LegChoice[]) => `${PAYMENT_PATH}?${tripParams(search, legs)}`;

// Det som passagerarnas klasser och tillägg på ett flyg bygger på: flyget
// (rutt, datum och avgång), planet och antalen per klass. Ändras det börjar
// flygets klasser om (TRIP-012-R10). i är 0 för utresan och 1 för hemresan.
export function legKey(search: Search, i: number, leg: LegChoice) {
  const route = i === 0 ? `${search.from}-${search.to} ${search.outbound}` : `${search.to}-${search.from} ${search.return}`;
  return `${route} ${leg.time} ${leg.aircraftId ?? "-"} ${leg.seating ? writeSeating(leg.seating) : "-"}`;
}

// De valda flygen i adressen: ett för en enkel resa, två för tur och retur.
// null om något flyg saknas eller är fel. Ett fel plan eller fel antal blir
// "inte valt"; att planet finns och antalen går ihop avgör sidan.
export function parseLegs(params: Params, search: Search): LegChoice[] | null {
  const text = (name: string) => (typeof params[name] === "string" ? params[name] : undefined);
  const names = search.return ? LEGS : LEGS.slice(0, 1);
  const legs = names.map((name) => {
    const time = text(name);
    if (!time || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return null;
    const aircraft = text(`${name}-plan`);
    const seating = text(`${name}-klasser`);
    return {
      time,
      aircraftId: aircraft && /^\d+$/.test(aircraft) ? Number(aircraft) : null,
      seating: seating === undefined ? null : readSeating(seating),
    };
  });
  return legs.every((leg) => leg !== null) ? legs : null;
}

// Valen för ett flyg, kontrollerade mot planen: ett plan som inte finns eller
// inte har plats för alla blir "inget plan", antal som inte går på planet
// blir "inga antal" (t.ex. efter en ändrad adress eller ett ändrat plan)
export function checkChoice(leg: LegChoice, fleet: FleetAircraft[], travellers: number): LegChoice {
  const aircraft = fleet.find((a) => a.id === leg.aircraftId);
  if (!aircraft || !canSeat(aircraft, travellers)) return { ...leg, aircraftId: null, seating: null };
  const seating = leg.seating && validSeating(aircraft, leg.seating, travellers) ? leg.seating : null;
  return { ...leg, seating };
}

// Ett annat plan tar bort antalen per klass; samma plan igen ändrar inget (R10)
export function chooseAircraft(leg: LegChoice, aircraftId: number): LegChoice {
  return leg.aircraftId === aircraftId ? leg : { ...leg, aircraftId, seating: null };
}

// Det som valts för ett flyg finns kvar om samma flyg väljs igen; ett annat
// flyg börjar om utan plan och klasser (R10)
export function keepChoice(previous: LegChoice | undefined, time: string): LegChoice {
  return previous?.time === time ? previous : { time, aircraftId: null, seating: null };
}

// Ett flyg är klart när det har ett plan och alla resenärer har en klass (TRIP-026-R3)
export const legDone = (leg: LegChoice, travellers: number) =>
  leg.aircraftId !== null && leg.seating !== null && placed(leg.seating) === travellers;

// Korten när sidan öppnas (TRIP-026-R5): de klara är hopfällda, det första
// som inte är klart är öppet, med planen eller, om ett plan är valt, med
// klasserna, och korten efter det visas inte än
export function firstViews(legs: LegChoice[], travellers: number): LegView[] {
  const open = legs.findIndex((leg) => !legDone(leg, travellers));
  return legs.map((leg, i) => {
    if (legDone(leg, travellers)) return "folded";
    if (i > open) return "hidden";
    return leg.aircraftId === null ? "aircraft" : "classes";
  });
}

// { 1: 2, 2: 1 } <-> "1:2,2:1". Klasser utan resenärer skrivs inte ut.
function writeSeating(seating: Seating) {
  return Object.entries(seating)
    .filter(([, count]) => count > 0)
    .map(([id, count]) => `${id}:${count}`)
    .join(",");
}

function readSeating(text: string): Seating | null {
  if (text === "") return {};
  const seating: Seating = {};
  for (const part of text.split(",")) {
    const match = /^(\d+):(\d+)$/.exec(part);
    if (!match || match[1] in seating) return null;
    seating[Number(match[1])] = Number(match[2]);
  }
  return seating;
}
