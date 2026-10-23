import { expect, test } from "vitest";
import { checkChoice, chooseAircraft, keepChoice, type LegChoice, parseLegs, parseStep, planUrl, resultsUrl } from "./trip";

const search = { from: "ARN", to: "LHR", outbound: "2026-11-13", return: "2026-11-20", travellers: 3 };
const oneWay = { ...search, return: null };
const chosen: LegChoice[] = [
  { time: "07:20", aircraftId: 3, seating: { 1: 2, 2: 1 } },
  { time: "18:45", aircraftId: null, seating: null },
];
const params = (url: string) => Object.fromEntries(new URL(url, "http://x").searchParams);

test("TRIP-011-R1 the chosen flights are written into the address and read back", () => {
  const url = planUrl(search, chosen);
  expect(url).toBe(
    "/flyg/plan?fran=ARN&till=LHR&utresa=2026-11-13&hemresa=2026-11-20&resenarer=3" +
      "&ut=07%3A20&ut-plan=3&ut-klasser=1%3A2%2C2%3A1&hem=18%3A45",
  );
  expect(parseLegs(params(url), search)).toEqual(chosen);
  expect(parseStep(params(url))).toBe("aircraft");
  expect(parseStep(params(planUrl(search, chosen, "classes")))).toBe("classes");
});

test("TRIP-011-R1 a missing or invalid flight in the address is refused", () => {
  expect(parseLegs({ ut: "07:20" }, search)).toBeNull();
  expect(parseLegs({ ut: "7:20" }, oneWay)).toBeNull();
  expect(parseLegs({ ut: "24:00" }, oneWay)).toBeNull();
  expect(parseLegs({}, oneWay)).toBeNull();
  expect(parseLegs({ ut: "07:20", hem: "18:45" }, oneWay)).toEqual([{ time: "07:20", aircraftId: null, seating: null }]);
});

test("TRIP-011-R1 an invalid aircraft or numbers in the address count as not chosen", () => {
  const [leg] = parseLegs({ ut: "07:20", "ut-plan": "x", "ut-klasser": "1:2,1:3" }, oneWay)!;
  expect(leg).toEqual({ time: "07:20", aircraftId: null, seating: null });
  // No one placed is a choice too
  expect(parseLegs({ ut: "07:20", "ut-plan": "3", "ut-klasser": "" }, oneWay)).toEqual([
    { time: "07:20", aircraftId: 3, seating: {} },
  ]);
});

test("TRIP-011-R10 going back to the flights keeps everything chosen after them", () => {
  const url = resultsUrl(search, chosen);
  expect(url.startsWith("/flyg?")).toBe(true);
  expect(parseLegs(params(url), search)).toEqual(chosen);
});

test("TRIP-011-R10 another aircraft clears the classes, the same one keeps them", () => {
  expect(chooseAircraft(chosen[0], 4)).toEqual({ time: "07:20", aircraftId: 4, seating: null });
  expect(chooseAircraft(chosen[0], 3)).toBe(chosen[0]);
});

test("TRIP-011-R10 another flight clears its aircraft and classes, the same one keeps them", () => {
  expect(keepChoice(chosen[0], "07:20")).toBe(chosen[0]);
  expect(keepChoice(chosen[0], "12:00")).toEqual({ time: "12:00", aircraftId: null, seating: null });
  expect(keepChoice(undefined, "12:00")).toEqual({ time: "12:00", aircraftId: null, seating: null });
});

test("TRIP-011-R2 a chosen aircraft that is missing or too small counts as not chosen", () => {
  const economy = { id: 1, name: "Ekonomi", capacity: 2, pricePercent: 100 };
  const fleet = [{ id: 3, name: "Hindenburg", pricePercent: 120, timePercent: 400, classes: [economy] }];
  const leg = { time: "07:20", aircraftId: 3, seating: { 1: 2 } };
  const nothing = { time: "07:20", aircraftId: null, seating: null };
  expect(checkChoice(leg, fleet, 2)).toEqual(leg);
  expect(checkChoice(leg, fleet, 3)).toEqual(nothing);
  expect(checkChoice({ ...leg, aircraftId: 9 }, fleet, 2)).toEqual(nothing);
  // Numbers that don't fit the aircraft are dropped, the aircraft is kept
  expect(checkChoice({ ...leg, seating: { 2: 1 } }, fleet, 2)).toEqual({ ...leg, seating: null });
});
