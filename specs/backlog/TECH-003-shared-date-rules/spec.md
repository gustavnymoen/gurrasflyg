---
id: TECH-003
title: Shared date rules
area: Flight booking
status: backlog
created: 2026-10-20
updated: 2026-10-20
depends_on: [TRIP-001]
---

# TECH-003 Shared date rules

## Goal

The rule for which dates can be booked (today up to six months ahead, in the visitor's local time) is defined once, in a module that both the browser and the server can use. The return trip date picker, the search results and charter booking can then use the same rule instead of copying it. The site behaves exactly as before.

## Background

The rule lives inside `app/components/SearchForm.tsx` (TRIP-001-R6 and R7): the private functions `toDateString` (a date as `YYYY-MM-DD` in local time) and `addMonths` (months added without running over, so 31 August + 6 months is the last day of February), the limits `min` and `max` computed in `DateInput`, and the two messages "Datumet har redan passerat." and "Du kan boka max 6 månader framåt.".

The next features need the same rule: the return date can't be before the outbound date nor more than six months ahead, the search results must refuse dates outside the range when the search arrives in the address, and charter trips can only be booked within both the range and their timetable's period (`specs/overview.md`, Rules for all features).

`tests/helpers.ts` has its own `bookableDates()` that works out the same limits. It stays as it is, on purpose: a test that computed its expected values with the code under test would pass even when the rule is wrong.

## Users

Developers. Visitors see no difference.

## Scope

**In scope**

- A module `lib/dates.ts` with the date rule and its messages.
- `SearchForm.tsx` uses the module.
- Tests for the module's edge cases.

**Out of scope**

- New rules (return date after the outbound date, timetable periods): they come with the features that need them.
- Time zones other than the visitor's own: the dates are calendar dates in local time, as today.

## Requirements

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

## Data

None.

## Interface

No visible change.

- `lib/dates.ts` (new).
- `app/components/SearchForm.tsx`: uses `lib/dates.ts`.
- `tests/TECH-003-shared-date-rules.spec.ts` (new).

## Non-functional requirements

None beyond `specs/overview.md`.

## Open questions

None.
