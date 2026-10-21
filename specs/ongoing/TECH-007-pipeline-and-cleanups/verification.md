---
id: TECH-007
title: Better pipeline and small cleanups
---

# Verification of TECH-007

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-007-R1 | `npm run lint`, `npm run typecheck`, `npm run build`: no errors or warnings | local | Pass | 2026-10-21 |
| TECH-007-R1 | `npm run test:local`: 56 passed | local | Pass | 2026-10-21 |
| TECH-007-R1 | `npm test` against the live site after deploy | live | Not checked yet | |
| TECH-007-R2 | One CI run for a push to a branch with an open pull request; CI on `main` after merge | GitHub | Not checked yet | |
| TECH-007-R3 | Test `TECH-007-R3 whole numbers are read in one way` | local | Pass | 2026-10-21 |
| TECH-007-R3 | Test `TECH-007-R3 the seats field accepts only whole numbers`: "120" and "1 200" accepted, "1e2" and "12.0" keep the button disabled, both when adding and changing | local | Pass | 2026-10-21 |
| TECH-007-R3 | Test `TECH-005-R4 add-on prices must be whole kronor, 0 or more` still passes | local | Pass | 2026-10-21 |
| TECH-007-R4 | "Preview tests" on the pull request: waits for Vercel, runs `npm test` against the preview, result on the pull request | GitHub | Not checked yet | |
| TECH-007-R4 | Code review: `CLAUDE.md` step 9 and the Git rule, `README.md` and `wiki/system/architecture.md` describe the workflow and the secrets; traces are off when the bypass secret is set | docs | Pass | 2026-10-21 |
| TECH-007-R5 | The three workflows use `.github/actions/setup-tests/`; a run with a cache hit skips the Chromium download; time before and after | GitHub | Not checked yet | |

## Definition of Done

- [x] Tests: every requirement is tested or has a recorded check; `npm run test:local` passes
- [ ] Deployed, and `npm test` passes against the live site
- [x] Accessibility: not applicable, visitors see no change
- [x] Spec updated to match what was built, no open questions left
- [x] Manual not affected; README, `CLAUDE.md`, `architecture.md` and `wiki/log.md` updated
- [x] No leftovers
- [x] Clean code; lint, type check and build pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] No new technical tasks

## Notes

- "Preview tests" starts on `pull_request` and waits for Vercel, instead of starting on Vercel's `status` event: a `status` workflow runs in `main`'s context, so its result wouldn't show on the pull request and it couldn't be tried before merge. See the spec's Interface section.
- CI time before the change, for R5: 2 min 19 s to 2 min 45 s (pull request #7 and its merge).
