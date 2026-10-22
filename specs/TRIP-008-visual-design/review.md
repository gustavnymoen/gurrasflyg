---
id: TRIP-008
title: "Visual design: foundation"
---

# Code review of TRIP-008

**Result:** Passed
**Date:** 2026-10-22, review run 1
**Summary:** The foundation is built as specified. A search finds no hex, `rgb()` or Tailwind palette colour under `app/` outside `globals.css`, `ui.tsx` is fully replaced, and every requirement has a test or a code review. Four small should-fix findings, all fixed in this change.

How the review works: `wiki/system/code-review.md`. A later run is added at the top as "Review run 2".

## Must fix

None.

## Should fix

- `specs/TRIP-008-visual-design/flow.mmd:3-4` The diagram still showed "@theme inline" and the class helpers kept in `ui.tsx`, which is deleted. **Done:** the flow shows `@theme static`, the component files, the admin colours as tokens and the axe check.
- `app/components/Card.tsx:6`, `app/components/Autocomplete.tsx:125,141` Radii `rounded-[14px]` and `rounded-[10px]` were not tokens. **Done:** new tokens `--radius-card-compact` and `--radius-option`; `DESIGN.md` says Tailwind's own small radii are kept for small details such as the checkbox.
- `app/components/Card.tsx:10-21` The `compact` and `title` props were used by no caller. **Done:** removed; `Card` takes only `className` and children.
- `tests/TRIP-008-visual-design.spec.ts:85-86` The R1 accent test also changes `--color-accent-strong`, while the criterion spoke of "the accent value". **Done:** the card now says "the accent tokens (accent and strong accent)", and the test explains why both are changed.

## Suggestions

- `app/components/SearchForm.tsx:61,163` `<Field label="Datum" htmlFor="date" className="md:w-48">` is written twice, in the Suspense fallback and in `DateInput`. **Done:** left as it is: the date error is computed inside `DateInput` (it needs today's date), so the `Field` with its error has to be there; the fallback is a disabled copy shown for a moment.
- `app/components/Field.tsx:7-20` Choosing one whole border class string per state is a pattern to remember with Tailwind. **Done:** recorded in `DESIGN.md`.

## Outside the change

- `app/admin/admin-ui.tsx:68` The admin `Dialog` uses `cardClass`, while `DESIGN.md` says dialogs float with `surface-float` and `shadow-float`. Already covered by TRIP-019-R3 (#28), so no new card.
