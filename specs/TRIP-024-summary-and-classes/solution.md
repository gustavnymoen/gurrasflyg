---
id: TRIP-024
title: Aircraft in the summary, classes from zero
card: "#62"
depends_on: [TRIP-011]
---

# TRIP-024 Aircraft in the summary, classes from zero: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 62`.

## Data

None. The seating is still in the address (`ut-klasser`, `hem-klasser`); a seating with every class at 0 is written as an empty value (`ut-klasser=`), which reads back as "no one placed", so going back and on keeps it (TRIP-011-R10).

## Interface

- **Din resa** (`Overview` in `app/flyg/plan/TripBuilder.tsx`): under a flight with a chosen aircraft, "Hindenburg · 9 h 20 min · landar 15:40" (with "+1", read as "nästa dag"). The text "9 h 20 min · landar 15:40" is one component, `FlightTime` in `app/flyg/plan/FlightTime.tsx` (renamed from `Arrival.tsx`), used both by `AircraftList` and, through `AircraftTime`, by Din resa, so the values are the same (R1). It follows the address, so a change and a reload show the same.
- **Step Klasser**: the first seating is `firstSeating()` in `lib/fare-rules.ts`, every class at 0 (R2), replacing TRIP-011's `defaultSeating()`. `seatingProblem()` gives "2 resenärer har ingen klass. Lägg till dem i en klass.". The totals already were `legTotal()` of the seating, so they are the sum so far and 0 kr at first (R3).
- **No going on** (R4): `everyoneSeated()` checks every flight. The trip total's note says "Lägg alla resenärer i en klass på varje flyg för att gå vidare." until it holds, then "Snart fyller du i resenärerna och bokar här."; TRIP-012 adds Fortsätt and uses `everyoneSeated()`.
- **Focus** (R5): `RoundButton` has a `keepFocus` prop. With it, an unavailable button gets `aria-disabled="true"` instead of `disabled` and no click handler, and the same faded look (`aria-disabled:` variants). Färre and Fler in `ClassList` use it.

## Decisions

- **`keepFocus` instead of changing every `RoundButton`.** A native `disabled` button loses focus when it becomes disabled, which is the bug. The other round buttons (the travellers in the search form, the calendar's months, the review carousel, admin) may have the same problem, but changing them changes other features' behaviour, so they are left for TECH-019 (#66).
- **`firstSeating()` lists every class at 0** rather than returning `{}`: both mean no one placed, but the explicit form says what the page shows.
- **Shared test helpers in `tests/plan.ts`.** TRIP-024's tests need TRIP-011's aircraft fixture and steps, so they were moved there instead of copied. The worker fixture creates the aircraft once for both files. `place()` clicks Fler one at a time and waits for the new number, since each click is read back from the address.
