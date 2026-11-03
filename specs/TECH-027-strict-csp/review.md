---
id: TECH-027
title: Strict Content Security Policy
---

# Code review of TECH-027

**Result:** Passed
**Date:** 2026-11-03, review run 1
**Summary:** The fallback change: the policy in `next.config.ts` is unchanged (only a comment differs), no test was touched or loosened, and the docs match what was done.
**Security:** Security points passed; the change adds no sign-in, input, query, secret, cookie or personal-data code. `/security-review` was run on the diff and found nothing (only a comment and documentation changed). The reviewer could not re-run the scratch SRI experiment; its measurements (6 and 293 errors) come from the author's session.

How the review works: `wiki/system/code-review.md`.

## Must fix

None.

## Should fix

- `.claude/launch.json` is untracked and unrelated. **Done:** left out of the commit.
- `verification.md` Definition of Done items were unchecked. **Done:** checked off except the Live tests, which wait for the merge.

## Suggestions

- The Styles section said "the same build" without the `script-src` used. **Done:** now says it was `'self'`, in the wiki and in `solution.md`.
- Decimal commas in `verification.md`. **Done:** points.

## Outside the change

- Per-page hashes of the inline scripts were not tried; only relevant if a strict `script-src` is wanted again. Not added to the board.
