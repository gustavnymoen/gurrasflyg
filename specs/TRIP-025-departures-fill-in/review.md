---
id: TRIP-025
title: Departures fill in from the top
---

# Review of TRIP-025

**Result:** Passed (2026-10-26, reviewer agent following `wiki/system/code-review.md`)

**Security:** Passed. The change is styling and client state only; `/security-review` not needed (card).

## Must fix

None.

## Should fix (fixed)

- `expectFillIn` read `getAnimations()` right after the list appeared, which depends on timing since a finished animation drops out. The tests now read `animationName` and `animationDelay` from the computed style, which also makes the R3 check able to fail if the class stayed.

## Suggestions

- `FlightCard` tested `fillInIndex === undefined` twice: now one `animated` constant (done).
- Sorting drops the animation of a card still animating, so it jumps to its end state. Fine for R3. It relies on the list being mounted again when the step changes (noted in `solution.md`).

## Outside the change

- The suite is 17 % slower (141 s to 166 s), within the 25 % limit; recorded in `verification.md`.
