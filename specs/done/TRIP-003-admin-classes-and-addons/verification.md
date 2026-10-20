---
id: TRIP-003
title: "Admin: cabin classes and add-ons"
---

# Verification of TRIP-003

Specified after the feature was built. Checked with the tests in `tests/TRIP-003-admin-classes-and-addons.spec.ts`, locally against a fresh test database (`npm run test:local`) and against the live site (`npm test`).

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-003-R1 | Test `TRIP-003-R1 card shows classes and add-ons and can be folded` | local, live | Pass | 2026-10-20 |
| TRIP-003-R2 | Test `TRIP-003-R2 add a cabin class, or cancel` | local, live | Pass | 2026-10-20 |
| TRIP-003-R3 | Test `TRIP-003-R3 class names are required and unique` | local, live | Pass | 2026-10-20 |
| TRIP-003-R4 | Test `TRIP-003-R4 rename a cabin class` | local, live | Pass | 2026-10-20 |
| TRIP-003-R5 | Test `TRIP-003-R5 delete a cabin class, unless it is in use` | local, live | Pass | 2026-10-20 |
| TRIP-003-R6 | Test `TRIP-003-R6 add an add-on with name, price and description` | local, live | Pass | 2026-10-20 |
| TRIP-003-R7 | Test `TRIP-003-R7 add-on fields are required and names unique` | local, live | Pass | 2026-10-20 |
| TRIP-003-R8 | Test `TRIP-003-R8 change an add-on` | local, live | Pass | 2026-10-20 |
| TRIP-003-R9 | Test `TRIP-003-R9 delete an add-on, unless it is in use` | local, live | Pass | 2026-10-20 |

## Checks before done

- [x] `npm run lint` and `npx tsc --noEmit` without errors
- [x] `npm run build` succeeds
- [x] `npm run test:local` passes
- [x] `npm test` passes against the live site
- [x] Wiki updated (system and manual) and a line added to `wiki/log.md`

## Notes

- The tests create classes, add-ons and aircraft named "E2E …" and delete them again. `tests/global-teardown.ts` removes any that a failed test leaves behind.
- "In use by a flight price or a booking" (R5, R9) can't be tested yet, since there is no way to create flights or bookings; checked in code review of `CLASS_IN_USE` and `ADDON_IN_USE` in `lib/admin.ts`.
