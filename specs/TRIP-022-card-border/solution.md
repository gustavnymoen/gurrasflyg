---
id: TRIP-022
title: One border colour for cards and buttons, toned-down primary buttons
card: "#43"
depends_on: [TRIP-008, TRIP-019, TRIP-020]
---

# TRIP-022 One border colour for cards and buttons, toned-down primary buttons: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 43`.

## Data

None.

## Interface

- `app/components/Card.tsx`: the card look uses `border-line-strong` instead of `border-edge`. Every card on the site (the search form, the sign-in form, the admin cards) uses it.
- `app/admin/AircraftForm.tsx`: the aircraft form, which draws its own frame, uses `border-line-strong`.
- `app/components/ReviewCarousel.tsx`: every review card has `border-line-strong`; only the side cards get `cursor-pointer` and the blur. The review in focus no longer has `border-accent-strong`.
- `app/globals.css`: the token `--color-edge` is removed, since nothing uses it any more. A new token `--color-accent-soft` is the accent at 30 % (`color-mix` with transparent).
- `app/components/Button.tsx`: the `primary` variant has `bg-accent-soft`, `border-line-strong` and `text-ink` instead of the filled `bg-accent` with white text; on hover the border turns `accent-strong` instead of the fill getting lighter. Every primary button on the site (Logga in, Spara in admin) changes with it. The `secondary` variant (Logga ut, Avbryt) has `border-line-strong` instead of `border-accent-strong`, and its border turns `accent-strong` on hover. `quiet` and `RoundButton` are unchanged; `RoundButton` already had the fields' border and a wine red border on hover.
- `DESIGN.md`: the token table and the rule for cards say that cards have the fields' border, and floating things the fainter `--color-line`; the accent rule says that primary buttons only have a faint tone of the accent.

Floating things (`floatClass` in `Card.tsx`: dialogs and the suggestion list), focus rings and the focused field's accent border are unchanged.

## Decisions

- **One token for fields and cards.** The card border reuses `--color-line-strong` instead of getting a token of its own with the same value, so the two can't drift apart. The cost is that they can't be changed separately later; the user wanted them the same.
- **The review in focus is marked by size and visibility.** It is already full size and fully visible while the side cards are smaller, faded and blurred, so the accent border was not needed to tell them apart (decided with the user on 2026-10-23).
- **R4 was added while reviewing the change locally.** The user found the filled wine red primary buttons too strong, like cancel or warning buttons, and chose a faint tone with the fields' border from four variants shown side by side (2026-10-23). Looking at it again, the user wanted the secondary buttons to have the light border too, as in variant C; wine red stays for focus and hover.
- **`--color-accent-soft` is mixed from `--color-accent`,** not written as its own colour, so that changing the accent still changes the buttons (TRIP-008-R1). The browser reports the mix as `color(srgb …)`, so the tests' `layer` helper reads both that and `rgba(…)`.
- **The border checks moved to TRIP-022's tests.** The tests of TRIP-008-R5, TRIP-019-R3 and TRIP-020-R4 checked the old border colours, and TRIP-008-R4, TRIP-008-R8 and TRIP-019-R5 the filled primary button and the wine red border of Avbryt. Those checks were removed and the tests renamed where the name mentioned the border, so each behaviour is tested once; they still check the shadows, the size and the name in brass. `adminCard` moved from the TRIP-019 test file, and `contrast` and `backgroundOf` from the TRIP-008 test file, to `tests/helpers.ts`, since TRIP-022's tests use them too.
