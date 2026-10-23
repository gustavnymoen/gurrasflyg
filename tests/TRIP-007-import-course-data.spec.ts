import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import destinations from "../data/destinations.json";

// R1–R8 check the imported data and are unit tests in
// db/migrations/006_charter_data.test.ts (TECH-015). R9 shows that the site
// reads the destinations from its database.

const byId = (a: { id: string }, b: { id: string }) => (a.id < b.id ? -1 : 1);

test("TRIP-007-R9 GET /api/destinations reads the destinations from the database", async ({ request }) => {
  const response = await request.get("/api/destinations");
  expect(response.ok()).toBe(true);
  expect(await response.json()).toEqual([...destinations].sort(byId));

  expect(readFileSync("lib/travel.ts", "utf8")).not.toMatch(/import .* from ["'].*destinations\.json["']/);
});
