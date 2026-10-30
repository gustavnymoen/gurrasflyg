---
type: Feature
title: Security headers
description: The Content Security Policy, Permissions-Policy and HSTS that every response carries, why the policy keeps 'unsafe-inline', and what a strict policy would need.
resource: next.config.ts
feature: TECH-013, TECH-026
tags: [security, headers, csp, hsts]
generated:
  by: claude
  at: 2026-10-30T12:00:00+01:00
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

A strict policy (a nonce per request, or hashes) is not possible here: Next.js needs every page to be rendered dynamically to add a nonce (Next.js docs, "Content Security Policy"), which does not work with `cacheComponents` and `partialPrefetching`, and Next's SRI option is experimental. Removing `'unsafe-inline'` is a card of its own on the board.

## Tests

`tests/TECH-026-security-scan-findings.spec.ts` (the exact values on a page and an API response, no `securitypolicyviolation` and no CSP console error on the main pages, an inline script allowed and an external one blocked) and the first smoke test (`tests/smoke.spec.ts`, against the preview and production). Vercel may add `; preload` to HSTS on production, so the smoke test checks the start of the value.

Requirements and verification: `specs/TECH-026-security-scan-findings/` and `specs/TECH-013-security/`.

[System documentation](index.md)
