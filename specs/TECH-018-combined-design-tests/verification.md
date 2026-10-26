---
id: TECH-018
title: Fewer, combined design tests
---

# Verification of TECH-018

How each requirement was checked. Only tests changed; the site did not.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-018-R1 | Code review: every requirement of TRIP-008, TRIP-020 and TRIP-022 that had a design test still has one, listed below; every assertion was moved as it was; `tests/TECH-018-design.spec.ts` passes in the whole suite | local | Pass | 2026-10-26 |
| TECH-018-R2 | `tests/TECH-018-design.spec.ts` has 12 tests (was 39); the three files' tests ran in 14.5 s (was 24.3 s) | local | Pass | 2026-10-26 |

## Requirement to test

Each row is a requirement that had a design test, and the test in `tests/TECH-018-design.spec.ts` that checks it now (short names; the full names start with the requirement IDs).

| Requirement | Test |
|---|---|
| TRIP-008-R1 | tokens (font and accent changes) |
| TRIP-008-R3 | header, text, order, contrast and fields (fonts, sizes, no Geist); phone (the heading at 42 px) |
| TRIP-008-R4 | header, text … (text and placeholder contrast); cards, photo and credit (border contrast); the switch (off border); keyboard focus (ring contrast); focused field |
| TRIP-008-R5 | cards, photo and credit (search card); focused field and suggestions (floating shadow); sign-in page (login card) |
| TRIP-008-R6 | header, text … (labels, placeholders); focused field; the switch; invalid date (red border) |
| TRIP-008-R7 | invalid date; sign-in page (wrong password) |
| TRIP-008-R8 | sign-in page (pill button); keyboard focus (disabled button) |
| TRIP-008-R9 | keyboard focus |
| TRIP-008-R12 | cards, photo and credit (start page); invalid date; sign-in page; phone |
| TRIP-020-R1 | header, text …; sign-in page; admin page; tokens (wordmark font); motion; reduced motion |
| TRIP-020-R2 | header, text, order, contrast and fields |
| TRIP-020-R3 | cards, photo and credit; sign-in page (no credit) |
| TRIP-020-R4 | cards, photo and credit |
| TRIP-020-R5 | motion (carousel slides); reduced motion |
| TRIP-020-R6 | phone; admin page (no sideways scroll on a phone) |
| TRIP-022-R1 | cards, photo and credit (search card, field); sign-in page; admin page |
| TRIP-022-R2 | cards, photo and credit |
| TRIP-022-R3 | focused field and suggestions |
| TRIP-022-R4 | sign-in page; admin page |

Requirements without a design test before (TRIP-008-R2, R10, R11, TRIP-020-R7) are unchanged: they were checked by code review and by the rest of the suite.

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | Not applicable: nothing changes outside the tests | | | |
| Browser tests | The combined tests; the whole suite (`npm run test:time`) passes | local | Pass | 2026-10-26 |
| Smoke test | Not applicable: no page or flow changes | | | |
| Accessibility | The axe checks are kept: start page with the photo and on a phone, with a date error, sign-in page with a wrong password, admin with the aircraft form | local | Pass | 2026-10-26 |
| Security | Not applicable: tests only | | | |
| Code review | [review.md](review.md) | local | Passed | 2026-10-26 |

## Test suite

`npm run test:time` before and after the change (budgets and rules in `wiki/system/testing.md`). The whole suite was measured after; before is the three design files measured on their own, and the whole suite counted as after plus the 27 tests removed.

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before, the three design files | 39 | 24.3 s | |
| After, the design file | 12 | 14.5 s | 2.1 s |
| Before, the whole suite | 208 | not measured (about 183 s: after plus 9.8 s) | |
| After, the whole suite | 181 | 172.8 s (budget 180 s) | 3.8 s (`TRIP-011-R8 an aircraft's factors are shown, checked and used in the times`) |

The whole suite is still close to its budget (172.8 s of 180 s); the cause is the features added since the baseline, not these tests.

## Definition of Done

- [x] Tests: every check in the card's test plan is done; every requirement is tested; `npm run test:unit` and `npm run test:local` pass
- [x] Test suite: the design tests went from 39 to 12 and from 24.3 s to 14.5 s; the whole suite is within the budgets
- [ ] Deployed, and the smoke tests pass against production (Live tests)
- [x] Accessibility: not applicable, visitors see no change; the axe checks are kept
- [x] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/`), system docs (`wiki/system/`) and `wiki/log.md` updated (no manual change: visitors see nothing new)
- [x] No leftovers: the three old test files are deleted, `DESIGN.md` points to the new file
- [x] Clean code: reuses the helpers; `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements noticed along the way added to the board (none)

## Requirements as built

Copied from the card (#61) on 2026-10-26, as built.

### TECH-018-R1 The site behaves as before

Every requirement of TRIP-008, TRIP-020 and TRIP-022 is still checked by a test named after it (a combined test is named after all the requirements it checks), no check is weakened, and the suite passes.

*Acceptance:* a list of the requirements of the three features and the test that checks each is recorded in `verification.md`; every requirement that had a test before still has one.

### TECH-018-R2 Fewer design tests, faster

The three design test files together have at most 20 tests (now 39) and take less time; the numbers before and after are recorded in `verification.md`.

*Acceptance:* `npm run test:local` passes; counting the tests in the three files gives at most 20; the total time of the three files is lower than before.

## Notes

The three files are now one file, `tests/TECH-018-design.spec.ts`, with 12 tests. See `solution.md` for the two small differences in how a state is reached.
