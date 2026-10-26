---
id: TRIP-016
title: Deleted aircraft still looks in use
---

# Code review of TRIP-016

**Result:** Passed
**Date:** 2026-10-26, review run 1
**Summary:** The page's `inUse` flag is removed, so the server's check in the delete transaction is the only one that counts. That meets R1 and R2; tests and docs follow the requirements.
**Security:** Passed. No new input, route or action; the delete functions still check in the database inside a transaction, with `?` parameters. `/security-review`: not needed (see the card).

## Must fix

None.

## Should fix

- `lib/admin.test.ts:42` The class and add-on were created in a shared `beforeAll` and recreated by hand inside a test, so one failing test could break the next. **Done:** created in `beforeEach` and cleaned in `afterEach`, so each test stands alone.
- `review.md` was the unfilled template. **Done:** this report; `verification.md` points to it.

## Suggestions

- `verification.md` R2: the card's criterion ("a button that still carries `inUse`") can no longer be tested since the prop is gone; it is checked by code review. **Done:** left as it is; the card text can say "the page holds no flag".
- `tests/TRIP-016-deleted-aircraft-in-use.spec.ts:36` The race lasts a few hundred milliseconds, so the browser test would probably also pass on the old code. **Done:** left as it is, said openly in `solution.md`; the unit test is the real guard.
- `app/admin/admin-ui.tsx:213` An in-use row asks "Är du säker?" before it says no. **Done:** accepted, documented in `solution.md`.

## Outside the change

None.
