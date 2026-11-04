---
id: TECH-029
title: Audit cleanups
---

# Code review of TECH-029

**Result:** Passed
**Date:** 2026-11-04, review run 1
**Summary:** `CharterBookingError` still works in `instanceof` checks, no booking text changed, table names come only from the repo, and nothing unused is left. One edge case found and fixed.
**Security:** Passed. The shared helpers take `table` only as the typed union `"bookings" | "charter_bookings"` from literals in the repo; values go in as `?` parameters; each interpolated line has the `nosemgrep` note; `bookingFailure` shows only `BookingError` messages. `/security-review`: not needed (no sign-in, admin, API route or query input changes).

## Must fix

None.

## Should fix

- `lib/travel.ts` (`readDestinations`, `listQuery`) tested `id ? …`, so an empty id `""` read all destinations and `getDestinationAirport("")` returned the first one instead of `null`. **Done:** tests `id !== undefined`; the R1 unit test checks `""` for both functions.

## Suggestions

- `lib/bookings.ts` `export { BookingError }` is kept only for `lib/bookings.test.ts`. **Done:** left as it is, so the existing tests stay unchanged (R4).

## Outside the change

- None.
