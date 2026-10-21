---
id: TRIP-007
title: Import the course data
---

# Code review of TRIP-007

**Result:** Passed
**Date:** 2026-10-21, review run 1
**Summary:** The two migrations, the generator and the database-backed `GET /api/destinations` match card #11 and `solution.md`; the generated 006 file matches the generator, and the tests cover R1–R9. Two small gaps, fixed.

How the review works: `wiki/system/code-review.md`. A later run is added at the top as "Review run 2".

## Must fix

None.

## Should fix

- `tests/TRIP-007-import-course-data.spec.ts:39` R2 includes the source of the access status, but no test checked `status_source`, the only value read from the pages' frontmatter. **Done:** the R2 test checks Spreepark's source, a `null`, and that 24 destinations have one.
- `scripts/generate-charter-data.mjs:55` A missing course value (`undefined`) would stop the script with a bare error. **Done:** `sql()` throws "Ett värde saknas i kursdatan".

## Suggestions

- `scripts/generate-charter-data.mjs:19` `localeCompare` depends on the machine's locale, so the generated file could differ between computers and break the R8 test. **Done:** plain comparison; the output is the same with a Danish locale.
- `lib/travel.ts:62` One query per child table and grouping in memory avoids one query per destination (N+1); reuse it for the charter search. **Done:** left as it is.
- `db/migrations/005_charter.sql:30` Foreign keys are not enforced on Turso; safe here since CI builds the test database from the same file first, but not for tables the administrator writes at runtime. **Done:** recorded in `solution.md`; kept in mind for later charter features.

## Outside the change

- `scripts/db-setup.mjs:146` The summary line counts only the airline's airports and routes. Not added: cosmetic.
