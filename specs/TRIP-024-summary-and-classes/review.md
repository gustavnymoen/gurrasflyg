---
id: TRIP-024
title: Aircraft in the summary, classes from zero
---

# Code review of TRIP-024

**Result:** Passed
**Date:** 2026-10-24, review run 1
**Summary:** The change does what its five requirements say: the aircraft in Din resa, classes from 0 (round-tripped in the address as an empty value), totals so far, `everyoneSeated()` blocking the way on, and `RoundButton keepFocus` keeping focus with `aria-disabled`. Every requirement has a test named after it, with the planned axe checks; TRIP-011's tests match the new start and `defaultSeating()` is gone.
**Security:** Passed. No sign-in, admin, API route, server action, database query or personal data changes; the seating is still checked by `checkChoice()`/`validSeating()` and prices calculated from the server's fleet. `/security-review`: not needed, per the card's test plan.

How the review works: `wiki/system/code-review.md`. A later run is added at the top as "Review run 2".

## Must fix

None.

## Should fix

- `wiki/system/testing.md:38` Lists `tests/helpers.ts` as the shared helpers but not the new `tests/plan.ts` (the aircraft fixture and the `/flyg/plan` steps), so TRIP-012 could copy them. **Done:** a line about `tests/plan.ts` added.

## Suggestions

- `app/flyg/plan/TripBuilder.tsx:176` "flight time · landar <arrival>" was built in two places, here and in `AircraftList.tsx:109`, in two ways. A shared component would guarantee the "same values as in the aircraft list" of R1. **Done:** `FlightTime` in `app/flyg/plan/FlightTime.tsx` (renamed from `Arrival.tsx`), used by both; the plan tests pass again.
- `tests/TRIP-024-summary-and-classes.spec.ts:69` "Back to Plan and on keeps the numbers" overlaps `TRIP-011-R10 …`. **Done:** kept, since the card's test plan asks for it; a cheap one to drop if the suite grows slow.
- `app/components/RoundButton.tsx:27` A pattern worth learning: `aria-disabled` plus no click handler keeps the button in the tab order and focus where it is, which native `disabled` can't. Opt-in, so other features are unaffected; the trade-off is that unavailable Färre buttons (every class at 0) can be reached with Tab. **Done:** left as it is.

## Outside the change

- The other `RoundButton` users (search form travellers, calendar months, review carousel, admin) still use native `disabled` and can lose focus the same way. Added to the board as TECH-019 (#66).
