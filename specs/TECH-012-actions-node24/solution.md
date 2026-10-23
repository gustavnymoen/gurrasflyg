---
id: TECH-012
title: Current GitHub Actions on Node.js 24, pinned to commits
card: "#38"
depends_on: [TECH-007, TECH-011, TECH-013]
---

# TECH-012 Current GitHub Actions on Node.js 24, pinned to commits: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 38`.

## Data

None.

## Interface

- `.github/workflows/ci.yml`, `preview-tests.yml`, `live-tests.yml` and `.github/actions/setup-tests/action.yml`: every third-party action is pinned to the commit its version tag points to, with the version as a comment:

  | Action | Before | After | Commit |
  |---|---|---|---|
  | `actions/checkout` | `@v4` | v7.0.1 | `3d3c42e5aac5ba805825da76410c181273ba90b1` |
  | `actions/setup-node` | `@v4` | v7.1.0 | `949feb2413d6458794dcd2491c4babbbce0c15c1` |
  | `actions/upload-artifact` | `@v4` | v7.0.2 | `cf430e030ddbb5b0abf93d22962f4752f3646cd9` |

  The commits were looked up with `gh api repos/<action>/commits/<tag>` on 2026-10-23.
- `.github/dependabot.yml`: the GitHub Actions get version updates once a month, grouped into one pull request (`groups.actions`), for both `/` and `/.github/actions/setup-tests`. npm keeps security updates only.
- `wiki/system/code-review.md` (security point 8): the rule that third-party actions are pinned to a commit with a version comment. `wiki/system/testing.md` and `README.md` say what Dependabot does for the actions.

## Decisions

- **Straight to v7, the current major version.** The breaking changes between v4 and v7 were read in the release notes and don't concern us: `checkout` v6 keeps the credentials in a separate file and v7 refuses to check out forks for `pull_request_target`, which we don't use; `setup-node` v5–v6 changed automatic caching, but we set `cache: npm` ourselves and take Node from the Playwright image; `upload-artifact` v7 adds unzipped single-file uploads, which we don't use.
- **The Playwright image stays at its version tag** (`v1.64.1-noble`), not a digest: the tag names an exact Playwright version, `scripts/check-playwright-image.mjs` checks it against `@playwright/test`, and a digest would have to be changed by hand at every update (decided in the card).
- **Semgrep and Gitleaks** (TECH-013) are Docker images with fixed versions run in `run:` steps, not actions, so there is nothing to pin for them here.
- **Version updates for the actions, security updates only for npm.** A pinned action never moves by itself, so without version updates it would never be updated; for npm, upgrading Next.js and the others stays a choice of our own.
