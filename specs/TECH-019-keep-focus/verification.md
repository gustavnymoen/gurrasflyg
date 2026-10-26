---
id: TECH-019
title: Keep focus on the other round buttons
---

# Verification of TECH-019

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-019-R1 | Browser tests `TECH-019-R1 …` in `tests/TECH-019-keep-focus.spec.ts`, one per place: the traveller picker (− at 1, + at 10), the calendar's month buttons (first and last month), the carousel's arrows, "Lägg till klass", "Lägg till addon"; each checks focus stays, `aria-disabled` and that Enter changes nothing. `TRIP-009-R12 the month buttons work with the keyboard …` now expects focus to stay on Nästa månad | local | Pass | 2026-10-26 |
| TECH-019-R2 | `grep keepFocus app` finds nothing; the existing tests of the buttons (TRIP-001-R8, TRIP-008-R8 incl. faded look and `not-allowed` cursor, TRIP-024-R5, TRIP-011) pass with `aria-disabled` in place of `disabled` | local | Pass | 2026-10-26 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | Not applicable: interface behaviour | | | |
| Browser tests | `tests/TECH-019-keep-focus.spec.ts` (5 tests, axe in each); TRIP-001, TRIP-004, TRIP-007 (TECH-007), TRIP-008, TRIP-009, TRIP-011 tests updated from `toBeDisabled` to `aria-disabled` | local | Pass | 2026-10-26 |
| Smoke test | Not applicable | | | |
| Accessibility | axe in each new test; WCAG 2.4.3 by keyboard on the live site for each place: not checked yet (after the deploy) | local | axe: Pass | 2026-10-26 |
| Security | Not applicable: no sign-in, data or API change | | | |
| Code review | [review.md](review.md) | local | Passed | 2026-10-26 |

## Test suite

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 99 unit, 176 browser | 0.5 s + 139.6 s | 3.0 s |
| After | 99 unit, 181 browser | 0.4 s + 135.9 s | 2.8 s |

Five new tests, all fast (under 2 s).

## Definition of Done

- [x] Tests and test suite: see the tables above
- [ ] Deployed, Live tests pass, keyboard check on the live site (after the deploy)
- [x] Requirements in the card match what was built; copied below; `solution.md` describes how it was built
- [x] System docs (`wiki/system/aircraft-and-classes.md`, `DESIGN.md`) and `wiki/log.md` updated; no manual change, visitors see no difference
- [x] No leftovers: `keepFocus`, the `disabled:` classes, `Calendar`'s `changeMonth`, `onFocusGrid` and the dialog ref are deleted
- [x] `npm run lint`, `npm run typecheck` and `npm run build` pass (the build once failed with ENOTEMPTY, then passed)
- [x] Code review done; see [review.md](review.md)

## Requirements as built

### TECH-019-R1 Focus stays

A round button that becomes unavailable while it has focus shall keep focus, be marked `aria-disabled="true"`, and do nothing when pressed.

Acceptance criteria:

- **Given** focus on − in the traveller picker at 2, **when** Enter is pressed so it reaches 1, **then** focus is still on −, which is `aria-disabled`, and pressing it again changes nothing.
- **Given** the same for + at the maximum, the calendar's previous month on the first month and next month on the last, and the review carousel's arrow.
- **Given** "Lägg till klass"/"Lägg till addon" in the aircraft form when nothing more can be added, **then** the button is `aria-disabled` and keeps focus.

### TECH-019-R2 One way only

`RoundButton` shall have no `keepFocus` prop; all round buttons work as R1 says, and look as before.

Acceptance criteria:

- **Given** the code, **when** searched, **then** `keepFocus` is not found, and existing tests and the visual checks of the buttons pass unchanged.
