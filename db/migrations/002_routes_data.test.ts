import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { expect, test } from "vitest";
import { queryUnitDb } from "../test-db";

// The routes and departures the migration creates, read from the unit tests' own
// database (built by vitest.global-setup.mjs).

const ROUTES = `
  SELECT r.id, f.iata AS "from", t.iata AS "to", r.duration_minutes AS minutes
  FROM routes r JOIN airports f ON f.id = r.from_airport_id JOIN airports t ON t.id = r.to_airport_id`;

test("TRIP-005-R1 there are 51 airports", async () => {
  const airports = await queryUnitDb<{ iata: string }>("SELECT iata FROM airports");
  expect(airports).toHaveLength(51);
  const codes = airports.map((a) => a.iata);
  for (const code of ["ARN", "GOT", "LHR", "JFK", "BKK"]) expect(codes).toContain(code);
});

test("TRIP-005-R2 200 routes, each with a return route", async () => {
  const routes = await queryUnitDb<{ from: string; to: string; minutes: number }>(ROUTES);
  expect(routes).toHaveLength(200);
  const byPair = new Map(routes.map((r) => [`${r.from}-${r.to}`, r.minutes]));
  for (const r of routes) expect(byPair.get(`${r.to}-${r.from}`)).toBe(r.minutes);

  for (const [a, b] of [["ARN", "GOT"], ["ARN", "LHR"], ["ARN", "JFK"]]) {
    expect(byPair.has(`${a}-${b}`)).toBe(true);
    expect(byPair.has(`${b}-${a}`)).toBe(true);
  }

  const airports = await queryUnitDb<{ iata: string }>("SELECT iata FROM airports");
  const served = new Set(routes.flatMap((r) => [r.from, r.to]));
  for (const a of airports) expect(served).toContain(a.iata);
});

test("TRIP-005-R3 flight times follow the distance", async () => {
  const routes = await queryUnitDb<{ from: string; to: string; minutes: number }>(ROUTES);
  const minutes = (from: string, to: string) => routes.find((r) => r.from === from && r.to === to)?.minutes;
  expect(minutes("ARN", "JFK")).toBe(500);
  expect(minutes("ARN", "LHR")).toBe(140);
  expect(minutes("ARN", "GOT")).toBe(60);
});

test("TRIP-005-R4 2–3 departures a day, 06:00–21:30, 3 hours apart", async () => {
  const rows = await queryUnitDb<{ route_id: number; departure_time: string }>(
    "SELECT route_id, departure_time FROM route_departures ORDER BY route_id, departure_time",
  );
  const byRoute = Map.groupBy(rows, (r) => r.route_id);
  expect(byRoute.size).toBe(200);
  for (const times of byRoute.values()) {
    expect(times.length).toBeGreaterThanOrEqual(2);
    expect(times.length).toBeLessThanOrEqual(3);
    const minutes = times.map((t) => {
      const [h, m] = t.departure_time.split(":").map(Number);
      return h * 60 + m;
    });
    for (const [i, m] of minutes.entries()) {
      expect(m).toBeGreaterThanOrEqual(6 * 60);
      expect(m).toBeLessThanOrEqual(21 * 60 + 30);
      expect(m % 5).toBe(0);
      if (i > 0) expect(m - minutes[i - 1]).toBeGreaterThanOrEqual(180);
    }
  }
});

test("TRIP-005-R5 generating the routes again gives the same migration", () => {
  const output = execFileSync("node", ["scripts/generate-routes.mjs"], { encoding: "utf8" });
  expect(output).toBe(readFileSync("db/migrations/002_routes_data.sql", "utf8"));
});
