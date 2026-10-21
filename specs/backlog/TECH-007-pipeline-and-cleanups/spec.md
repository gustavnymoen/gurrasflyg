---
id: TECH-007
title: Better pipeline and small cleanups
area: Shared
status: backlog
created: 2026-10-21
updated: 2026-10-21
depends_on: [TECH-005]
---

# TECH-007 Better pipeline and small cleanups

## Goal

Every change is tested against a real Vercel and Turso environment before it reaches production, CI runs once per change and a little faster, and whole numbers typed in the admin forms are read in one way, in one place. The site behaves as before.

## Background

Small findings from TECH-005, grouped into one task:

- `.github/workflows/ci.yml` runs on `push` to every branch and on `pull_request` to `main`. A push to a branch with an open pull request therefore starts two identical CI runs (seen on pull request #7: 2 min 45 s and 2 min 35 s). They run side by side, so the wait isn't longer, but the work is done twice.
- Two functions read a whole number from what an administrator typed, in two different ways: `parseCapacity` in `app/admin/AircraftForm.tsx` (in the browser, with `Number`, so "1e2" and "12.0" are accepted) and `parseKronor` in `lib/admin.ts` (on the server, digits and spaces only, TECH-005-R4). Found in TECH-005's code review.

- The real environment (Vercel, Turso, environment variables, migrations on a real database) is only tested after a production deploy, by "Live tests". If they fail, the fault is already live. Every branch already gets a preview deployment with a Turso database of its own (`wiki/system/architecture.md`), but nothing is tested against it, because Vercel's Deployment Protection asks for a Vercel sign-in.
- Each CI and Live tests run downloads Chromium again (`npx playwright install --with-deps chromium`).

## Users

Developers. The administrator sees no difference, apart from the stricter seats field in R3.

## Scope

**In scope**

- CI triggers.
- Running the tests against each pull request's preview deployment, before merge.
- Caching Playwright's browser in the workflows, and one shared setup for them.
- One shared parser for whole numbers, used by the seats fields and the add-on price.

**Out of scope**

- Making merge technically impossible while a check is red: branch protection needs GitHub Pro for a private repository. The rule in `CLAUDE.md` stays the gate.
- Splitting the tests into parallel jobs.
- Other cleanups.

## Requirements

### TECH-007-R1 The site behaves as before

Apart from R3, the site shall work exactly as before.

Acceptance criteria:

- **Then** `npm run lint`, `npm run typecheck` and `npm run build` pass without errors or warnings.
- **Then** the existing tests pass, both `npm run test:local` and, after deploy, `npm test` against the live site.

### TECH-007-R2 CI runs once per change

CI shall run on pull requests to `main` and on pushes to `main`, and not on pushes to other branches.

Acceptance criteria:

- **Given** a branch with an open pull request, **when** it is pushed, **then** exactly one CI run starts.
- **When** a pull request is merged, **then** CI runs on `main`.
- **Then** `CLAUDE.md`, `README.md` and `wiki/system/architecture.md` describe when CI runs. A branch without a pull request is checked locally (step 5 in `CLAUDE.md`) and by CI once its pull request is opened.

### TECH-007-R3 One parser for whole numbers

A function in a small module without `server-only` (for example `parseWholeNumber` in `lib/numbers.ts`) shall read a whole number from typed text: spaces are ignored, and anything but digits gives no number. `parseCapacity` and `parseKronor` both use it and keep their own rules and messages (seats more than 0; price 0 or more, "Ange priset i hela kronor.").

Acceptance criteria:

- **Then** "1 290" gives 1290, and "12,50", "12.50", "1e2", "-5" and "" give no number.
- **Then** the seats fields accept "120" and "1 200", and no longer accept "1e2" or "12.0" (they show the same message as other invalid seats).
- **Then** the TECH-005-R4 test still passes.

### TECH-007-R4 Tests against the preview deployment before merge

A workflow "Preview tests" shall run `npm test` against the preview deployment of each commit on a pull request to `main`, when Vercel reports the preview as ready, and pass Vercel's Deployment Protection with the "Protection Bypass for Automation" secret (repository secret `VERCEL_AUTOMATION_BYPASS_SECRET`, created by the user in Vercel and on GitHub, sent as the header `x-vercel-protection-bypass`). The tests that run only locally are skipped, as against the live site.

Acceptance criteria:

- **Given** a pull request, **when** its preview deployment is ready, **then** "Preview tests" runs against that deployment's address, and its result is shown on the pull request.
- **Then** the admin tests sign in on the preview with the repository secret `ADMIN_PASSWORD`, the same as Live tests (Vercel's Preview environment has `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`, with the same password as production); without it they are skipped.
- **Then** test data is created and deleted in the preview's database, never in production's.
- **Then** step "Merge" in `CLAUDE.md` says to merge only when both "CI" and "Preview tests" are green, and `README.md` and `wiki/system/architecture.md` describe the workflow and the secrets.
- **Then** the bypass secret is never written to logs or files.

### TECH-007-R5 Faster, shared test setup in the workflows

The workflows that run Playwright (CI, Live tests, Preview tests) shall share one setup (a composite action, for example `.github/actions/setup-tests/`) that installs the packages and Chromium, with Chromium cached between runs, keyed on the Playwright version in `package-lock.json`.

Acceptance criteria:

- **Then** the three workflows use the shared setup instead of repeating the steps.
- **Given** a cache hit, **then** Chromium isn't downloaded again; the time of a CI run before and after is recorded in `verification.md`.
- **When** Playwright is upgraded, **then** the cache key changes and the new browser is downloaded.

## Data

None.

## Interface

- `.github/workflows/ci.yml`: the `push` trigger is limited to `main`; uses the shared setup.
- `.github/workflows/preview-tests.yml` (new): tests against the preview deployment.
- `.github/workflows/live-tests.yml`: uses the shared setup.
- `.github/actions/setup-tests/` (new): packages and cached Chromium.
- `playwright.config.ts`: sends the bypass header when the secret is set.
- `lib/numbers.ts` (new): `parseWholeNumber`.
- `app/admin/AircraftForm.tsx`, `lib/admin.ts`: use it.

How "Preview tests" learns the preview's address is decided while building: Vercel's commit status links to Vercel's dashboard, not to the deployment, so the address comes from what the status event holds, the branch address (`gurrasflyg-git-<branch>-<team>.vercel.app`) or Vercel's API. Whichever is used is written into this section.

## Non-functional requirements

None beyond `specs/overview.md`.

## Open questions

None.
