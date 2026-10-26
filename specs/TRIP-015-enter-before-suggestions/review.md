---
id: TRIP-015
title: Enter before new airport suggestions
---

# Code review of TRIP-015

**Result:** Passed
**Date:** 2026-10-26, review run 1
**Summary:** The change is a test extension plus corrected notes and docs; `git diff` shows no change in `app/`. The new TRIP-015-R1 steps in the "TRIP-001-R4" test match both acceptance criteria, hold the answer back with `page.route` and a promise (no fixed wait), and add no test to the suite.
**Security:** Passed. No code in `app/` changed. `/security-review`: not needed.

## Must fix

None.

## Should fix

None.

## Suggestions

- `tests/TRIP-001-flight-search-form.spec.ts:60` Enter may be pressed before the 150 ms delay is over, so the held-back route is reached later. **Done:** the comment now says the test covers both the delay and the request on its way.
- `tests/TRIP-001-flight-search-form.spec.ts:52-66` The route stays registered for the rest of the test; harmless, nothing fetches "arlanda" again. **Done:** left as it is.

## Outside the change

- Tab is not tested for the same condition (same check in `Autocomplete`); noted in `verification.md`. Not added to the board.
