---
id: TRIP-045
title: Agneta knows continents, aircraft, classes and add-ons
card: "#159"
depends_on: [TRIP-017, TRIP-032, TRIP-039, TRIP-044]
---

# TRIP-045 Agneta knows continents, aircraft, classes and add-ons: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 159`.

## Data

None. No table or migration. The text reads `aircraft`, `aircraft_capacity`, `classes`, `addons` and `aircraft_class_addons` through `readFleet()` and `readAddons()` (`lib/flights.ts`), the same functions the booking uses.

## Interface

- **`lib/chat-prompt.ts`, `buildSystemPrompt()`**
  - A `Continent:` line in every destination block (`d.continent`).
  - A section `# AIRCRAFT, CLASSES AND ADD-ONS` between the booking text and the knowledge: `EQUIPMENT_RULES` (what the factors mean, the price and time formulas, the charter exception for the time factor, the add-on rules: up to `MAX_ADDONS` of each, no beer under `ADULT_AGE`, `Dåliga nerver` at `NERVES_PRICE` on flights only, the charter extras in the booking text) followed by one entry per aircraft with its price and time factor, and under it each class with seats, class price factor and the add-ons offered there with price and description (`equipmentSection()`).
  - One rule in `INSTRUCTIONS`: use only that section and the Continent lines; what is not there does not exist for us; never price or time a route from the factors.
- Nothing visible to the visitor changes except what she answers. No route, tool or page is touched.

## Decisions

- **In the main prompt, not a tool** (decided with the user): the data is a few hundred tokens, it keeps one cacheable text, and she can answer in the plain chat as well as in help mode.
- **Factors are shown as the admin shows them** (`formatFactor`, "1,20", "4,00") with a one-line explanation of what 1,00 means, so "how much faster or dearer" is relative to 1,00 and no route price or time is ever given from them.
- **Classes are listed per aircraft**, not as a separate list: a class that no aircraft has cannot be bought, and `readFleet()` leaves out aircraft without classes, so the text shows exactly what a visitor can book.
- **The booking rules are not copied as numbers**: the limits come from `MAX_ADDONS`, `ADULT_AGE`, `NERVES_PRICE`, `NERVES` and the extras from `EXTRAS` (in the booking text), so a change there shows in her text.
- The unit tests add their own aircraft and add-on to the unit-test database and remove them again; the user's own database is never touched.
