---
id: TECH-005
title: All prices in whole kronor
---

# Verification of TECH-005

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-005-R1 | `npm run lint`, `npm run typecheck`, `npm run build`: no errors or warnings | local | Pass | 2026-10-21 |
| TECH-005-R1 | `npm run test:local`: 54 passed, including the unchanged TRIP-003 and TRIP-004 price tests | local | Pass | 2026-10-21 |
| TECH-005-R1 | Test `TECH-005-R1 a price in kronor is shown as before`: 249 is shown as "249" in the table and "249 kr" next to the aircraft | local | Pass | 2026-10-21 |
| TECH-005-R1 | `npm test` against the live site after the merge of pull request #7: 48 passed, 6 skipped (local only); "Live tests" on `main` passed too | live | Pass | 2026-10-21 |
| TECH-005-R2 | Test `TECH-005-R2 the migration converts öre to the nearest whole krona`: 24 900 → 249, 1 250 → 13, 1 249 → 12, 0 → 0, on a database in memory | local | Pass | 2026-10-21 |
| TECH-005-R2 | Migration on a copy of the local database (`TURSO_DATABASE_URL=file:<copy>`, `scripts/db-setup.mjs`): the five add-ons 100 000, 12 000, 2 500, 10 000, 10 000 öre became 1 000, 120, 25, 100, 100 kr; every other table has the same number of rows | local copy | Pass | 2026-10-21 |
| TECH-005-R2 | The local database got the migration through `prebuild` in `npm run build`, with the same prices as the copy; a backup from before it is in `db/backups/` | local | Pass | 2026-10-21 |
| TECH-005-R2 | Turso, read-only query after the deploy: `schema_migrations` has `004_whole_kronor.sql`, and the four add-ons are in whole kronor (for example 1000) | live | Pass | 2026-10-21 |
| TECH-005-R3 | Tests `TECH-005-R3 prices are formatted as whole kronor` and `TECH-005-R3 the seed data has no prices` | local | Pass | 2026-10-21 |
| TECH-005-R3 | Code review: no `/ 100` or `* 100` on a price in `app/`, `lib/`, `scripts/`; `db/schema.sql` and `db/seed.sql` say kronor | code | Pass | 2026-10-21 |
| TECH-005-R4 | Test `TECH-005-R4 add-on prices must be whole kronor, 0 or more`: 12,50, 12.50 and "tolv" give "Ange priset i hela kronor." and nothing is saved, also when changing; -5 gives "Priset måste vara 0 kr eller mer."; 0 and "1 290" are saved | local | Pass | 2026-10-21 |
| TECH-005-R5 | Code review: the rule is whole kronor in `CLAUDE.md`, `specs/overview.md`, `wiki/system/architecture.md`, `wiki/manual/admin-klasser-och-addons.md` and the TRIP-003 spec (with a History line); "öre" occurs only where the change is described | docs | Pass | 2026-10-21 |

## Definition of Done

- [x] Tests: every requirement is tested or has a recorded check; `npm run test:local` passes
- [x] Deployed, and `npm test` passes against the live site
- [x] Accessibility: not applicable, visitors see no change (the change is on the admin page; the axe helper comes with TRIP-008)
- [x] Spec updated to match what was built, no open questions left
- [x] Manual (`admin-klasser-och-addons.md`), system docs (`architecture.md`) and `wiki/log.md` updated
- [x] No leftovers: `noSpinnerClass` deleted, since no number fields are left
- [x] Clean code; `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] No new technical tasks

## Notes

- **Found while building:** in Chromium a number field (`type="number"`) drops the comma, so "12,50" became 1250 without a message, and the add-on was saved for 1 250 kr. This was true before TECH-005 too. Settled with the user: the price field is now a text field with a numeric keyboard, and the server reads the text. R4 and the Interface section were updated.
- **Small cleanup in the same change:** `noSpinnerClass` (hid the arrows in number fields) was deleted; the seats fields in `AircraftForm.tsx` were already text fields, so it did nothing there.
- **Mistake during the work:** the new test file was first run without `BASE_URL`, so against the live site with the old code; the R4 test saved an "E2E Addon" for 12,50 kr there. The global teardown removed it; a check of the live admin page afterwards found no "E2E" data left.
- `npm run copy-to-prod` could not be run between the local migration and the deploy, when the local database was in kronor and Turso still in öre. Both are in kronor since the deploy of pull request #7.

## Moved by TECH-015 (2026-10-23)

`TECH-005-R2 …` moved to `db/migrations/004_whole_kronor.test.ts`, and the two `TECH-005-R3 …` tests to `lib/format.test.ts` and `db/seed.test.ts`, with the same checks and names, as unit tests.
