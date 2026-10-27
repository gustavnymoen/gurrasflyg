---
id: TRIP-019
title: "Visual design: admin page"
card: "#28"
depends_on: [TRIP-008]
---

# TRIP-019 Visual design: admin page: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 28`.

## Data

None.

## Interface

- `app/components/Button.tsx`: every text button on `/admin` is a `<Button>` in size `compact` (R1, R5): Lägg till, Lägg till plan, Spara/Avbryt, Spara omdöme, Tilldela plan, Logga ut, and Ja/Nej/OK in the dialogs. `buttonClass()` is removed, since nothing outside `Button.tsx` needed it; `Button` builds its classes itself.
- `app/components/Card.tsx`: `Card` has a `size` (`default`, `compact`) instead of the exported `cardClass` and `compactCardClass` (R1, R3). New `floatClass` (floating surface, line border, floating shadow) for what floats above the page; the suggestion list in `Autocomplete.tsx` uses it too. `floatingCardClass` is a card's shape with that look, for dialogs.
- `app/admin/admin-ui.tsx` (R1, R3):
  - `CollapsibleCard` is a compact `Card`.
  - `Dialog` floats with `floatingCardClass` instead of looking like a card (R3).
  - `IconButton` takes `expanded`, so the arrows that unfold an aircraft or a class in `AircraftTable.tsx` are `IconButton`s instead of their own button style.
  - `SaveCancel` and `DeleteButton` use `Button`.
- `app/admin/AircraftForm.tsx`: "+ Lägg till klass" and "+ Lägg till addon" are quiet compact `Button`s; the form panel uses the compact card radius.
- `app/admin/AircraftTable.tsx`: the add-on chips use `rounded-pill`.
- `app/admin/ReviewSection.tsx`: each star in "Nytt omdöme" is a 28 × 28 px button (WCAG 2.5.8 target size), found by axe.
- `DESIGN.md`: the admin pieces and when to use them (R7).
- `tests/helpers.ts`: the token colours and shadows, `css()`, `expectTextMessage()`, `reviewForm()` and `writeReview()` moved here from the TRIP-008 and TRIP-006 tests, since TRIP-019's tests need them too.

No texts change.

## Decisions

- **`<Button>` instead of `buttonClass()`.** The class helper was there so the admin page could keep its `<button>`s during TRIP-008. With every button a `<Button>`, the helper is one more way to do the same thing, so it is removed. The same goes for `cardClass` and `compactCardClass`, now a `size` on `Card`.
- **Dialogs float, cards don't.** A dialog sits above the page, like the suggestion list, so both use `floatClass` (floating surface and shadow). Before, the dialog looked like a card.
- **Dialog buttons are compact.** R5 says the admin buttons are compact; the dialogs are only on the admin page.
- **The quiet "+ Lägg till" keeps its padding.** Removing the padding with `px-0` would be a second padding class on the same element, decided by the order in the CSS, not in the class list (`DESIGN.md`, rules).
- **The collapsible card's heading and the star picker stay their own `<button>`s.** They are not buttons in the design's sense (a heading that folds, a radio group of stars); they use the tokens only.

How it works today: [Design](../../wiki/system/design.md).
