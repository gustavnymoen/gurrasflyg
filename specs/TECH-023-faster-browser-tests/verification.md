---
id: TECH-023
title: Browser tests back inside the time budget
---

# Verification of TECH-023

How each requirement was checked. Only tests, test helpers and `playwright.config.ts` changed; the site did not.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-023-R1 | `npm run test:time`: 178 browser tests pass, none retried, no flaky; `git diff --stat origin/main` shows only `playwright.config.ts`, `tests/`, `wiki/` and `specs/` | local | Pass | 2026-10-30 |
| TECH-023-R2 | `npm run test:time`: 178 browser tests in 139,6 s (was 176,9 s), slowest 3,0 s; none marked over budget | local | Pass | 2026-10-30 |
| TECH-023-R3 | `npx playwright test --list` before and after: 178 tests, the titles are identical (diff of the sorted lists) except that the plane test is now under "with motion"; all 120 requirement IDs in full form (`TRIP-004-R1` …) are in both lists | local | Pass | 2026-10-30 |

No test was combined or removed, so no assertion moved. The two files that need motion say so (`tests/TRIP-025-departures-fill-in.spec.ts`: R1 to R3 and the axe test, R4 keeps reduced motion; `tests/TECH-018-design.spec.ts`: the plane and carousel test).

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `npm run test:unit` (inside `test:time`): 222 pass in 0,8 s | local | Pass | 2026-10-30 |
| Browser tests | The whole suite, before and after, by `npm run test:time` (below); requirement IDs compared (R3) | local | Pass | 2026-10-30 |
| Smoke test | Not applicable: no page or flow changes | | | |
| Accessibility | Not applicable: no page changes. The axe checks are in the same tests on the same states | | | |
| Security | `/security-review` not needed: no sign-in, admin, API, action, query or personal-data code changed (the sign-in helper only waits for a button) | | | |
| Code review | [review.md](review.md) | local | Passed | 2026-10-30 |

## Test suite

`npm run test:time` before and after the change (budgets and rules in `wiki/system/testing.md`). Both on a computer with another process using a core (a Vitest watch in another checkout), so a quiet computer should be faster.

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 178 | 176,9 s | 4,5 s (`TRIP-012-R1 R4 R5 R6 R10 …`) |
| After | 178 | 139,6 s | 3,0 s (`TRIP-013-R7 R9 …`) |

Where it went (measured by adding up Playwright's steps, see `solution.md`): trace recording about 5–15 s, the admin page's waiting about 12 s, the flight cards' animation about 13 s.

## Definition of Done

- [x] Tests: every check in the card's test plan is done; every requirement is tested or has a recorded check; `npm run test:unit` and `npm run test:local` pass
- [x] Test suite: within the time budgets, total time shrank by 21 %, and the helper added follows the quality rules in `wiki/system/testing.md`
- [ ] Deployed, and the smoke tests pass against production (Live tests): after the merge
- [x] Accessibility: not applicable, visitors see no change
- [x] Requirements in the card match what was built (R1 widened with `playwright.config.ts` on 2026-10-30), no open questions left; copied below; `solution.md` describes how it was built
- [x] Manual (not applicable), system docs (`wiki/system/testing.md`, `pipeline.md`) and `wiki/log.md` updated
- [x] No leftovers: scratch configs removed; nothing the change made unused
- [x] Clean code: `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements: none added; the remaining ~800 ms waits after `page.goto` are noted in `solution.md` (worth about 5 s)

## Requirements as built

### TECH-023-R1 The site behaves as before

The site shall behave exactly as before; only tests, test helpers and the test configuration change.

- **Given** the changed suite, **when** `npm run test:local` runs, **then** every test passes, none is retried, and no file outside `tests/`, `wiki/`, `specs/` and `playwright.config.ts` changes.

### TECH-023-R2 The suite is faster

`npm run test:local` shall take less than 150 s for the browser tests, and no test shall take more than 5 s.

- **Given** `npm run test:time` on a quiet computer, **when** it finishes, **then** the browser tests' time is under 150 s (budget in `wiki/system/testing.md` stays 180 s) and no test is marked over budget.

### TECH-023-R3 No check is lost

Every requirement that had a test before still has a check after, named after it.

- **Given** the list of requirement IDs in test names before the change, **when** it is compared with the list after, **then** every ID is still there. The comparison is recorded above.

## Notes

- The first attempt at the baseline failed because `~` in `PLAYWRIGHT_BROWSERS_PATH=~/…` was expanded after `HOME=<empty folder>` had been set; an absolute path works.
- One run with trace recording on failed once in `TRIP-013-R1 R9 …` (a `toHaveCount`); it passed in every later run (six full runs and several partial ones). Not reproduced, noted for the review.
- A server kept running over several full suites collects Betala presses and locks the rate limit (TECH-025): three booking tests failed in such a run. Each measured run starts a fresh server.
