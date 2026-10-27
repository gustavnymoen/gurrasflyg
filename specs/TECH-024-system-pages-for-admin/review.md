---
id: TECH-024
title: System pages for the administration and reviews
---

# Code review of TECH-024

**Result:** Passed
**Date:** 2026-10-27, review run 2
**Summary:** Run 2 checked the fixes of run 1 and the whole change again: the three new system pages and `design.md` match the code, the wiki has the OKF v0.2 shape and no broken links, and no must-fix or should-fix findings are left.
**Security:** Passed. The pages name `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` but give no values, and describe the proxy, page and server-action checks, the cookie flags and the attempt limit as the code does. `/security-review`: not needed, no code, route, query or personal data changes (one code comment was reworded).

How the review works: `wiki/system/code-review.md`. A later run is added at the top as "Review run 3".

## Must fix

None.

## Should fix

None.

## Suggestions

- `lib/login-limit.ts:10-15` The comment said that no more attempts are counted once an address is locked, but the SQL still counts them up; only `last_failed_at` stops moving. **Done:** the comment is reworded.

## Outside the change

- The oldest spec folders (TRIP-001 to TRIP-006, TECH-001, 002, 005, 006, 007) have `spec.md` instead of `solution.md`. Out of scope in the card; not added to the board, since the new wiki pages now say how the administration and reviews are built.

# Review run 1

**Result:** Stopped (1 must fix)
**Date:** 2026-10-27, review run 1
**Summary:** The new pages matched the code almost everywhere and the OKF shape and links were valid, but one statement in `reviews.md` was wrong.
**Security:** Passed (same as above).

## Must fix

- `wiki/system/reviews.md` It said the start page shows no heading when there are no reviews; the heading "Vad våra resenärer säger" is in `app/page.tsx`, outside the carousel, so it stays. **Done:** the sentence now says the carousel shows nothing and the heading stays.

## Should fix

- `wiki/system/admin-sign-in.md` It said no more attempts are counted once an address is locked; only `last_failed_at` stops moving. **Done:** reworded.
- `wiki/system/index.md` Two entries (`GET /api/destination-search` and the TRIP-023 bullet) linked pages without repeating their `description`, breaking R3. **Done:** the TRIP-023 bullet is removed and the endpoint bullet no longer links.
- `.claude/launch.json` is untracked and unrelated. **Done:** not staged; it is not part of this change.

## Suggestions

- `wiki/system/admin.md` "Routes" is correct as it is; no change.
