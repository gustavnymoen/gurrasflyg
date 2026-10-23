---
id: TECH-015
title: Unit tests with Vitest, fewer repeated browser tests
---

# Code review of TECH-015

**Result:** Passed
**Date:** 2026-10-23, review run 1
**Summary:** All 24 moved tests keep their names and checks (every removed block in `tests/` compared with the new `*.test.ts` files). The unit test database is always `unit-test.db`, built with a `file:` URL, so `db-setup.mjs` never touches the user's own database. Nothing must be fixed.
**Security:** Passed. No sign-in, admin, API or server-action code; the queries in the test files use parameters; the narrowed Semgrep rule still matches bare `all`/`get`/`run` and `.execute`/`.query`. `/security-review`: not needed, only test code, test helpers and the scan's rule changed.

How the review works: `wiki/system/code-review.md`. A later run is added at the top as "Review run 2".

## Must fix

None.

## Should fix

- `scripts/test-time.mjs:84` The exit code ignored failing unit tests, and a run killed by a signal could exit 0. **Done:** it exits 1 if either run failed or gave no status.
- `tests/TRIP-009-return-trip-datepicker.spec.ts:157` The Tab case typed the date already chosen, so it couldn't show that leaving the field reads a new date. **Done:** it types `2027-01-05` and checks the field and the summary.
- `wiki/system/architecture.md:119` still described `npm run test:time` without the unit tests. **Done.**
- `CLAUDE.md:38` The Definition of Done named only `npm run test:local`, and `code-review.md` didn't mention unit tests. **Done:** the Definition of Done (and the template) name `npm run test:unit` too; the review guide names `db/test-db.ts` among the helpers and a rule tested case by case through the browser as a test-quality finding.

## Suggestions

- `vitest.global-setup.mjs:8` repeats how `scripts/test-server.mjs` rebuilds a test database. **Done:** left as it is: the two are a few lines each, and a shared helper in `lib/local-db.mjs`, which the site imports, would bring `child_process` into it.
- `db/test-db.ts` `queryUnitDb` opens a client per call. **Done:** left as it is at 0.1 s; `openUnitDb` is there for a shared client when the data checks grow.

## Outside the change

- `specs/TECH-003-shared-date-rules/solution.md` and `flow.mmd` named the deleted test file. **Done:** they point to `lib/dates.test.ts`.
- `README.md:31` A blank line split the list of test commands. **Done:** removed.
