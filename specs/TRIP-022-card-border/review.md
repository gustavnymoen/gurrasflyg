---
id: TRIP-022
title: One border colour for cards
---

# Code review of TRIP-022

How the review works: `wiki/system/code-review.md`.

## Review run 3

**Result:** Passed
**Date:** 2026-10-23, review run 3 (by Claude, without the reviewer agent: a two-line style change)
**Summary:** After run 2 the user asked that secondary buttons (Logga ut, Avbryt) also get the fields' border instead of a wine red one, as in the chosen variant C. `secondary` in `Button.tsx` now has `border-line-strong` with `hover:border-accent-strong`, and no hover change when disabled, like `primary`. The check of Avbryt's border moved from `TRIP-019-R5 …` to `TRIP-022-R1 and R4 …`, which also checks the wine red border on hover. Lint, the type check and the affected tests pass.

### Must fix

None.

### Should fix

None.

## Review run 2

**Result:** Passed
**Date:** 2026-10-23, review run 2
**Summary:** Run 2 adds R4 (toned-down primary buttons) and it is correct. `--color-accent-soft` is mixed from the accent, so TRIP-008-R1 still holds; the primary variant has the fields' border and ink text, with an accent-strong border on hover and no hover change when disabled. Every R4 criterion is tested once, the moved helpers are used, and nothing that used `--color-edge`, `EDGE` or the old primary checks is left.

### Must fix

None.

### Should fix

None.

### Suggestions

- `tests/helpers.ts` `layer` and `contrast` were two copies of the same blend, and `contrast` couldn't read `color(srgb …)`. **Done:** `contrast` lays its foreground over the background with `layer`, so one place knows both formats.
- `tests/TRIP-008-visual-design.spec.ts` `not.toHaveCSS(…, buttonBefore)` passed for any change of the button's background. **Done:** it now expects green at 30 %, `color(srgb 0 0.501961 0 / 0.3)`, which is what TRIP-008-R1 asks.
- `tests/TRIP-022-card-border.spec.ts` R4's criterion names the add-on form, the test checks Spara in the aircraft form. **Done:** `verification.md` says why: both use the shared `SaveCancel`.

### Outside the change

- `specs/TRIP-008-visual-design/verification.md` gave the TRIP-008-R1 test name with "checkbox" instead of "switch" (wrong since TRIP-009). **Done:** fixed here, a one-word documentation fix.

## Review run 1

**Result:** Passed
**Date:** 2026-10-23, review run 1
**Summary:** The change is small and correct. Every card, the aircraft form and every review card now use `border-line-strong`, `--color-edge` and its test constant are gone with nothing left behind, and the old border checks were moved into TRIP-022's tests instead of being duplicated. There were two small should-fix items.

### Must fix

None.

### Should fix

- `app/globals.css:21` The comment on `--color-line-strong` still said "kanter på fält och kryssrutor (3:1)", though the token is now also the card border. **Done:** the comment now says "kanter på fält, kryssrutor och kort (3:1)".
- `tests/TRIP-022-card-border.spec.ts:49` Only the suggestion list was tested for TRIP-022-R3's fainter border; the dialog was only covered by reading the code. **Done:** `TRIP-019-R3 a dialog floats with the floating shadow` also checks the dialog's border (`LINE`), without another page load.

### Suggestions

- `app/components/ReviewCarousel.tsx:89` `focused ? "" : "cursor-pointer blur-[1px]"` has an empty branch now that the review in focus has no classes of its own. **Done:** left as it is; it reads like the `hidden` condition right after it.
- `tests/TRIP-022-card-border.spec.ts:16` Comparing the search card with the Från field's own border, not only with the constant, checks what the requirement asks ("the same as the fields"). **Done:** nothing to change; a pattern to keep.

### Outside the change

- The requirement text of TRIP-008-R5 and TRIP-020-R4 still describes the old look under the new "Changed by TRIP-022" notes, in the verification files and cards #12, #28 and #29. Left as it is: the project records later changes as notes above the original text (as TRIP-021 did for TRIP-020-R4), so the history stays readable. Not added to the board.
