---
id: TRIP-043
title: Leaner departure and aircraft pickers
---

# Code review of TRIP-043

**Result:** Passed
**Date:** 2026-11-06, review run 1
**Summary:** The change meets R1–R10. The old structure is removed (`seatingProblem`, the `tried` state, "Klar", the "Valt plan" block, the private `Detail` in `FlightCard`). `ChoiceCard`, `AircraftList`, `ClassList` and `LegCard` are reshaped rather than copied, and every requirement has a named test (browser and unit).
**Security:** Passed. No new input, server action, API route or query. The address is still checked by `checkChoice`/`validSeating`, and `placeTraveller` only produces values `validSeating` accepts. `/security-review` is not needed, as the card says.

## Must fix

None.

## Should fix

- Opening a second aircraft row without placing anyone (R6) shows "0 av 3 placerade" and a disabled Fortsätt, while everyone is placed on the first aircraft and the flight is done in the address. **Accepted:** this is what R6 says (opening changes nothing); the first row is one click away. Noted in `solution.md`.
- `verification.md` has numbers still to fill in. **Done** before the commit.

## Suggestions

- `ChoiceCard`: `aria-controls` points to an element rendered only while open. **Accepted:** axe accepts it for `aria-expanded="false"`, and it is the pattern used elsewhere.
- `proceed` goes on to Resenärer when the outbound is re-opened with the return folded. **Done:** already described in `solution.md`.
- R4 says flight time "(flight booking only)", but charter rows show the departure's own time too, as before. **Accepted:** left as built; the manual and system docs say so.

## Outside the change

None.
