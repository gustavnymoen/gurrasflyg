---
id: TECH-014
title: Whole suite once, smoke tests after deploy, branch protection
---

# Verification of TECH-014

How each requirement was checked. The smoke tests are in `tests/TECH-014-smoke-tests.spec.ts`.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-014-R1 | CI on pull request #56 runs the whole suite (`npm run test:local`); `ci.yml` has only `pull_request` and `workflow_dispatch`. That no CI run starts after the merge: not checked yet | CI | Pass on the pull request; after merge not checked yet | 2026-10-23 |
| TECH-014-R2 | The five tests `TECH-014-R2 @smoke …` pass with `npm run test:smoke` against the live site (5.7 s) and locally, without any secret; code review: none signs in or writes. The repository secret `ADMIN_PASSWORD` is deleted (`gh secret list` shows only `VERCEL_AUTOMATION_BYPASS_SECRET`) | live, local | Pass | 2026-10-23 |
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
| Security | No test uses a production secret any more, and the unused repository secret `ADMIN_PASSWORD` is deleted; Vercel's Git Fork Protection is on (checked by the user); the CI job `security` passes | CI, GitHub | Pass | 2026-10-23 |
| Code review | [review.md](review.md): run 1 stopped (1 must fix), run 2 passed; `/security-review` not needed | local | Passed | 2026-10-23 |

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
- [x] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/`), system docs (`wiki/system/`) and `wiki/log.md` updated (no manual change)
- [x] No leftovers: the waiting job and the address built from the branch name are removed
- [x] Clean code: `npm run lint` and `npm run typecheck` pass; the workflows pass in CI
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements noticed along the way added to the board (none)

## Requirements as built

Copied from the card (#48) on 2026-10-23, as built.

### TECH-014-R1 The whole suite once, in CI

CI runs lint, the type check, the build and the whole test suite (`npm run test:local`) on every pull request to `main`, and not on pushes to `main`. It can also be started by hand.

Acceptance criteria:

- **Given** a pull request, **when** CI runs, **then** it runs all tests, as today.
- **Given** a merge to `main`, **when** it is done, **then** CI does not run again.

### TECH-014-R2 Smoke tests

A small set of smoke tests, marked `@smoke` in their names and run with `npm run test:smoke`, checks that: the start page loads with its heading and search form; the reviews are shown; the airport search (`/api/airports`) answers with airports; `/admin` sends a visitor without sign-in to the sign-in page; and the charter data (`/api/destinations`) answers with destinations. They only read: no sign-in, no password, no data written. Together they take at most 1 minute against a deployed site.

Acceptance criteria:

- **Given** a deployed site, **when** `npm run test:smoke` runs against it, **then** the five checks pass without any secret.
- **Given** the smoke tests, **when** their code is read, **then** none signs in or writes data.

### TECH-014-R3 Smoke tests against the preview

Preview tests runs only the smoke tests, against the pull request's preview, when Vercel reports the preview as ready.

Acceptance criteria:

- **Given** a pull request, **when** its preview is ready, **then** Preview tests runs the smoke tests against its address and reports on the pull request.

### TECH-014-R4 Smoke tests against production, no test data there

Live tests runs only the smoke tests, against the live site, when Vercel reports a production deploy as ready. It no longer uses the production admin password, and no test writes data to production. It can still be started by hand.

Acceptance criteria:

- **Given** a merge, **when** the production deploy is ready, **then** Live tests runs the smoke tests against https://gurrasflyg.vercel.app.
- **Given** the Live tests workflow, **when** it is read, **then** it has no `ADMIN_PASSWORD`.

### TECH-014-R5 Started by `deployment_status`

Preview tests and Live tests start from GitHub's `deployment_status` event when Vercel reports a deployment, choosing preview or production by the deployment's environment, and test only a successful one, at the address in the event; a failed preview makes Preview tests fail. There is no job that polls for the preview and no address built from the branch name.

Acceptance criteria:

- **Given** a branch with a name longer than today's limit, **when** its preview is ready, **then** Preview tests runs against the right address.
- **Given** a failed Vercel preview deploy, **when** it is reported, **then** no tests run against it, and the pull request shows a failing check, so it can't be merged.

### TECH-014-R6 Branch protection on `main`

When the repo is public (TECH-013-R8), `main` is protected: a change reaches it only through a pull request, CI (`check`, `security`), Preview tests (`preview`) and Vercel's own status must pass, the branch must be up to date with `main`, and force pushes and deleting `main` are not allowed. No approving review is required, since the user merges their own pull requests.

Acceptance criteria:

- **Given** a pull request with a failing or missing check, **when** someone tries to merge, **then** GitHub refuses.
- **Given** a branch behind `main`, **when** someone tries to merge, **then** GitHub asks for the branch to be updated first.
- **Given** a direct push to `main`, **when** it is tried, **then** GitHub refuses.

### TECH-014-R7 The pipeline documented

`wiki/system/` describes the pipeline (what runs when, against what, and why) with a Mermaid diagram that can be exported as a picture; CLAUDE.md's workflow, Definition of Done ("after deploy `npm test`" becomes the smoke tests) and time budgets match it; `wiki/log.md` has a line.

Acceptance criteria:

- **Given** the documentation, **when** it is read, **then** it matches the workflows, and the diagram shows each step.

## Notes

- Out of scope in the card: "E2E" leftovers in production from earlier live runs. The live start page shows no review named "E2E"; the admin data (classes, add-ons, aircraft) was not checked, since that needs the admin password.
- Also on this branch: the Live tests results of TECH-016, TECH-013 and TECH-012 after their merges, recorded in their `verification.md`.
