---
id: TECH-031
title: Smaller Vercel functions
---

# Code review of TECH-031

**Result:** Passed
**Date:** 2026-11-06, review run 1
**Summary:** `lib/db.ts` picks the client from the URL and `next.config.ts` keeps libsql's native binaries out of the function traces; no errors found against R1 and R2. The preview checks for R1, R3 and R4 are still open, so the feature is not done.
**Security:** The security points passed: no new input, secrets, cookies or error output; the auth token still comes from `TURSO_AUTH_TOKEN`; the query helpers still use parameters; the guard for a missing `TURSO_DATABASE_URL` on Vercel is unchanged. `/security-review`: run, no finding of confidence 8 or higher.

## Must fix

None.

## Should fix

- `specs/overview.md:156` TECH-031 was listed as "Done" while checks are open. **Done:** set to "Review".
- `.claude/launch.json` is untracked and unrelated. **Done:** not committed with this change.

## Suggestions

- `lib/db.ts:15` Everything but `file:` gets the web client (so also `http://`, `ws://`), which it can handle. **Done:** left as it is.
- `lib/db.ts:15` The web client is only exercised on the preview, and `withTransaction` with its `SQLITE_BUSY` retry is where a difference is most likely. **Done:** recorded in `solution.md` and `verification.md`; checked by the booking on the preview.

## Outside the change

- `tests/plan.ts` imports the regular `@libsql/client`: tests only, not traced into the app. Not added to the board.
- `db/backups/` is traced locally (about 20 MB) but is not in Git. Noted in `solution.md`.
