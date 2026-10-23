---
id: TECH-013
title: Security in the review and the pipeline
---

# Verification of TECH-013

How each requirement was checked.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-013-R1 | Code review: `wiki/system/code-review.md` point 8 has the security points; `specs/_template/review.md` and the reviewer's report format have a "Security" line; this task's own `review.md` has it filled in | local | Pass | 2026-10-23 |
| TECH-013-R2 | Code review: `CLAUDE.md` step 7 and `code-review.md` point 8 say when `/security-review` is run and where its result goes | local | Pass | 2026-10-23 |
| TECH-013-R3 | CI job `security`, step "Sårbara paket": `npm audit --omit=dev --audit-level=high` finds 0 vulnerabilities in today's packages (run 39965901244). The whole job took 43 s, within the 8-minute budget (timeout 8 min) | CI | Pass | 2026-10-23 |
| TECH-013-R4 | Demo pull request #54 (closed, branch deleted): `run("SELECT … '" + name + "'")` in a temporary file failed the job with `sql-built-from-text` and the line. The community rules did not catch SQL joined into `pg`'s `query` or our `run`, so the custom rule in `.semgrep/sql.yml` was added. On today's code: 0 findings after excluding `.claude/` (tooling, not the site) and marking two safe lines with `nosemgrep` and why (`lib/travel.ts`, `scripts/db-setup.mjs`) | CI | Pass | 2026-10-23 |
| TECH-013-R5 | Demo pull request #54: a made-up GitHub token failed the job (`github-pat`, file and line, value redacted). The whole history (61 commits) scanned: no other finding, so no secret to rotate | CI | Pass | 2026-10-23 |
| TECH-013-R6 | `.github/dependabot.yml` covers npm and GitHub Actions with version updates off (`open-pull-requests-limit: 0`); Dependabot alerts and security updates turned on in the repo's settings (`gh api …/vulnerability-alerts` answers 204) | GitHub | Pass | 2026-10-23 |
| TECH-013-R7 | One-time review of the whole code base by a separate agent against the security points; no high-severity finding. Fixed here: delay after a wrong password, password compared as hashes, run-time input checks in the admin actions, security headers, traces only locally, read-only tokens and step-level secrets in the workflows, the missing-password message only outside production, the stateless session documented. To the board: TECH-017 (limit sign-in attempts); noted on TECH-004 (`copy-to-prod`). See `solution.md` | local | Pass | 2026-10-23 |
| TECH-013-R8 | Course data: the course leader confirmed on 2026-10-23 that it may be shared, with Wikipedia credited as the source of the destination texts (added to `README.md`, and noted on TRIP-013 for the destination pages). History scan clean (R5). Future commits use the GitHub no-reply e-mail (decided by the user). The repo was made public on 2026-10-23 (`gh repo view` shows PUBLIC) | GitHub | Pass | 2026-10-23 |
| All | `npm run lint`, `npm run typecheck` and `npm run build` without errors or warnings; `npm run test:time` 143 passed; after the review's small input-check fixes the admin tests (TRIP-003, TRIP-004, TRIP-006: 23) passed again | local, CI | Pass | 2026-10-23 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | Not applicable: no new logic with rules to test (the input checks reject wrong types, which the page never sends) | | | |
| Browser tests | The existing suite passes with the fixes (`npm run test:time`) | local | Pass | 2026-10-23 |
| Smoke test | Not applicable: no page or flow added | | | |
| Accessibility | Not applicable: visitors see no change | | | |
| Security | R4, R5 shown on the demo pull request; R7 is the security review of the whole code base | CI, local | Pass | 2026-10-23 |
| Code review | [review.md](review.md): passed, no must-fix findings; `/security-review` run: no findings | local | Passed | 2026-10-23 |

## Test suite

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 143 | 88.7 s (TECH-016) | 2.8 s |
| After | 143 | 93.2 s (+5 %) | 2.8 s |

The time grew because a wrong password is now answered after one second (five tests sign in with a wrong password on purpose).

## Definition of Done

- [x] Tests: every check in the card's test plan is done; every requirement is tested or has a recorded manual check; `npm run test:local` passes
- [x] Test suite: within the time budgets, total time grown by at most 25 %
- [ ] Deployed, and the smoke tests pass against production (until TECH-014: `npm test` against the live site)
- [x] Accessibility: not applicable, visitors see no change
- [x] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/`), system docs (`wiki/system/`) and `wiki/log.md` updated (no manual change: visitors see nothing new)
- [x] No leftovers: the demo file existed only on the closed demo branch
- [x] Clean code: reuses existing components and helpers; `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements noticed along the way added to the board (TECH-017; a note on TECH-004)

