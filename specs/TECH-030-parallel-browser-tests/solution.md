---
id: TECH-030
title: Bring the browser tests back inside the time budget
card: "#137"
depends_on: [TECH-032]
---

# TECH-030 Bring the browser tests back inside the time budget: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 137`.

## Data

None. The test databases (`~/Ai Projekt/gurrasflyg-data/test-<lane>.db`) are built from the schema, seed and migrations by `scripts/db-setup.mjs`, as `test.db` was.

## Interface

None for visitors. For developers:

- `npm run test:local` runs the browser tests in **lanes** (`lib/test-lanes.mjs`: four by default, `TEST_LANES` changes it). `scripts/test-server.mjs` builds once and starts one copy of the site per lane (ports 3200–3203), each with its own database. Port 3100 only signals: it answers when every lane's site is ready, which is what Playwright waits for.
- `playwright.config.ts` makes one project per lane (`lane-0` …), each with `workers: 1`, and divides the spec files between them. Against a deployed site (`BASE_URL`) there is no lane, one worker, as before.
- `npm run test:time` prints the time the run took (first test's start to last test's end) against the 180 s budget, and the tests' own times added up on a line of its own.
- On CI, `node scripts/test-server.mjs --build-only` builds (the one build) and `npm run test:local` runs with `TEST_SERVER_PREBUILT=1`, which skips the build and only rebuilds the databases.

## Decisions

- **Why lanes and not more workers on one database.** The first try was `--workers=4` with the old single site and database: 2.0 min, but 3 of 261 tests failed. Two causes: a test and the site writing to the database at the same moment (`SQLITE_BUSY`), and, worse, the tests that create aircraft (`fleet` in `tests/plan.ts`, the admin tests) change the set of aircraft that every other test sees, so "Billigast" (cheapest) was on four aircraft instead of one and the agent chose another aircraft than the test expected. The tests were written for a database of their own. Rather than sorting the files into "may run together" and "may not" (the 18 files that use the fleet are 140 s of 257 s, so that would not have reached the budget, and a new test could break it silently), every lane gets a database of its own, and the tests keep the guarantee they were written for.
- **Project, not just workers.** A Playwright project has its own `baseURL`, so a lane's site is a project's `baseURL` and nothing in the tests changes. The first lane run still failed (5 tests): with only the global `workers: 4`, Playwright let all four workers take tests from any lane, so a lane's database was used by several tests at once. Each lane project needs `workers: 1`. Found by reading the order the files ran in.
- **Files are divided by size, not by name or by a list.** The largest file goes to the lightest lane (a greedy division), with file size as the measure of time. It needs no maintenance and gave lanes of 68–70 s of tests each. A new file lands in the lightest lane. A list of files per lane would be wrong as soon as a file changes.
- **`inTestDb` finds its lane** from the running project's name (`base.info().project.name`), since it is only called from inside tests.
- **The gate on port 3100.** Playwright's `webServer` waits for one URL. The script answers on 3100 only after all lanes' sites answer, so no lane's first test can find its site missing. The lanes use ports from 3200, since a development server of another project held 3101 during the work and made the first version fail to start.
- **Next is started with `node` directly, not through `npx`.** Stopping `npx` left the site running and holding its port.
- **One build on CI.** The build step of the job is the build for the tests (same code, with the test environment), so the second build (11–15 s) is gone. The cost, accepted knowingly: CI no longer runs the plain `npm run build` with the default environment (the default `.next` output); a build that breaks only there is first seen in Vercel's build of the preview. `next build` does not differ between the two but in `NEXT_DIST_DIR`, `LLM_MOCK` and the database file. A plain `npm run test:local` still builds every time, so an old build is never tested by mistake. The databases are rebuilt at every start either way.
- **Not done: trimming tests.** The card makes it conditional on the run still being over 180 s; it is at 72.5 s locally, so no test was combined or removed. No test lost its check.
- **The number of lanes** is four because the computer has 10 cores and the CI runner 4: a site and a browser for each lane. What CI gives is recorded in `verification.md`.
