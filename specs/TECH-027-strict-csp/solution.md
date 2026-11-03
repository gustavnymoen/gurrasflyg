---
id: TECH-027
title: Strict Content Security Policy
card: "#103"
depends_on: [TECH-026]
---

# TECH-027 Strict Content Security Policy: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 103`.

## Data

None.

## Interface

Nothing a visitor sees changes. The Content Security Policy is unchanged (`script-src 'self' 'unsafe-inline'`, `style-src 'self' 'unsafe-inline'`); only the comment above it in `next.config.ts` now says that `experimental.sri` was tried.

## Decisions

**The experiment (R1).** `experimental.sri: { algorithm: "sha256" }` was added to `next.config.ts` together with `script-src 'self'` (no `'unsafe-inline'`) in production, and measured in a production build (`next build` and `next start`, own `distDir` and database copy, Next.js 16, Turbopack) with Chromium:

- The build worked, and the routes were still `○` static or `◐` partially prerendered, so `cacheComponents` and `partialPrefetching` were not affected.
- SRI adds an `integrity="sha256-…"` attribute to the `<script src>` tags of the chunk files. It does **not** touch the inline `<script>` tags in every page (the ones that start Next's loader and carry the page's server data as `self.__next_f.push(…)`).
- With `script-src 'self'` Chromium refused those inline scripts ("Executing inline script violates the following Content Security Policy directive"; 6 errors on `/`), so `self.__next_f` was never set and the page did not hydrate. A page without hydration shows the HTML but no tab, form or button works.
- An integrity attribute is also not something CSP trusts for inline code; only `'unsafe-inline'`, a nonce or a hash of each inline script would allow them. A hash in a header that is the same for every page can't fit, since the inline scripts carry each page's own data. Per-page hashes were not tried.

**Decision (R2).** The policy stays as it is, `experimental.sri` is not enabled (it would add an experimental option and gain nothing without the inline scripts), and the reason is written in `wiki/system/security-headers.md`. The strict policy needs a nonce per request, which means every page is rendered dynamically and gives up `cacheComponents`: a card of its own if it is ever wanted.

**Styles (R3).** With `style-src 'self'` and `script-src 'self'` as in the experiment, 293 "Applying inline style violates …" errors came on `/` and `/charter` (measured by changing the header in the browser). React's `style={…}` props become `style="…"` attributes, and CSP allows those only with `'unsafe-inline'` (a nonce or hash doesn't cover attributes). So `'unsafe-inline'` stays in `style-src`.

**Tests.** The policy is unchanged, so `tests/TECH-026-security-scan-findings.spec.ts` and `tests/smoke.spec.ts` already say the truth (the first even checks that an inline script runs, the known limit). Nothing was loosened.
