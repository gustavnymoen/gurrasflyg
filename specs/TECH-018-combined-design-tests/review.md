---
id: TECH-018
title: Fewer, combined design tests
---

# Code review of TECH-018

**Result:** Passed
**Date:** 2026-10-26, review run 1
**Summary:** No requirement lost its test and no assertion was weakened: all 39 old tests were compared assertion by assertion with the 12 in `tests/TECH-018-design.spec.ts`.
**Security:** The security points of the review: passed (tests and docs only, no secret added). `/security-review`: not needed, as the card says.

How the review works: `wiki/system/code-review.md`.

## Must fix

None.

## Should fix

- `verification.md` The "Code review" row linked a `review.md` that did not exist yet. **Done:** this report is saved as `review.md`.
- `verification.md` "Before, the whole suite" is an estimate (after plus the 27 removed tests' time), not a measurement. **Done:** left as it is and labelled as an estimate; the requirement (R2) is about the three design files, which were measured before and after.

## Suggestions

- `tests/TECH-018-design.spec.ts` (admin test) The phone check resizes after the desktop checks instead of loading `/admin` at 390 px. **Done:** added to the differences in `solution.md`.
- `tests/TECH-018-design.spec.ts` (focused-field test) The field is focused with `fill("lon")` instead of `focus()`; the assertion is the same. **Done:** added to `solution.md`.
- A combined test stops at its first failure, so later checks on that page are not reported. **Done:** accepted trade-off; the checks are grouped by requirement in comments.

## Outside the change

- Older `verification.md` files (TRIP-008, TRIP-020, TRIP-022, TECH-015) still name the deleted test files; finished features keep their records. Not added to the board.
