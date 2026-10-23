---
id: TECH-016
title: SDD and the test strategy in the specification, a test plan in every card
card: "#50"
depends_on: [TECH-006, TECH-008, TECH-011, TRIP-021]
---

# TECH-016 SDD and the test strategy: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 50`.

## Data

None.

## Interface

Documentation and templates only; visitors see no change.

- `specs/overview.md`: a new section "How we work" after "Purpose", on specification-driven development as the project uses it (R1).
- `wiki/system/testing.md` (new): the test strategy. A table of the six kinds of checks, one section per kind, where each runs, and the quality rules and time budgets moved from `CLAUDE.md` (R2). Sections for checks that are not built yet say which task brings them (TECH-013, TECH-014, TECH-015), so those tasks fill them in.
- `.github/ISSUE_TEMPLATE/card.md`: a section "Test plan" before the non-functional requirements (R3).
- `CLAUDE.md`: SDD and `testing.md` in the introduction; step 1 needs a test plan to move a card to Specified (R3); step 3 writes unit tests with the code, step 4 writes the tests in the test plan and a smoke test for a main page or flow (R4); Definition of Done items 1 and 9 refer to the test plan and `testing.md`; the section "Tests" is a pointer to `testing.md` instead of the rules themselves.
- `specs/_template/verification.md`: a table "The test plan" with a row per kind of check, and the Definition of Done lines matching `CLAUDE.md` (R5).
- References to the rules' old place updated: `README.md` (Tests), `wiki/system/code-review.md` (test quality, and a test plan check not done counts as a requirement not tested), `wiki/system/architecture.md`, `wiki/system/index.md`, `.claude/agents/code-reviewer.md` and the comment in `scripts/test-time.mjs`.

## Decisions

- **One page for the strategy, linked from everywhere.** The rules for tests were in `CLAUDE.md`, `README.md`, `accessibility.md` and `code-review.md`. `testing.md` now holds the strategy, the quality rules and the time budgets; `CLAUDE.md` says when in the workflow, and `accessibility.md` and `code-review.md` keep their own detailed rules, linked from it. Each rule has one place, so they can't drift apart.
- **The strategy names what isn't built yet.** Writing it before TECH-013, TECH-014 and TECH-015 means it describes some checks that don't exist; those sections say so and name the task, and each task replaces its note with how it works. This was the reason to do this task first (decided with the user on 2026-10-23): the strategy is written once and kept up to date, instead of written afterwards.
- **The test plan is in the card, the result in `verification.md`.** The plan is part of the specification (what will be checked), so it is worked out with the user before the card is Specified; `verification.md` records what was actually done, row by row.
- **Two copies of one test merged.** The review found two TRIP-008 tests with the same name, "a focused field has the accent border" (R4 and R6), checking the same thing on Från and Till; TRIP-022's rename had made them identical. They are one test now, `TRIP-008-R4 and R6 a focused field has the accent border and ring`, which also checks the ring. A small related cleanup, as the quality rule "No duplicates" asks.
- **Test plans for the specified cards were added before this task started** (2026-10-23), directly in the cards, so R6 of the first draft was dropped from the card.
