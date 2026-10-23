---
id: TECH-014
title: Whole suite once, smoke tests after deploy, branch protection
---

# Verification of TECH-014

How each requirement was checked. The smoke tests are in `tests/TECH-014-smoke-tests.spec.ts`.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-014-R1 | CI on pull request #56 runs the whole suite (`npm run test:local`); `ci.yml` has only `pull_request` and `workflow_dispatch`. That no CI run starts after the merge: not checked yet | CI | Pass on the pull request; after merge not checked yet | 2026-10-23 |
| TECH-014-R2 | The five tests `TECH-014-R2 @smoke …` pass with `npm run test:smoke` against the live site (5.7 s) and locally, without any secret; code review: none signs in or writes | live, local | Pass | 2026-10-23 |
| TECH-014-R3 | Preview tests run 39974586619 started from Vercel's `deployment_status` for the preview of #56, ran `npm run test:smoke` against its address (5 passed, 5.6 s; the whole job 1 min) and shows on the pull request as the check `preview` | CI | Pass | 2026-10-23 |
| TECH-014-R4 | Code review: `live-tests.yml` runs `npm run test:smoke` and has no `ADMIN_PASSWORD`. On #56's preview, Live tests started and was skipped, as it should for a preview. The run after the merge: not checked yet | CI | Pass so far; after merge not checked yet | 2026-10-23 |
| TECH-014-R5 | Both workflows start from `deployment_status`; the polling job and the address built from the branch name are gone; the preview's address came from the event (`gurrasflyg-6r05mactp-aqc-lab.vercel.app`, not built from the branch). A failed Vercel deploy: not shown (no failing deploy was made). Code review: Preview tests runs for `success`, `failure` and `error` and fails unless `success`, and Vercel's own status `Vercel` is a required check, so a failed preview stops the merge (fixed after the review) | CI | Pass; the failed deploy not shown | 2026-10-23 |
| TECH-014-R6 | Branch protection set on 2026-10-23 and read back with `gh api …/branches/main/protection`: required checks `check`, `security`, `preview` and `Vercel`, `strict` (up to date with `main`), pull request required with 0 approvals, enforced for admins, no force pushes, no deletion. A merge refused by GitHub: see below. A direct push to `main` was not tried (it would only be refused, but a test push to `main` was not worth the risk) | GitHub | Pass | 2026-10-23 |
| TECH-014-R7 | Code review: `wiki/system/pipeline.md` (with the Mermaid diagram), `testing.md`, `README.md`, `architecture.md` and `CLAUDE.md` match the workflows | local | Pass | 2026-10-23 |
| All | `npm run lint`, `npm run typecheck` without errors; `npm run test:time` 148 passed (143 + the five smoke tests) | local | Pass | 2026-10-23 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | Not applicable: no logic changed | | | |
| Browser tests | The whole suite passes locally and in CI | local, CI | Pass | 2026-10-23 |
| Smoke test | The five smoke tests, against the live site by hand and against #56's preview by Preview tests | live, CI | Pass | 2026-10-23 |
| Accessibility | Not applicable: visitors see no change | | | |
| Security | No test uses a production secret any more; the CI job `security` passes | CI | Pass | 2026-10-23 |
| Code review | [review.md](review.md) | local | | 2026-10-23 |

## Test suite

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 143 | 93.2 s (TECH-013) | 2.8 s |
| After | 148 | 91.6 s (−2 %) | 2.9 s (`TRIP-009-R12 axe finds no violations with the calendar open, a range chosen and a message`) |

In the pipeline, Preview tests went from about 4.5 minutes (the whole suite) to 1 minute (the smoke tests), and Live tests will do the same.

## Definition of Done

- [x] Tests: every check in the card's test plan is done; every requirement is tested or has a recorded manual check; `npm run test:local` passes
- [x] Test suite: within the time budgets
- [ ] Deployed, and the smoke tests pass against production (Live tests)
- [x] Accessibility: not applicable, visitors see no change
- [ ] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/`), system docs (`wiki/system/`) and `wiki/log.md` updated (no manual change)
- [x] No leftovers: the waiting job and the address built from the branch name are removed
- [x] Clean code: `npm run lint` and `npm run typecheck` pass; the workflows pass in CI
- [ ] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements noticed along the way added to the board (none)

## Requirements as built

Copied from the card when the task is done.

## Notes

- Out of scope in the card: "E2E" leftovers in production from earlier live runs. The live start page shows no review named "E2E"; the admin data (classes, add-ons, aircraft) was not checked, since that needs the admin password.
- Also on this branch: the Live tests results of TECH-016, TECH-013 and TECH-012 after their merges, recorded in their `verification.md`.
