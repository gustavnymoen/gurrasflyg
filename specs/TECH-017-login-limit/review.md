---
id: TECH-017
title: Limit admin sign-in attempts
---

# Code review of TECH-017

**Result:** Passed
**Date:** 2026-10-26, review run 1
**Summary:** The limit does what R1 to R4 say. The attempt is counted and checked in one atomic SQL statement before the password is compared, so parallel guesses can't get past it. No must-fix findings.
**Security:** Passed. Every query uses `?` parameters; `x-forwarded-for` is only stored as a parameter and cut to 45 characters; nothing secret is stored; the IP address is removed after 15 minutes or on a right password. `/security-review`: run, no findings.

## Must fix

None.

## Should fix

- `app/admin/login/actions.ts` An IPv6 attacker with a /64 can change address for every guess. **Done:** accepted and recorded in `solution.md`; a limit across all addresses would be a separate card.
- `.claude/launch.json` is an untracked file outside the change. **Done:** not staged or committed with this work.
- `verification.md` Security and Code review rows. **Done:** filled in.

## Suggestions

- The `DELETE` runs at every attempt, also refused ones. Left as is: the table is small.
- `inTestDb` is exported from `tests/plan.ts` for the new test. Left as is; it can move to a shared helper if a third test needs it.
- **Done:** the comment on `registerLoginAttempt` says the count means attempts not yet cleared by a right password.

## Outside the change

- A limit across all addresses would also cover IPv6 rotation and distributed guessing (not on the board; add only if wanted).
