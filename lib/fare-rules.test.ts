import { expect, test } from "vitest";
import {
  aircraftOptions,
  arrival,
  canAdd,
  cheapestFare,
  classOptions,
  fare,
  firstSeating,
  type FleetAircraft,
  flightMinutes,
  type Leg,
  legTotal,
  seatingCounter,
  seatingProblem,
  validSeating,
} from "./fare-rules";

const ECONOMY = { id: 1, name: "Ekonomi", capacity: 100, pricePercent: 100 };
const BUSINESS = { id: 2, name: "Business", capacity: 10, pricePercent: 150 };
const FIRST = { id: 3, name: "Första klass", capacity: 2, pricePercent: 250 };

const aircraft = (id: number, name: string, pricePercent: number, timePercent: number, classes = [ECONOMY]): FleetAircraft => ({
  id,
  name,
  pricePercent,
  timePercent,
  classes,
});

const ZEPPELIN = aircraft(1, "Hindenburg", 120, 400, [ECONOMY, BUSINESS, FIRST]);
const FALCON = aircraft(2, "Millenium Falcon", 300, 30, [BUSINESS, FIRST]);
const JET = aircraft(3, "F35", 800, 40, [{ ...FIRST, capacity: 1 }]);

const STOCKHOLM = { timezone: "Europe/Stockholm" };
const LONDON = { timezone: "Europe/London" };
const leg: Leg = { date: "2026-11-13", time: "07:20", price: 1000, routeMinutes: 140, from: STOCKHOLM, to: LONDON };
const lateLeg = { ...leg, time: "21:30" };

test("TRIP-011-R4 the price is the departure's price times the aircraft's and the class's factors", () => {
  expect(fare(1000, 120, 150)).toBe(1800);
  expect(fare(1000, 120, 100)).toBe(1200);
  // Rounded to whole kronor
  expect(fare(999, 133, 100)).toBe(1329);
  expect(fare(1005, 100, 150)).toBe(1508);
});

test("TRIP-011-R4 a flight's total is each class's price times its travellers", () => {
  const plane = aircraft(9, "Testplan", 120, 100, [ECONOMY, BUSINESS]);
  expect(legTotal(plane, 1000, { [BUSINESS.id]: 2, [ECONOMY.id]: 1 })).toBe(4800);
  expect(legTotal(plane, 1000, {})).toBe(0);
});

test("TRIP-011-R7 the flight time is the route's time times the aircraft's time factor", () => {
  expect(flightMinutes(140, 400)).toBe(560);
  expect(flightMinutes(140, 50)).toBe(70);
  // Whole minutes, and at least one
  expect(flightMinutes(140, 33)).toBe(46);
  expect(flightMinutes(1, 1)).toBe(1);
});

test("TRIP-011-R7 the arrival is in the arrival airport's local time", () => {
  // 07:20 in Stockholm is 06:20 in London; 560 minutes later it is 15:40 there
  expect(arrival(leg, 560)).toEqual({ time: "15:40", days: 0 });
});

test("TRIP-011-R7 an arrival after midnight local time is a later day", () => {
  const helsinki = { ...lateLeg, to: { timezone: "Europe/Helsinki" } };
  expect(arrival(helsinki, 120)).toEqual({ time: "00:30", days: 1 });
  // London is an hour behind, so the same flight there lands before midnight
  expect(arrival(lateLeg, 120)).toEqual({ time: "22:30", days: 0 });
  expect(arrival(lateLeg, 3000)).toEqual({ time: "22:30", days: 2 });
});

test("TRIP-011-R7 the arrival follows summer time", () => {
  // Summer time starts on 28 March 2027: 07:00 in Stockholm is 05:00 UTC
  expect(arrival({ ...leg, date: "2027-03-28", time: "07:00" }, 60)).toEqual({ time: "07:00", days: 0 });
});

test("TRIP-026-R1 only the aircraft with room for every traveller are shown", () => {
  // F35 has one seat
  expect(aircraftOptions([ZEPPELIN, JET], leg, 2).map((o) => o.aircraft.name)).toEqual(["Hindenburg"]);
  expect(aircraftOptions([ZEPPELIN, JET], leg, 1).map((o) => o.aircraft.name)).toEqual(["Hindenburg", "F35"]);
  expect(aircraftOptions([JET], leg, 2)).toEqual([]);
});

