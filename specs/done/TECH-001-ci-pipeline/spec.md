---
id: TECH-001
title: Automatic pipeline (CI)
area: Shared
status: done
created: 2026-10-20
updated: 2026-10-20
depends_on: []
---

# TECH-001 Automatic pipeline (CI)

## Goal

Every change is checked automatically: lint, type check, build and the full test suite run on GitHub for every push, and the tests run against the live site after every deploy. A broken change is caught before it is merged to `main`, and a broken deploy is noticed right away.

## Background

Today the checks are run by hand (`npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run test:local`, `npm test`), and a push to `main` is published by Vercel whether or not they pass. The course prescribes Playwright tests against the live site; this keeps that, and runs it automatically.

The repository is private on a free GitHub plan, where branch protection rules aren't available. Merging only green changes is therefore a rule in the way of working, not something GitHub enforces.

## Users

Developers (the product owner and Claude). Visitors don't see any difference.

## Scope

**In scope**

- A GitHub Actions workflow that checks every push and pull request.
- A GitHub Actions workflow that tests the live site after each production deploy.
- The way of working: changes go through a branch and a pull request, and are merged when the checks are green.

**Out of scope**

- Changing how Vercel builds and publishes.
- Enforced branch protection (needs a paid plan or a public repository).
- Running the tests against Vercel's preview deployments (they are behind Vercel's sign-in).

## Requirements

### TECH-001-R1 Checks on every push

On every push to any branch, and on every pull request to `main`, GitHub shall run in order: install (`npm ci`), lint, type check, build, and the whole test suite against a local production build with a fresh test database (`npm run test:local`). The run fails if any step fails, and the result is shown as a check (green or red) on the commit and the pull request.

Acceptance criteria:

- **When** a branch is pushed, **then** the workflow "CI" runs all five steps and the commit gets a green check if they pass.
- **Given** a change that breaks a test, **when** it is pushed, **then** the check is red and the failing test is named in the log.

### TECH-001-R2 No real secrets or data in the checks

The checks of R1 shall not use production's database or passwords. The test server gets a throw-away admin password and session secret made up in the workflow, and its own test database.

Acceptance criteria:

- **Then** the workflow file contains no Turso address, and the "CI" job uses no repository secrets.

### TECH-001-R3 Tests against the live site after each deploy

After each successful production deploy on Vercel, GitHub shall run the whole test suite against <https://gurrasflyg.vercel.app> (`npm test`). The admin password is read from the repository secret `ADMIN_PASSWORD`; without it the admin tests are skipped, as locally.

Acceptance criteria:

- **When** Vercel reports a successful production deploy, **then** the workflow "Live tests" runs `npm test` against the live site.
- **When** Vercel reports a preview deploy, **then** "Live tests" doesn't run.

### TECH-001-R4 Test report when something fails

When tests fail, the run shall save Playwright's report (with screenshots and the page state at the failure) as a downloadable artifact.

Acceptance criteria:

- **Given** a failing test, **then** the run has an artifact with the Playwright report.

### TECH-001-R5 Outdated runs are cancelled

When a branch is pushed again before its previous run has finished, the previous run shall be cancelled.

Acceptance criteria:

- **When** two pushes to the same branch come quickly after each other, **then** only the latest run completes.

### TECH-001-R6 Way of working

Changes shall be made on a branch, pushed, and merged to `main` through a pull request when the "CI" check is green. `CLAUDE.md` and `README.md` describe this, and the pipeline.

Acceptance criteria:

- **Then** `CLAUDE.md` and `README.md` describe the pipeline and the branch–pull request–merge flow.

## Data

None.

## Interface

- `.github/workflows/ci.yml`: the checks (R1, R2, R4, R5).
- `.github/workflows/live-tests.yml`: tests after deploy (R3, R4).
- The repository secret `ADMIN_PASSWORD`, set by the product owner under GitHub → Settings → Secrets and variables → Actions.

## Non-functional requirements

- A CI run takes at most about five minutes.
- Node.js 24, the same version as locally.
