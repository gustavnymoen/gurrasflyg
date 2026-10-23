---
id: TECH-015
title: Unit tests with Vitest, fewer repeated browser tests
---

# Verification of TECH-015

How each requirement was checked.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-015-R1 | `npm run test:unit` runs all 26 unit tests once and passes; `npm run test:unit -- --watch` runs them and waits for file changes ("Waiting for file changes…"); `npm run lint` and `npm run typecheck` cover the `*.test.ts` files and `vitest.config.mts` | local | Pass | 2026-10-23 |
| TECH-015-R2 | Code review: every unit test is a `*.test.ts` next to its code or data, named after a requirement; Vitest's `include`/`exclude` and Playwright's `testDir: ./tests` keep the two apart (`npm run test:local` ran 124 browser tests, `npm run test:unit` 26 unit tests, none in both) | local | Pass | 2026-10-23 |
| TECH-015-R3 | 24 tests moved with the same checks and names (table in `solution.md`); `tests/` has no test without `page` or `request` any more; all pass in Vitest, and the data checks read `unit-test.db`, rebuilt from the migrations every run | local, CI | Pass | 2026-10-23 |
| TECH-015-R4 | `TRIP-009-R8 …` and `TRIP-009-R9 …` in the browser keep one or two dates each; the other formats, the year and every message are unit tests in `lib/dates.test.ts` (two new tests). No requirement lost a check: listed in `solution.md` and in TRIP-009's `verification.md` | local | Pass | 2026-10-23 |
| TECH-015-R5 | Demo pull request #58 (closed, branch deleted): a broken expectation in `lib/dates.test.ts` failed CI at `npm run test:unit`, and `npm run build` and `npm run test:local` were skipped (run 39985832246). `npm run test:time` shows the unit tests (26, 0.1 s against a 30 s budget) next to the browser tests | CI, local | Pass | 2026-10-23 |
| TECH-015-R6 | Code review: `wiki/system/testing.md` (which kind for what, unit tests in use, their database, the 30 s budget), `CLAUDE.md` (Build, Verify, Merge, Definition of Done), `wiki/system/code-review.md`, `README.md`, `wiki/system/pipeline.md` and `architecture.md` | local | Pass | 2026-10-23 |
| All | `npm run lint`, `npm run typecheck` without errors; CI run 39986349510 green (`check`: 26 unit tests, 124 browser tests; `security`: 0 findings) | local, CI | Pass | 2026-10-23 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | 26: the 24 moved and two new for `lib/dates.ts` | local, CI | Pass | 2026-10-23 |
| Browser tests | 124 remain and pass; TRIP-009-R8 and R9 shortened | local, CI | Pass | 2026-10-23 |
| Smoke test | Not applicable: no page or flow changed | | | |
| Accessibility | Not applicable: visitors see no change | | | |
| Security | The CI job `security` passes. Found on the way: the custom Semgrep rule `sql-built-from-text` took a `Map`'s `get` with a template for SQL once the data checks left `tests/` (which Semgrep skips); the rule now treats only the bare `all`, `get` and `run` and the methods `execute` and `query` as database calls, and demo #58 showed it still catches SQL joined from text | CI | Pass | 2026-10-23 |
| Code review | [review.md](review.md): passed; `/security-review` not needed | local | Passed | 2026-10-23 |

## Test suite

| | Unit tests | Browser tests | Browser tests' time | Slowest browser test |
|---|---|---|---|---|
| Before | – | 148 | 91.6 s (TECH-014) | 2.9 s |
| After | 26 (0.1 s) | 124 | 92.9 s (+1 %) | 2.8 s |

The browser time hardly changed: the moved tests were already fast without a page, and the two shortened TRIP-009 tests saved little. The whole local check is not slower, which is what the card asks.

## Definition of Done

- [x] Tests: every check in the card's test plan is done; every requirement is tested or has a recorded manual check; `npm run test:local` passes
- [x] Test suite: within the time budgets, total time grown by at most 25 %
- [x] Deployed, and the smoke tests pass against production (Live tests after the merge 884acd7, run 39988777447: 5 passed; recorded on TRIP-010's branch)
- [x] Accessibility: not applicable, visitors see no change
- [x] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/`), system docs (`wiki/system/`) and `wiki/log.md` updated (no manual change)
- [x] No leftovers: `tests/TECH-003-shared-date-rules.spec.ts` and `queryTestDb` are deleted; the demo existed only on its closed branch
- [x] Clean code: `npm run lint` and `npm run typecheck` pass; the build passes in CI
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements noticed along the way added to the board (none)

## Requirements as built

Copied from the card (#49) on 2026-10-23, as built.

### TECH-015-R1 Vitest

Unit tests run with Vitest: `npm run test:unit` runs them all once, and `npm run test:unit -- --watch` reruns the affected ones on every save. They understand TypeScript and the project's `@/` paths, and `npm run lint` and `npm run typecheck` cover them.

Acceptance criteria:

- **Given** the project, **when** `npm run test:unit` runs, **then** all unit tests run and pass.

### TECH-015-R2 Next to the code, named after the requirement

A unit test lives next to the file it tests, as `<file>.test.ts` (for example `lib/dates.test.ts`); data checks live next to the data or migrations they check. Each test's name starts with the requirement it checks, as the browser tests' do. Vitest runs only `*.test.ts`, Playwright only `tests/*.spec.ts`.

Acceptance criteria:

- **Given** a unit test, **when** its name is read, **then** it starts with a requirement ID.
- **Given** `npm run test:local`, **when** it runs, **then** it runs no unit tests, and `npm run test:unit` no browser tests.

### TECH-015-R3 The tests without a browser move

Every test that needs no browser moves to Vitest with the same checks and the same name: the data checks of TECH-005, TRIP-005 and TRIP-007, TRIP-020-R3 and the date rules of TECH-003 and TRIP-009-R13. Data checks run against a fresh test database built by the migrations, never the user's own database. Each moved feature's `verification.md` names the new place.

Acceptance criteria:

- **Given** `tests/`, **when** it is read, **then** every test there uses a browser.
- **Given** the moved tests, **when** they run, **then** they check the same things as before and pass.

### TECH-015-R4 Fewer repeated rule cases in the browser

Browser tests that check one rule with many cases through the page keep one or two cases that show the page uses the rule; the other cases are checked by unit tests of the rule's function. No requirement loses a check, and `verification.md` lists what moved.

Acceptance criteria:

- **Given** the TRIP-009 tests of typed dates, **when** they are read, **then** the browser checks one valid and one invalid date, and the other formats and limits are unit tests of `lib/dates.ts`.

### TECH-015-R5 In the pipeline and the measurements

CI runs the unit tests before the build, so a broken rule stops it early. `npm run test:time` reports the unit tests (number and time) next to the browser tests. The unit tests take at most 30 seconds in all.

Acceptance criteria:

- **Given** a pull request with a failing unit test, **when** CI runs, **then** it fails at the unit tests, before the build.
- **Given** `npm run test:time`, **when** it runs, **then** it shows both kinds.

### TECH-015-R6 The rules for which kind of test

CLAUDE.md says which kind of test to write: logic, calculations, rules and data in unit tests; what a visitor sees and does, keyboard, accessibility (axe) and look in browser tests; and that every requirement still has at least one test named after it. The Definition of Done, the time budgets and `wiki/system/code-review.md` match.

Acceptance criteria:

- **Given** CLAUDE.md, **when** a new feature's tests are planned, **then** it says which kind to use for what.
