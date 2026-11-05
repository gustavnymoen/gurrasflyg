---
id: TRIP-034
title: Styled multi-choice charter filters
card: "#125"
depends_on: [TRIP-013]
---

# TRIP-034 Styled multi-choice charter filters: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 125`.

## Data

None. No table or migration changes; the filters work on the destination cards already loaded in the browser.

## Interface

- **`app/components/MultiSelect.tsx`** (new, reusable): a button "<Name>: Alla | <option> | N valda" (`aria-expanded`, `aria-controls`) that opens a `role="group"` panel with one `Checkbox` per option, labelled "<name> (<count>)". The button uses `fieldClass("small")` and `ChevronIcon`, the panel `floatClass` like `Menu`. It owns only whether the panel is open; the choices come in as `selected` and go out through `onChange`.
- **`app/charter/DestinationBrowser.tsx`:** the four `<select>`s are replaced by four `MultiSelect`s. The filter row is one column on a phone, two from `sm`, four from `md`.
- **`lib/destinations.ts`:** `Filters` holds a list per filter; `parseFilters`, `filtersToParams`, `applyFilters`, `filterOptions` and `listHref` read and write repeated parameters; `withChoices` (new) changes the choices of one filter and unchecks countries outside the chosen continents.
- Texts (Swedish): "Alla", "N valda", the filter names as before.

## Decisions

- **Any-of within a filter, all-of between** (`applyFilters`). The count of an option is what it would give with the other filters and the search (`facetCounts`, unchanged), so it is the number of hits that option adds up to.
- **Dead options hidden, chosen ones kept** (`filterOptions`): an option with no hit is left out unless it is chosen, so it can be removed. A combination the visitor reaches by the controls is therefore never empty; a typed address can still be.
- **The panel stays open while choosing** so several boxes can be checked in a row; it closes with Escape (focus returns to the button), a click outside, Tab out, or opening another filter (a click outside, as in `Menu`).
- **Countries follow the continents in `withChoices`**, not in `parseFilters`: the address is only checked against the data, as before; the rule applies when the visitor changes a continent.
- **No native picker on a phone:** one control everywhere, as the card decided. On a phone the panel is as wide as its button and can cover the next button; tapping outside closes it.
- **Antarktis** has no countries, so it does not limit Land; with hidden empty options only the countries that have a destination there are listed.
- **The panel is as wide as its button** at every width, so the right-most panel never runs past the screen; long names wrap. Checkbox ids use the option's index, since values such as "Industrial site" contain spaces.
