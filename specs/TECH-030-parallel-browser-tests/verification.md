---
id: TECH-030
title: Bring the browser tests back inside the time budget
---

# Verification of TECH-030

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-030-R1 | The whole suite passes: 262 browser tests (261 before; `TRIP-012-R1 R4 R5 R6 R10` was split in two, `TRIP-012-R1 R4` and `TRIP-012-R5 R6 R10`, with the same checks) and 366 unit tests. No test removed or skipped, none retried. | local | Pass | 2026-11-09 |
| TECH-030-R2 | `npm run test:time`: 81.7 s for the run (budget 180 s), slowest test 4.2 s; 72.5 s on a quiet computer, 94.2 s on a busy one. Before: 257.0 s, slowest 5.0 s. | local | Pass | 2026-11-09 |
| TECH-030-R3 | Ten full runs in a row with four lanes passed (`npm run test:local`, 261 tests each, built the plain way: five before and five after the two timing fixes below). The 262-test code (after the TRIP-012 split) was run three times more (`test:time`, 81.7 s, and twice the CI way, 81.7 s and 80.3 s); the first of those CI-way runs had two failures (the two races below, fixed before the others), the other two passed. A first lane run failed (5 tests) because several workers took tests from one lane; fixed with `workers: 1` per lane. No file needs a serial step (each lane has its own database). | local | Pass | 2026-11-09 |
| TECH-030-R4 | The CI way, run locally: `node scripts/test-server.mjs --build-only`, then `TEST_SERVER_PREBUILT=1 npm run test:time` ran 262 tests without building again: 80.3 s, all passed (no "Creating an optimized build" in the test run). The `check` job time on GitHub (at most 6 min) is **not checked**: it is read from the pull request's run. | local; CI not checked | Partly: CI time not checked | 2026-11-09 |
| TECH-030-R5 | `wiki/system/testing.md` (Lanes rule, runs, one run at a time, budgets), `architecture.md`, `pipeline.md`, `README.md`, `specs/overview.md` and `wiki/log.md` read against the code | local | Pass | 2026-11-09 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | None for the tests themselves. `scripts/test-time.mjs` (reading the elapsed time from the report) has no unit test: it is a measuring script, checked by running it (R2) | local | Pass | 2026-11-09 |
| Browser tests | The whole suite, changed where needed (`tests/TRIP-012-book-a-flight.spec.ts` split, `tests/TRIP-013-destinations.spec.ts` waits for the filtered count, `expectNoA11yViolations` waits for the page title, `tests/global-teardown.ts` cleans every lane, `tests/plan.ts` `inTestDb` finds its lane); ten runs in a row | local | Pass | 2026-11-09 |
| Smoke test | Not applicable: no change to what the site does. The smoke tests are part of the suite and pass; Preview tests run on the pull request | local | Pass | 2026-11-09 |
| Accessibility | Not applicable beyond the existing axe checks, which all stay and pass | local | Pass | 2026-11-09 |
| Security | `/security-review` not needed (tests, test configuration and the CI workflow; no secret added or printed) | local | Not applicable | 2026-11-09 |
| Code review | [review.md](review.md) | local | Passed | 2026-11-09 |

## Test suite

`npm run test:time` (budgets and rules in `wiki/system/testing.md`). Since this change the time is the time the run took; the sum of the tests' own times is in brackets.

| | Tests | Time | Slowest test |
|---|---|---|---|
| Before (one worker, 2026-11-09) | 261 browser, 366 unit | 257.0 s (4.5 min including the start) | 5.0 s |
| After, quiet computer | 261 browser, 366 unit | 72.5 s (275.6 s added up) | 4.9 s |
| After, final (busy computer: load average 8) | 262 browser, 366 unit | 80.3–81.7 s (284–296 s added up) | 4.2–5.0 s |

Unit tests: 12–17 s (budget 30 s), unchanged. The time grew by more than 25 % nowhere; it fell by 68 %. CI (4 cores, about 55 % slower than this computer) is **not measured yet**.

## Definition of Done

