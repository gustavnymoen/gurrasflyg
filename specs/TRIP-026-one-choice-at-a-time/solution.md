---
id: TRIP-026
title: One choice at a time on the plan page
card: "#68"
depends_on: [TRIP-011, TRIP-024]
---

# TRIP-026 One choice at a time on the plan page: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 68`.

## Data

None. The choices stay in the address as in TRIP-011-R10 (`ut`, `ut-plan`, `ut-klasser`, `hem`, …). The parameter `steg=klasser` is gone with the steps Plan and Klasser; an old address with it still works, the parameter is ignored.

## Interface

- **Steps** (R5): `Steps` gets Flyg (a link back to the results), **Plan och klass** (current) and Resenärer. The `onClick` kind of step (the old button back to Plan) is removed from `StepItem`, since nothing uses it.
- **One card per flight** (`LegCard` in `app/flyg/plan/LegCard.tsx`, new): a `Card` with the heading "Utresa" or "Hemresa" (h2) and the flight line, and one of three contents:
  - `aircraft`: `AircraftList`, "Plan för utresan" (h3). Each aircraft is a card whose whole top is a button with `aria-expanded`, as `FlightCard` on `/flyg`: name, flight time and arrival, price per person and the comparisons. Opened, it lists the aircraft's classes and seats ("Ekonomi: 10 platser") and **Välj** (R2). Only aircraft with room for everyone are listed (`aircraftOptions()` filters with `canSeat()`, R1); with none, "Inget plan har plats för 5 resenärer." and a link **Till flygen** back to the results with everything chosen.
  - `classes`: at the top the chosen aircraft, "Valt plan" with its name, flight time and arrival, and its price per person in the cheapest class (`aircraftFare()`), no comparison; a button that shows the list again (R4). Below it `ClassList`, "Klasser på utresan" (h3), with the counter next to the heading: "Placera ut 3 resenärer" / "Placera ut 1 resenär", or a check and "Alla resenärer har en klass" (`seatingCounter()`, in an `aria-live="polite"` paragraph, R3). Then the classes, "Totalt för utresan", and **Klar**.
  - `folded`: a button "Klart för utresan" with the aircraft, its time and arrival, the number per class ("Ekonomi: 2 · Business: 1") and the flight's total. A click opens the card again with its classes (R4).
- **Klar** (R3): with someone not placed, the card stays open and `seatingProblem()` gives "2 resenärer har ingen klass. Lägg till dem i en klass." as an alert above Klar; the message follows the numbers and goes away when everyone is placed. With everyone placed the card folds and the next card that is not folded opens (the return card, from its list or with its classes).
- **Totalt för resan** stays under the cards (TRIP-024-R4), now always shown: the sum of the flights with an aircraft.
- **Which card is open** is page state in `TripBuilder` (`views`, one `LegView` per flight: `hidden`, `aircraft`, `classes` or `folded`). When the page opens it comes from the choices (`firstViews()` in `lib/trip.ts`, R5): a flight that is done (`legDone()`: an aircraft and everyone placed) is folded, the first one not done is open with its list or, with an aircraft, its classes, and the ones after it are hidden.
- **Focus** never gets lost: every change of view names the element to focus (the classes' heading after Välj and when a folded card opens, the list's heading after a click on the chosen aircraft, the next card's heading after Klar, or the folded card itself when no card is left). An effect after each render focuses it once it is on the page.

## Decisions

- **The open card is page state, not in the address.** The requirements keep TRIP-011-R10's parameters, and what is open follows from the choices after a reload anyway (R5). So every change now replaces the address (`history.replaceState`), and the browser's Back goes back to the flights; before, a new step added a history entry.
- **Focus waits for its element.** Välj writes the aircraft into the address, and Next.js gives it back through `useSearchParams`, possibly a render after the view changed. Until then the card shows the list (`LegCard` needs an aircraft for the classes), so the focus target is kept until the element exists instead of being focused at once.
- **Klar opens the next card that is not folded**, not only the return card. On a return trip with both done, Klar on a reopened outbound card leaves the return card folded and puts focus on the outbound card's summary, so it isn't lost (R4's "the other card stays as it is").
- **The message follows the numbers after Klar** (`tried` per flight, reset by Klar with everyone placed or another aircraft), rather than staying as it was when Klar was pressed: a message that still says 2 when one is left would be wrong.
- **The aircraft cards are bordered list items, not `Card`s**, since they sit inside the flight's `Card`; a shadow inside a shadow looked heavy.
- **`aircraftFare()`** is the price per person in an aircraft's cheapest class, now used by the list, the chosen aircraft and the "från" price (`cheapestFare()`), which each computed it before.
- **`everyoneSeated()` is replaced by `legDone()`**, which also needs an aircraft; its unit test moved to `lib/trip.test.ts`.
- **The empty list's message has no browser test.** Every database the tests run against has an aircraft with room for 10, the most a search allows, so it was checked by hand on a fresh test database without aircraft (see `verification.md`), and `aircraftOptions()` returning nothing is a unit test.
