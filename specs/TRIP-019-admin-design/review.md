---
id: TRIP-019
title: "Visual design: admin page"
---

# Code review of TRIP-019

**Result:** Passed
**Date:** 2026-10-22, review run 1
**Summary:** The admin page now gets its look from the shared `Button`, `Card` (compact) and `floatClass`, and `IconButton` now covers the expand arrows. The unused exports are removed, and R3–R5 have tests named after the requirements. No errors, and no requirement left unmet or untested.

How the review works: `wiki/system/code-review.md`. A later run is added at the top as "Review run 2".

## Must fix

None.

## Should fix

- `specs/TRIP-019-admin-design/solution.md` (Interface) and `wiki/log.md`: they said `buttonClass()` is "no longer exported", but the function is deleted; `Button.tsx` builds the classes itself. **Done:** both, and `verification.md`, now say it is removed.

## Suggestions

- `app/admin/admin-ui.tsx:68` `Dialog` repeated `rounded-card p-6` from `Card.tsx`, so a changed card radius or padding would not reach the dialog. **Done:** `Card.tsx` exports `floatingCardClass` (a card's shape with the floating look), which `Dialog` uses; listed in `DESIGN.md`.
- `app/admin/AircraftForm.tsx:478` "+ Lägg till klass/addon" is now a quiet `Button`, so its look (muted text, hover colour) follows the `quiet` variant for the whole site. **Done:** left as it is; that is the point of a shared variant.
- `tests/TRIP-019-admin-design.spec.ts:27` `adminCard` finds a card by its folding heading button, not a CSS class, which follows what the user sees. **Done:** nothing to change.

## Outside the change

- `app/admin/admin-ui.tsx` `Dialog` uses the fixed id `dialog-title` and handles Escape only on the overlay. Unchanged code, fine with one dialog at a time; noted as a comment on TRIP-021 (#30, WCAG) to be checked there. Not added as a separate card.
