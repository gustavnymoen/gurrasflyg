---
id: TRIP-001
title: "Flight search form"
---

# Verification of TRIP-001

Specified after the feature was built. Checked with the tests in `tests/TRIP-001-flight-search-form.spec.ts`, locally against a fresh test database (`npm run test:local`) and against the live site (`npm test`).

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-001-R1 | Test `TRIP-001-R1 start page shows the search form` | local, live | Pass | 2026-10-20 |
| TRIP-001-R2 | Test `TRIP-001-R2 suggests at most 5 airports …` | local, live | Pass | 2026-10-20 |
| TRIP-001-R3 | Test `TRIP-001-R3 says when no airport matches` | local, live | Pass | 2026-10-20 |
| TRIP-001-R4 | Test `TRIP-001-R4 airport can be chosen with mouse or keyboard` | local, live | Pass | 2026-10-20 |
| TRIP-001-R5 | Test `TRIP-001-R5 same airport in both fields …` | local, live | Pass | 2026-10-20 |
| TRIP-001-R6 | Test `TRIP-001-R6 date can be chosen from today to six months ahead` | local, live | Pass | 2026-10-20 |
| TRIP-001-R7 | Test `TRIP-001-R7 dates outside the bookable range show a message` | local, live | Pass | 2026-10-20 |
| TRIP-001-R8 | Test `TRIP-001-R8 number of travellers is between 1 and 10` | local, live | Pass | 2026-10-20 |
| TRIP-001-R9 | Test `TRIP-001-R9 return trip checkbox starts unchecked` | local, live | Pass | 2026-10-20 |
| TRIP-001-R10 | Test `TRIP-001-R10 airport endpoint returns at most 5 matches` | local, live | Pass | 2026-10-20 |

## Checks before done

- [x] `npm run lint` and `npx tsc --noEmit` without errors
- [x] `npm run build` succeeds
- [x] `npm run test:local` passes
- [x] `npm test` passes against the live site
- [x] Wiki updated (system and manual) and a line added to `wiki/log.md`

## Notes

- **Found during verification:** if the traveller types quickly and presses Enter before the new suggestions have arrived (150 ms delay plus the request), the highlighted suggestion from the *previous* list is chosen. For example, changing "lon" to "arlanda" and pressing Enter at once chooses London Heathrow. The R4 test waits for the new list. Candidate for a fix in a later feature.
- The phone layout in R1 was checked on the live site with Playwright's iPhone 13 profile (390 px wide): the fields are stacked and the page doesn't scroll sideways.
