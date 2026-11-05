---
id: TRIP-034
title: Styled multi-choice charter filters
---

# Code review of TRIP-034

**Result:** Passed
**Date:** 2026-11-05, review run 1
**Summary:** R1–R5 are met in the code; the filter logic is in `lib/destinations.ts` with unit tests, `MultiSelect` builds on `Checkbox`, `floatClass` and `fieldClass`, and the old `<select>` code and tests are gone.
**Security:** Passed. No sign-in, API, action, query or personal data; address values are checked against the data in `parseFilters`. `/security-review`: not needed, as the card says.

## Must fix

None.

## Should fix

- `app/components/MultiSelect.tsx:79` The panel (`sm:w-max`, `left-0`) could run past the screen edge for the right-most filter at `md`. **Done:** the panel is now as wide as its button at every width.
- `app/components/MultiSelect.tsx:85` The checkbox id was built from the option value (spaces are invalid in an id). **Done:** it uses the option's index.

## Suggestions

- `app/components/MultiSelect.tsx:47` `onBlur` only closes when focus moves to an element outside the panel. **Done:** left as it is; Escape and a click outside also close it.
- `lib/destinations.test.ts` the "never empty" test follows only the first option of each filter. **Done:** left as it is; the browser test and the other R4 tests cover the rest.

## Outside the change

- `verification.md` still has the live checklist and Live tests open; they need the deploy.
