---
id: TECH-011
title: Faster and healthier test suite
---

# Verification of TECH-011

How each requirement was checked. The tests are unchanged: the requirements are about the workflows and the rules, so they are checked in code review, by hand on GitHub, and by the existing tests passing.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-011-R1 | Code review: `ci.yml`, `live-tests.yml` and the `preview` job in `preview-tests.yml` have `container: mcr.microsoft.com/playwright:v1.64.1-noble`; no step runs `playwright install` or `apt-get` (`grep` over `.github/`) | local | Pass | 2026-10-22 |
| TECH-011-R2 | Code review: the three workflows use `v1.64.1-noble`, and `package-lock.json` has `@playwright/test` 1.64.1. By hand: on a throw-away branch (draft pull request #37, closed without merge) `ci.yml` used `v1.63.0-noble`; CI run 39822227999 stopped in `setup-tests` after 57 s, before lint, with "Playwright-imagen har version 1.63.0, men @playwright/test är 1.64.1. Ändra imagen till mcr.microsoft.com/playwright:v1.64.1-noble i .github/workflows/ci.yml, preview-tests.yml och live-tests.yml." | local, GitHub | Pass | 2026-10-22 |
| TECH-011-R3 | From the job's start to its first check, read from the steps' times in GitHub Actions. Throw-away pull request #37: CI 68 s until lint, Preview tests' test job 67 s until `npm test`. This card's pull request #39: CI 66 s until lint (container 50 s, `setup-tests` 13 s), whole job 3 min 29 s; Preview tests' test job 65 s until `npm test`, whole job 3 min 18 s (the wait job, 1 min 48 s, waited for Vercel). Live tests after the merge (run 39824327641): 67 s until `npm test`, whole job 3 min 44 s. Before (TRIP-019 and TRIP-020): 6–7 min of preparation | GitHub | Pass (at most 68 s) | 2026-10-22 |
| TECH-011-R4 | On the throw-away pull request #37, a test that fails on purpose (`TECH-011-R4 a failing test makes the job red`, then deleted with the branch): CI run 39822467323 and Preview tests run 39822466919 were red with only that test failing, after lint, type check and build passed, and saved `playwright-report` and `playwright-report-preview` as artifacts. Pull request #39: CI (run 39823494699) and Preview tests (run 39823494568) green; after the merge CI on `main` (run 39824272017) and Live tests (run 39824327641: 95 passed, 13 skipped) green | GitHub | Pass | 2026-10-22 |
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
- [x] Deployed, and `npm test` passes against the live site (Live tests run 39824327641, 2026-10-22)
- [x] Accessibility: not applicable, visitors see no change
- [x] Requirements in the card match what was built (R6's baseline updated on 2026-10-22), no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual: not applicable (no change for users of the site); system docs (`wiki/system/architecture.md`, `code-review.md`, `README.md`) and `wiki/log.md` updated
- [x] No leftovers: the browser installation is removed from `setup-tests`, and its comment about Chromium not being cached
- [x] Clean code: `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements: TECH-012 (#38), the actions still on Node.js 20
- [x] Small related cleanups: TRIP-020's `verification.md` records its live test run and the LCP measurement

## Requirements as built

Copied from card #36 on 2026-10-22.

### TECH-011-R1 The test jobs run in the Playwright image

The jobs in CI, Preview tests and Live tests shall run in the container `mcr.microsoft.com/playwright:v<version>-noble`, and `setup-tests` shall no longer install browsers or system libraries.

Acceptance criteria:

- **Then** the three workflows run their job in the Playwright image, and no step runs `playwright install` or `apt-get`. (Code review.)

### TECH-011-R2 The image follows the Playwright version

The image's version shall be the same as the installed `@playwright/test` version. If they differ (for example after `@playwright/test` is updated but not the image), the job shall fail early with a message saying which versions differ and where to change the image.

Acceptance criteria:

- **Given** `package-lock.json` has `@playwright/test` 1.64.1, **then** the jobs use `v1.64.1-noble`.
- **Given** the image's version and `@playwright/test` differ, **then** the job stops before the tests with an error naming both versions. (Checked once by hand on a branch.)

### TECH-011-R3 Faster preparation

From the start of a job until its first check (lint, or the first test against a preview or the live site) shall take at most 2 minutes.

Acceptance criteria:

- **Then** on three runs after the change (a pull request's CI and Preview tests, and Live tests after the merge), the preparation steps take at most 2 minutes each, read from the steps' times in GitHub Actions. (Manual check, recorded in `verification.md`.)

### TECH-011-R4 The checks work as before

The workflows shall check exactly what they did before: CI runs lint, the type check, the build and `npm run test:local`; Preview tests run `npm test` against the pull request's preview; Live tests run `npm test` against the live site after a merge. A failing job still saves the Playwright report.

Acceptance criteria:

- **Then** CI and Preview tests are green on this card's pull request, and Live tests are green after its merge.
- **Given** a test fails, **then** the job is red and the report is saved as an artifact. (Checked once by hand on a branch with a deliberately failing test, which is then removed.)

### TECH-011-R5 Documented

`wiki/system/architecture.md` shall describe that the test jobs run in the Playwright image, and how to update it together with `@playwright/test`. `wiki/log.md` has a line.

Acceptance criteria:

- **Then** the pipeline section in `architecture.md` says so. (Code review.)

### TECH-011-R6 Time budgets for the tests

`CLAUDE.md` shall set time budgets for the test suite, and a script shall measure it. The budgets, from the baseline on 2026-10-22 (108 tests, 65 s of tests locally (measured with `npm run test:time`), slowest test 2.5 s, `npm test` against a preview or the live site 2–3 min):

| What | Budget |
|---|---|
| One test, locally | at most 5 s |
| All tests in `npm run test:local` (without the build) | at most 3 min |
| `npm test` against a preview or the live site | at most 5 min |
| A whole job on GitHub (CI, Preview tests, Live tests) | at most 8 min, of which at most 2 min preparation |

`npm run test:time` runs `npm run test:local` and prints the number of tests, the total time and the five slowest tests, and marks anything over budget.

Every feature records in `verification.md` the number of tests and the total time before and after the change. When a budget is exceeded, or the total time grows by more than 25 % in one change, the cause is found: the change is fixed if it caused it, otherwise a technical task is put at the top of the backlog.

Acceptance criteria:

- **Then** `CLAUDE.md` has the budgets and the rule, and `npm run test:time` prints the numbers. (Code review, and the script run once.)
- **Then** `specs/_template/verification.md` has a line for the test numbers before and after.

### TECH-011-R7 Quality rules for the tests

`CLAUDE.md` shall say how the tests are kept good, and the review shall check it:

- **No flaky tests.** Tests are not retried. A test that sometimes fails is fixed (or the bug in the site is), never retried or skipped.
- **No fixed waits.** Tests wait for what the user sees (`expect`, `toBeVisible`), never for a time (`waitForTimeout`).
- **Each test checks behaviour** named in its requirement, not only CSS or markup, unless the requirement is about the look.
- **No duplicates.** A behaviour already checked by another feature's test is not tested again; a test that a later change made redundant is removed.
- **Shared helpers** in `tests/helpers.ts` instead of copies.
- **Cheap where it can be:** checks that don't need a browser or a new page load are combined or done without one.

Acceptance criteria:

- **Then** `CLAUDE.md` has the rules, the Definition of Done has a point for the test suite's time and quality, and `wiki/system/code-review.md` lists them as something to look for. (Code review.)

## Notes

- The baseline in the card (75 s, slowest 2.6 s) was remeasured with `npm run test:time`: 64.5 s, slowest 2.5 s. `CLAUDE.md` and the card's R6 now have the measured numbers; the budgets are unchanged.
- The actions `checkout@v4`, `setup-node@v4` and `upload-artifact@v4` give a warning that Node.js 20 is deprecated on GitHub's runners. Not part of this card: added to the board as TECH-012 (#38).
