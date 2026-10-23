import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { expect, test } from "vitest";
import { generateRoutes } from "../../scripts/generate-routes.mjs";
import { queryUnitDb } from "../test-db";

// The routes, departures and prices after all migrations, read from the unit
// tests' own database (built by vitest.global-setup.mjs).

type Route = { id: number; from: string; to: string; minutes: number };
type Departure = { route_id: number; departure_time: string; price: number | null };

const routes = () =>
  queryUnitDb<Route>(
    `SELECT r.id, f.iata AS "from", t.iata AS "to", r.duration_minutes AS minutes
     FROM routes r JOIN airports f ON f.id = r.from_airport_id JOIN airports t ON t.id = r.to_airport_id`,
  );
const departures = () => queryUnitDb<Departure>("SELECT route_id, departure_time, price FROM route_departures");

test("TRIP-010-R10 every ordered pair of airports has a route with at least 5 departures", async () => {
  const [airports, all, times] = await Promise.all([
    queryUnitDb<{ iata: string }>("SELECT iata FROM airports"),
    routes(),
    departures(),
  ]);
  expect(all).toHaveLength(airports.length * (airports.length - 1));
  const pairs = new Set(all.map((r) => `${r.from}-${r.to}`));
  for (const a of airports) {
    for (const b of airports) if (a !== b) expect(pairs).toContain(`${a.iata}-${b.iata}`);
  }
  const count = Map.groupBy(times, (d) => d.route_id);
  for (const r of all) {
    expect(r.minutes).toBeGreaterThan(0);
    expect(count.get(r.id)?.length).toBeGreaterThanOrEqual(5);
  }
});

test("TRIP-010-R10 the existing routes keep their flight times and departures", async () => {
  const [all, times] = await Promise.all([routes(), departures()]);
  const byId = new Map(all.map((r) => [r.id, r]));
  const timesOf = Map.groupBy(times, (d) => d.route_id);
  for (const old of generateRoutes()) {
    expect(byId.get(old.id)).toMatchObject({ from: old.from, to: old.to, minutes: old.minutes });
    const now = timesOf.get(old.id)?.map((d) => d.departure_time);
    for (const time of old.times) expect(now).toContain(time);
  }
});

test("TRIP-010-R11 every departure has a price of 150–1 000 000 kr, shared about 80/10/10", async () => {
  const prices = (await departures()).map((d) => d.price);
  for (const price of prices) {
    expect(Number.isInteger(price)).toBe(true);
    expect(price).toBeGreaterThanOrEqual(150);
    expect(price).toBeLessThanOrEqual(1_000_000);
  }
  const share = (min: number, max: number) =>
    prices.filter((p) => p !== null && p >= min && p < max).length / prices.length;
  expect(share(150, 5_000)).toBeCloseTo(0.8, 1);
  expect(share(5_000, 100_000)).toBeCloseTo(0.1, 1);
  expect(share(100_000, 1_000_001)).toBeCloseTo(0.1, 1);
});

test("TRIP-010-R11 generating the routes again gives the same migration and prices", () => {
  const output = execFileSync("node", ["scripts/generate-all-routes.mjs"], { encoding: "utf8" });
  expect(output).toBe(readFileSync("db/migrations/007_all_routes.sql", "utf8"));
});

test("TRIP-010-R5 every airport has a city for the flight cards", async () => {
  const airports = await queryUnitDb<{ iata: string; city: string | null }>("SELECT iata, city FROM airports");
  for (const a of airports) expect(a.city, a.iata).toBeTruthy();
  expect(airports.find((a) => a.iata === "ARN")?.city).toBe("Stockholm");
});

test("TRIP-010-R12 routes have no aircraft", async () => {
  const columns = await queryUnitDb<{ name: string }>("SELECT name FROM pragma_table_info('routes')");
  expect(columns.map((c) => c.name)).not.toContain("aircraft_id");
});
