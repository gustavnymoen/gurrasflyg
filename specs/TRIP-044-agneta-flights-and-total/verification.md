---
id: TRIP-044
title: Agneta and ordinary flights, and the total in her summary
---

# Verification of TRIP-044

Checked locally on 2026-11-08 (unit tests; the browser suite on a production build with its own test database and the fake agent `LLM_MOCK=1`, run on port 3101 because 3100 was taken by another project's server). **Not done:** R1 with the real model, nothing deployed, so the Live tests have not run.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-044-R1 | Unit test `TRIP-044-R1` in `lib/chat-prompt.test.ts` (intro, decline rule and "no tools" rule allow it, "never guess", `[[HELP]]`). Real model, "kan du boka flyg mellan New York och London?": **not checked** | local | Pass (real model not checked) | 2026-11-08 |
| TRIP-044-R2 | Unit tests `TRIP-044-R2` in `lib/agent.test.ts` (flight and charter, with add-ons from the form, Dåliga nerver, extras, nerves capped, a choice for another plan not counted, her own add-ons replace the context's) and `lib/agent-rules.test.ts` (the context check, names dropped); browser tests in `tests/TRIP-044-agneta-total.spec.ts` (her total equals the page's, flight and charter) | local | Pass | 2026-11-08 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | 3 + 1 new tests as above | local | Pass | 2026-11-08 |
| Browser tests | `tests/TRIP-044-agneta-total.spec.ts` (2 tests); TRIP-030 and TRIP-036 tests updated for the new context fields | local | Pass | 2026-11-08 |
| Smoke test | None planned | | | |
| Accessibility | axe in the new tests; no visible change | local | Pass | 2026-11-08 |
| Real model | **Not checked**: R1 to be tried by hand | | | |
| Security | `/security-review`: no finding | local | Pass | 2026-11-08 |
| Code review | [review.md](review.md) | local | Passed | 2026-11-08 |

## Test suite

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before (TRIP-037) | 356 unit + 249 browser | unit 10.8 s, browser 254.3 s | 5.2 s |
| After | 360 unit + 251 browser | unit 12.9 s, browser 264 s (4.4 min, whole run) | not measured |

The browser suite was already over the 180 s budget before this change. The two new tests take about 5 s together. `npm run test:time` could not run its browser part (port 3100 taken), so the browser run was made by hand on 3101.

## Definition of Done

- [x] Tests: every requirement is tested (R1's real model not checked); unit and browser suites pass
- [ ] Test suite: browser suite over the 180 s budget (already before)
- [ ] Deployed, and the smoke tests pass against production: not yet
- [x] Accessibility: axe passes; no visible change
- [x] Requirements match what was built; `solution.md` describes how
- [x] Manual, system docs and `wiki/log.md` updated
- [x] No leftovers
- [x] Clean code: lint, typecheck and build pass
- [x] Code review: see [review.md](review.md)
- [x] Technical tasks: none added

## Requirements as built

Copied from the card (unchanged by the work).

### TRIP-044-R1 Flights in the plain chat

Asked about an ordinary flight, Agneta does not decline. In her own voice she says she does not know departures, times and prices off the top of her head and never guesses them, but can search and book for the visitor, and ends with `[[HELP]]` so the button **Hjälp mig** is offered. The tab Flyg is at most an alternative. Acceptance: the intro, the decline rule and the "no tools" rule allow this and still forbid inventing departures, times and prices; tried by hand with the real model.

### TRIP-044-R2 The total matches the page

The total in her summary equals the total the payment page shows for the same booking, for flights and for charter, or she gives no total. Acceptance: add-ons chosen in the form (and Dåliga nerver on flights; on charter the extras too) give her total equal to the page's. The context carries the non-personal part of the form (class and count per add-on per traveller and trip, checked like `safeActions`) and the number of travellers who ticked Dåliga nerver (0 to the number of travellers); the server prices everything from the database. A unit test compares with the page's calculation for a flight and a charter booking.
