---
id: TECH-016
title: SDD and the test strategy in the specification, a test plan in every card
---

# Verification of TECH-016

How each requirement was checked. The task changes documentation and templates, so its requirements are checked by reading them (code review), as its test plan says. One test changed: two copies of the same TRIP-008 test were merged (see `solution.md`).

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-016-R1 | Code review: `specs/overview.md` has "How we work" on SDD (requirements as source of truth, code, tests and docs follow, traceability to tests and `verification.md`, wrong requirements changed in the card first), linking `CLAUDE.md` and `testing.md` | local | Pass | 2026-10-23 |
| TECH-016-R2 | Code review: `wiki/system/testing.md` covers unit tests, browser tests, smoke tests, accessibility, security and code review, each with what, when written, where it runs and passing; the parts not built name TECH-013, TECH-014 and TECH-015; the quality rules and time budgets moved from `CLAUDE.md`, which now links to the page; linked from `wiki/system/index.md` and `README.md` | local | Pass | 2026-10-23 |
| TECH-016-R3 | Code review: `.github/ISSUE_TEMPLATE/card.md` has "Test plan"; `CLAUDE.md` step 1 needs a test plan before Specified | local | Pass | 2026-10-23 |
| TECH-016-R4 | Code review: `CLAUDE.md` steps 3 (unit tests with the code) and 4 (the test plan's tests, a smoke test for a main page or flow), and Definition of Done item 1 (every check in the test plan done, and the smoke tests against production after the deploy, until TECH-014 `npm test`) | local | Pass | 2026-10-23 |
| TECH-016-R5 | Code review: `specs/_template/verification.md` has "The test plan" with rows for unit, browser, smoke, accessibility, security and code review | local | Pass | 2026-10-23 |
| All | `npm run lint`, `npm run typecheck` and `npm run build` without errors or warnings; `npm run test:time` 143 passed (one fewer: the merged TRIP-008 test). Against the live site after the deploy: Live tests run 39963783255 on `main`, 130 passed, 13 skipped (`runsLocally`) | local, live | Pass | 2026-10-23 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | Not applicable: no logic changed | | | |
| Browser tests | No page changed; the merged test `TRIP-008-R4 and R6 a focused field has the accent border and ring` passes in the whole suite | local | Pass | 2026-10-23 |
| Smoke test | Not applicable: no page or flow changed | | | |
| Accessibility | Not applicable: visitors see no change | | | |
| Security | Not applicable: no code changed | | | |
| Code review | [review.md](review.md): run 1 stopped (2 must fix), run 2 passed; the documents agree and don't repeat each other | local | Passed | 2026-10-23 |

## Test suite

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 144 | 88.2 s (TRIP-022) | 2.8 s |
| After | 143 | 88.7 s (+1 %) | 2.8 s (`TRIP-009-R12 axe finds no violations with the calendar open, a range chosen and a message`) |

## Definition of Done

- [x] Tests: every check in the card's test plan is done; every requirement is tested or has a recorded manual check; `npm run test:local` passes
- [x] Test suite: within the time budgets, and the merged test follows the quality rules
- [x] Deployed, and the smoke tests pass against production (until TECH-014: `npm test` against the live site; run 39963783255, recorded on TECH-014's branch)
- [x] Accessibility: not applicable, visitors see no change
- [x] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/`), system docs (`wiki/system/`) and `wiki/log.md` updated (no manual change: visitors see nothing new)
- [x] No leftovers: everything the change made unused is deleted, no commented-out code or debug output
- [x] Clean code: reuses existing components and helpers; `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements noticed along the way added to the board (none)

## Requirements as built

Copied from the card (#50) on 2026-10-23, as built.

### TECH-016-R1 SDD in the specification

`specs/overview.md` has a section "How we work" that says the project follows specification-driven development: the card's requirements are the source of truth; code, tests and documentation follow from them; every requirement has an ID, a test named after it and a row in `verification.md`; and a requirement that turns out wrong is changed in the card first. It links to CLAUDE.md for the steps and to `wiki/system/testing.md` for the tests.

Acceptance criteria:

- **Given** `specs/overview.md`, **when** it is read, **then** it says that the project follows SDD and what that means here.

### TECH-016-R2 The test strategy

`wiki/system/testing.md` describes, for each kind of check, what it checks, when it is written, where and when it runs, and what counts as passing:

- **Unit tests** (Vitest): logic, calculations, rules and data.
- **Browser tests** (Playwright): what a visitor sees and does, the keyboard, and look.
- **Smoke tests:** a few read-only checks per main page or flow, against the preview and production after each deploy.
- **Accessibility:** axe in the browser tests for every page and state, and the manual WCAG 2.2 AA checklist on the live site.
- **Security:** the security points of the code review, `/security-review` for sensitive changes, and the pipeline's package, code and secret scans.
- **Code review:** the reviewer agent and `review.md`.

It also has the time budgets and quality rules for tests, moved from CLAUDE.md, and a picture of which check runs where in the pipeline.

Acceptance criteria:

- **Given** `wiki/system/testing.md`, **when** it is read, **then** it covers the six kinds above, and the parts not built yet name the task that brings them.
- **Given** CLAUDE.md, **when** it is read, **then** it links to the strategy instead of repeating its rules.

### TECH-016-R3 A test plan in every card

The card template has a section "Test plan" that says, for the card's requirements: which unit tests, which browser tests, which smoke test (or why none), what accessibility checks, and whether `/security-review` is needed. A card moves to Specified only with a test plan.

Acceptance criteria:

- **Given** a new card from the template, **when** it is created, **then** it has the section "Test plan".
- **Given** CLAUDE.md's step 1 (Specify), **when** it is read, **then** a card needs a test plan to be Specified.

### TECH-016-R4 Tests written as the feature is built

CLAUDE.md's workflow says that unit tests are written together with the code they test, and that a feature that adds or changes a main page or flow adds a smoke test for it, as its test plan says. The Definition of Done checks the test plan: every planned test exists and passes, and the smoke test passes against production after the deploy.

Acceptance criteria:

- **Given** CLAUDE.md, **when** the steps Build, Test and Done are read, **then** they say this.

### TECH-016-R5 Verification by kind of check

`specs/_template/verification.md` has a place for each kind of check (unit, browser, smoke, accessibility, security, code review), so that a feature records how each was done.

Acceptance criteria:

- **Given** a new feature folder from the template, **when** `verification.md` is read, **then** it has these places.

## Notes

- Also on this branch: TRIP-022's live results (Live tests and the checklist items 2 and 6, 2026-10-23) are recorded in its `verification.md`, since TRIP-022 was merged before they were done.
