---
id: TRIP-021
title: "Accessibility: WCAG 2.2 AA"
---

# Code review of TRIP-021

How the review works: `wiki/system/code-review.md`. A later run is added at the top as "Review run 2".

## Review run 2

**Result:** Passed
**Date:** 2026-10-23, review run 2
**Summary:** Both findings from run 1 are fixed: each card keeps its own height, and only clicks on the `<dialog>` itself count as outside clicks. The code meets R1–R4 with tests. The only new finding was that TRIP-020's docs still described the old fixed card.

### Must fix

None.

### Should fix

- `specs/TRIP-020-start-page-design/solution.md:26` and `verification.md` described the card as fixed at 12 rem with clamped text. **Done:** both have a "Changed by TRIP-021-R4" note, like TRIP-006's spec.

### Suggestions

- `tests/TRIP-021-wcag.spec.ts` The focus check accepts `body`, which would also be true if focus fell to the page's start. **Done:** left as it is: with `showModal()` the page behind is inert, so focus can only be in the dialog or in the browser's own controls (which the page sees as `body`), and the test also checks that Escape gives focus back to the trash can.
- `tests/TRIP-021-wcag.spec.ts` The trimmed name was exactly 20 characters, the form's limit. **Done:** one space less in front, and a comment on the length.

### Outside the change

- `Dialog` and `StarPicker` used fixed ids (`dialog-title`, `rating-label`). **Done:** fixed in this change with `useId`, since both were changed anyway.

## Review run 1

**Result:** Stopped (1 must fix)
**Date:** 2026-10-23, review run 1
**Summary:** The change is small and does what the card asks for: the checklist doc, the axe states, the dialog, the labels and the review limits match R1–R4 and are tested. One problem blocked: stacked in one grid cell, every review card stretched to the height of the tallest one, while R4 says only a card whose own text needs room may grow.

### Must fix

- `app/components/ReviewCarousel.tsx:73` Grid items stretch by default, so every card took the height of the tallest review in the list, and the 12 rem check in the R4 test depended on every other review in the database being short. **Done:** the cards have `self-start`, so each keeps its own height.

### Should fix

- `app/admin/admin-ui.tsx` The "click outside" check used only the click's coordinates; Enter or Space on a button gives a click at (0, 0), so Enter on "Ja" also closed the dialog at once and "Tar bort…" was never shown. **Done:** only clicks on the `<dialog>` itself count, then the coordinates.
- `wiki/manual/admin-omdomen.md:20` A paragraph between steps 3 and 4 split the numbered list. **Done:** moved below step 4.

### Suggestions

- `app/components/ReviewCarousel.tsx:110` The arrows sit at the middle of a 12 rem card and are not centred when a card grows. **Done:** left as it is: centring on the container would follow the tallest card, not the one in focus, and a card grows only with larger text spacing or an older long review.
- `app/admin/admin-ui.tsx` `LabeledField` with `cloneElement` and `useId` keeps one label/field pattern without wrapping the field; the comment says why `htmlFor` was chosen. **Done:** nothing to change.

### Outside the change

- None.