- [ ] Tests: every check in the card's test plan is done; every requirement is tested or has a recorded manual check; `npm run test:unit` and `npm run test:local` pass (CI time of R4 and the live smoke tests wait for the pull request)
- [x] Test suite: within the time budgets, total time shrank, and the changed tests follow the quality rules in `wiki/system/testing.md`
- [ ] Deployed, and the smoke tests pass against production (Live tests): after the merge
- [x] Accessibility: not applicable (visitors see no change); the axe checks of the suite pass
- [x] Requirements in the card match what was built (R3 and R4 reworded to the lanes, card updated), no open questions left; copied below as built; `solution.md` describes how it was built (R4's CI time is recorded when it is measured)
- [x] Manual (`wiki/manual/`: not applicable, nothing visible), system docs (`wiki/system/`) and `wiki/log.md` updated
- [x] No leftovers: `testDbFile` removed from `lib/local-db.mjs`; no commented-out code or debug output
- [x] Clean code: `npm run lint` and `npm run typecheck` pass; `npm run build` is run by the test server for the tests (the same build, with the test environment), the default build was not run separately
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements noticed along the way: none

## Requirements as built

### TECH-030-R1 Nothing is lost

Acceptance criteria:

- **Given** the changed tests and configuration, **then** every requirement that had a browser test still has one (or a recorded manual check), the number of tests per requirement does not drop except for recorded duplicates, and the unit tests and browser tests pass.
- Tests are not retried and none is skipped that ran before; `verification.md` lists the number of browser tests before and after.

### TECH-030-R2 Inside the budget locally

Acceptance criteria:

- `npm run test:time` shows the whole browser run in at most 180 s of elapsed time, and no test over 5 s.
- `npm run test:time` prints the elapsed time (not the sum of the tests' times) and compares that with the budget; the numbers before and after, on a computer that is not busy with other work, are in `verification.md`.

### TECH-030-R3 The tests are safe to run in parallel

Acceptance criteria:

- **Given** the suite running in four lanes at the same time, **when** it is run five times in a row, **then** every run passes with no retries.
- Every lane has a site and a database of its own and runs its tests one at a time, so no file needs a serial step of its own. The files are divided between the lanes by size, and why lanes were chosen over one shared database is in `solution.md`.
- Data a test creates is unique to it and removed by it; no test depends on the order or the timing of another file's test. `globalTeardown` and the `fleet` fixture still leave no "E2E …" data behind, in every lane.
- The number of lanes (four, `TEST_LANES`) is chosen so that it works on the CI runner (4 cores) as well as locally, and the choice is explained in `solution.md`.

### TECH-030-R4 Inside the budget on CI

Acceptance criteria:

- **Given** a pull request with this change, **then** the `check` job on GitHub takes at most 6 minutes (measured from its run; the earlier run took 7 min 12 s), and the other budgets in `testing.md` still hold.
- The site is built once for the browser tests on CI: the job's build step is `node scripts/test-server.mjs --build-only` (the test environment), the tests start with `TEST_SERVER_PREBUILT=1` and do not build again, and a plain `npm run test:local` on a computer still builds as before. The default `npm run build` is no longer a separate CI step; Vercel's own build of every preview checks it.

### TECH-030-R5 The rules are written down

Acceptance criteria:

- `wiki/system/testing.md` says how a test must be written to be safe in parallel (its own data, no counting of shared totals, which files run serially and how a new one is chosen), how the suite's time is measured now, and the new numbers in "Time budgets".
- `specs/overview.md` and `wiki/log.md` are updated.

## Notes

- **Deviations from the card:** the card describes parallel workers with a serial step for files that cannot share the database. Built instead: lanes with a database each, which needs no serial step (the reasons are in `solution.md`). The card's trimming of tests was not needed. Both are within the goal and the requirements.
- **Found while verifying:** (1) four workers on one database fail 3 of 261 tests (the tests that create aircraft change what the others see, and `SQLITE_BUSY`); (2) with lanes but without `workers: 1` per lane, 5 failed; (3) one run in the CI way failed on two races that a busy computer shows: `expectNoA11yViolations` ran before the streamed page title (`document-title`), and `TRIP-013` read the result count before the list was filtered. Both fixed in the tests.
- **The per-test limit:** `TRIP-012-R1 R4 R5 R6 R10` took 4.9–6.2 s with four lanes busy (5.0 s alone), so it was split in two.
- **The tests' own times added up grow** (257 s to 275–345 s) because four browsers and four sites share the computer; the run is shorter, each test a little slower. The per-test limit of 5 s is measured in that setting.
- Not checked: the `check` job on GitHub (R4), Preview and Live tests. Four lanes on the CI runner's 4 cores may need `TEST_LANES` lowered; this is read from the pull request.
