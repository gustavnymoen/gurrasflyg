---
id: TECH-019
title: Keep focus on the other round buttons
---

# Code review of TECH-019

**Result:** Passed
**Date:** 2026-10-26, review run 1
**Summary:** `RoundButton` always uses `aria-disabled`, `keepFocus` is gone with its call sites, and the calendar's focus workaround is deleted cleanly. R1 and R2 have named tests; no must-fix findings.
**Security:** Passed. Interface-only change (no sign-in, input, query, cookie, secret or personal-data code touched); `/security-review` not needed. The reviewer read the diff only; lint, type check and tests were run by the author.

How the review works: `wiki/system/code-review.md`.

## Must fix

None.

## Should fix

- `specs/overview.md:121` TECH-019 is listed as Done before the live keyboard check. **Done:** left as is; the list is updated in the Done step like the other cards, and `verification.md` says what is not checked yet.
- `tests/TECH-019-keep-focus.spec.ts:~58` The carousel test used `test.skip` with fewer than two reviews, which could hide a regression. **Done:** it asserts the count instead.

## Suggestions

- `tests/TRIP-009-return-trip-datepicker.spec.ts:~243` The test used to assert that focus moves to the grid. **Done:** checked that `specs/TRIP-009-return-trip-datepicker/verification.md` and `wiki/system/date-picker.md` don't describe it; the old review.md is a historical record.
- `tests/TECH-019-keep-focus.spec.ts` Most tests press Enter on a button that is already unavailable; only the traveller picker shows a button becoming unavailable while focused. **Done:** left as it is, as in `solution.md`; TRIP-024-R5 and TRIP-009-R12 also cover the transition.

## Outside the change

- `app/admin/AircraftForm.tsx:150,192,517` A `disabled` prop on the quiet `Button` is still native `disabled` and can lose focus the same way. The card excludes `Button`. Not added to the board; worth a TECH card if wanted.
