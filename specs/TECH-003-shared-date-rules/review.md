---
id: TECH-003
title: Shared date rules
---

# Code review of TECH-003

**Result:** Passed
**Date:** 2026-10-23, review run 1
**Summary:** The date rule now lives in `lib/dates.ts`, `SearchForm.tsx` uses it, and the behaviour is unchanged (empty value, the `<` and `>` comparisons and both messages work as before). All three requirements are met and tested. The TRIP-021 follow-up on this branch matches the "Live tests" run on `main` (104 passed, 13 skipped, every TRIP-021-R3 and R4 test ran and passed live).

How the review works: `wiki/system/code-review.md`. A later run is added at the top as "Review run 2".

## Must fix

None.

## Should fix

None.

## Suggestions

- `lib/dates.ts:32` `dateError` compares text and assumes a well-formed `YYYY-MM-DD`. That holds for `<input type="date">`, which gives "" or a valid date, but not for a date read from the address by the coming search results. **Done:** left as it is; the feature that reads dates from the address validates the format first (TRIP-009 brings `parseDate`, which returns `null` for anything that isn't a date).
- `app/components/SearchForm.tsx:141` The edited comment no longer says that the dates compare as text. **Done:** no change; that note is now in `lib/dates.ts`, next to the code that relies on it.
- `lib/dates.ts:27` `bookableRange(today)` takes today as an argument instead of reading the clock, which lets the tests pin a date without faking time. **Done:** kept; worth reusing for the return-date and charter-period rules.

## Outside the change

- `tests/helpers.ts:68` `bookableDates()` keeps its own `toDateString` on purpose (card, Background). Not a duplicate; no task added.
