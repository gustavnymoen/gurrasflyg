---
id: TECH-003
title: Shared date rules
---

# Verification of TECH-003

How each requirement was checked.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-003-R1 | `npm run lint`, `npm run typecheck` and `npm run build` without errors or warnings; `npm run test:time` 120 passed, among them `TRIP-001-R6 date can be chosen from today to six months ahead` and `TRIP-001-R7 …` with the date messages. Against the live site after the deploy: "Live tests" on `main`, `npm test` 107 passed, 13 skipped (`runsLocally`) | local, live | Pass | 2026-10-23 |
| TECH-003-R2 | Code review with a search (`grep -rn` for `toDateString`, `addMonths`, "redan passerat" and "månader framåt" in `app`, `lib`, `scripts`, `tests`): they occur only in `lib/dates.ts`, the tests, and `bookableDates()` in `tests/helpers.ts`, which keeps its own copy on purpose (card, Background). `lib/dates.ts` has no `server-only` and uses no browser API; it is imported by the client component `SearchForm.tsx` (the build passes) and by the tests running in Node | local | Pass | 2026-10-23 |
| TECH-003-R3 | Tests `TECH-003-R3 addMonths ends on the last day of a shorter month`, `… toDateString writes the local date with leading zeros`, `… bookableRange and dateError allow today up to six months ahead`, without a browser page | local | Pass | 2026-10-23 |

## Test suite

`npm run test:time` before and after the change.

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 117 | 76.1 s | 2.5 s |
| After | 120 | 76.3 s | 2.5 s (`TRIP-006-R2 arrows, keys and clicks move the cards round`) |

## Definition of Done

- [x] Tests: every requirement is tested or has a recorded check; `npm run test:local` passes (2026-10-23)
- [x] Test suite: within the time budgets, total time unchanged (the three new tests take no browser and a few milliseconds), the new tests follow the quality rules
- [x] Deployed, and `npm test` passes against the live site ("Live tests", 2026-10-23)
- [x] Accessibility: not applicable, visitors see no change (the existing axe tests of the start page pass)
- [x] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual: not affected (visitors see no change); system docs (`wiki/system/architecture.md`) and `wiki/log.md` updated
- [x] No leftovers: the form's own `toDateString`, `addMonths`, limits and messages are gone
- [x] Clean code: `lib/dates.ts` follows `lib/review-rules.ts` and `lib/numbers.ts`; `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done (passed on the first run), no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements: none needed
- [x] Also done on this branch: the follow-up of TRIP-021 after its deploy (live checks recorded in `specs/TRIP-021-wcag/verification.md`)

## Requirements as built

Copied from card #13.

### TECH-003-R1 The site behaves as before

The date field on the start page shall work exactly as before.

Acceptance criteria:

- **Then** `npm run lint`, `npm run typecheck` and `npm run build` pass without errors or warnings, and the existing tests pass, both `npm run test:local` and, after deploy, `npm test` (in particular TRIP-001-R6 and R7).

### TECH-003-R2 The date rule in a shared module

A new module `lib/dates.ts`, without `server-only` and without browser-only code, shall export:

- `toDateString(date)`: the date as `YYYY-MM-DD` in local time.
- `addMonths(date, months)`: the date the given number of months later; when that day doesn't exist, the last day of that month.
- `MAX_MONTHS_AHEAD = 6`.
- `bookableRange(today)`: the earliest and latest bookable date, `{ min, max }`, as `YYYY-MM-DD`.
- `dateError(value, range)`: the message for a date outside the range ("Datumet har redan passerat." or "Du kan boka max 6 månader framåt."), or `null` for an empty or bookable date.

`SearchForm.tsx` uses these and no longer has its own `toDateString`, `addMonths`, limits or date messages.

Acceptance criteria:

- **Then** `toDateString`, `addMonths` and the two date messages occur only in `lib/dates.ts` (and the tests). (Code review, with a search.)
- **Then** `lib/dates.ts` can be imported from a client component and from server code.

### TECH-003-R3 The edge cases are tested

The module's rules shall have tests of their own that run without a browser page, in `tests/TECH-003-shared-date-rules.spec.ts`.

Acceptance criteria:

- **Then** `addMonths` of 31 August 2026 + 6 months is 28 February 2027, of 31 August 2027 + 6 months is 29 February 2028 (leap year), and of 15 January 2027 + 6 months is 15 July 2027.
- **Then** `toDateString` of 5 March 2027 is "2027-03-05", with leading zeros.
- **Given** today 20 October 2026, **then** `bookableRange` is 2026-10-20 to 2027-04-20, and `dateError` gives "Datumet har redan passerat." for 2026-10-19, `null` for 2026-10-20 and 2027-04-20, "Du kan boka max 6 månader framåt." for 2027-04-21, and `null` for an empty value.

## Notes

- `bookableDates()` in `tests/helpers.ts` was removed by TRIP-009 (2026-10-23), when the TRIP-001 date tests it served were replaced; the TRIP-009 tests fix the browser's clock instead.

## Moved by TECH-015 (2026-10-23)

The three `TECH-003-R3 …` tests moved, with the same checks and names, from `tests/TECH-003-shared-date-rules.spec.ts` (now deleted) to the unit tests in `lib/dates.test.ts`.
