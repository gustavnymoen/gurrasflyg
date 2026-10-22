---
id: TRIP-000
title: Short name of the feature
---

# Verification of TRIP-000

How each requirement was checked. Create this file when work starts and fill it in before the feature is done.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-000-R1 | Test `TRIP-000-R1 …` in `tests/TRIP-000-<name>.spec.ts` | local, live | Pass | YYYY-MM-DD |
| TRIP-000-R2 | Manual: … (why it can't be automated) | live | Pass | YYYY-MM-DD |

## Test suite

`npm run test:time` before and after the change (budgets and rules in `CLAUDE.md`).

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | … | … s | … s |
| After | … | … s | … s |

## Definition of Done

- [ ] Tests: every requirement is tested or has a recorded manual check; `npm run test:local` passes
- [ ] Test suite: within the time budgets, total time grown by at most 25 % (or the cause handled), and the new tests follow the quality rules in `CLAUDE.md`
- [ ] Deployed, and `npm test` passes against the live site
- [ ] Accessibility: changed pages and states pass `expectNoA11yViolations`, and the relevant items of `wiki/system/accessibility.md` are checked on the live site (not applicable if visitors see no change)
- [ ] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [ ] Manual (`wiki/manual/`), system docs (`wiki/system/`) and `wiki/log.md` updated
- [ ] No leftovers: everything the change made unused is deleted, no commented-out code or debug output
- [ ] Clean code: reuses existing components and helpers; `npm run lint`, `npm run typecheck` and `npm run build` pass
- [ ] Code review done, no must-fix findings left; see [review.md](review.md)
- [ ] Technical tasks for larger improvements noticed along the way added to the board

## Requirements as built

Copied from the card when the feature is done, with their acceptance criteria, so the repo shows what was built even if the card changes later.

### TRIP-000-R1 Short title

…

## Notes

Deviations from the requirements, and anything found during verification.
