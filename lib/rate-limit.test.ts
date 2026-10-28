import { beforeEach, expect, test } from "vitest";
import { queryUnitDb } from "../db/test-db";
import { unitTestDbFile } from "./local-db.mjs";

// Använder enhetstesternas egen databas (vitest.global-setup.mjs), aldrig din.
// lib/db.ts läser adressen när den importeras, så modulerna importeras först
// när den är satt. Tiden skickas in, så inget behöver vänta. Inloggningens
// egna regler (TECH-017) testas i lib/login-limit.test.ts, som ska gå
// oförändrad.
process.env.TURSO_DATABASE_URL = `file:${unitTestDbFile}`;
const { API_LIMIT, BOOKING_LIMIT } = await import("./flow-limits");
const { clearAttempts, LONGEST_WINDOW_MS, MINUTE_MS, minutesLeft, registerAttempt, tooManyMessage } = await import(
  "./rate-limit"
);

const NOW = 1_800_000_000_000;

beforeEach(async () => {
  await queryUnitDb("DELETE FROM login_attempts");
});

// n försök i rad från nyckeln, med pausen ms mellan dem
async function attempt(key: string, limit: typeof BOOKING_LIMIT, n: number, gap = 1000, start = NOW) {
  let last = null;
  for (let i = 0; i < n; i++) last = await registerAttempt(key, limit, start + i * gap);
  return last;
}

test("TECH-025-R1 the 10 first presses of Betala within 15 minutes are counted, the 11th is refused", async () => {
  expect(BOOKING_LIMIT).toEqual({ max: 10, windowMs: 15 * MINUTE_MS, fixedWindow: true });
  expect(await attempt("bokning:1.1.1.1", BOOKING_LIMIT, 10, MINUTE_MS)).toBeNull();
  expect(await registerAttempt("bokning:1.1.1.1", BOOKING_LIMIT, NOW + 10 * MINUTE_MS)).not.toBeNull();
});

test("TECH-025-R1 another address is not limited by the first one", async () => {
  await attempt("bokning:1.1.1.1", BOOKING_LIMIT, 12);
  expect(await registerAttempt("bokning:2.2.2.2", BOOKING_LIMIT, NOW + 12_000)).toBeNull();
});

test("TECH-025-R1 booking works again 15 minutes after the first counted press", async () => {
  await attempt("bokning:1.1.1.1", BOOKING_LIMIT, 10);
  expect(await registerAttempt("bokning:1.1.1.1", BOOKING_LIMIT, NOW + BOOKING_LIMIT.windowMs - 1)).not.toBeNull();
  expect(await registerAttempt("bokning:1.1.1.1", BOOKING_LIMIT, NOW + BOOKING_LIMIT.windowMs)).toBeNull();
});

test("TECH-025-R1 presses spread out so that no 15 minutes hold more than 10 never lock the address", async () => {
  // 11 presses, 5 minutes apart: at most 4 fall within any 15 minutes
  expect(await attempt("bokning:1.1.1.1", BOOKING_LIMIT, 11, 5 * MINUTE_MS)).toBeNull();
});

test("TECH-025-R1 the message says the minutes left, rounded up, at least 1", async () => {
  await attempt("bokning:1.1.1.1", BOOKING_LIMIT, 10);
  const locked = await registerAttempt("bokning:1.1.1.1", BOOKING_LIMIT, NOW + 10_000);
  expect(tooManyMessage(minutesLeft(locked!.msLeft))).toBe("För många försök. Försök igen om 15 minuter.");
  const almostOver = await registerAttempt("bokning:1.1.1.1", BOOKING_LIMIT, NOW + BOOKING_LIMIT.windowMs - 1);
  expect(tooManyMessage(minutesLeft(almostOver!.msLeft))).toBe("För många försök. Försök igen om 1 minut.");
});

test("TECH-025-R3 the 60 first calls of a route within a minute are counted, the 61st is refused with the seconds left", async () => {
  expect(API_LIMIT).toEqual({ max: 60, windowMs: MINUTE_MS, fixedWindow: true });
  expect(await attempt("api:airports:1.1.1.1", API_LIMIT, 60, 100)).toBeNull();
  const locked = await registerAttempt("api:airports:1.1.1.1", API_LIMIT, NOW + 6000);
  // The minute is counted from the first call, not the latest
  expect(locked).toEqual({ msLeft: MINUTE_MS - 6000 });
});

test("TECH-025-R3 steady use of a route, 61 calls 30 seconds apart, is never refused", async () => {
  // At most 3 calls fall within any minute
  expect(await attempt("api:destination-search:1.1.1.1", API_LIMIT, 61, MINUTE_MS / 2)).toBeNull();
});

test("TECH-025-R3 a limit on one route does not affect another route or another address", async () => {
  await attempt("api:airports:1.1.1.1", API_LIMIT, 61, 100);
  expect(await registerAttempt("api:destination-search:1.1.1.1", API_LIMIT, NOW + 7000)).toBeNull();
  expect(await registerAttempt("api:airports:2.2.2.2", API_LIMIT, NOW + 7000)).toBeNull();
});

test("TECH-025-R3 the count of a route starts over a minute after its first call", async () => {
  await attempt("api:airports:1.1.1.1", API_LIMIT, 61, 100);
  expect(await registerAttempt("api:airports:1.1.1.1", API_LIMIT, NOW + MINUTE_MS - 1)).not.toBeNull();
  expect(await registerAttempt("api:airports:1.1.1.1", API_LIMIT, NOW + MINUTE_MS)).toBeNull();
});

test("TECH-025-R2 the cleanup of a flow with a short window does not remove the rows of a flow with a long one", async () => {
  await attempt("bokning:1.1.1.1", BOOKING_LIMIT, 3);
  // Five minutes later: past the API window, well within the booking window
  await registerAttempt("api:airports:2.2.2.2", API_LIMIT, NOW + 5 * MINUTE_MS);
  const rows = await queryUnitDb<{ ip: string; attempts: number }>("SELECT ip, attempts FROM login_attempts ORDER BY ip");
  expect(rows).toEqual([
    { ip: "api:airports:2.2.2.2", attempts: 1 },
    { ip: "bokning:1.1.1.1", attempts: 3 },
  ]);
});

test("TECH-025-R2 rows older than every window are removed, whatever the flow", async () => {
  await attempt("api:airports:1.1.1.1", API_LIMIT, 2);
  await attempt("bokning:2.2.2.2", BOOKING_LIMIT, 2);
  await registerAttempt("bokning:3.3.3.3", BOOKING_LIMIT, NOW + LONGEST_WINDOW_MS + MINUTE_MS);
  const rows = await queryUnitDb<{ ip: string }>("SELECT ip FROM login_attempts");
  expect(rows.map((r) => r.ip)).toEqual(["bokning:3.3.3.3"]);
});

test("TECH-025-R2 a window longer than the longest is refused, since its rows could be cleaned up too early", async () => {
  await expect(registerAttempt("x", { max: 1, windowMs: LONGEST_WINDOW_MS + 1 }, NOW)).rejects.toThrow();
});

test("TECH-025-R2 clearing a key resets only that key", async () => {
  await attempt("bokning:1.1.1.1", BOOKING_LIMIT, 11);
  await attempt("bokning:2.2.2.2", BOOKING_LIMIT, 3);
  await clearAttempts("bokning:1.1.1.1");
  const rows = await queryUnitDb<{ ip: string }>("SELECT ip FROM login_attempts");
  expect(rows.map((r) => r.ip)).toEqual(["bokning:2.2.2.2"]);
});
