---
id: TECH-007
title: Better pipeline and small cleanups
---

# Verification of TECH-007

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-007-R1 | `npm run lint`, `npm run typecheck`, `npm run build`: no errors or warnings | local | Pass | 2026-10-21 |
| TECH-007-R1 | `npm run test:local`: 56 passed | local | Pass | 2026-10-21 |
| TECH-007-R1 | `npm test` against the live site after the merge of pull request #8: 50 passed, 6 skipped (local only); "Live tests" on `main` passed too | live | Pass | 2026-10-21 |
| TECH-007-R2 | Pull request #8: the push before the pull request started no CI run; opening it, and each later push, started exactly one | GitHub | Pass | 2026-10-21 |
| TECH-007-R2 | CI ran once on `main` after the merge of #8 (push) and passed | GitHub | Pass | 2026-10-21 |
| TECH-007-R3 | Test `TECH-007-R3 whole numbers are read in one way` | local | Pass | 2026-10-21 |
| TECH-007-R3 | Test `TECH-007-R3 the seats field accepts only whole numbers`: "120" and "1 200" accepted, "1e2" and "12.0" keep the button disabled, both when adding and changing | local | Pass | 2026-10-21 |
| TECH-007-R3 | Test `TECH-005-R4 add-on prices must be whole kronor, 0 or more` still passes | local | Pass | 2026-10-21 |
| TECH-007-R4 | First run on #8: Vercel started the preview 12 minutes after the push, and the job gave up after 10. Re-run: the bypass worked (20 passed), but 30 admin tests failed: the preview answered "Inget lösenord är satt", since `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` were set for Production only in Vercel | GitHub | Fail | 2026-10-21 |
| TECH-007-R4 | After the user ticked Preview for both variables in Vercel: "Preview tests" waited for Vercel, ran against `gurrasflyg-git-tech-007-pipeline-and-cleanups-aqc-lab.vercel.app`: 50 passed, 6 skipped (local only), result shown on the pull request, 2 min 18 s | GitHub | Pass | 2026-10-21 |
| TECH-007-R4 | The downloaded failure report holds no bypass secret (searched for it) | GitHub | Pass | 2026-10-21 |
| TECH-007-R4 | Code review: `CLAUDE.md` step 9 and the Git rule, `README.md` and `wiki/system/architecture.md` describe the workflow and the secrets; traces are off when the bypass secret is set | docs | Pass | 2026-10-21 |
| TECH-007-R5 | Code review: CI, Live tests and Preview tests use `.github/actions/setup-tests/`; CI and Preview tests ran green with it on #8 | GitHub | Pass | 2026-10-21 |
| TECH-007-R5 | The Chromium cache, as first built: hit on the later runs, but no faster (setup 42 s with hit, 36 s without; CI 138–156 s against 139–165 s before). Removed with the user; R5 changed | GitHub | Removed | 2026-10-21 |

## Definition of Done

- [x] Tests: every requirement is tested or has a recorded check; `npm run test:local` passes
- [x] Deployed, and `npm test` passes against the live site
- [x] Accessibility: not applicable, visitors see no change
- [x] Spec updated to match what was built, no open questions left
- [x] Manual not affected; README, `CLAUDE.md`, `architecture.md` and `wiki/log.md` updated
- [x] No leftovers
- [x] Clean code; lint, type check and build pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] No new technical tasks

## Notes

- "Preview tests" starts on `pull_request` and waits for Vercel, instead of starting on Vercel's `status` event: a `status` workflow runs in `main`'s context, so its result wouldn't show on the pull request and it couldn't be tried before merge. See the spec's Interface section.
- CI time before the change: 2 min 19 s to 2 min 45 s (pull request #7 and its merge).
- Pull request #8 was merged before the last two commits (removing the cache, this verification, the move to `done/`); they reached `main` through a follow-up pull request.
- First Preview tests run: Vercel's build for the push started 12 minutes late. The job waits at most 10 minutes; README says to re-run it when Vercel is slower.
- A first guess at the admin failures (the bypass cookie header breaking server actions) was wrong; the header was removed anyway, since the secret is sent with every request.

## Moved by TECH-015 (2026-10-23)

`TECH-007-R3 whole numbers are read in one way` moved, with the same checks, to the unit tests in `lib/numbers.test.ts`.
