---
id: TRIP-027
title: Detailed price list
---

# Code review of TRIP-027

**Result:** Passed
**Date:** 2026-10-26, review run 1
**Summary:** `priceList()` and `PriceList` match R1 to R4. The rounding, the remainder to Bränsle and the `<dl>` markup are correct, and no migration is needed. The tests are named after the requirements.
**Security:** Passed. The change adds no input, route, server action, query or personal data. `/security-review`: not needed, as the card says.

## Must fix

None.

## Should fix

- `.claude/launch.json` is an untracked file that is not part of TRIP-027. **Done:** it is not staged or committed with this work.
- `specs/overview.md` lists TRIP-027 as "Done" before the live checks. **No change needed:** the list is updated when the feature is done, as for the earlier features; the live checks are recorded in `verification.md` after the deploy.

## Suggestions

- `PRICE_LIST_SHARES` was exported but only used in `priceList()`. **Done:** `export` removed.
- The tests read the total with `getByText(...).locator("..").locator("span").last()`, as the TRIP-012 test does. Left as is; a shared helper can come with the next change in these tests.

## Outside the change

None.
