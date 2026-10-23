---
id: TRIP-009
title: Return trip date picker
---

# Code review of TRIP-009

**Result:** Passed
**Date:** 2026-10-23, review run 1
**Summary:** TRIP-009 builds what card #14 asks for. Every requirement has a test or a recorded code review, the date rules are kept in `lib/dates.ts`, and what the change made unused (`Checkbox`, `DateInput`, `bookableDates`, the replaced TRIP-001 tests) is deleted. Two small keyboard issues were worth fixing.

How the review works: `wiki/system/code-review.md`. A later run is added at the top as "Review run 2".

## Must fix

None.

## Should fix

- `app/components/Calendar.tsx` A keyboard user pressing "Nästa månad" until the last month (or "Föregående månad" back to the first) was left on a disabled button, which browsers may drop focus from to `<body>`, against R12. **Done:** when a month button is used from the keyboard and becomes disabled, focus moves to the grid's tabbable day (`onFocusGrid`); test `TRIP-009-R12 the month buttons work with the keyboard, and focus stays in the calendar`.
- `app/components/DatePicker.tsx` `commit` returned early when the text matched the chosen date, so Enter on an unchanged "13/11" didn't move on to Hemresa, against R8 ("with Enter it is as if the day had been clicked"). **Done:** Enter on unchanged text chooses the day again; leaving the field still does nothing. Added to `TRIP-009-R8 a typed date is read on Enter and when leaving the field`.

## Suggestions

- `app/components/DatePicker.tsx` `keepReturn` used the message function `dateError(...) === null` for a yes/no question. **Done:** it compares the return day with `returnRange(day, …)`, so `dateError` is only used for messages.
- `app/components/DatePicker.tsx` `pendingFocus` and `quietFocus` rely on every `focus()` firing `onFocus`, which resets the flag. **Done:** a comment says so.

## Outside the change

None.
