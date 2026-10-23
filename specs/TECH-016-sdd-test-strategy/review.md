---
id: TECH-016
title: SDD and the test strategy in the specification, a test plan in every card
---

# Code review of TECH-016

How the review works: `wiki/system/code-review.md`.

## Review run 2

**Result:** Passed
**Date:** 2026-10-23, review run 2
**Summary:** Both must-fix findings from run 1 are fixed: the Definition of Done and the verification template name the smoke tests against production (with `npm test` until TECH-014), and `verification.md` only marks as done the checks that were run. The merged TRIP-008 test and the should-fix items are correct.

### Must fix

None.

### Should fix

- `specs/TRIP-022-card-border/verification.md:25` The checklist row added in this change named the old test `TRIP-008-R4 a focused field has the accent border`. **Done:** it names `TRIP-008-R4 and R6 a focused field has the accent border and ring`.

### Suggestions

- `wiki/system/testing.md:14` R2 asks what counts as passing for each kind; the table only implied it. **Done:** a column "Passes when".

### Outside the change

- `specs/TRIP-022-card-border/verification.md:42` and other finished features point to "the quality rules in `CLAUDE.md`". Left as it is: finished features keep their records (out of scope in the card).

## Review run 1

**Result:** Stopped (2 must fix)
**Date:** 2026-10-23, review run 1
**Summary:** The SDD section, `testing.md`, the card template's test plan and the verification template met R1, R2, R3 and R5, and nothing from CLAUDE.md's old Tests section was lost. Two things blocked: the Definition of Done lacked the smoke-test check of R4, and TECH-016's own `verification.md` marked checks as done that were not run.

### Must fix

- `CLAUDE.md:38` Definition of Done item 1 didn't mention the smoke test that R4 asks for. **Done:** item 1 says the smoke tests pass against production after the deploy (until TECH-014, `npm test` against the live site), and so does the template's line.
- `specs/TECH-016-sdd-test-strategy/verification.md:43` The "Clean code" and "Tests" boxes were ticked while the type check, build and tests had not been run. **Done:** lint, the type check, the build and `npm run test:time` (143 passed) were run and recorded.

### Should fix

- `wiki/system/testing.md:78` axe was shown as running only locally and in CI, but it runs in Preview tests and Live tests too today. **Done:** marked until TECH-014.
- `wiki/system/testing.md:19` The browser tests row said "Locally and in CI" only. **Done:** it says they also run against the preview and production until TECH-014.
- `wiki/system/testing.md:22` The security row listed CI and Dependabot as if they existed. **Done:** "CI and Dependabot from TECH-013".
- `CLAUDE.md:24` Steps 3 and 4 didn't say that Vitest and smoke tests don't exist yet. **Done:** notes for TECH-015 and TECH-014.
- `CLAUDE.md:25` Step 4 repeated testing.md's naming rule and "never weaken a test", and README repeated them too. **Done:** step 4 says when to write which tests and points to `testing.md` for how; README's Tests section is cut down to how to run them.

### Suggestions

- `wiki/system/testing.md:32` Unit and browser tests had different wording for the same naming rule. **Done:** both "named after its requirement".
- `.github/ISSUE_TEMPLATE/card.md:27` The test plan had no line for code review. **Done:** "Code review: always; anything the reviewer should look at in particular."

### Outside the change

- `tests/TRIP-008-visual-design.spec.ts` had two tests named "a focused field has the accent border" (R4 and R6) checking the same thing, made identical by TRIP-022's rename. **Done:** merged into `TRIP-008-R4 and R6 a focused field has the accent border and ring`, as a small related cleanup.
- Finished features point to the quality rules in `CLAUDE.md`. Left as they are.
