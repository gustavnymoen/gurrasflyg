---
id: TRIP-010
title: Flight search results
---

# Code review of TRIP-010

## Review run 2

**Result:** Passed
**Date:** 2026-10-23, review run 2
**Summary:** Every finding from run 1 is fixed. The new TRIP-010-R13 (Tab chooses the highlighted airport) is small and tested, with one edge case worth fixing.
**Security:** Passed. The address is validated in `parseSearch`, every query uses `?` parameters, errors to visitors show no internals, and the admin side only deletes code. No secrets, cookies or personal data are involved. `/security-review`: run (the page reads the address and queries the database), no findings.

### Must fix

None.

### Should fix

- `app/components/Autocomplete.tsx:97` Tab, like Enter, chose `suggestions[highlighted]` while the list still showed the answer to an earlier text, so a quick Tab could choose an airport that doesn't match what was typed. **Done:** Tab and Enter choose only when the list answers the text in the field (`answered`). This also fixes the problem noted in TRIP-001's verification (Enter choosing from the previous list), and R13 in the card says so.

### Suggestions

- `tests/TRIP-010-search-results.spec.ts:84` R13 also covers Shift+Tab, which the test didn't press. **Done:** the test chooses with Shift+Tab too, after waiting for the new list.
- `app/flyg/FlightResults.tsx:143` The module-level `subscribeNever` with `useSyncExternalStore` gives a "running in the browser" flag without an effect or a second render; worth reusing. **Done:** left as it is.
- `tests/helpers.ts:226` Importing the pure date helpers from `lib/dates.ts` into the tests works because that file has no `server-only` or React imports; worth keeping true. **Done:** noted.

### Outside the change

- `db/migrations/001_routes.sql:2` still says routes get their aircraft with "Tilldela plan". An applied migration is never edited; the schema is described in `wiki/system/architecture.md`. Not added.
- `specs/TRIP-004-admin-aircraft/verification.md:20` refers to the deleted TRIP-005 test for clearing routes. A historical record; TRIP-005's spec now says it is superseded in part by TRIP-010. Not added.
- TRIP-016 (a deleted aircraft still looks in use) may no longer apply now that routes have no aircraft; the card notes it, to be checked when TRIP-016 is next.

## Review run 1

**Result:** Stopped (1 must fix)
**Date:** 2026-10-23, review run 1
**Summary:** The change is tidy and follows the card closely. The migration is deterministic and covered by unit tests, the search is validated on the server, and the leftovers of "Tilldela plan" are all deleted. One must-fix: no test reliably reached the "no flights" state.
**Security:** Passed (as in run 2). `/security-review` still to be run at that point.

### Must fix

- `tests/TRIP-010-search-results.spec.ts:168` The "no flights" state, its message (R4) and its axe check (the card's accessibility requirement) were only reached if the test ran late in the evening. **Done:** a new test, "TRIP-010-R4 with no departures left the page says so and suggests another date", searches yesterday, whose departures have all left, and checks the message, no cards, the status "0 flyg hittades" and axe.

### Should fix

- `tests/TRIP-010-search-results.spec.ts:112` R2's "a new date searches again" checked only the address. **Done:** it also checks the list's date line for the new date (`formatDay`).
- `app/flyg/FlightResults.tsx:101` `search.return ?? search.outbound` suggested a case that can't happen. **Done:** the return step renders only when `search.return` exists, and uses it directly.

### Suggestions

- `tests/helpers.ts:984` `daysFromToday`, and `short` in the spec, repeated date helpers from `lib/dates.ts`. **Done:** the tests import `addDays`, `toDateString`, `formatShort` and `formatDay`.
- `lib/flights.ts:55` The flight number is stable only as long as a route's departures don't change. **Done:** a comment says to identify a flight by route and time.
- `app/flyg/FlightResults.tsx:139` Hoist the no-op `subscribe` to a module constant. **Done:** `subscribeNever`.

### Outside the change

- `db/migrations/001_routes.sql:2` and TRIP-005's spec still describe "Tilldela plan". **Done:** TRIP-005's spec has a note that TRIP-010 supersedes it in part; the migration stays as it is.
- TRIP-016 may no longer apply; noted in the card.