## Requirements as built

Copied from the card (#41) on 2026-10-23, as built.

### TECH-013-R1 Security in the code review

The code review guide has a security section, and every review goes through it: admin actions and admin pages check the sign-in on the server; input is validated on the server; database queries use parameters, never text joined with input; secrets never reach the code, the browser, logs or error messages; cookies are `HttpOnly`, `Secure` and `SameSite`; error messages to visitors don't reveal internals. The review report has a row for security.

Acceptance criteria:

- **Given** `wiki/system/code-review.md`, **when** it is read, **then** it has a security section with the points above.
- **Given** `specs/_template/review.md`, **when** a new review is saved, **then** it has a row for security with the result.
- **Given** the reviewer agent run on a change, **when** its report is saved, **then** the security row is filled in.

### TECH-013-R2 `/security-review` for sensitive changes

A change that touches sign-in, admin, API routes, server actions, database queries or personal data is also checked with Claude Code's `/security-review` in the review step, and the result is saved in the feature's `review.md`. Its findings are handled like the reviewer's: high-severity findings are must-fix.

Acceptance criteria:

- **Given** CLAUDE.md's workflow, **when** the review step is read, **then** it says when `/security-review` is run and where its result goes.

### TECH-013-R3 Known vulnerabilities in packages stop the pipeline

The "CI" check fails when a package the site uses in production has a known vulnerability of high or critical severity (`npm audit --omit=dev --audit-level=high`).

Acceptance criteria:

- **Given** a pull request, **when** CI runs, **then** it runs the audit and fails if there is a high or critical vulnerability.
- **Given** today's packages, **when** CI runs, **then** the audit passes.

### TECH-013-R4 Security mistakes in our code stop the pipeline

Every pull request is scanned with Semgrep (free community rules for JavaScript, TypeScript, React, Next.js and SQL), and a finding fails the check. A finding that is wrong is marked in the code with `nosemgrep` and a comment saying why, never by turning the rule off for the whole project.

Acceptance criteria:

- **Given** a pull request with code that builds an SQL query by joining text with input, **when** the scan runs, **then** the check fails and points to the line (shown once while building, then removed).
- **Given** today's code with any findings fixed or marked, **when** the scan runs, **then** it passes.

### TECH-013-R5 Leaked secrets stop the pipeline

Every pull request is scanned with Gitleaks, and a password, token or API key in the changed commits fails the check. The whole Git history is scanned once.

Acceptance criteria:

- **Given** a pull request with a commit containing something that looks like an API key, **when** the scan runs, **then** the check fails (shown once while building, then removed).
- **Given** the whole Git history, **when** it is scanned once, **then** the result is recorded in `verification.md`, and any real secret found is rotated (with the user) and noted.

### TECH-013-R6 Dependabot security updates

Dependabot alerts and security updates are on for the npm packages and the GitHub Actions. A security update arrives as a pull request that goes through CI and Preview tests like any other.

Acceptance criteria:

- **Given** the repo's settings, **when** they are read, **then** Dependabot alerts and security updates are on, and `.github/dependabot.yml` covers npm and GitHub Actions without regular version updates. (TECH-012 later adds monthly version updates for GitHub Actions, once they are pinned to commits.)

### TECH-013-R7 One-time review of the current code

The whole current code base is reviewed once for security, with the security section of R1 and `/security-review`. Small findings are fixed in this task; larger ones become cards on the board.

Acceptance criteria:

- **Given** the review, **when** it is done, **then** its findings and what was done with each are recorded in `verification.md`.

### TECH-013-R8 The repo becomes public when it is safe

When the scan of the whole Git history (R5) has found no real secret, or every one found has been rotated, and the user has confirmed that the course data in `data/`, `knowledge/` and `public/images/` may be shared publicly, the repo is made public. Before that, the user decides whether future commits use GitHub's no-reply e-mail address (the e-mail in existing commits stays visible).

Acceptance criteria:

- **Given** a clean history scan and the user's confirmation of the course data, **when** the repo is made public, **then** `gh repo view` shows it as public and `verification.md` records the scan, the confirmation and the date.
- **Given** a secret found in the history that can't be rotated, **when** R5 is done, **then** the repo stays private and the user is told why.

## Notes

- The demo pull request #54 is closed and its branch deleted, but GitHub keeps a closed pull request's commits, so its made-up token stays visible there once the repo is public. It was never a real token.
