---
id: TECH-011
title: Faster and healthier test suite
---

# Verification of TECH-011

How each requirement was checked. The tests are unchanged: the requirements are about the workflows and the rules, so they are checked in code review, by hand on GitHub, and by the existing tests passing.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-011-R1 | Code review: `ci.yml`, `live-tests.yml` and the `preview` job in `preview-tests.yml` have `container: mcr.microsoft.com/playwright:v1.64.1-noble`; no step runs `playwright install` or `apt-get` (`grep` over `.github/`) | local | Pass | 2026-10-22 |
| TECH-011-R2 | Code review: the three workflows use `v1.64.1-noble`, and `package-lock.json` has `@playwright/test` 1.64.1. By hand, a branch with a different image version: not checked yet | local, GitHub | Partly checked | 2026-10-22 |
| TECH-011-R3 | Preparation times of CI, Preview tests and Live tests in GitHub Actions | GitHub | Not checked yet | |
| TECH-011-R4 | CI and Preview tests on the pull request, Live tests after the merge; a branch with a deliberately failing test | GitHub | Not checked yet | |
| TECH-011-R5 | Code review: the pipeline section of `wiki/system/architecture.md` describes the image, the wait job, the version check and how to update Playwright; `wiki/log.md` has a line; `README.md` updated too | local | Pass | 2026-10-22 |
| TECH-011-R6 | Code review: `CLAUDE.md` section "Tests" has the budgets and the 25 % rule; `specs/_template/verification.md` has the table "Test suite". `npm run test:time` run once: printed 108 tests, 64.5 s, and the five slowest (see below) | local | Pass | 2026-10-22 |
| TECH-011-R7 | Code review: `CLAUDE.md` section "Tests" has the six quality rules, the Definition of Done has point 9, and `wiki/system/code-review.md` lists test quality as point 6 of what to look for | local | Pass | 2026-10-22 |
| All | `npm run lint`, `npm run typecheck`, `npm run build` without errors or warnings; `npm run test:time` 108 passed (also after the review's fixes) | local | Pass | 2026-10-22 |

## Test suite

`npm run test:time` before and after the change. The tests are unchanged; the difference is run-to-run variation.

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 108 | 64.5 s | 2.5 s (`TRIP-006-R5 and R6 a saved review is listed and shown first, and can be deleted`) |
| After | 108 | 62.6 s | 2.5 s (`TRIP-006-R2 arrows, keys and clicks move the cards round`) |

## Definition of Done

- [x] Tests: the requirements are checked by code review and by hand (no test can see the workflows); `npm run test:local` passes (2026-10-22)
- [x] Test suite: within the time budgets; no test added or changed
- [ ] Deployed, and `npm test` passes against the live site
- [x] Accessibility: not applicable, visitors see no change
- [ ] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual: not applicable (no change for users of the site); system docs (`wiki/system/architecture.md`, `code-review.md`, `README.md`) and `wiki/log.md` updated
- [x] No leftovers: the browser installation is removed from `setup-tests`, and its comment about Chromium not being cached
- [x] Clean code: `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements: none needed
- [x] Small related cleanups: TRIP-020's `verification.md` records its live test run and the LCP measurement

## Requirements as built

Copied from card #36 when the task is done.

## Notes

- The baseline in the card (75 s, slowest 2.6 s) was remeasured with `npm run test:time`: 64.5 s, slowest 2.5 s. `CLAUDE.md` and the card's R6 now have the measured numbers; the budgets are unchanged.
