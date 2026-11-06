---
id: TRIP-042
title: No "Snabbast" in the charter plan step
card: "#140"
depends_on: [TRIP-039]
---

# TRIP-042 No "Snabbast" in the charter plan step: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 140`.

## Data

None.

## Interface

- `PlanBuilder` has an optional setting `compareTime` (default `true`). It is passed down through `LegCard` and `AircraftList` to the aircraft cards, which leave out the comparison with the fastest ("Snabbast" or "+x min") when it is `false`.
- `app/charter/CharterPlan.tsx` passes `compareTime={false}`. `/flyg/plan` passes nothing, so it is as before.
- "Billigast" and the rest of the cards are unchanged. No text changes.

## Decisions

- **A setting, not a copy and not a rule.** The cards stay one shared component (the owner's wish: no duplicated code). Hiding the badge is presentation, so `lib/fare-rules.ts` (`aircraftOptions` still computes `fastest` and `timeDiff`) and its unit tests are unchanged.
- **Not "hide it when all times are equal".** That would also change flights when every aircraft happens to have the same time; the card says flights are as before.
- The setting is passed through two components that don't use it themselves (`PlanBuilder` to `LegCard` to `AircraftList`), like `emptyLink`; with one setting a context would be more code.
