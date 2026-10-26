import { expect, test } from "vitest";
import { type Flight, fillInDelay, flightNumber, hasLeft, localNow, searchDelay, sortFlights, totalPrice } from "./flight-rules";

const airport = { iata: "ARN", name: "Stockholm Arlanda", city: "Stockholm", country: "Sverige", timezone: "Europe/Stockholm" };
const flight = (time: string, fromPrice: number): Flight => ({
  id: time,
  number: "GF 11",
  date: "2026-11-13",
  time,
  price: 100,
  fromPrice,
  routeMinutes: 140,
  from: airport,
  to: { ...airport, iata: "LHR" },
});

test("TRIP-025-R1 each card starts 60 ms after the one before", () => {
  expect([0, 1, 2, 3].map(fillInDelay)).toEqual([0, 60, 120, 180]);
});

test("TRIP-025-R2 only the first ten cards are delayed one after another", () => {
  expect(fillInDelay(9)).toBe(540);
  expect(fillInDelay(10)).toBe(fillInDelay(9));
  expect(fillInDelay(500)).toBe(fillInDelay(9));
});

test("TRIP-010-R3 the simulated search takes 1–4 seconds", () => {
  expect(searchDelay(0)).toBe(1000);
  expect(searchDelay(0.5)).toBe(2500);
  expect(searchDelay(0.9999)).toBeLessThanOrEqual(4000);
});

test("TRIP-010-R4 localNow gives the date and time in the airport's time zone", () => {
  const now = new Date("2026-11-13T23:30:00Z");
  expect(localNow("Europe/Stockholm", now)).toEqual({ date: "2026-11-14", time: "00:30" });
  expect(localNow("America/New_York", now)).toEqual({ date: "2026-11-13", time: "18:30" });
});

test("TRIP-010-R4 departures that have already left today are left out", () => {
  const now = { date: "2026-11-13", time: "14:05" };
  expect(hasLeft({ date: "2026-11-13", time: "14:00" }, now)).toBe(true);
  expect(hasLeft({ date: "2026-11-13", time: "14:05" }, now)).toBe(true);
  expect(hasLeft({ date: "2026-11-13", time: "14:10" }, now)).toBe(false);
  expect(hasLeft({ date: "2026-11-14", time: "06:00" }, now)).toBe(false);
  expect(hasLeft({ date: "2026-11-12", time: "23:00" }, now)).toBe(true);
});

test("TRIP-010-R6 the total price is the price per person times the travellers", () => {
  expect(totalPrice(1290, 3)).toBe(3870);
  expect(totalPrice(1290, 1)).toBe(1290);
});

test("TRIP-010-R6 the flight number comes from the route and the departure", () => {
  expect(flightNumber(201, 3)).toBe("GF 2013");
  expect(flightNumber(1, 1)).toBe("GF 11");
});

test("TRIP-010-R7 sorting by departure time and by price", () => {
  const flights = [flight("12:00", 900), flight("07:20", 2500), flight("18:45", 900)];
  expect(sortFlights(flights, "time").map((f) => f.time)).toEqual(["07:20", "12:00", "18:45"]);
  expect(sortFlights(flights, "price").map((f) => f.time)).toEqual(["12:00", "18:45", "07:20"]);
  // The original list is unchanged
  expect(flights.map((f) => f.time)).toEqual(["12:00", "07:20", "18:45"]);
});
