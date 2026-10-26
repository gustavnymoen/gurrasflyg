---
id: TECH-020
title: Shared choice card and traveller plural
---

# Verification of TECH-020

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-020-R1 | The existing unit and browser tests pass unchanged (`npm run test:time`: 100 unit, 181 browser) | local | Pass | 2026-10-26 |
| TECH-020-R2 | Existing tests of `/flyg` and `/flyg/plan` (TRIP-010, TRIP-011, TRIP-012, TRIP-024, TRIP-026) pass, with axe; code review: neither card has its own `open`, button or panel | local | Pass | 2026-10-26 |
| TECH-020-R3 | Test `TECH-020-R3 …` in `lib/format.test.ts`; a search for `"resenär"` finds only the helper | local | Pass | 2026-10-26 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `travellersText` for 0, 1, 2 | local | Pass | 2026-10-26 |
| Browser tests | None new; the existing flight and plan tests | local | Pass | 2026-10-26 |
| Smoke test | Not applicable: none new | | | |
| Accessibility | Unchanged; `aria-expanded`/`aria-controls` checked by the existing tests with axe | local | Pass | 2026-10-26 |
| Security | Not applicable: no sign-in, API, database or personal data | | | |
| Code review | [review.md](review.md) | local | Passed | 2026-10-26 |

Live tests after the deploy: not checked yet.

## Test suite

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 99 unit + 181 browser | 143.1 s | 2.9 s |
| After | 100 unit + 181 browser | 141.4 s | 2.8 s |

(The "before" run overlapped with the first edits; the behaviour is the same, so the numbers hold.)

## Definition of Done

- [x] Tests (Live tests after the deploy: not checked yet)
- [x] Test suite within budgets
- [x] Accessibility unchanged
- [x] Requirements match what was built; no open questions
- [x] Manual: not applicable (no visible change); system docs and `wiki/log.md` updated
- [x] No leftovers
- [x] Clean code: lint, typecheck and build pass
- [x] Code review done, no must-fix findings
- [x] Improvements: the inline "plats/platser" plural noted in the review, too small for a card

## Requirements as built

- **TECH-020-R1** The site behaves as before: the existing unit and browser tests pass unchanged.
- **TECH-020-R2** One shared expandable card (`ChoiceCard`) is used by both the flight cards and the aircraft cards; neither keeps its own `open` state, button or panel markup.
- **TECH-020-R3** One helper, `travellersText(n)`, writes "1 resenär" / "N resenärer" (also "0 resenärer"), used everywhere the plural is written.