test("TRIP-011-R2 each aircraft shows its price, time and the difference to the cheapest and the fastest", () => {
  const options = aircraftOptions([FALCON, ZEPPELIN], leg, 2);
  expect(
    options.map((o) => ({
      name: o.aircraft.name,
      price: o.price,
      minutes: o.minutes,
      priceDiff: o.priceDiff,
      timeDiff: o.timeDiff,
      cheapest: o.cheapest,
      fastest: o.fastest,
    })),
  ).toEqual([
    // Hindenburg: 1 000 × 1,20 × 1,00 in Ekonomi, 140 × 4,00 minutes
    { name: "Hindenburg", price: 1200, minutes: 560, priceDiff: 0, timeDiff: 518, cheapest: true, fastest: false },
    // Millenium Falcon: 1 000 × 3,00 × 1,50 in Business, 140 × 0,30 minutes
    { name: "Millenium Falcon", price: 4500, minutes: 42, priceDiff: 3300, timeDiff: 0, cheapest: false, fastest: true },
  ]);
  expect(options[0].arrival).toEqual({ time: "15:40", days: 0 });
});

test("TRIP-026-R1 the aircraft shown are compared with each other", () => {
  // F35 is the fastest, but has one seat and is not shown
  const options = aircraftOptions([ZEPPELIN, FALCON, JET], leg, 2);
  expect(options.find((o) => o.aircraft.name === "Millenium Falcon")?.fastest).toBe(true);
});

test("TRIP-011-R3 each class shows its price and the difference to the cheapest class", () => {
  expect(classOptions(ZEPPELIN, 1000).map((o) => [o.cabinClass.name, o.price, o.priceDiff])).toEqual([
    ["Ekonomi", 1200, 0],
    ["Business", 1800, 600],
    ["Första klass", 3000, 1800],
  ]);
});

test("TRIP-024-R2 at first every class has 0 travellers", () => {
  const seating = firstSeating(ZEPPELIN);
  expect(seating).toEqual({ [ECONOMY.id]: 0, [BUSINESS.id]: 0, [FIRST.id]: 0 });
  expect(seatingProblem(seating, 2)).toBe("2 resenärer har ingen klass. Lägg till dem i en klass.");
});

test("TRIP-024-R3 the totals are the sum for the travellers placed so far", () => {
  expect(legTotal(ZEPPELIN, 1000, firstSeating(ZEPPELIN))).toBe(0);
  // 1 of 2 in Ekonomi at 1 200 kr
  expect(legTotal(ZEPPELIN, 1000, { [ECONOMY.id]: 1 })).toBe(1200);
});

test("TRIP-011-R3 a class takes at most its seats, and the classes at most the travellers", () => {
  expect(canAdd(FIRST, { [FIRST.id]: 1 }, 3)).toBe(true);
  expect(canAdd(FIRST, { [FIRST.id]: 2 }, 3)).toBe(false);
  expect(canAdd(BUSINESS, { [ECONOMY.id]: 3 }, 3)).toBe(false);
});

test("TRIP-011-R3 a message says how many travellers have no class", () => {
  expect(seatingProblem({ [ECONOMY.id]: 2 }, 3)).toBe("1 resenär har ingen klass. Lägg till den i en klass.");
  expect(seatingProblem({}, 3)).toBe("3 resenärer har ingen klass. Lägg till dem i en klass.");
  expect(seatingProblem({ [ECONOMY.id]: 2, [BUSINESS.id]: 1 }, 3)).toBeNull();
  expect(seatingProblem({ [ECONOMY.id]: 4 }, 3)).toMatch(/fler resenärer/);
});

test("TRIP-026-R3 the counter says how many travellers are left to place", () => {
  expect(seatingCounter(firstSeating(ZEPPELIN), 3)).toBe("Placera ut 3 resenärer");
  expect(seatingCounter({ [ECONOMY.id]: 2 }, 3)).toBe("Placera ut 1 resenär");
  expect(seatingCounter({ [ECONOMY.id]: 2, [FIRST.id]: 1 }, 3)).toBe("Alla resenärer har en klass");
});

test("TRIP-011-R3 numbers that are impossible on the aircraft are not accepted", () => {
  expect(validSeating(ZEPPELIN, { [ECONOMY.id]: 2, [FIRST.id]: 1 }, 3)).toBe(true);
  expect(validSeating(ZEPPELIN, { [FIRST.id]: 3 }, 3)).toBe(false);
  expect(validSeating(ZEPPELIN, { [ECONOMY.id]: 4 }, 3)).toBe(false);
  expect(validSeating(ZEPPELIN, { 99: 1 }, 3)).toBe(false);
  expect(validSeating(FALCON, { [ECONOMY.id]: 1 }, 3)).toBe(false);
});

test("TRIP-011-R9 the från price is the cheapest aircraft with room and its cheapest class", () => {
  const cheap = aircraft(4, "Billigt", 120, 100);
  const dear = aircraft(5, "Dyrt", 300, 100);
  expect(cheapestFare([dear, cheap], 2, 1000)).toBe(1200);
  // Not an aircraft without room for everyone
  expect(cheapestFare([dear, { ...cheap, classes: [{ ...ECONOMY, capacity: 1 }] }], 2, 1000)).toBe(3000);
  expect(cheapestFare([JET], 2, 1000)).toBeNull();
});
