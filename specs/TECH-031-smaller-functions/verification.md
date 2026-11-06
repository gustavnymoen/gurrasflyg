---
id: TECH-031
title: Smaller Vercel functions
---

# Verification of TECH-031

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-031-R1 | Code review of `lib/db.ts`; `file:` path exercised by all unit and browser tests; the web client on a `libsql://` URL by "Preview tests" (the smoke tests against the preview's Turso), "Live tests" after the merge, and the booking below | local, preview, live | Pass | 2026-11-06 |
| TECH-031-R2 | Manual (needs a build): `npm run build` into a separate folder, then every `*.nft.json` under `server/` read for `@libsql/darwin-*`, `linux-*` and `win32-*`. Before: 19 of 24 functions list it. After: 0 of 24. The Vercel build log was not read (the Vercel CLI is not installed); the owner looks at the sizes in the dashboard | local | Pass locally, Vercel log not checked | 2026-11-06 |
| TECH-031-R3 | The existing unit tests (317) and browser tests (223) pass unchanged; "Preview tests" and "Live tests" pass; a booking was made and cancelled by hand by the owner (transactions with the web client), which worked | local, preview, live | Pass | 2026-11-06 |
| TECH-031-R4 | Sizes below (local trace). The Vercel build log and the account's Functions Storage not checked | local | Local trace only | 2026-11-06 |

## Sizes (R4)

Local trace: the files each function's `*.nft.json` lists, summed, after `npm run build` (24 functions), measured with the local macOS binary (7.5 MB; the Linux one on Vercel may be bigger). Each function's trace also lists the local `db/backups/` (20.2 MB, not in Git, so not on Vercel); it is taken away below, since it is not what Vercel stores.

| | Functions with the binary | Largest function, without `db/backups/` | Largest function, as traced locally | Sum as traced locally (counts shared files 24 times) |
|---|---|---|---|---|
| Before | 19 of 24 | about 10.4 MB | 30.6 MB | 589.2 MB |
| After | 0 of 24 | about 2.9 MB | 23.1 MB | 447.2 MB |
| After, without the exclude (the web client alone) | 19 of 24 | about 10.4 MB | 30.6 MB | 589.2 MB |

The sums are not the size on Vercel: shared files are counted once per function, and most of the sum is the local backups. The real sizes are in the Vercel dashboard for a deployment (not recorded here).

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `npm run test:unit`, no new tests: 317 passed | local | Pass | 2026-11-06 |
| Browser tests | `npm run test:local`, no new tests: 223 passed | local | Pass | 2026-11-06 |
| Smoke test | The existing smoke tests: "Preview tests" on the preview and "Live tests" on main after the merge | preview, live | Pass | 2026-11-06 |
| Accessibility | Not applicable: nothing visible changes | | | |
| Security | The security points in the review passed; `/security-review` run: no finding of confidence 8 or higher | local | Pass | 2026-11-06 |
| Code review | [review.md](review.md) | local | Passed | 2026-11-06 |

## Test suite

No test was added or changed, so the number of tests is the suite as it stands on `main`.

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | not measured (the change adds no tests) | | |
| After | 317 unit + 223 browser | unit 6.5 s, browser 191.2 s | 3.7 s |

The browser tests are 11 s over the 3 minute budget in `wiki/system/testing.md`. This change adds no test, so the cause is earlier changes (TRIP-039 and TRIP-040 added tests); it is not handled in this change.

## Definition of Done

Done, except that the sizes on Vercel (R4) were not recorded: the owner reads them in the dashboard. The browser tests are over their time budget because of earlier changes (see above).

## Requirements as built

### TECH-031-R1 Web client in production

**Given** `TURSO_DATABASE_URL` is a `libsql://` URL, **then** `lib/db.ts` uses `@libsql/client/web`. **Given** a `file:` URL (local and tests), **then** it uses the regular client as before. Everything `lib/db.ts` exports (`db`, `all`, `get`, `run`, transactions) works the same in both.

### TECH-031-R2 No native binary in the functions

**Given** a production build (`npm run build`), **then** no `*.nft.json` trace lists `@libsql/<platform>` (the native binary) or the `libsql` package's binary, and the Vercel build log shows the functions without it. The binary is kept out by `outputFileTracingExcludes` (found in the measurement: the trace follows every import, so the web client alone does not remove it); the web client of R1 is what makes it safe to leave out, since the code then never loads it on Vercel.

### TECH-031-R3 The site behaves as before

**Given** the change, **then** all unit tests and `npm run test:local` pass unchanged, "Preview tests" pass, and on the preview deployment (its own Turso database) pages and the chat reach the database, and one booking is made and cancelled by hand, since transactions are the part where the web client could differ. No new test is written: the choice of client is one line, and R3 is shown by the existing tests and the checks on the preview.

### TECH-031-R4 Sizes recorded

**Given** the work is done, **then** `verification.md` records the size of the functions before and after, both the local trace and the Vercel build log (the largest functions and the total), and the Functions Storage of the account if the dashboard shows the change.

## Notes

- The measurement showed that the web client alone does not remove the binary from the functions: the file tracer follows the `import()` that is never run on Vercel. The exclude removes the binary and the web client makes it safe to leave out, so the card's R2 was changed to say so.
- `import()` with a text computed in the code is refused by the build, so `lib/db.ts` has two written-out imports.
