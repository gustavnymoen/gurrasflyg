import { beforeEach, expect, test } from "vitest";
import { queryUnitDb } from "../db/test-db";
import { unitTestDbFile } from "./local-db.mjs";

// Använder enhetstesternas egen databas (vitest.global-setup.mjs), aldrig din.
// lib/db.ts läser adressen när den importeras, så login-limit importeras först
// när den är satt. Tiden skickas in, så inget behöver vänta.
process.env.TURSO_DATABASE_URL = `file:${unitTestDbFile}`;
const { clearLoginAttempts, LOGIN_WINDOW_MS, registerLoginAttempt } = await import("./login-limit");

const NOW = 1_800_000_000_000;
const MINUTE = 60 * 1000;

beforeEach(async () => {
  await queryUnitDb("DELETE FROM login_attempts");
});

// n försök i rad från adressen, vart och ett en minut efter det förra
async function attempt(ip: string, n: number, start = NOW) {
  let last = null;
  for (let i = 0; i < n; i++) last = await registerLoginAttempt(ip, start + i * MINUTE);
  return last;
}

test("TECH-017-R1 R2 the sixth attempt within 15 minutes is refused, the first five are not", async () => {
  expect(await attempt("1.1.1.1", 5)).toBeNull();
  expect(await registerLoginAttempt("1.1.1.1", NOW + 5 * MINUTE)).not.toBeNull();
});

test("TECH-017-R2 another address is not locked by the first one", async () => {
  await attempt("1.1.1.1", 6);
  expect(await registerLoginAttempt("2.2.2.2", NOW + 6 * MINUTE)).toBeNull();
});

test("TECH-017-R1 a right password clears the count", async () => {
  await attempt("1.1.1.1", 4);
  await clearLoginAttempts("1.1.1.1");
  expect(await attempt("1.1.1.1", 5, NOW + 10 * MINUTE)).toBeNull();
});

test("TECH-017-R1 the count is forgotten 15 minutes after the latest failed attempt", async () => {
  await attempt("1.1.1.1", 5);
  const lastFailed = NOW + 4 * MINUTE;
  // Just before the end it is still locked, at the end it starts over
  expect(await registerLoginAttempt("1.1.1.1", lastFailed + LOGIN_WINDOW_MS - 1)).not.toBeNull();
  expect(await registerLoginAttempt("1.1.1.1", lastFailed + LOGIN_WINDOW_MS)).toBeNull();
});

test("TECH-017-R3 the minutes left are rounded up, at least 1, and a refused attempt does not extend the lock", async () => {
  await attempt("1.1.1.1", 5);
  const lastFailed = NOW + 4 * MINUTE;
  expect(await registerLoginAttempt("1.1.1.1", lastFailed + 1000)).toEqual({ minutesLeft: 15 });
  expect(await registerLoginAttempt("1.1.1.1", lastFailed + 10 * MINUTE)).toEqual({ minutesLeft: 5 });
  expect(await registerLoginAttempt("1.1.1.1", lastFailed + LOGIN_WINDOW_MS - 1)).toEqual({ minutesLeft: 1 });
});

test("TECH-017-R1 old rows of other addresses are removed", async () => {
  await attempt("3.3.3.3", 2);
  await registerLoginAttempt("4.4.4.4", NOW + LOGIN_WINDOW_MS + MINUTE * 5);
  const rows = await queryUnitDb<{ ip: string }>("SELECT ip FROM login_attempts");
  expect(rows.map((r) => r.ip)).toEqual(["4.4.4.4"]);
});
