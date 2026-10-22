---
id: TECH-011
title: Faster and healthier test suite
---

# Code review of TECH-011

**Result:** Passed
**Date:** 2026-10-22, review run 1
**Summary:** The three test jobs run in the Playwright image, setup-tests no longer installs browsers, a version check stops the job early with both versions named, and the time budgets and quality rules are in CLAUDE.md, the Definition of Done, the review guide and the verification template. Nothing blocks. The two should-fix findings are about error handling in `test-time.mjs` and a card baseline that no longer matched CLAUDE.md.

How the review works: `wiki/system/code-review.md`. A later run is added at the top as "Review run 2".

## Must fix

None.

## Should fix

- `scripts/test-time.mjs:25` If Playwright writes no JSON report (for example when the test server's build fails before any test runs), `readFileSync` throws: the run ends with a stack trace instead of the tests' exit code, and the temporary folder is left behind. **Done:** the report is read only if it exists, otherwise the script exits with the tests' exit code; the folder is removed in a `finally`.
- `CLAUDE.md:56` The baseline (65 s, slowest 2.5 s) differed from the one in card #36's TECH-011-R6 (75 s, 2.6 s). **Done:** the card's R6 now has the measured baseline.

## Suggestions

- `.github/actions/setup-tests/action.yml:12` Leaving out `node-version`, so that the image's Node 24 is used, means the image decides the runtime and setup-node only gives the npm cache; two places can't disagree about the Node version. The same idea is behind `check-playwright-image.mjs`: check what the job actually runs in. **Done:** left as it is.
- `CLAUDE.md:74` The quality rule "Shared helpers in `tests/helpers.ts`" repeats the first bullet under step 4 (Test). **Done:** left as it is: step 4 says how to write a test, the rule is what the review checks, and the repetition is one line.

## Outside the change

- `scripts/postinstall.mjs:1-2` The comment was in English and only mentioned Vercel, although the script is also skipped when `CI` is set, which now matters for the image-based jobs. **Done:** fixed in this change (Swedish, mentions CI and the image).
