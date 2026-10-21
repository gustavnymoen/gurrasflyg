---
id: TRIP-005
title: "Routes, departures and aircraft assignment"
---

# Verification of TRIP-005

Specified after the feature was built. Checked with the tests in `tests/TRIP-005-routes-and-aircraft-assignment.spec.ts`, locally against a fresh test database (`npm run test:local`) and against the live site (`npm test`).

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-005-R1 | Test `TRIP-005-R1 there are 51 airports`, reading the test database | local | Pass | 2026-10-20 |
| TRIP-005-R2 | Test `TRIP-005-R2 200 routes, each with a return route` | local | Pass | 2026-10-20 |
| TRIP-005-R3 | Test `TRIP-005-R3 flight times follow the distance` | local | Pass | 2026-10-20 |
| TRIP-005-R4 | Test `TRIP-005-R4 2–3 departures a day, 06:00–21:30, 3 hours apart` | local | Pass | 2026-10-20 |
| TRIP-005-R5 | Test `TRIP-005-R5 generating the routes again gives the same migration` | local | Pass | 2026-10-20 |
| TRIP-005-R6 | Test `TRIP-005-R6 admin page shows the assignment status` | local, live | Pass | 2026-10-20 |
| TRIP-005-R7 | Test `TRIP-005-R7 and R9 assign to every route, and deleting the aircraft clears them` | local | Pass | 2026-10-20 |
| TRIP-005-R8 | Test `TRIP-005-R8 without aircraft nothing can be assigned` | local | Pass | 2026-10-20 |
| TRIP-005-R9 | Test `TRIP-005-R7 and R9 assign to every route, and deleting the aircraft clears them` | local | Pass | 2026-10-20 |

## Checks before done

- [x] `npm run lint` and `npx tsc --noEmit` without errors
- [x] `npm run build` succeeds
- [x] `npm run test:local` passes
- [x] `npm test` passes against the live site
- [x] Wiki updated (system and manual) and a line added to `wiki/log.md`

## Notes

- R1–R4 read the database directly, which is only possible locally. R7–R9 would replace the live site's assignments, so they are skipped against the live site. Production has the same migrations, so the data is the same.
- The spec first said ARN–JFK takes 505 minutes; the generated data says 500, which matches the formula. The spec was corrected.
- R8 requires that no aircraft exist in the test database, which holds because every test deletes its aircraft and the database is rebuilt for every run.
