---
id: TRIP-002
title: "Admin sign-in"
---

# Verification of TRIP-002

Specified after the feature was built. Checked with the tests in `tests/TRIP-002-admin-sign-in.spec.ts`, locally against a fresh test database (`npm run test:local`) and against the live site (`npm test`).

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-002-R1 | Test `TRIP-002-R1 admin requires sign-in` | local, live | Pass | 2026-10-20 |
| TRIP-002-R2 | Test `TRIP-002-R2 wrong password shows an error` | local, live | Pass | 2026-10-20 |
| TRIP-002-R3 | Test `TRIP-002-R3 right password signs in` | local, live | Pass | 2026-10-20 |
| TRIP-002-R4 | Test `TRIP-002-R4 sign-in is an HTTP-only session cookie`. The 8-hour limit: code review of `isValidSessionToken` in `lib/session.ts` | local, live | Pass | 2026-10-20 |
| TRIP-002-R5 | Test `TRIP-002-R5 forged sign-in is rejected` | local, live | Pass | 2026-10-20 |
| TRIP-002-R6 | Test `TRIP-002-R6 sign out` | local, live | Pass | 2026-10-20 |
| TRIP-002-R7 | Code review: `run()` in `app/admin/actions.ts` calls `isAdmin()` before every change | code | Pass | 2026-10-20 |

## Checks before done

- [x] `npm run lint` and `npx tsc --noEmit` without errors
- [x] `npm run build` succeeds
- [x] `npm run test:local` passes
- [x] `npm test` passes against the live site
- [x] Wiki updated (system and manual) and a line added to `wiki/log.md`

## Notes

- R4's expiry and R7 can't be tested from the browser without the secret `ADMIN_SESSION_SECRET` or the server action IDs, so they are checked in code review.
- The admin tests need `ADMIN_PASSWORD`, read from `.env.local`. It is the same locally and in production.
