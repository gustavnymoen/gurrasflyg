---
id: TECH-026
title: Security scan findings
card: "#102"
depends_on: [TECH-013, TECH-017, TECH-025]
---

# TECH-026 Security scan findings: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 102`.

## Data

None.

## Interface

Nothing a visitor sees changes.

- **`lib/my-booking.ts`** (R1): `checkCredentials` no longer calls `clearLoginAttempts` after a successful lookup. The counter ends with its window. The admin sign-in still clears its own counter on a right password.
- **`lib/search-text.ts`** (R2): `searchText(params)` and `MAX_QUERY_LENGTH` (100), used by `/api/airports` and `/api/destination-search`, which had the cut as a local constant.
- **`next.config.ts`** (R3): `Permissions-Policy`, `Strict-Transport-Security` and a `Content-Security-Policy` built by `contentSecurityPolicy(dev)`. The config is now a function of the phase, so `'unsafe-eval'` is added only in `next dev`.
- **R4:** `.vitest/json/output.json` removed from Git (`git rm --cached`), `/.vitest/` in `.gitignore`, and `chmod 600 .env.local` in the README's setup steps.
- **R5:** the known limit of the stateless sign-in is in `wiki/system/admin-sign-in.md`; the headers are described in the new `wiki/system/security-headers.md`.

## Decisions

- **`'unsafe-inline'` stays.** Next's own inline scripts and styles need it, and a nonce policy needs dynamic rendering of every page, which `cacheComponents` rules out. Recorded in the wiki; a Backlog card covers a strict CSP.
- **One shared `searchText()`** instead of a second copy of the cut, so the two routes can't drift apart again.
- **The unit test of the lock** sets the count with four wrong guesses, one right lookup and one more wrong guess. An older unit test that made nine lookups from one address now uses an address per request, since the right lookups no longer reset the count.
- **The CSP check on the main pages** is in the new spec (`/`, `/charter`, `/min-bokning`, `/admin/login`), not added to every existing page test: those are about 30 files, and the policy is the same for every page.
- **Directives widened:** none. No real resource was blocked in the browser tests.
- **Vercel's HSTS.** Vercel can add `; preload` on production, so the smoke test checks the start of the value.
