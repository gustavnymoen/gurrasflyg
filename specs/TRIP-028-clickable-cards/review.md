---
id: TRIP-028
title: Clickable destination cards, no start cards
---

# Code review of TRIP-028

**Result:** Passed
**Date:** 2026-10-26, review run 1
**Summary:** The start cards and everything only they used are removed cleanly, and the card has one stretched link on the title. No errors and no leftovers.
**Security:** Passed. No input, queries, sign-in, secrets or personal data. `/security-review`: not needed, as the card says.

How the review works: `wiki/system/code-review.md`.

## Must fix

None.

## Should fix

- `app/charter/DestinationCard.tsx` TRIP-028-R2 said a focus ring is drawn on keyboard focus "or the pointer is over it", but only the keyboard ring is built. **Done:** the card's sentence is changed to keyboard focus for the ring and the hand pointer for the pointer; `verification.md` says so.

## Suggestions

- `tests/TRIP-013-destinations.spec.ts` "pressed anywhere" was checked only through "Visa" with `force: true`, which skips the hit test. **Done:** the test now presses the photo with a real mouse click (`page.mouse.click`), so it proves the stretched area receives the press. (Playwright's own `click()` refuses any element under the overlay, with or without a hit-test on it.)
- `app/charter/DestinationCard.tsx` `after:absolute after:inset-0` depends on the card being the nearest positioned ancestor. **Done:** the comment says so.

## Outside the change

- `specs/TRIP-013-destination-pages/` still described the start cards in places. **Done:** checked, `flow.mmd`, `solution.md` and `verification.md` no longer mention them (R3 is marked as replaced).
