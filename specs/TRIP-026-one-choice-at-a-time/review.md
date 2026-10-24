---
id: TRIP-026
title: One choice at a time on the plan page
---

# Code review of TRIP-026

**Result:** Passed
**Date:** 2026-10-24, review run 1
**Summary:** The change does what TRIP-026-R1 to R5 ask for, each requirement has a browser test named after it plus unit tests for the counter, `legDone()`, `firstViews()` and the aircraft with room, and focus is handled for Välj, Klar, reopening a card and the chosen aircraft. No must-fix findings.
**Security:** Passed. Nothing on the server changed (no sign-in, admin, API routes, server actions, database queries or personal data); the address is still checked by `checkChoice()` and prices are calculated from the database. `/security-review`: not needed, for the same reason.

How the review works: `wiki/system/code-review.md`.

## Must fix

None.

## Should fix

- `app/flyg/plan/TripBuilder.tsx` (`done()`) The focus target tested `next === -1` twice in one expression. **Done:** a named `focus` with a comment.
- `app/flyg/plan/AircraftList.tsx` (`AircraftCard`) Copies the disclosure pattern of `FlightCard` (open state, `aria-expanded` button, chevron, details with Välj). Too big for this change. **Done:** added to the board as TECH-020 (#69).
- `wiki/system/aircraft-and-classes.md` A paragraph right after a list item rendered as part of it. **Done:** blank line added.

## Suggestions

- `app/flyg/plan/TripBuilder.tsx` The focus effect keeps its target until the element exists; a target that never appears could take focus later. **Done:** left as it is. Every view change replaces the target, and the elements it names always appear once the address is read back; recorded in `solution.md`.
- `app/flyg/plan/LegCard.tsx` (`Unfold`) `aria-expanded={false}` on a button that is replaced, never expanded, would be announced as "collapsed". **Done:** removed; the buttons are named by their visible label ("Valt plan …", "Klart för utresan …"). To be confirmed in the live screen-reader pass.
- `lib/fare-rules.ts` and `app/flyg/` The plural "resenär"/"resenärer" is written out in about six places. **Done:** grouped into TECH-020 (#69).

## Outside the change

- The comment on `AircraftTime` in `app/flyg/plan/FlightTime.tsx` named only Din resa. **Done:** fixed in this change.
- The shared choice card and the traveller plural: TECH-020 (#69), added.
