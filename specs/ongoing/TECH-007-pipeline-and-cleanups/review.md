---
id: TECH-007
title: Better pipeline and small cleanups
---

# Code review of TECH-007

**Result:** Passed
**Date:** 2026-10-21, review run 1 (the `code-reviewer` agent)
**Summary:** The change does what R2–R5 ask. `parseWholeNumber` is small and correct, `parseKronor` and `parseCapacity` keep their own rules, and the preview workflow keeps the bypass secret out of traces and logs. Two stale lines in the docs and a test that missed one of the seats fields were fixed.

How the review works: `wiki/system/code-review.md`.

## Must fix

None.

## Should fix

- `README.md:17` Still said "GitHub Actions checks every push". **Done:** now says pull requests, preview before merge, and the live site after deploy.
- `CLAUDE.md:66` The Git rule asked only for a green "CI", while step 9 asks for "CI" and "Preview tests". **Done:** both say "CI" and "Preview tests".
- `tests/TECH-007-pipeline-and-cleanups.spec.ts:38` The R3 test only checked the field for adding a class, not the field for changing seats, and not "120". **Done:** both fields are checked, with "120", "1 200", "1e2" and "12.0".

## Suggestions

- `.github/workflows/preview-tests.yml` If Vercel never posts a status, the job waits 10 minutes and says "inte klar". **Done:** the message now says that Vercel reported no preview for the commit.
- `.github/workflows/preview-tests.yml` The branch address copies Vercel's naming rules, which could change. **Done:** left as it is; the spec records the trade-off, and a change would show as failing Preview tests.
- `playwright.config.ts` The bypass header is sent with every request, also to other sites. **Done:** left as it is: the site loads nothing from outside, and TRIP-008's font comes through `next/font`, which serves it from the site itself.

## Outside the change

- `wiki/log.md` The TECH-001 line says "CI checks every push". Left as it is: it describes what was true then.
