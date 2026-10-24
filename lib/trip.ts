// Resan som besökaren sätter ihop steg för steg (TRIP-011-R1, R10): de valda
// flygen och planet och klasserna för varje flyg. Allt står i adressen efter
// sökningen, så att sidan går att ladda om och besökaren kan gå tillbaka till
// ett tidigare steg utan att något försvinner, t.ex.
// /flyg/plan?fran=ARN&till=LHR&utresa=2026-11-13&resenarer=2&ut=07:20&ut-plan=3&ut-klasser=1:2

import { canSeat, type FleetAircraft, type Seating, validSeating } from "./fare-rules";
import { type Params, RESULTS_PATH, type Search, searchParams } from "./search";

export const PLAN_PATH = "/flyg/plan";

// Ett valt flyg (avgångstiden; rutten följer av sökningen) och planet och
// antalen per klass för det. null = inte valt än.
export type LegChoice = { time: string; aircraftId: number | null; seating: Seating | null };

// Stegen på sidan /flyg/plan. Flygen väljs på /flyg, resenärerna i TRIP-012.
export type TripStep = "aircraft" | "classes";

// Utresan först, sedan hemresan
const LEGS = ["ut", "hem"] as const;

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
export function planUrl(search: Search, legs: LegChoice[], step: TripStep = "aircraft") {
  const params = tripParams(search, legs);
  if (step === "classes") params.set("steg", "klasser");
  return `${PLAN_PATH}?${params}`;
}

// Tillbaka till flygen, med allt som valts efter dem
export const resultsUrl = (search: Search, legs: LegChoice[]) => `${RESULTS_PATH}?${tripParams(search, legs)}`;

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

export const parseStep = (params: Params): TripStep => (params.steg === "klasser" ? "classes" : "aircraft");

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
