import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createClient } from "@libsql/client";
import { expect, test } from "@playwright/test";
import { testDbFile } from "../lib/local-db.mjs";
import { createAircraft, deleteWithConfirmation, requireAdminPassword, runsLocally, signIn, uniqueName } from "./helpers";

// R1–R4 read the local test database directly. R7–R9 replace every route's
// aircraft, which must not happen on the live site. Both run only locally.

async function query<T>(sql: string): Promise<T[]> {
  const db = createClient({ url: `file:${testDbFile}` });
  try {
    return (await db.execute(sql)).rows as unknown as T[];
  } finally {
    db.close();
  }
}

const ROUTES = `
  SELECT r.id, f.iata AS "from", t.iata AS "to", r.duration_minutes AS minutes
  FROM routes r JOIN airports f ON f.id = r.from_airport_id JOIN airports t ON t.id = r.to_airport_id`;

test.describe("route data", () => {
  test.skip(!runsLocally, "reads the local test database");

  test("TRIP-005-R1 there are 51 airports", async () => {
    const airports = await query<{ iata: string }>("SELECT iata FROM airports");
    expect(airports).toHaveLength(51);
    const codes = airports.map((a) => a.iata);
    for (const code of ["ARN", "GOT", "LHR", "JFK", "BKK"]) expect(codes).toContain(code);
  });

  test("TRIP-005-R2 200 routes, each with a return route", async () => {
    const routes = await query<{ from: string; to: string; minutes: number }>(ROUTES);
    expect(routes).toHaveLength(200);
    const byPair = new Map(routes.map((r) => [`${r.from}-${r.to}`, r.minutes]));
    for (const r of routes) expect(byPair.get(`${r.to}-${r.from}`)).toBe(r.minutes);

    for (const [a, b] of [["ARN", "GOT"], ["ARN", "LHR"], ["ARN", "JFK"]]) {
      expect(byPair.has(`${a}-${b}`)).toBe(true);
      expect(byPair.has(`${b}-${a}`)).toBe(true);
    }

    const airports = await query<{ iata: string }>("SELECT iata FROM airports");
    const served = new Set(routes.flatMap((r) => [r.from, r.to]));
    for (const a of airports) expect(served).toContain(a.iata);
  });

  test("TRIP-005-R3 flight times follow the distance", async () => {
    const routes = await query<{ from: string; to: string; minutes: number }>(ROUTES);
    const minutes = (from: string, to: string) => routes.find((r) => r.from === from && r.to === to)?.minutes;
    expect(minutes("ARN", "JFK")).toBe(500);
    expect(minutes("ARN", "LHR")).toBe(140);
    expect(minutes("ARN", "GOT")).toBe(60);
  });

  test("TRIP-005-R4 2–3 departures a day, 06:00–21:30, 3 hours apart", async () => {
    const rows = await query<{ route_id: number; departure_time: string }>(
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
});

test("TRIP-005-R5 generating the routes again gives the same migration", () => {
  const output = execFileSync("node", ["scripts/generate-routes.mjs"], { encoding: "utf8" });
  expect(output).toBe(readFileSync("db/migrations/002_routes_data.sql", "utf8"));
});

test("TRIP-005-R6 admin page shows the assignment status", async ({ page }) => {
  requireAdminPassword();
  await signIn(page);
  await expect(page.getByRole("button", { name: "Tilldela plan" })).toBeVisible();
  await expect(page.getByText(/^\d+ av \d+ rutter har plan$/)).toBeVisible();
});

test.describe("assigning aircraft", () => {
  test.skip(!runsLocally, "would replace the live site's assignments");

  test.beforeEach(async ({ page }) => {
    requireAdminPassword();
    await signIn(page);
  });

  test("TRIP-005-R8 without aircraft nothing can be assigned", async ({ page }) => {
    await expect(page.getByText("Inga plan än.")).toBeVisible();
    await page.getByRole("button", { name: "Tilldela plan" }).click();
    await expect(page.getByText("Det finns inga plan att tilldela. Lägg till ett plan först.")).toBeVisible();
  });

  test("TRIP-005-R7 and R9 assign to every route, and deleting the aircraft clears them", async ({ page }) => {
    const name = uniqueName("Plan");
    await createAircraft(page, name, [{ name: "Ekonomi", seats: 150 }]);

    await page.getByRole("button", { name: "Tilldela plan" }).click();
    await expect(page.getByText("200 av 200 rutter har plan")).toBeVisible();
    const row = page.getByRole("row").filter({ has: page.getByRole("button", { name: `Ta bort ${name}` }) });
    await expect(row.getByRole("cell").nth(4)).toHaveText("200");

    await deleteWithConfirmation(page, `Ta bort ${name}`);
    await page.reload();
    await expect(page.getByText("0 av 200 rutter har plan")).toBeVisible();
  });
});
