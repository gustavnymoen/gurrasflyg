import { expect, test } from "vitest";
import { unitTestDbFile } from "@/lib/local-db.mjs";

// En server action går att anropa med vad som helst. Är adressen för lång
// svarar den "ändrats" innan något läses, sparas eller räknas (TECH-025-R4).
// lib/db.ts läser adressen när den importeras, så actions importeras först när den är satt.
process.env.TURSO_DATABASE_URL = `file:${unitTestDbFile}`;
const { MAX_QUERY_LENGTH } = await import("@/lib/booking-rules");
const { CHANGED } = await import("@/lib/bookings");
const { CHANGED: CHARTER_CHANGED } = await import("@/lib/charter-bookings");
const { bookAction } = await import("./actions");
const { bookCharterAction } = await import("@/app/charter/actions");

const tooLong = `fran=ARN&${"x".repeat(MAX_QUERY_LENGTH)}`;

test("TECH-025-R4 a flight booking with a trip address over the limit is refused as changed", async () => {
  expect(tooLong.length).toBeGreaterThan(MAX_QUERY_LENGTH);
  expect(await bookAction(tooLong, {} as never)).toEqual({ ok: false, error: CHANGED });
});

test("TECH-025-R4 a charter booking with a trip address over the limit is refused as changed", async () => {
  expect(await bookCharterAction("teufelsberg", tooLong, {} as never)).toEqual({ ok: false, error: CHARTER_CHANGED });
});
