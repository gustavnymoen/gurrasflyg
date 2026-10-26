---
id: TRIP-015
title: Enter before new airport suggestions
---

# Verification of TRIP-015

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-015-R1 | Test `TRIP-001-R4 …` in `tests/TRIP-001-flight-search-form.spec.ts`, extended with `TRIP-015-R1` (the answer for "arlanda" held back with `page.route`; Enter chooses nothing and does not submit; after the answer, Enter chooses Stockholm Arlanda). Also checked that it fails when `answered === text.trim()` in `Autocomplete` is replaced by `true` (reverted). | local | Pass | 2026-10-26 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | Not applicable: the behaviour lives in a component. `npm run test:unit` still passes (160). | local | Pass | 2026-10-26 |
| Browser tests | No new test; the R4 test extended. `npm run test:local` passes (160). | local | Pass | 2026-10-26 |
| Smoke test | Not applicable: no main page or flow changes. | – | – | – |
| Accessibility | Not applicable: visitors see no change; axe in the same test's page is unchanged. | – | – | – |
| Security | Not needed (no code changed). | – | – | – |
| Code review | [review.md](review.md); `git diff main` shows no change in `app/`. | local | See review.md | 2026-10-26 |

## Test suite

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 160 | 155.7 s | 3.6 s |
| After | 160 | 156.5 s (budget 180 s) | 3.6 s |

Unit tests: 160, 0.7 s. "Before" is from TECH-021's verification after the merge of `main`.

## Definition of Done

- [x] Tests: the check in the card's test plan is done; the requirement is tested; `npm run test:unit` and `npm run test:local` pass
- [x] Test suite: 156.5 s of 180 s, no test over 5 s, no new test
- [ ] Deployed, and the smoke tests pass against production (Live tests)
- [x] Accessibility: not applicable, visitors see no change
- [x] Requirements in the card match what was built, no open questions; copied below; `solution.md` describes how it was built
- [x] Manual (not applicable, no change for visitors), system docs (`wiki/system/search-results.md`) and `wiki/log.md` updated
- [x] No leftovers
- [x] Clean code: `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] No larger improvements noticed along the way

## Requirements as built

### TRIP-015-R1 Enter does not choose from an old list

The site shall not choose an airport with Enter or Tab from a suggestion list that answers an earlier text than the one in the field.

- **Given** the suggestions for "lon" are shown, **when** the visitor changes the text to "arlanda" and presses Enter before the new suggestions have arrived, **then** nothing is chosen (the field still reads "arlanda") and no airport is selected.
- **Given** the same situation, **when** the new suggestions then arrive and the visitor presses Enter, **then** Stockholm Arlanda is chosen.

## Notes

- The behaviour was fixed in TRIP-010; this task only added the test and corrected the comment in the test and the note in TRIP-001's `verification.md`.
- Tab is not tested here (same condition in the same component; the card tests Enter).
