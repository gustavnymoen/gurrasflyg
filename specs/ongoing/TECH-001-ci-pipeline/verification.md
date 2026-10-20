---
id: TECH-001
title: Automatic pipeline (CI)
---

# Verification of TECH-001

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-001-R1 | The CI job simulated locally: `CI=1`, then lint, type check, build and `npm run test:local` (49 passed) | local | Pass | 2026-10-20 |
| TECH-001-R1 | First run of "CI" on GitHub after pushing the branch: failed at the type check, `Cannot find name 'LayoutProps'` (the local simulation had passed only because `.next/` already held the generated types) | GitHub | Fail | 2026-10-20 |
| TECH-001-R1 | After the fix (`npm run typecheck` = `next typegen && tsc --noEmit`): the whole CI sequence in a fresh clone with `CI=1` and a random password: lint, typecheck, build, `npm run test:local` (49 passed) | local, fresh clone | Pass | 2026-10-20 |
| TECH-001-R1 | Run of "CI" on GitHub after the fix | GitHub | Not yet checked | |
| TECH-001-R2 | Code review of `ci.yml`: no Turso address, no `secrets.` in the CI job; the simulation ran with a random password and secret | local | Pass | 2026-10-20 |
| TECH-001-R3 | First run of "Live tests" after the merge to `main` is published | GitHub | Not yet checked | |
| TECH-001-R4 | Locally with `CI=1` the HTML report is written to `playwright-report/`; the upload runs only on failure | local | Pass | 2026-10-20 |
| TECH-001-R5 | Code review: `concurrency` with `cancel-in-progress` in `ci.yml` | code | Pass | 2026-10-20 |
| TECH-001-R6 | `CLAUDE.md`, `README.md` and `wiki/system/architecture.md` describe the pipeline and the pull request flow | docs | Pass | 2026-10-20 |

## Definition of Done

- [x] Tests: the existing suite is the test; it passes in the CI simulation
- [ ] Runs green on GitHub (CI and Live tests)
- [x] Spec matches what was built
- [x] Manual not affected (no change for visitors); system docs and `wiki/log.md` updated
- [x] No leftovers
- [x] Clean code; lint, type check and build pass
- [x] No new technical tasks

## Notes

- Live tests need the repository secret `ADMIN_PASSWORD`; until it is set, the admin tests are skipped there.
- A pushed branch gets a Vercel preview deploy, not production; only `main` is published to production.
- That Vercel sends `deployment_status` events with the environment "Production" can only be confirmed by the first real run.
