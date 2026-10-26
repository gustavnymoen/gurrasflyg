---
id: TRIP-025
title: Departures fill in from the top
card: "#65"
depends_on: [TRIP-010]
---

# TRIP-025 Departures fill in from the top: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 65`.

## Data

None.

## Interface

- **`fillInDelay(index)`** in `lib/flight-rules.ts` (R1, R2): the start delay of card number `index`, 60 ms per card and the same for every card from the tenth on (`Math.min(index, 9) * 60`), so the whole animation takes at most about 0.8 s.
- **`--animate-fill-in`** in `app/globals.css` (R1): the keyframes `fill-in` (from transparent and 8 px up, to place) for 250 ms with `backwards` fill, so a delayed card stays hidden until its turn. It sits with the other animations in `@theme`.
- **`FlightCard`** takes an optional `fillInIndex`. With it the `<li>` gets `animate-fill-in` and `animation-delay` from `fillInDelay()`; without it there is no animation.
- **`FlightList`** (in `FlightResults.tsx`) keeps `fillIn` in state, true at first. Sorting sets it to false, so the cards lose their animation and move at once (R3).

## Decisions

- **CSS only.** The animation runs on the card's `<li>`, so no content is hidden from screen readers and the buttons can be focused and used at once (R2); the card is only transparent for a moment.
- **Why a state and not just the class.** Sorting moves the existing cards in the DOM, and a browser starts a CSS animation again when an element is moved. Taking the class away when the sorting changes avoids that, and is simpler than tracking which cards have finished.
- **A list "appears" when `FlightList` is mounted.** The outbound and return lists are different places in the tree, so changing step (or going back with Ändra) mounts a new list with `fillIn` true again (R1, R3). The skeleton cards are replaced by the list when the search is done, so the first list animates then.
- **Reduced motion (R4)** needs nothing new: the rule in `globals.css` that switches off all animations for `prefers-reduced-motion: reduce` covers it.
- **R2 in the browser test** only shows the keyboard working during the animation: the routes have 5–7 departures, so the cap at the tenth card is a unit test.
- **axe waits for the animation.** `expectNoA11yViolations` (`tests/helpers.ts`) first waits for the cards' `fill-in` animations, since a card that is still partly see-through reads as low contrast. Found when CI ran the existing TRIP-010 axe tests.
