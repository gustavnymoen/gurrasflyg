---
id: TRIP-029
title: Price lists per area and beer from 18
---

# Code review of TRIP-029

**Result:** Passed
**Date:** 2026-10-26, review run 1
**Summary:** The change does what R1–R4 ask, with no extra behaviour. Charter's price list has its own rows, the fees have their new name in both, and the beer rule is one set of helpers in `lib/booking-rules.ts`, used by the form and, through `travellerProblems()`, by the server. Every requirement has a test named after it.
**Security:** Passed. No new action, query or personal data; `createBooking` already validates the booking with `travellerProblems()` against the flights it reads from the database, so the server refuses beer under 18. `/security-review`: not needed (the card's test plan; nothing in sign-in, admin, API routes, server actions, queries or personal data changed).

## Must fix

None.

## Should fix

- `app/flyg/boka/TravellersForm.tsx:193` The status paragraph was `display: none` while empty, so it appeared together with its text, which screen readers often don't announce. **Done:** it is always on the page, visually hidden (`sr-only`) while empty, so it takes no space and is read when the text comes.

## Suggestions

- `lib/booking-rules.ts:209` A table with the percent per area for each row would keep shared labels in one place if a third area came. **Done:** left as it is: two areas read more clearly as two lists, and the shared fees row is one constant.
- `lib/booking-rules.ts:351` `beerOn` returned the beer add-ons' ids, not the beer a passenger has. **Done:** renamed `beerIdsOn`, with a comment that matches.

## Outside the change

- `lib/charter-rules.ts:221` (`anyMinor`) has its own under-18 check; it could use `isAdult()`, but a missing age means something else there (not counted). Not added: small, and its meaning must stay.
- Found while verifying: `vitest` also ran tests inside other sessions' worktrees in `.claude/worktrees/` (with their own `node_modules`). **Done:** `.claude/**` excluded in `vitest.config.mts`, as eslint already does.
- Found while verifying: the browser suite is at 173 s of 180 s and `TRIP-013-R1` takes 6.2 s. Added as TECH-023 (#94) at the top of Backlog.
