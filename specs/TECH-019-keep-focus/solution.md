---
id: TECH-019
title: Keep focus on the other round buttons
card: "#66"
depends_on: [TRIP-024]
---

# TECH-019 Keep focus on the other round buttons: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 66`.

## Data

None.

## Interface

- **`RoundButton`** (`app/components/RoundButton.tsx`) always marks an unavailable button `aria-disabled="true"` and never sets the native `disabled`. The click handler is dropped while it is unavailable, so pressing it does nothing. The `keepFocus` prop is gone; the faded look is the `aria-disabled:` classes that were already there (the `disabled:` ones are removed).
- **Users:** `SearchForm` (− / +), `Calendar` (previous / next month), `ReviewCarousel` (the arrows), `AircraftForm` ("Lägg till klass", "Lägg till addon"), `ClassList` (Färre / Fler) and `TravellersForm` (− / +) now get this without an extra prop.
- **`Calendar`** no longer moves focus away from a month button that becomes unavailable (`changeMonth` and the `onFocusGrid` prop, with its `DatePicker` call site, are deleted): focus stays on the button, as R1 says.

## Decisions

- **One way only.** `keepFocus` was an opt-in, so every new round button would have had the problem until someone remembered it. Making it the only behaviour removes the choice (R2).
- **The calendar's workaround is deleted, not kept.** It existed because a native `disabled` button drops focus; with `aria-disabled` there is nothing to work around.
- **The review carousel's arrows are never unavailable** (it wraps around), so for them R1 is shown by focus staying on the arrow after it is pressed.
- **The test for "Lägg till klass"/"Lägg till addon"** checks `aria-disabled` and that focus stays while the form changes under it; those buttons are unavailable until the form is valid, so the focus case is a button that becomes unavailable after being pressed.
