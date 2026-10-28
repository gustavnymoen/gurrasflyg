---
id: TECH-025
title: Rate limit on public flows
---

# Code review of TECH-025

**Result:** Passed
**Date:** 2026-10-28, review run 2
**Summary:** The fix for the must-fix of run 1 is correct: the `CASE`, the cleanup and `msLeft` hold together, and the sign-in and Min bokning behave as before. Nothing new to fix.
**Security:** Passed. The count is one atomic upsert, the key is the first `x-forwarded-for` entry cut to 45 characters, the keys are prefixed so they can't collide with sign-in addresses, and no secrets or personal data are added. `/security-review`: run, no findings at confidence 8 or higher.

How the review works: `wiki/system/code-review.md`.

## Must fix

None.

## Should fix

None.

## Suggestions

- `lib/rate-limit.ts:32` The cleanup comment gave only the general rule. **Done:** it now says that with `fixedWindow` `last_failed_at` is the first attempt, which is what makes the window start over.

## Outside the change

- Rows of a key with a 1-minute window that is never used again stay until they are 15 minutes old, and then the next call from any key removes them. The table is bounded, so this is only a note. Not added to the board.

# Review run 1

**Result:** Stopped (1 must fix)
**Date:** 2026-10-28, review run 1
**Summary:** The change was tidy, but the window was measured from the latest attempt, so R3 ("more than 60 calls in a minute") did not hold for steady use.
**Security:** Passed. `/security-review` was run after run 1, see run 2.

## Must fix

- `lib/rate-limit.ts:29` and `lib/flow-limits.ts:12` (R3, also R1) The count only started over when a key had been quiet for a whole window, so 61 calls spread over 20 minutes, never more than a few a minute, gave a 429. **Done:** `Limit.fixedWindow` counts the window from the first attempt for Betala and the API routes; the sign-in keeps its meaning. Unit tests for steady use and for the window from the first call were added, and the card and `rate-limits.md` say it.

## Should fix

- `.claude/launch.json` is a new untracked file that has nothing to do with this task. **Done:** it was there before the work started; it is left out of the commit.
- `tests/TECH-025-rate-limit.spec.ts:19` `lockKey` used a plain `INSERT`, so a row left by a crashed run gave a constraint error. **Done:** `ON CONFLICT DO UPDATE`.
- R3's "normal use of the search field gives no 429" had no test. **Done:** the unit test of 61 calls 30 seconds apart.

## Suggestions

- The exemption of requests without `x-forwarded-for` is safe on Vercel; behind another proxy it would need a second look. **Done:** a line in `rate-limits.md` and a comment in `lib/flow-limits.ts`.
- A comment that the cleanup and the counting are two statements, and that a missed cleanup only means the next call cleans up. **Done:** added in `lib/rate-limit.ts`.
- The sign-in key has no prefix, unlike the other flows. **Done:** left as it is; a prefix would change existing rows.

## Outside the change

- The table `login_attempts` and its columns no longer say what they hold. The card names a rename out of scope. Not added to the board yet.
