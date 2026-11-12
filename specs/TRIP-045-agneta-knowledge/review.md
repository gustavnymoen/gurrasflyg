---
id: TRIP-045
title: Agneta knows continents, aircraft, classes and add-ons
---

# Code review of TRIP-045

**Result:** Passed
**Date:** 2026-11-12, review run 1
**Summary:** The continent lines and the new aircraft, class and add-on section are built from `readFleet()`, `readAddons()` and the shared constants, in a fixed order, with no copied values. No must-fix findings.
**Security:** Passed. No new input, route or query; the text is built from data that is public on the site and the visitor's messages are still never part of it. `/security-review`: not needed (no sign-in, admin, route, action, query or personal data changed).

How the review works: `wiki/system/code-review.md`.

## Must fix

None.

## Should fix

- `specs/TRIP-045-agneta-knowledge/` had no `verification.md` and `review.md`. **Done:** written; anything not checked is marked so.
- `lib/chat-prompt.ts:57` said add-ons are bought "per traveller and per trip", which can mislead on a flight booking with several legs. **Done:** now "per flight (in charter, per trip)", and the test follows.
- `lib/chat-prompt.test.ts` used a hard-coded `class_id = 2`. **Done:** the class is found by name.
- `withPlane` writes to the shared unit-test database. **Done:** checked that `vitest.config` has `fileParallelism: false`, so no other test file runs at the same time (as in `bookings.test.ts`).

## Suggestions

- The parameter `test` of `withPlane` hid vitest's `test`. **Done:** renamed `check`.
- The "add-ons: none" branch had no test. **Done:** the test plane has an Ekonomi class with no add-ons and the test checks the line.
- The `fare-rules` import was between two `charter` imports. **Done:** moved next to the other `lib/` imports.

## Outside the change

- None.
