---
id: TECH-012
title: Current GitHub Actions on Node.js 24, pinned to commits
---

# Verification of TECH-012

How each requirement was checked.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-012-R1 | CI run 39971000771 and Preview tests run 39971000864 on pull request #55 pass, and their annotations have no "Node.js 20 is deprecated" warning (only GitHub's notice about Ubuntu 26). The CI run before the change (39965901244) had two such warnings. Live tests after the merge: not checked yet | CI | Pass on the pull request; live not checked yet | 2026-10-23 |
| TECH-012-R2 | Every `uses:` in `.github/` that is not local has a 40-character SHA and a version comment (`grep -rn "uses:" .github`); each SHA equals what `gh api repos/<action>/commits/<tag>` returns for its tag | local | Pass | 2026-10-23 |
| TECH-012-R3 | Code review: `.github/dependabot.yml` has `github-actions` for `/` and `/.github/actions/setup-tests`, `interval: monthly` and one group for all actions; npm still has `open-pull-requests-limit: 0` (security updates only) | local | Pass | 2026-10-23 |
| TECH-012-R4 | The same steps run as before; CI: `npm run test:local` 143 passed (as before); Preview tests: 130 passed, 13 skipped (`runsLocally`), 143 in all as before | CI | Pass | 2026-10-23 |
| TECH-012-R5 | Code review: `wiki/system/code-review.md` security point 8 has the rule for pinning actions | local | Pass | 2026-10-23 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | Not applicable: no logic changed | | | |
| Browser tests | The whole suite in CI and against the preview, as R4 | CI | Pass | 2026-10-23 |
| Smoke test | Not applicable: no page or flow changed | | | |
| Accessibility | Not applicable: visitors see no change | | | |
| Security | The pinning itself (R2); the CI job `security` passes | CI | Pass | 2026-10-23 |
| Code review | [review.md](review.md): passed; `/security-review` not needed | local | Passed | 2026-10-23 |

## Test suite

No test changed; CI's `npm run test:local` ran 143 tests in 2.4 min of tests. The jobs: CI `check` 3 min 22 s and `security` 29 s; Preview tests 4 min 27 s in all (within 8 minutes).

## Definition of Done

- [x] Tests: every check in the card's test plan is done; every requirement is tested or has a recorded manual check; `npm run test:local` passes (in CI)
- [x] Test suite: within the time budgets
- [ ] Deployed, and the smoke tests pass against production (until TECH-014: `npm test` against the live site)
- [x] Accessibility: not applicable, visitors see no change
- [x] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/`), system docs (`wiki/system/`) and `wiki/log.md` updated (no manual change)
- [x] No leftovers
- [x] Clean code: no code changed; the workflows pass in CI
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements noticed along the way added to the board (none)

## Requirements as built

Copied from the card (#38) on 2026-10-23, as built.

### TECH-012-R1 Current actions without warnings

The workflows use the current major versions of `actions/checkout`, `actions/setup-node` and `actions/upload-artifact`, which run on Node.js 24, and no run warns that Node.js 20 is deprecated.

Acceptance criteria:

- **Given** a pull request, **when** CI and Preview tests run, **then** they pass and their logs have no warning about Node.js 20.
- **Given** the merge, **when** Live tests run, **then** they pass without that warning.

### TECH-012-R2 Actions pinned to commits

Every third-party action in `.github/` is referenced by a full 40-character commit SHA, followed by a comment with its version, for example `actions/checkout@<sha> # v7.0.1`. The SHA is the one the version's tag points to.

Acceptance criteria:

- **Given** `.github/`, **when** every `uses:` that is not a local action (`./…`) is read, **then** it has a 40-character SHA and a version comment, and the SHA matches the tag on GitHub.

### TECH-012-R3 Dependabot keeps the actions up to date

Dependabot proposes updates of the pinned actions (SHA and comment together) as pull requests, also for the composite action in `.github/actions/setup-tests/`, grouped into one pull request per run, at most once a month.

Acceptance criteria:

- **Given** `.github/dependabot.yml`, **when** it is read, **then** the `github-actions` ecosystem covers `/` and `/.github/actions/setup-tests` with monthly, grouped version updates, and npm still has security updates only.

### TECH-012-R4 The checks behave as before

CI, Preview tests and Live tests run the same steps and the same tests as before, with the same results.

Acceptance criteria:

- **Given** the change, **when** the checks run, **then** the number of tests and their results are the same as before the change.

### TECH-012-R5 The rule for new actions

`wiki/system/code-review.md` says that a new third-party action is pinned to a commit SHA with a version comment.

Acceptance criteria:

- **Given** the review guide, **when** it is read, **then** it has the rule.

## Test plan

- **Unit and browser tests:** none new; the whole suite passes in CI, with the same number of tests as before (R4).
- **Pipeline:** the runs of CI, Preview tests and Live tests after the change have no Node.js 20 warning (R1).
- **Code review:** every `uses:` has a 40-character SHA that matches its tag on GitHub, checked with `gh api` (R2); `dependabot.yml` (R3) and the review guide (R5) read; recorded in `verification.md`.
- **Accessibility and security:** not affected apart from the pinning itself.
