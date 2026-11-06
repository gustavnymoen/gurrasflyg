---
id: TRIP-042
title: No "Snabbast" in the charter plan step
---

# Code review of TRIP-042

**Result:** Passed
**Date:** 2026-11-06, review run 1
**Summary:** `compareTime` (default true) goes from `PlanBuilder` through `LegCard` and `AircraftList` to the card; charter sets it to false, so the "Snabbast" comparison is hidden there and flights are unchanged. R1 is covered by the extended charter test and the flights test; docs and spec are updated.
**Security:** The security points passed: presentation only, no sign-in, input, queries, secrets, cookies or personal data. `/security-review`: not needed, as the card says.

## Must fix

None.

## Should fix

- `.claude/launch.json` is untracked and not part of TRIP-042. **Done:** left out of the commit.

## Suggestions

- `app/flyg/plan/LegCard.tsx`, `app/flyg/plan/AircraftList.tsx`: `compareTime` is a required prop that is only forwarded; fine, the type check catches a missed caller. **Done:** left as it is; if more such flags come, one options object.

## Outside the change

- The browser tests are over the 3 minute budget (190 s), from earlier changes. Noted in `verification.md`; not added to the board yet.
