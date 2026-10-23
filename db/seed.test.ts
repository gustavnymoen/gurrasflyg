import { readFileSync } from "node:fs";
import { expect, test } from "vitest";

const readSql = (file: string) => readFileSync(`db/${file}`, "utf8");

test("TECH-005-R3 the seed data has no prices", () => {
  const seed = readSql("seed.sql");
  for (const table of ["addons", "flight_prices", "booking_flights", "booking_flight_addons"]) {
    expect(seed).not.toMatch(new RegExp(`INSERT INTO ${table}\\b`));
  }
});
