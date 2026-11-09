---
id: TECH-030
title: Bring the browser tests back inside the time budget
---

# Code review of TECH-030

**Result:** Passed
**Date:** 2026-11-09, review run 1
**Summary:** TECH-030 meets R1–R5 as built. Lanes (a site and a database each) replace the card's "more workers plus a serial step", and the reasons are recorded in `solution.md`. No must-fix finding; the small should-fix and suggested points are done below.
**Security:** Passed. No secret is added or printed; the CI workflow only changes a run step and an environment variable, and no third-party action is added; the teardown reads `ADMIN_PASSWORD` from the environment only. `/security-review`: not needed (tests, test configuration and the CI workflow), as the card says.

How the review works: `wiki/system/code-review.md`. The reviewer read the working tree against `main`; it did not run the tests, lint or the type check (the author did: ten full runs in a row, lint and type check pass).

## Must fix

None.

## Should fix

- `verification.md` (Requirements as built) R3 and R4 were copied unchanged from the card, and R3 spoke of a serial step that does not exist. **Done:** R3 and R4 reworded to the lanes here and in the card.
- `.github/workflows/ci.yml:46` CI no longer runs the plain `npm run build`, so a build that breaks only with the default environment is first seen in Vercel's preview build. **Done:** kept on purpose (one build is the point of R4), and written down in `solution.md`, `pipeline.md` and R4.
- `verification.md` (R3 row) "261 tests each" did not fit the final 262 tests, and did not say which runs used the CI way. **Done:** the row now says which runs were before and after the split and which were the CI way. The CI-way run was repeated after the fixes and passed (262 tests, 80.3 s).
- `.claude/launch.json` is untracked and not part of this change. **Done:** left alone and not to be committed.

## Suggestions

- `scripts/test-server.mjs` A normal shutdown printed "The test site of lane N stopped". **Done:** a `stopping` flag silences it.
- `scripts/test-time.mjs` `process.exit(1)` without a message when no tests ran. **Done:** it prints why.
- `playwright.config.ts` The division by file size can make one lane slower without anyone seeing it; `test:time` could print the time per lane. **Done:** left as it is (68–70 s per lane now); to be looked at if a lane drifts.

## Outside the change

- `npm run build` in `scripts/test-server.mjs` (not prebuilt) runs `prebuild` (`db-setup`) for lane 0 again after the loop has built every database: a few hundred milliseconds of duplicate work. Not added to the board.
