import { expect, test } from "vitest";
import { queryUnitDb } from "../db/test-db";
import { ACCESS_NAMES, CATEGORY_NAMES, CONTINENT_NAMES, countryName, TRANSPORT_NAMES } from "./destination-names";

// Värdena i databasen, utan att läsa mer än en kolumn
const values = async (sql: string) => (await queryUnitDb<{ value: string }>(sql)).map((row) => row.value);

test("TRIP-013-R4 every continent, category, access value and way of getting there has a Swedish name", async () => {
  const checks: [Record<string, string>, string][] = [
    [CONTINENT_NAMES, "SELECT DISTINCT continent AS value FROM destinations"],
    [CATEGORY_NAMES, "SELECT DISTINCT category AS value FROM destinations"],
    [ACCESS_NAMES, "SELECT DISTINCT access AS value FROM destinations"],
    [TRANSPORT_NAMES, "SELECT DISTINCT transport AS value FROM destination_transport"],
  ];
  for (const [names, sql] of checks) {
    const missing = (await values(sql)).filter((value) => !names[value]);
    expect(missing).toEqual([]);
  }
});

test("TRIP-013-R4 a country's Swedish name comes from its country code", async () => {
  expect(countryName("DE")).toBe("Tyskland");
  expect(countryName("UA")).toBe("Ukraina");
  // Varje land i resmålen har ett namn som inte bara är koden
  for (const code of await values("SELECT DISTINCT country AS value FROM destinations")) {
    expect(countryName(code)).not.toBe(code);
  }
});
