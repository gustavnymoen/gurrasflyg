---
id: TECH-032
title: Stabilise the flaky browser tests
---

# Verification of TECH-032

The requirements as built are in the card: `gh issue view 149`. The causes could not be reproduced locally, so R1 is the likely cause, worked out from the code (see `solution.md`).

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-032-R1 | Code review of `DatePicker.tsx`, `app/globals.css` and the helpers; reproduction tried without success: 45 runs with 10 busy processes, 90 with 40, 60 with the browser's CPU slowed 6 times, 40 with it slowed 25 times. Written in `solution.md` | local | Pass (causes likely, not reproduced) | 2026-11-06 |
| TECH-032-R2 | The five tests of `tests/TRIP-009-return-trip-datepicker.spec.ts` that start with Arrow down use `arrowDownIntoCalendar()` (`hydrated()`, one press). The other Arrow key checks (TRIP-001, TRIP-013) follow a `fill`, so the page is hydrated: not changed | local | Pass | 2026-11-06 |
| TECH-032-R3 | `expectNoA11yViolations` waits for all finite animations and transitions; every axe check of the suite uses it and passes | local | Pass | 2026-11-06 |
| TECH-032-R4 | Code review: the rule "Waiting for focus and for motion (TECH-032)" in `wiki/system/testing.md` | local | Pass | 2026-11-06 |
| TECH-032-R5 | The changed tests (TRIP-009-R2, R11, R12 ×2 and TRIP-023-R2 R4 R5) ran 120 times with 20 busy processes and the browser's CPU slowed 25 times (TRIP-009): none failed. CI of the pull request: see the pull request | local, CI | Pass locally; CI see the PR | 2026-11-06 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | Not applicable, no logic changes; `npm run test:unit` passes (320) | local | Pass | 2026-11-06 |
| Browser tests | The existing tests, changed; the whole suite (`npm run test:time`) and the stress runs above. The temporary code that slowed the CPU is not kept | local | Pass | 2026-11-06 |
| Smoke test | Not applicable, no page or flow changes | | | |
| Accessibility | Not applicable beyond the existing axe checks, which stay and now wait for transitions | local | Pass | 2026-11-06 |
| Security | `/security-review` not needed: only tests and a wiki page changed | local | Pass | 2026-11-06 |
| Code review | [review.md](review.md) | local | See review.md | 2026-11-06 |

## Test suite

No test was added or removed; the helper change adds a wait of a few tens of milliseconds to five tests.

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | not measured: `main` was not run alone, because the run takes 4 minutes and the computer was shared with other sessions; the last numbers on `main` are 223 browser tests, 191.2 s, slowest 3.7 s (TECH-031) | | |
| After | 320 unit + 234 browser | unit 6.5 s, browser 229.0 s | 4.2 s |

The browser time is over the budget of 180 s. It is the problem of TECH-030 ("Bring the browser tests back inside the time budget"); the run was made while other sessions used the computer, and TRIP-039 measured 188.0 s for 219 tests. Nothing in this change is a likely cause of the difference.
