import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { expect, test } from "vitest";
import { queryUnitDb } from "../test-db";

// The airports and routes the migration creates, read from the unit tests' own
// database (built by vitest.global-setup.mjs). R2 (200 routes) and R4 (2–3
// departures a day) were replaced by TRIP-010-R10, checked in 007_all_routes.test.ts.

const ROUTES = `
  SELECT r.id, f.iata AS "from", t.iata AS "to", r.duration_minutes AS minutes
  FROM routes r JOIN airports f ON f.id = r.from_airport_id JOIN airports t ON t.id = r.to_airport_id`;

test("TRIP-005-R1 there are 51 airports", async () => {
  const airports = await queryUnitDb<{ iata: string }>("SELECT iata FROM airports");
  expect(airports).toHaveLength(51);
  const codes = airports.map((a) => a.iata);
  for (const code of ["ARN", "GOT", "LHR", "JFK", "BKK"]) expect(codes).toContain(code);
});

test("TRIP-005-R3 flight times follow the distance", async () => {
  const routes = await queryUnitDb<{ from: string; to: string; minutes: number }>(ROUTES);
  const minutes = (from: string, to: string) => routes.find((r) => r.from === from && r.to === to)?.minutes;
  expect(minutes("ARN", "JFK")).toBe(500);
  expect(minutes("ARN", "LHR")).toBe(140);
  expect(minutes("ARN", "GOT")).toBe(60);
});

test("TRIP-005-R5 generating the routes again gives the same migration", () => {
  const output = execFileSync("node", ["scripts/generate-routes.mjs"], { encoding: "utf8" });
  expect(output).toBe(readFileSync("db/migrations/002_routes_data.sql", "utf8"));
});
