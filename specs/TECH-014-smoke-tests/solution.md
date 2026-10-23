---
id: TECH-014
title: Whole suite once, smoke tests after deploy, branch protection
card: "#48"
depends_on: [TECH-001, TECH-007, TECH-011, TECH-012, TECH-013, TECH-016]
---

# TECH-014 Whole suite once, smoke tests after deploy, branch protection: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 48`.

## Data

None.

## Interface

- `tests/TECH-014-smoke-tests.spec.ts`: five smoke tests named `TECH-014-R2 @smoke …`: the start page with its heading and search form, the reviews, `/api/airports?q=sto` containing ARN, `/admin` sending a visitor to `/admin/login`, and `/api/destinations` answering with destinations. The API checks use Playwright's `request` and need no browser page.
- `package.json`: `npm run test:smoke` (`playwright test --grep @smoke`), against the live site or `BASE_URL`.
- `.github/workflows/ci.yml`: on pull requests to `main` and by hand (`workflow_dispatch`), no longer on pushes to `main` (R1).
- `.github/workflows/preview-tests.yml`: started by `deployment_status`; runs when the state is `success` and the environment starts with `Preview`; checks out `deployment.sha` and runs the smoke tests against `deployment_status.environment_url`, with only the bypass secret. The job that polled Vercel's commit status and built the address from the branch name is gone (R3, R5).
- `.github/workflows/live-tests.yml`: started by `deployment_status` for `Production`, or by hand; runs the smoke tests against the live site's fixed address, with no secret (R4, R5).
- Branch protection on `main`, set with `gh api` (R6).
- Docs (R7): `wiki/system/pipeline.md` (new, with a Mermaid diagram), `wiki/system/testing.md` (smoke tests in use, where each check runs, new budgets), `README.md` (a short Pipeline section and `test:smoke`), `wiki/system/architecture.md`, `CLAUDE.md` (Verify, Merge, Definition of Done, Git rules), `specs/_template/verification.md`, `wiki/system/index.md`, `wiki/log.md`.

## Decisions

- **The whole suite in CI, not against the preview.** CI's local production build with a fresh test database covers every test, including those that read the database, which can't run against the preview; the preview and production get the smoke tests, which show that the deploy itself works (decided with the user, best practice).
- **`deployment_status`, not `repository_dispatch`.** Vercel recommends `repository_dispatch` for new workflows, but those runs start from `main` and don't belong to the pull request's commit, so they can't be a required check without an extra action that sets a status, and can't be tried before they are merged. `deployment_status` runs belong to the deployed commit and show on the pull request (decided with the user on 2026-10-23). Vercel had the event turned off for this project; the user turned it on under Settings → Git.
- **`startsWith(environment, 'Preview')`:** Vercel names the environments "Preview" and "Production" (seen on the first deployment of this branch); `startsWith` also covers the "Preview – <project>" form Vercel uses when one repository has several projects.
- **Live tests use the fixed address,** not the deployment's own address: the production domain is what visitors use, and Vercel's protection covers the deployment addresses.
- **`npm test` stays** as a way to run the whole suite against the live site by hand (the course's `npm test`), but the pipeline doesn't run it there any more.
- **Smoke tests may overlap browser tests**, the one exception to "No duplicates", since they check the deployed site; the rule is in `testing.md`.
- **No approving review in branch protection:** the user merges their own pull requests, and GitHub doesn't let an author approve their own.
