---
id: TECH-007
title: Better pipeline and small cleanups
area: Shared
status: done
created: 2026-10-21
updated: 2026-10-21
depends_on: [TECH-005]
---

# TECH-007 Better pipeline and small cleanups

## Goal

Every change is tested against a real Vercel and Turso environment before it reaches production, CI runs once per change, the workflows share one setup, and whole numbers typed in the admin forms are read in one way, in one place. The site behaves as before.

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
- One shared setup for the workflows.
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
- **Then** the seats fields accept "120" and "1 200", and no longer accept "1e2" or "12.0": the button to add or confirm the class stays disabled, as for other invalid seats.
- **Then** the TECH-005-R4 test still passes.

### TECH-007-R4 Tests against the preview deployment before merge

A workflow "Preview tests" shall run `npm test` against the preview deployment of each commit on a pull request to `main`, when Vercel reports the preview as ready, and pass Vercel's Deployment Protection with the "Protection Bypass for Automation" secret (repository secret `VERCEL_AUTOMATION_BYPASS_SECRET`, created by the user in Vercel and on GitHub, sent as the header `x-vercel-protection-bypass`). The tests that run only locally are skipped, as against the live site.

Acceptance criteria:

- **Given** a pull request, **when** its preview deployment is ready, **then** "Preview tests" runs against that deployment's address, and its result is shown on the pull request.
- **Then** the admin tests sign in on the preview with the repository secret `ADMIN_PASSWORD`, the same as Live tests (Vercel's Preview environment has `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`, with the same password as production); without it they are skipped.
- **Then** test data is created and deleted in the preview's database, never in production's.
- **Then** step "Merge" in `CLAUDE.md` says to merge only when both "CI" and "Preview tests" are green, and `README.md` and `wiki/system/architecture.md` describe the workflow and the secrets.
- **Then** the bypass secret is never written to logs or files.

### TECH-007-R5 Shared test setup in the workflows

The workflows that run Playwright (CI, Live tests, Preview tests) shall share one setup, the composite action `.github/actions/setup-tests/`, that installs Node, the packages and Chromium.

Acceptance criteria:

- **Then** the three workflows use the shared setup instead of repeating the steps.

Chromium is not cached. A cache was built and measured on pull request #8: with a cache hit the setup took 42 s, without it 36 s, and whole CI runs 138–156 s with the cache against 139–165 s before. Downloading Chromium takes a few seconds; the time goes to the system libraries (`install-deps`), which every new machine needs anyway. The cache was removed (settled with the user on 2026-10-21).

## Data

None.

## Interface

- `.github/workflows/ci.yml`: the `push` trigger is limited to `main`; uses the shared setup.
- `.github/workflows/preview-tests.yml` (new): tests against the preview deployment.
- `.github/workflows/live-tests.yml`: uses the shared setup.
- `.github/actions/setup-tests/` (new): Node, packages and Chromium.
- `playwright.config.ts`: sends the bypass header when the secret is set.
- `lib/numbers.ts` (new): `parseWholeNumber`.
- `app/admin/AircraftForm.tsx`, `lib/admin.ts`: use it.

How it was built: "Preview tests" starts on `pull_request`, not on Vercel's `status` event. A workflow started by `status` runs in `main`'s context, so its result would show on `main` instead of the pull request, and a new such workflow can't run before it is merged. The job waits (up to 10 minutes) until the commit's status `Vercel` is `success`, then tests the branch address `gurrasflyg-git-<branch>-aqc-lab.vercel.app`, which Vercel's commit status doesn't give (it links to Vercel's dashboard). An address longer than 63 characters is shortened by Vercel, so the job stops with a clear error for such branch names. Traces are off when the bypass secret is set, since a trace saves every request's headers.

## Non-functional requirements

None beyond `specs/overview.md`.

## Open questions

None.
