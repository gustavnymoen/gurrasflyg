---
id: TRIP-028
title: Clickable destination cards, no start cards
card: "#85"
depends_on: [TRIP-013]
---

# TRIP-028 Clickable destination cards, no start cards: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 85`.

## Data

None.

## Interface

- **`StartCards`** (`app/charter/StartCards.tsx`) is deleted, with what only it used: `topCategories`, `continentChoices`, `countriesIn` and `choicesWithCounts` in `lib/destinations.ts`, the `"results"` focus target of `go()` and the `resultsHeading` ref in `DestinationBrowser`, and `CONTINENT_WITHOUT_COUNTRIES` is no longer exported. The filters are the one way to narrow the list (R1).
- **`DestinationCard`** has one link: the title inside the `<h3>`. Its `after:absolute after:inset-0` stretches over the card, which is `relative`, so a press anywhere opens the page and a screen reader finds one link named "Titel, Land" (R2). "Visa" is a `<span aria-hidden>` with the secondary button's classes.

## Decisions

- **Stretched link instead of a link around the card.** Wrapping the whole card in `<a>` would make the link's name the whole card's text. With the link on the heading the name is the title, and the heading still shows in the list of headings.
- **The focus ring is on the card** (`has-[a:focus-visible]`), and the link itself has no outline, so the ring surrounds what is pressed. It is the same ring as the rest of the site (2 px `accent-strong`, 3 px offset).
- **No hover effect.** The pointer is a hand over the whole card (the link's stretched area); nothing else changes, as asked.
- **"Visa" is hidden from screen readers** (`aria-hidden`), since it would repeat what the title link says.
