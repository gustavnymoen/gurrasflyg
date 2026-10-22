---
id: TECH-011
title: Faster and healthier test suite
card: "#36"
depends_on: [TECH-001, TECH-007]
---

# TECH-011 Faster and healthier test suite: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 36`.

## Data

None.

## Interface

Visitors see no change.

**Workflows (R1, R4)**

- `ci.yml`, `live-tests.yml` and the test job of `preview-tests.yml` run in the container `mcr.microsoft.com/playwright:v1.64.1-noble` with `options: --user 1001`, as in Playwright's CI docs. The user matches the runner's, so the checked-out files and the npm cache belong to the job.
- `preview-tests.yml` has two jobs: `wait` (on the runner, outside the image) waits for Vercel's status and gives the preview's address as an output, and `preview` (in the image) runs `npm test` against it. Everything else the workflows do is unchanged, including saving the report when a test fails.
- `.github/actions/setup-tests/` no longer installs Chromium or system libraries. It runs `actions/setup-node` with only `cache: npm` (the image's Node 24 is used), `npm ci`, and the version check.

**Version check (R2):** `scripts/check-playwright-image.mjs` reads the image's Playwright version from `/ms-playwright/.docker-info`, which the image writes when it is built (`playwright-core mark-docker-image`), and compares it with the installed `@playwright/test`. If they differ it prints a GitHub error with both versions, the image to use and the three files to change, and exits with 1, before any check runs.

**Test time (R6):** `npm run test:time` runs `scripts/test-time.mjs`. It runs `npm run test:local -- --reporter=list,json` with `PLAYWRIGHT_JSON_OUTPUT_FILE` pointing to a temporary file, then prints the number of tests run and skipped, the sum of the tests' durations (without building the test server), the five slowest tests, and marks anything over budget (5 s per test, 3 min in all). It exits with the tests' own exit code.

**Rules (R6, R7):** `CLAUDE.md` has a new section "Tests" with the time budgets, the 25 % rule and the quality rules; the Definition of Done has a point 9 for the test suite, and the Verify step runs `npm run test:time`. `wiki/system/code-review.md` lists test quality as point 6 of what to look for. `specs/_template/verification.md` has a table "Test suite" for the numbers before and after, and a box in the Definition of Done.

## Decisions

- **The image instead of caching the system libraries.** Caching `apt` packages is fragile (they are installed outside the project, and the cache must match the runner image). The Playwright image already has exactly what the installed Playwright needs, and is pulled from Microsoft's registry rather than Ubuntu's mirror.
- **The version is written in the three workflows, and checked at run time.** `container.image` can't read the version from `package-lock.json`, so the version is written out. The check compares what the job actually runs in with what is installed, so a forgotten update stops the job with a clear message instead of a missing browser in the middle of the tests. Playwright's own message about an outdated image only appears when the browser's revision changes, not for every new version.
- **A separate wait job in Preview tests.** The image has no `gh`, which the wait uses to read Vercel's status. Splitting the jobs keeps the wait as it was. The cost is that the test job's preparation (pulling the image and `npm ci`) now starts when the preview is ready, instead of while Vercel builds.
- **The test time is the sum of the tests' durations,** not the wall time of `npm run test:local`, which also includes building the site (about a minute). The sum changes only when the tests change, so it can be compared between features.
- **Baseline remeasured.** The card's baseline (75 s, slowest 2.6 s) was read from an earlier run's output; `npm run test:time` on 2026-10-22 gave 65 s and 2.5 s, which is what `CLAUDE.md` records. The budgets are the same.
