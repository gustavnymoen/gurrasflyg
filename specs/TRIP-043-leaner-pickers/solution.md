---
id: TRIP-043
title: Leaner departure and aircraft pickers
card: "#145"
depends_on: [TRIP-010, TRIP-011, TRIP-014, TRIP-024, TRIP-026, TRIP-039, TRIP-042]
---

# TRIP-043 Leaner departure and aircraft pickers: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 145`.

## Data

None. The address parameters (`ut-plan`, `ut-klasser`, `hem-plan`, `hem-klasser`), the tables and the prices are as before (Agneta, TRIP-040, uses the same parameters).

## Interface

**Departures** (`/flyg` and charter, R1–R3)

- `app/components/ChoiceCard.tsx` is reshaped: it is no longer one button over the whole card but a row with the summary, a visible **Välj** and a separate chevron button that unfolds the details. The two buttons are named after the departure (`Välj SK1122 kl 06:50`, `Visa mer om SK1122 kl 06:50`). `chosen` (charter only) gives Välj `aria-pressed` and the "✓ Vald" text.
- `FlightCard` (flight booking) and `TripCard` in `CharterResults` (charter) both use it. Charter's row keeps times, travel time and price; airline, flight number, changes and date are in the unfold. `app/components/Detail.tsx` is the shared `dt`/`dd` row (it was a private function in `FlightCard`).
- The return list is shown after the outbound is chosen: it was already so in both (R3), and is unchanged.

**Aircraft step** (`/flyg/plan` and charter, R4–R10; `PlanBuilder` serves both)

- `AircraftList` is one row per aircraft (name, flight time, seats, price per person, the comparison badges, **Välj**). Välj opens the row (`aria-pressed`); only one row is open at a time. The open row holds `ClassList`.
- `ClassList` is the classes of the open row (price, seats, +/−), the counter "1 av 2 placerade" (`aria-live="polite"`), the price of the flight and **Fortsätt**, which is disabled with "Placera ut N resenärer till" (its accessible description) until everyone has a class. "Klar", its error message and the "Valt plan" block are gone.
- `LegCard` shows the aircraft list (open) or the folded summary. `PlanBuilder` has the text at the top ("Välj plan och fördela resenärerna på klasser. Hemresan kommer sedan.") and the box with the total, which has no button of its own any more.
- Fortsätt on a flight folds it and shows the next flight that is not folded (focus on its heading); when there is none (the return flight, or the only flight), `router.push(nextHref)` goes on to Resenärer.

## Decisions

- **Opening a row is not a choice.** Välj only opens the row (state in `PlanBuilder`, `opened`, per flight); nothing is written to the address. The aircraft is chosen when the first traveller is placed in one of its classes: `placeTraveller` (`lib/trip.ts`) makes that aircraft the leg's aircraft, and if it is another aircraft than before, starts from 0 in every class (R6: at most one aircraft has numbers, in the address too). That is the old `chooseAircraft` rule, now private to `lib/trip.ts`, and it keeps the address as before. A row of an aircraft that holds no travellers shows 0 in every class.
- **`opened` is `undefined` until the visitor opens a row**, and then means "the aircraft that holds the travellers" (for a reload or a change from Agneta). A flight that is opened again from its summary resets it to `undefined`.
- **`LegView` is `hidden | open | folded`** (was four values). Which aircraft is open is a separate state, since it no longer follows from the flight's view.
- **The return flight keeps its choices** when the outbound is changed (R8): `opened` and the address are per flight, and Fortsätt on the outbound only folds it and moves on to the next flight that is not folded.
- **Fortsätt on a flight that is edited again** (the return flight is already folded) goes on to Resenärer, since there is no flight left to show. The same rule as for the last flight: no flight to show, so continue.
- **After coming back from Resenärer** every flight is folded and there is no button of its own in the total box (the card says so). The way on is the summary of the last flight (open it, then Fortsätt), or the browser's forward button. This is the cost of "Fortsätt, not a button in the box"; noted in `review.md`.
- **Reshaped, not copied.** `ChoiceCard` is used by both departure lists; `AircraftList` and `ClassList` keep their jobs, `LegCard` loses `Unfold` for "Valt plan". The separate `tried` state, `seatingProblem`, the "Klar" flow and the texts under the total were removed.
- **Charter's "Snabbast"** is still hidden with `compareTime` (TRIP-042), unchanged.
- **Opening a second row without placing anyone** shows 0 placed there while the first aircraft still holds everyone (R6: opening changes nothing). Accepted; the first row is one click away.
