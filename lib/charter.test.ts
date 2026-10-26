import { beforeAll, expect, test } from "vitest";
import { unitTestDbFile } from "./local-db.mjs";

// Läser tidtabellerna i enhetstesternas databas (vitest.global-setup.mjs).
// lib/db.ts läser adressen när den importeras, så charter importeras först när den är satt.
process.env.TURSO_DATABASE_URL = `file:${unitTestDbFile}`;
let charter: typeof import("./charter");

beforeAll(async () => {
  charter = await import("./charter");
});

// Långt före alla datum, så att inget har avgått
const EARLY = new Date("2026-11-02T10:00:00Z");
const ids = async (from: string, to: string, date: string, now = EARLY) =>
  (await charter.findTrips(from, to, date, now)).map((t) => t.id);

test("TRIP-014-R3 ARN to BER on a Monday has four trips, on a Saturday three", async () => {
  expect(await ids("ARN", "BER", "2027-01-11")).toEqual([
    "ARN-BER-SK1122",
    "ARN-BER-EW488",
    "ARN-BER-SK2291",
    "ARN-BER-DY6077",
  ]);
  expect(await ids("ARN", "BER", "2027-01-16")).toEqual(["ARN-BER-SK1122", "ARN-BER-SK2291", "ARN-BER-DY6077"]);
});

test("TRIP-014-R3 ARN to WDH has no trips on a Tuesday, and a seasonal route none outside its period", async () => {
  expect(await ids("ARN", "WDH", "2027-01-12")).toEqual([]);
  expect(await ids("ARN", "WDH", "2027-01-11")).toEqual(["ARN-WDH-LH1570"]);
  // ARN-TIA-SK2513 går på lördagar från 28 mars 2027
  expect(await ids("ARN", "TIA", "2027-03-27")).not.toContain("ARN-TIA-SK2513");
  expect(await ids("ARN", "TIA", "2027-04-03")).toContain("ARN-TIA-SK2513");
  // Efter tidtabellernas slut 30 april 2027
  expect(await ids("ARN", "BER", "2027-05-01")).toEqual([]);
});

test("TRIP-014-R3 a trip that has already left (local time at the departure airport) is not listed", async () => {
  // 05:55 UTC är 06:55 i Stockholm: 06:50 har gått, 07:00 har inte gått
  expect(await ids("ARN", "BER", "2027-01-11", new Date("2027-01-11T05:55:00Z"))).toEqual([
    "ARN-BER-EW488",
    "ARN-BER-SK2291",
    "ARN-BER-DY6077",
  ]);
  expect(await ids("ARN", "BER", "2027-01-11", new Date("2027-01-11T05:49:00Z"))).toHaveLength(4);
  // Gårdagens resor har gått, morgondagens inte
  expect(await ids("ARN", "BER", "2027-01-11", new Date("2027-01-12T05:00:00Z"))).toEqual([]);
});

test("TRIP-014-R4 the arrival is worked out from the departure and the travel time, not the course data's arrives", async () => {
  const [trip] = await charter.findTrips("ARN", "WDH", "2027-01-11", EARLY);
  expect(trip.time).toBe("06:25");
  expect(trip.arrival).toEqual({ time: "21:25", days: 0 });
  expect(trip.flights).toEqual(["LH1570", "4Y653"]);
  expect(trip.stops).toEqual(["Frankfurt"]);
  // Efter övergången till sommartid: samma restid, men ankomsten en timme tidigare
  const [summer] = await charter.findTrips("ARN", "WDH", "2027-03-29", EARLY);
  expect(summer.arrival).toEqual({ time: "20:25", days: 0 });
});

test("TRIP-014-R5 a chosen return that doesn't fit the outbound trip is dropped, and the outbound is kept", async () => {
  const destination = { id: "teufelsberg", title: "Teufelsberg", airport: "BER" };
  const same = { from: "ARN", outbound: "2027-01-11", return: "2027-01-11", travellers: 1 };
  const open = await charter.readCharter(destination, same, { out: null, back: null }, EARLY);
  const latestOut = open!.out.at(-1)!;
  const earliestBack = open!.back[0];
  const data = await charter.readCharter(destination, same, { out: latestOut.id, back: earliestBack.id }, EARLY);
  expect(data!.choice).toEqual({ out: latestOut.id, back: null });
  const first = await charter.readCharter(destination, same, { out: open!.out[0].id, back: open!.back.at(-1)!.id }, EARLY);
  expect(first!.choice.back).toBe(open!.back.at(-1)!.id);
});

test("TRIP-014-R2 dates beyond six months, or a return beyond two months, are not bookable", async () => {
  const destination = { id: "teufelsberg", title: "Teufelsberg", airport: "BER" };
  const none = { out: null, back: null };
  const base = { from: "ARN", outbound: "2027-01-11", return: "2027-01-16", travellers: 1 };
  expect(await charter.readCharter(destination, base, none, EARLY)).not.toBeNull();
  expect(await charter.readCharter(destination, base, none, new Date("2026-06-01T10:00:00Z"))).toBeNull();
  expect(await charter.readCharter(destination, { ...base, return: "2027-03-12" }, none, EARLY)).toBeNull();
  expect(await charter.readCharter(destination, base, none, new Date("2027-02-01T10:00:00Z"))).toBeNull();
});
