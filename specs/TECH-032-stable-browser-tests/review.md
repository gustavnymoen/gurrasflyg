---
id: TECH-032
title: Stabilise the flaky browser tests
---

# Code review of TECH-032

**Result:** Passed
**Date:** 2026-11-06, review run 1
**Summary:** The change fixes the three flaky tests at their likely cause and meets R1 to R5: `hydrated()` replaces the repeated key press, `expectNoA11yViolations` waits for all finite animations and transitions, and the rule is in `testing.md`. No must-fix findings.
**Security:** Passed. Only tests, helpers and wiki changed; `/security-review` not needed.

How the review works: `wiki/system/code-review.md`. The reviewer read the diff and code only and ran no tests.

## Must fix

None.

## Should fix

- `verification.md` (Test suite) The "Before" row said "not measured". **Done:** it now says why and gives the last numbers on `main` (TECH-031).
- `.claude/launch.json` An untracked dev-server config that is not part of this task. **Done:** not committed.

## Suggestions

- `tests/helpers.ts:215` `hydrated()` relies on React's internal `__reactProps$` key; it fails loudly if React renames it. **Done:** left as it is; check on a React upgrade.
- `tests/TRIP-013-destinations.spec.ts:57,234`, `tests/TRIP-034-charter-filters.spec.ts:19` `networkidle` waits stand in for "hydrated". **Done:** left as they are (no failure to guide a change); `hydrated()` is the fix if one flakes.
- The other key presses (TRIP-001, TRIP-013, TRIP-018) follow an action that needs hydration. **Done:** checked, no change.

## Outside the change

- The browser tests take 229 s against 180 s: TECH-030, already on the board.
