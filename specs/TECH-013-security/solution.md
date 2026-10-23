---
id: TECH-013
title: Security in the review and the pipeline
card: "#41"
depends_on: [TECH-006, TECH-016]
---

# TECH-013 Security in the review and the pipeline: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 41`.

## Data

None.

## Interface

**In the review (R1, R2)**

- `wiki/system/code-review.md`: a new point 8, Security, with what the reviewer checks (sign-in on the server, input validated on the server, parameterised queries, secrets, cookies, errors to visitors, personal data), and when `/security-review` is run as well.
- `specs/_template/review.md` and the report format in `.claude/agents/code-reviewer.md`: a line "Security".
- `CLAUDE.md` step 7: run `/security-review` for sensitive changes and add its result to the report.
- `wiki/system/testing.md`: the security section filled in.

**In the pipeline (R3–R6)**

- `.github/workflows/ci.yml`: a second job, `security`, next to `check`, on a plain Ubuntu runner (it needs Docker, which the Playwright container job doesn't have):
  - `npm audit --omit=dev --audit-level=high` (needs only `package-lock.json`, no install);
  - Semgrep 1.182.0 from its official image, with the community rule packs `p/javascript`, `p/typescript`, `p/react`, `p/nextjs` and `p/sql-injection`, `--error` and `--metrics=off`;
  - Gitleaks 8.30.1 from its official image, over the whole Git history (`fetch-depth: 0`), with `--redact` so values are never printed.
- `.github/dependabot.yml`: npm (`/`) and GitHub Actions (`/` and `/.github/actions/setup-tests`), security updates only (`open-pull-requests-limit: 0` turns version updates off).
- Repo settings: Dependabot alerts and security updates turned on (2026-10-23, with the user's OK).

**Fixes from the one-time review (R7)**

- `app/admin/login/actions.ts`: a wrong password is answered after one second; a missing `ADMIN_PASSWORD` names the setting only outside production.
- `lib/session.ts`: `passwordMatches` compares SHA-256 hashes of the password with `timingSafeEqual`, so the length of the right password doesn't show in the response time.
- `lib/admin.ts` and `app/admin/actions.ts`: run-time checks of server action input: `requireId` for ids, `requireText` accepts only strings of at most 200 characters, prices must be strings, the aircraft's classes and add-ons must be arrays.
- `next.config.ts`: security headers on every response (`X-Frame-Options: DENY`, `Content-Security-Policy: frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`).
- `playwright.config.ts`: a trace only for local runs, since a trace saves typed values and headers, and so the admin password and the bypass secret.
- `.github/workflows/`: `permissions: contents: read` in CI and Live tests; the secrets in Preview tests and Live tests are given only to the `npm test` step, not to `npm ci`.
- `wiki/system/architecture.md`: the sign-in's security details, including that signing out doesn't invalidate a copied cookie (stateless session).

## Decisions

- **Gitleaks scans the whole history on every pull request,** not only the pull request's commits. The history is small (seconds), a secret that came in earlier is found too, and the one-time history scan of R5 is simply the first run.
- **Semgrep and Gitleaks run as Docker images with fixed versions,** not as GitHub Actions: no third-party action gets the token, and TECH-012's rule (pin to commits) has nothing to pin here.
- **Only community rules and no account.** `semgrep ci` and the Gitleaks action's organisation licence need sign-up; `semgrep scan` with registry packs and the Gitleaks CLI don't.
- **The demo of failing scans ran on a throw-away pull request** (#54), which was closed and its branch deleted, so the made-up token never reached `main` and the full-history scan stays clean.
- **Larger findings go to the board:** a limit on sign-in attempts needs a table in the database (Vercel's functions don't share memory), so it is TECH-017; the risks in `copy-to-prod` are noted on TECH-004, which removes the script.
