---
id: TRIP-043
title: Leaner departure and aircraft pickers
---

# Verification of TRIP-043

All checks below were run locally (`npm run test:local`, a production build on port 3100 with its own test database) on 2026-11-06. After the merge the smoke tests run against the live site (Live tests); that is not yet checked.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-043-R1 | Tests `TRIP-043-R1 R2 R3 …` in `tests/TRIP-043-pickers.spec.ts`: flight booking and charter, a Välj named after its departure on every row, one click chooses | local | Pass | 2026-11-06 |
| TRIP-043-R2 | The same tests: the unfold is a separate button with `aria-expanded`/`aria-controls`, shows the details (flight booking: flight number, airports, date; charter: airline, flight number, changes, date), chooses nothing; TRIP-010-R6 R9 checks the details and the total | local | Pass | 2026-11-06 |
| TRIP-043-R3 | The same tests: no return list before an outbound is chosen, then it comes | local | Pass | 2026-11-06 |
| TRIP-043-R4 | Test `TRIP-043-R4 R5 R9 …`: a row per aircraft with price, flight time, seats and Välj; "Billigast" and "Snabbast" in flight booking (and TRIP-011-R2 R9 for every row's comparison text); charter without "Snabbast" (`TRIP-043-R10`, TRIP-039-R1 R2 R3) | local | Pass | 2026-11-06 |
| TRIP-043-R5 | `TRIP-043-R4 R5 R9 …`: classes (price, seats, +/−) in the open row, no "Valt plan" block, one row open at a time, nothing written to the address by opening; the price follows the numbers (TRIP-011-R4 R10) | local | Pass | 2026-11-06 |
| TRIP-043-R6 | `TRIP-043-R6 …`: placing in another aircraft removes the first one's numbers, in the address too; opening a row alone changes nothing. Unit test `TRIP-043-R6` in `lib/trip.test.ts` | local | Pass | 2026-11-06 |
| TRIP-043-R7 | `TRIP-043-R7 R8 …`, `TRIP-043-R7 a one-way trip …`: Fortsätt disabled with the number left as its description, enabled when all are placed, folds the flight; the last one goes to Resenärer; no button in the total box. Unit test `TRIP-043-R7` in `lib/fare-rules.test.ts` | local | Pass | 2026-11-06 |
| TRIP-043-R8 | `TRIP-043-R7 R8 …`: no return flight before the outbound's Fortsätt; changing the outbound keeps the return's choices; unit test `TRIP-026-R5, TRIP-043-R8` in `lib/trip.test.ts` | local | Pass | 2026-11-06 |
| TRIP-043-R9 | `TRIP-043-R4 R5 R9 …`: the text at the top and the counter "N av M placerade" with `aria-live="polite"`. Unit test `TRIP-043-R9` | local | Pass | 2026-11-06 |
| TRIP-043-R10 | `TRIP-043-R10 …`: the charter step with the same components, no "Snabbast"; the TRIP-039 and TRIP-040 tests run on the new step | local | Pass | 2026-11-06 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `placeTraveller`, `firstViews`, `seatingCounter`, `seatingLeft` in `lib/trip.test.ts` and `lib/fare-rules.test.ts`; the tests of the removed `seatingProblem` and `chooseAircraft` were replaced | local | Pass | 2026-11-06 |
| Browser tests | `tests/TRIP-043-pickers.spec.ts` (new); TRIP-010, 011, 012, 014, 024, 025, 026 and 039 updated to the new structure; TRIP-040 unchanged and passing; helpers in `tests/plan.ts` | local | Pass | 2026-11-06 |
| Smoke test | The smoke tests (`TRIP-010-R4`, `TRIP-011-R1`, `TRIP-012-R1`) go through the new steps read-only; nothing added | local | Pass | 2026-11-06 |
| Accessibility | axe in every state of the card's plan: departure list with an unfolded row (flight booking and charter), aircraft step with an open row, with the disabled and the enabled Fortsätt, and the folded flight. **The checklist in `wiki/system/accessibility.md` on the live site: not checked yet** (only possible after the deploy) | local | Axe passes; checklist not checked | 2026-11-06 |
| Security | Not needed, as the card says: no new input, the address parameters are checked as before. The security points are part of the review | local | Pass | 2026-11-06 |
| Code review | [review.md](review.md) | local | Passed | 2026-11-06 |

TECH-018-design has the look checks: `TRIP-043-R1 R2 …` (Välj at least 34 px tall, the unfold button at least 24 px, no sideways scroll at 320 px, also unfolded) and `TRIP-043-R4 R5 R7 …` (the open row's accent ring, the faded and the enabled Fortsätt, 320 px).

## Test suite

`npm run test:time`, before from TRIP-042's `verification.md`. The browser suite was already over its 180 s budget (190.5 s); it grew 8 % (9 new tests, a few steps added to old ones). One run had TRIP-039-R4 R5 R8 failing on persisted page state; fixed with a reload, and that spec group (TRIP-012, 014, 039) was rerun green. Not rerun in full after that fix. Not added to the board yet.

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before (TRIP-042, 2026-11-06) | 317 unit + 223 browser | unit 6.2 s, browser 190.5 s | 4.3 s |
| After | 317 unit + 232 browser | unit 6.0 s, browser 206.0 s | 6.4 s (TRIP-039-R4 R5 R8, a long test that was 4–5 s before; the one test over the 5 s budget) |

## Definition of Done

- [x] Tests: see the table above; the live smoke tests wait for the merge
- [ ] Test suite: numbers above; total over the 180 s budget (as before), +8 %
- [ ] Deployed, and the smoke tests pass against production (Live tests): not yet
- [ ] Accessibility: axe passes; the checklist on the live site not yet
- [x] Requirements in the card match what was built, no open questions; as built below; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/`), system docs (`wiki/system/`), `DESIGN.md` and `wiki/log.md` updated
- [x] No leftovers: `seatingProblem()`, the `tried` state, "Klar", the `Unfold` for "Valt plan", the box text under the total and the private `Detail` in `FlightCard` are deleted
- [x] Clean code: lint and typecheck pass; the build ran inside `test:local`
- [x] Code review: Passed, see [review.md](review.md)
- [x] Technical tasks: none added

## Requirements as built

The same as the card (`gh issue view 145`), R1–R10. Nothing was changed during the work.

## Notes

- **Persisted page state.** Coming back to `/flyg/plan` with the browser's back button or a link shows the page as it was left (Next keeps the earlier page's state); a reload folds every done flight. The tests that go back first reload.
- **Way on after the booking page.** With every flight folded and no button in the total box, a visitor who comes back from Resenärer opens the last flight and presses Fortsätt (or uses the browser's forward button). This follows R7 as written.
- **Fixed in a test:** TRIP-012's "Dåliga nerver" tooltip check relied on where the mouse rested after the click on Fortsätt; it now moves the mouse away first.
