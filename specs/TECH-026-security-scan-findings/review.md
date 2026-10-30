---
id: TECH-026
title: Security scan findings
---

# Code review of TECH-026

**Result:** Passed
**Date:** 2026-10-30, review run 1
**Summary:** The change does what R1-R5 ask. The CSP matches the card and allows Next's inline scripts and styles through `'unsafe-inline'`, and the lookup limiter still locks after the limit now that a success no longer clears the counter. No must-fix findings.
**Security:** The security points of the review: passed (sign-in unchanged, server-side validation of the search text, no new queries, no secrets, no cookies touched). `/security-review`: run, no findings at confidence 8 or higher; the CSP's `'unsafe-inline'` is a known limit, documented and with its own card (TECH-027).

## Must fix

None.

## Should fix

- `specs/TECH-026-security-scan-findings/verification.md` was still the template, and the Backlog card for a strict CSP was missing. **Done:** `verification.md` filled in; TECH-027 (#103) added to the board.

## Suggestions

- `lib/search-text.ts` `MAX_QUERY_LENGTH` had the same name as the booking query limit in `lib/booking-rules.ts`. **Done:** renamed to `MAX_SEARCH_LENGTH`.
- After R1 every lookup and cancellation request counts, so more than 5 in 15 minutes locks a visitor. **Done:** written in `wiki/system/my-booking.md`.
- On Vercel previews the toolbar script from `vercel.live` may be blocked by `script-src 'self'`. **Done:** left as it is; recorded in `verification.md` to be checked in the Preview tests.

## Outside the change

- `clearLoginAttempts` is now used only by the admin sign-in; not unused, no action.
