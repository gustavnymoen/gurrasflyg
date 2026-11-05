import { canSeat, fare, type FleetAircraft, placed, type Seating, validSeating } from "./fare-rules";
import { formatPrice } from "./format";
import type { PlanChoice } from "./trip";

// Agnetas plan och klass (TRIP-040-R1, R2): det som inte beror på om resan är ett flyg eller en
// charterresa, så att flygagenten (TRIP-036) kan använda samma. Bara avgångens pris och planen behövs.

// Planen med plats för alla resenärer och deras pris per klass, billigast först: det som modellen
// får veta om planen, aldrig något ur minnet. Ingen flygtid: den beror på resan (charterns är avgångens egen).
export function aircraftText(fleet: FleetAircraft[], price: number, travellers: number) {
  const priceOf = (a: FleetAircraft, percent: number) => fare(price, a.pricePercent, percent);
  const cheapest = (a: FleetAircraft) => Math.min(...a.classes.map((c) => priceOf(a, c.pricePercent)));
  const rows = fleet
    .filter((a) => canSeat(a, travellers))
    .toSorted((a, b) => cheapest(a) - cheapest(b) || a.name.localeCompare(b.name, "sv"))
    .map((a) => {
      const classes = a.classes.map((c) => `class ${c.id} ${c.name} (room for ${c.capacity}) ${formatPrice(priceOf(a, c.pricePercent))} per person`);
      return `- aircraft ${a.id} ${a.name}: ${classes.join("; ")}`;
    });
  return rows.length > 0 ? rows.join("\n") : "- none: no aircraft seats this many travellers";
}

// Plan och antal per klass ur verktygets argument, kontrollerade som sidan kontrollerar dem:
// planet har plats för alla, klasserna finns, ingen klass får fler än den rymmer och antalen blir
// exakt resenärerna. Det som inte stämmer ger en text som modellen får läsa.
export function checkPlan(fleet: FleetAircraft[], travellers: number, aircraftId: unknown, classes: unknown): { plan: PlanChoice } | { problem: string } {
  const aircraft = fleet.find((a) => a.id === aircraftId);
  if (!aircraft || !canSeat(aircraft, travellers)) return { problem: `No such aircraft among those that seat ${travellers} travellers. Use an aircraft id from list_aircraft.` };
  const seating: Seating = {};
  for (const row of Array.isArray(classes) ? classes : []) {
    const { class_id: id, count } = (row ?? {}) as { class_id?: unknown; count?: unknown };
    const cabinClass = aircraft.classes.find((c) => c.id === id);
    if (!cabinClass || typeof count !== "number" || !Number.isInteger(count) || count < 0 || cabinClass.id in seating) {
      return { problem: `Give each class once as class_id and count, with a class from ${aircraft.name}: ${aircraft.classes.map((c) => `${c.id} ${c.name}`).join(", ")}.` };
    }
    seating[cabinClass.id] = count;
  }
  const full = aircraft.classes.find((c) => (seating[c.id] ?? 0) > c.capacity);
  if (full) return { problem: `${full.name} on ${aircraft.name} has room for ${full.capacity}, not ${seating[full.id]}. Nothing was changed.` };
  if (placed(seating) !== travellers || !validSeating(aircraft, seating, travellers)) {
    return { problem: `The numbers per class must add up to exactly ${travellers} travellers (got ${placed(seating)}). Nothing was changed.` };
  }
  return { plan: { aircraftId: aircraft.id, seating } };
}
