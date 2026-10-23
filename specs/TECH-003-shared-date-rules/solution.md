---
id: TECH-003
title: Shared date rules
card: "#13"
depends_on: [TRIP-001]
---

# TECH-003 Shared date rules: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 13`.

## Data

None.

## Interface

Visitors see no change.

**`lib/dates.ts` (R2)** holds the rule for which dates can be booked. It has no `server-only` and no browser-only code, like `lib/review-rules.ts` and `lib/numbers.ts`, so client components, server code and the tests can all import it.

- Dates are calendar dates in the visitor's local time, written as `YYYY-MM-DD`. Such text sorts in date order, so `dateError` compares with `<` and `>` and needs no `Date` objects.
- `toDateString(date)` builds the text from the local year, month and day; `toISOString()` gives UTC and can be a different day.
- `addMonths(date, months)` starts from the first day of the target month and then sets the day to the smaller of the original day and that month's last day, so 31 August + 6 months is 28 February instead of running over into March.
- `bookableRange(today)` takes today as an argument instead of reading the clock itself, so the tests can give a fixed date. `DateRange` is its return type, `{ min, max }`, both included.
- `dateError(value, range)` returns the message or `null`. The "6" in "Du kan boka max 6 månader framåt." comes from `MAX_MONTHS_AHEAD`, so the number in the message follows the rule.

**`app/components/SearchForm.tsx` (R1):** `DateInput` calls `bookableRange(new Date())` and `dateError(value, range)`, and gives `range.min` and `range.max` to the date field. Everything else is unchanged, including `use(io())`, which makes "today" the visitor's today and not the day the page was built.

**Tests (R3):** `tests/TECH-003-shared-date-rules.spec.ts` (since TECH-015 the unit tests in `lib/dates.test.ts`) imports the module and calls it directly, without a page, like `TECH-005-R3`. `tests/helpers.ts` keeps its own `bookableDates()` on purpose (see the card).

## Decisions

- **The messages live with the rule.** The next features show the same messages in other places (the return date, the search results), so they are part of the shared module, not of the form.
- **No new rules yet.** The return date and the charter periods come with the features that need them (card, Out of scope).
