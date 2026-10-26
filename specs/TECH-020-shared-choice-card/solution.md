---
id: TECH-020
title: Shared choice card and traveller plural
card: "#69"
depends_on: [TRIP-026]
---

# TECH-020 Shared choice card and traveller plural: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 69`.

## Data

None.

## Interface

- **`ChoiceCard`** (`app/components/ChoiceCard.tsx`) holds the `open` state, the full-width button with `aria-expanded`, `aria-controls` and `ChevronIcon`, and the details panel with a top border and **Välj**. Props: `summary` (the content of the button), `summaryClassName` and `chevronClassName` (the grid, which differs between the cards), `onChoose` and `children` (the details above **Välj**). It renders no frame: `FlightCard` puts it in a `Card size="flush"`, `AircraftCard` in its own bordered `li`, as before.
- **`travellersText(n)`** in `lib/format.ts` returns "0 resenärer", "1 resenär", "2 resenärer". It is used in `FlightCard`, `FlightResults`, `AircraftList`, `TripBuilder`, `TripOverview`, `PaymentForm`, `TravellersForm` and `seatingCounter` in `lib/fare-rules.ts` (the card named five places; a search found eight).

## Decisions

- **The frame stays outside.** The two cards have different frames (a shadowed `Card` and a plain border), and changing how they look is out of scope, so `ChoiceCard` takes the grid classes as props instead of owning the look.
- **The helper writes the number too**, not just the word, since every place wrote "number space word".
