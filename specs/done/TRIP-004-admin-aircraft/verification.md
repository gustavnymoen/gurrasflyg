---
id: TRIP-004
title: "Admin: aircraft"
---

# Verification of TRIP-004

Specified after the feature was built. Checked with the tests in `tests/TRIP-004-admin-aircraft.spec.ts`, locally against a fresh test database (`npm run test:local`) and against the live site (`npm test`).

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-004-R1 | Test `TRIP-004-R1 table shows classes, seats and routes per aircraft` | local, live | Pass | 2026-10-20 |
| TRIP-004-R2 | Test `TRIP-004-R2 expanding shows classes, add-ons and prices` | local, live | Pass | 2026-10-20 |
| TRIP-004-R3 | Test `TRIP-004-R3 cancel discards the new aircraft` | local, live | Pass | 2026-10-20 |
| TRIP-004-R4 | Test `TRIP-004-R4 classes need valid seats and can only be added once` | local, live | Pass | 2026-10-20 |
| TRIP-004-R5 | Test `TRIP-004-R5 seats can be changed and a class removed with its add-ons` | local, live | Pass | 2026-10-20 |
| TRIP-004-R6 | Test `TRIP-004-R6 add-ons are chosen per class, once each` | local, live | Pass | 2026-10-20 |
| TRIP-004-R7 | Test `TRIP-004-R7 name and a class are required, and names are unique` | local, live | Pass | 2026-10-20 |
| TRIP-004-R8 | Test `TRIP-004-R8 change an aircraft`. Limits for flights and bookings: code review of `updateAircraft` | local, live | Pass | 2026-10-20 |
| TRIP-004-R9 | Test `TRIP-004-R9 delete an aircraft`; routes cleared: `TRIP-005-R7 and R9 …`. Block for flights: code review | local, live | Pass | 2026-10-20 |
| TRIP-004-R10 | Code review: `createAircraft`, `updateAircraft` and `deleteAircraft` use `withTransaction` | code | Pass | 2026-10-20 |

## Checks before done

- [x] `npm run lint` and `npx tsc --noEmit` without errors
- [x] `npm run build` succeeds
- [x] `npm run test:local` passes
- [x] `npm test` passes against the live site
- [x] Wiki updated (system and manual) and a line added to `wiki/log.md`

## Notes

- **Found during verification:** right after an aircraft is deleted, the page briefly still shows its add-ons and classes as in use. Pressing their trash can in that moment shows "Du kan ej ta bort" although nothing uses them any more; a moment later it works. The server's check is correct, only the page's data is old. Happened in about one of three runs against the live site. The tests wait until the deleted row is gone before going on. Candidate for a fix.
- Flights can't be created yet, so the rules that depend on flights and bookings (R8, R9) are checked in code review. They should get tests when flights are added.
