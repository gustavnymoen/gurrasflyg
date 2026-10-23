---
id: TECH-015
title: Unit tests with Vitest, fewer repeated browser tests
card: "#49"
depends_on: [TECH-011, TECH-014, TECH-016]
---

# TECH-015 Unit tests with Vitest, fewer repeated browser tests: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 49`.

## Data

None in the site. The unit tests have their own database, `~/Ai Projekt/gurrasflyg-data/unit-test.db` (`unitTestDbFile` in `lib/local-db.mjs`), outside the project and separate from the browser tests' `test.db`.

## Interface

- `vitest` 5 as a dev dependency; `npm run test:unit` (`vitest run`; `-- --watch` reruns on every save).
- `vitest.config.mts`: runs `**/*.test.ts` outside `tests/`, `node_modules/` and the build folders; `@/` resolves to the project; `globalSetup` builds the database. The `.mts` extension makes the config ESM without changing `package.json`'s module type.
- `vitest.global-setup.mjs`: deletes `unit-test.db` and runs `scripts/db-setup.mjs` against it, so the data checks read exactly what the schema, seed and migrations create.
- `db/test-db.ts`: `queryUnitDb` and `openUnitDb` for the data checks (replaces `queryTestDb` in `tests/helpers.ts`, which no browser test uses any more).
- The tests that need no browser, moved with the same checks and names (R3), 24 in all:

  | Requirement | Before | Now |
  |---|---|---|
  | TECH-003-R3 (3) | `tests/TECH-003-shared-date-rules.spec.ts` (deleted) | `lib/dates.test.ts` |
  | TRIP-009-R13 (2) | `tests/TRIP-009-return-trip-datepicker.spec.ts` | `lib/dates.test.ts` |
  | TECH-007-R3 | `tests/TECH-007-pipeline-and-cleanups.spec.ts` | `lib/numbers.test.ts` |
  | TECH-005-R2, R3 (3) | `tests/TECH-005-whole-kronor.spec.ts` | `db/migrations/004_whole_kronor.test.ts`, `lib/format.test.ts`, `db/seed.test.ts` |
  | TRIP-005-R1–R5 (5) | `tests/TRIP-005-routes-and-aircraft-assignment.spec.ts` | `db/migrations/002_routes_data.test.ts` |
  | TRIP-007-R1–R8 (9) | `tests/TRIP-007-import-course-data.spec.ts` | `db/migrations/006_charter_data.test.ts` |
  | TRIP-020-R3 (1) | `tests/TRIP-020-start-page-design.spec.ts` | `app/start-page-photo.test.ts` |

- Fewer repeated cases in the browser (R4): `TRIP-009-R8 …` keeps one date read on Enter and one ISO date read on Tab; `TRIP-009-R9 …` keeps the format message and the return-date message, and that a valid date removes it. The other formats, the year, and every message are unit tests in `lib/dates.test.ts` (two new tests, of `formatShort`/`formatDay` and of `readDate`).
- `.github/workflows/ci.yml`: `npm run test:unit` after the type check and before the build (R5).
- `scripts/test-time.mjs`: runs the unit tests with Vitest's JSON report before `npm run test:local` and prints their number and time against a 30-second budget.
- Docs (R6): `wiki/system/testing.md` (unit tests in use, the database, the budget), `CLAUDE.md`, `README.md`, `wiki/system/pipeline.md`, `wiki/system/architecture.md`, `wiki/log.md`, and a note in each moved feature's `verification.md`.

## Decisions

- **Next to the code and the data** (decided with the user): `lib/dates.test.ts` next to `lib/dates.ts`, and the data checks next to the migration that creates the data, so a reader of a migration sees its test. The photo check sits in `app/`, since a test file in `public/` would be served to visitors.
- **A database of their own for the unit tests**, built with the site's own `db-setup.mjs`, not the browser tests' `test.db`: the two can run at the same time, and the unit tests don't depend on a build of the site.
- **Moved, not rewritten:** the moved tests keep their names and checks (only `queryTestDb` became `queryUnitDb`, and `test.describe` with `runsLocally` went away, since unit tests always run locally), so each feature's verification still points to the same tests.
- **The browser time didn't drop much** (91.6 → 92.9 s, within noise): the moved tests were already fast without a page. The gain is that the rules now have room for many cases, run in a fraction of a second, and can be rerun on every save.
