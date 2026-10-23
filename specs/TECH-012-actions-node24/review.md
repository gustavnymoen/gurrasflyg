---
id: TECH-012
title: Current GitHub Actions on Node.js 24, pinned to commits
---

# Code review of TECH-012

**Result:** Passed
**Date:** 2026-10-23, review run 1
**Summary:** Every third-party action in `.github/` is at v7 and pinned to a full commit SHA with a version comment; Dependabot proposes one grouped pull request a month for the actions, and npm still gets security updates only. No errors; the change matches R1–R5 and `solution.md`.
**Security:** Passed. All non-local `uses:` are pinned, and each SHA matches its tag (checked with `gh api repos/actions/<action>/commits/<tag>`). `/security-review`: not needed, the change touches no sign-in, admin, API routes, server actions, database queries or personal data.

How the review works: `wiki/system/code-review.md`. A later run is added at the top as "Review run 2".

## Must fix

None.

## Should fix

None.

## Suggestions

- `specs/TECH-012-actions-node24/verification.md:12` R1 said "Pass" though its live criterion wasn't checked yet. **Done:** "Pass on the pull request; live not checked yet", updated after the first Live tests run.
- `.github/dependabot.yml:22` Putting `open-pull-requests-limit: 0` back for the actions would quietly turn their monthly updates off. **Done:** a comment says so.

## Outside the change

None.
