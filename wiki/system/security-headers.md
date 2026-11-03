---
type: Feature
title: Security headers
description: The Content Security Policy, Permissions-Policy and HSTS that every response carries, why the policy keeps 'unsafe-inline' (Next's experimental SRI was tried and does not remove the need), and what a strict policy would need.
resource: next.config.ts
feature: TECH-013, TECH-026, TECH-027
tags: [security, headers, csp, hsts]
generated:
  by: claude
  at: 2026-11-03T12:00:00+01:00
---

# Security headers

`next.config.ts` sets these headers on every response (pages and API routes), through `headers()`:

| Header | Value | Why |
|---|---|---|
| `X-Frame-Options` | `DENY` | The site can't be shown in a frame on another site (clickjacking). |
| `X-Content-Type-Options` | `nosniff` | The browser doesn't guess file types. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Other sites get only the origin. |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | The site uses none of them, so they are off (TECH-026-R3). |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` | Browsers use https only, for two years. No `preload`, since that can't easily be undone. Browsers ignore it over plain `http://localhost`. |
| `Content-Security-Policy` | see below | The page may only load what it owns. |

## The policy

```
default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; object-src 'none';
base-uri 'self'; form-action 'self'; frame-ancestors 'none'
```

In `next dev` only, `script-src` also has `'unsafe-eval'`, which React's debugging needs (`contentSecurityPolicy(dev)` in `next.config.ts`, with `dev` from the config phase). Production never has it. A directive is widened only if a real resource turns out to be blocked, and the reason is written in the feature's `solution.md`.

## Known limit: `'unsafe-inline'`

Scripts and styles may be inline, so the policy does **not** stop an injected inline script. It does stop scripts, images, fonts, frames and requests from other origins, plugins (`object-src`), a changed `<base>` and forms that post elsewhere. The site has no user-written HTML (visitor input is rendered as text by React), so the risk is small.

A strict policy with a nonce per request is not possible here: Next.js needs every page to be rendered dynamically to add a nonce (Next.js docs, "Content Security Policy"), which does not work with `cacheComponents` and `partialPrefetching`. Removing `'unsafe-inline'` that way is a card of its own if it is ever wanted.

### What `experimental.sri` showed (TECH-027)

Next's experimental Subresource Integrity (`experimental.sri: { algorithm: "sha256" }`) was tried with `script-src 'self'` in a production build (`next build` and `next start`, Next.js 16) in Chromium:

- The pages stayed statically prerendered, so `cacheComponents` and `partialPrefetching` were not the problem.
- SRI adds `integrity` hashes to the `<script src>` tags of the chunk files only. The **inline** `<script>` tags in every page (Next's loader and the page's server data, `self.__next_f.push(…)`) get nothing, and CSP does not accept an integrity attribute for inline code.
- Chromium blocked those inline scripts (6 policy errors on `/`), `self.__next_f` was never set and the page did not hydrate.

So SRI does not replace `'unsafe-inline'`, and it was left off. A hash of each inline script in the header can't work either, since the scripts carry each page's own data (not tried per page). Retry after a Next.js update that nonces or hashes its inline scripts without dynamic rendering.

### Styles

With `style-src 'self'` (on the same build, whose `script-src` was `'self'`) the browser gave 293 "Applying inline style violates …" errors on `/` and `/charter`: React's `style={…}` props become `style="…"` attributes, which CSP allows only with `'unsafe-inline'` (a nonce or hash doesn't cover attributes). So `'unsafe-inline'` stays in `style-src`.

## Tests

`tests/TECH-026-security-scan-findings.spec.ts` (the exact values on a page and an API response, no `securitypolicyviolation` and no CSP console error on the main pages, an inline script allowed and an external one blocked) and the first smoke test (`tests/smoke.spec.ts`, against the preview and production). Vercel may add `; preload` to HSTS on production, so the smoke test checks the start of the value.

Requirements and verification: `specs/TECH-027-strict-csp/`, `specs/TECH-026-security-scan-findings/` and `specs/TECH-013-security/`.

[System documentation](index.md)
