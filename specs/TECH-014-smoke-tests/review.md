---
id: TECH-014
title: Whole suite once, smoke tests after deploy, branch protection
---

# Code review of TECH-014

How the review works: `wiki/system/code-review.md`.

## Review run 2

**Result:** Passed
**Date:** 2026-10-23, review run 2
**Summary:** The run-1 must-fix is fixed: Preview tests runs for a Preview `deployment_status` of `success`, `failure` or `error` and fails unless `success`, and `Vercel` is a required check (`check`, `security`, `preview`, `Vercel`, `strict`). Left were texts describing the old trigger and the old list of required checks.
**Security:** Passed. The deployment state reaches the shell through `env`, not interpolation; actions pinned; read-only token; the bypass secret only in the test step; Live tests uses no secret. `/security-review`: not needed.

### Must fix

None.

### Should fix

- `specs/TECH-014-smoke-tests/solution.md:21` still described a success-only trigger and the old required checks. **Done:** updated.
- Card #48 R5/R6 didn't match the code (success-only, "missing check", only CI and Preview tests required). **Done:** the card says how it was built, and `verification.md` has it as built.
- `CLAUDE.md:30` didn't name Vercel's status among the required checks. **Done.**
- `wiki/system/pipeline.md:21`, `flow.mmd:6` showed only `deployment_status: success`. **Done:** both show that a failed deploy makes Preview tests fail.

### Suggestions

- `.github/workflows/preview-tests.yml:16` A workflow-level `concurrency` lets any later `deployment_status` event for the same branch (even one whose job is skipped, such as `inactive`) cancel a running smoke test. **Done:** `concurrency` moved to the job.
- `.github/workflows/preview-tests.yml:35` Say that `Vercel` is required too, so no one removes one of the two guards. **Done:** a comment.

### Outside the change

- The unused repository secret `ADMIN_PASSWORD`. **Done:** deleted with the user's OK.
- Vercel's Git Fork Protection. **Done:** the user checked that it is on.

## Review run 1

**Result:** Stopped (1 must fix)
**Date:** 2026-10-23, review run 1
**Summary:** The smoke tests, the move to `deployment_status`, the CI triggers, the branch protection and the docs mostly matched the card. One problem blocked: a failed Vercel preview made the `preview` job skip, and GitHub counts a skipped job as passing, so branch protection would have let it merge.
**Security:** Passed for pinned actions, the read-only token and secrets per step; the unused `ADMIN_PASSWORD` secret was still stored.

### Must fix

- `.github/workflows/preview-tests.yml:23` A job-level `if: state == 'success'` made a failed preview skip the job, which counts as passing. **Done:** the job runs for final states and fails unless `success`, and Vercel's status is a required check too.

### Should fix

- The repository secret `ADMIN_PASSWORD`, no longer used, could be read by a workflow on any deployed branch. **Done:** deleted (with the user's OK).
- `wiki/system/pipeline.md:59` repeated the job budgets from `testing.md`. **Done:** it links to them.

### Suggestions

- `live-tests.yml:18` The skipped `live` check on every pull request needs a word of explanation. **Done:** a comment in the workflow and a note in `pipeline.md`.
- `README.md:72` A second, ASCII diagram of the pipeline could drift from the Mermaid one. **Done:** removed; README points to `pipeline.md`.

### Outside the change

- Vercel's Git Fork Protection on a public repo. **Done:** checked by the user.
- `README.md:94` on `npm test`. **Done:** it says the whole suite against the live site is run by hand only.
