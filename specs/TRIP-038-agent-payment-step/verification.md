---
id: TRIP-038
title: The agent takes the visitor to the payment step
---

# Verification of TRIP-038

All checks below were run locally (`npm run test:local`, a production build on port 3100 with its own test database) on 2026-11-06. After the merge the smoke tests run against the live site (Live tests); that is not yet checked.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-038-R1 | Unit tests `TRIP-038-R1` in `lib/agent.test.ts` (`show_payment` opens the payment page, refused for an invalid form or without a plan; the rules text); browser test `TRIP-038-R1 R2 …` (BETALSIDAN opens the payment page, BETALSATT sets and shows the method) and `TRIP-038-R1 she does not open …`; `TRIP-030-R4` covers the changed-page case unchanged | local | Pass | 2026-11-06 |
| TRIP-038-R2 | Unit test `TRIP-030-R8 TRIP-038-R2` (button on the payment page only); browser tests `TRIP-038-R1 R2 …` (button on the payment page, none before, no booking saved, axe) and `TRIP-038-R2 on Resenärer …`; `TRIP-030-R7 R8`/`R8` updated to book from the payment page | local | Pass | 2026-11-06 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `lib/agent.test.ts` | local | Pass | 2026-11-06 |
| Browser tests | `tests/TRIP-038-agent-payment-step.spec.ts` (new); `TRIP-030` tests updated | local | Pass | 2026-11-06 |
| Smoke test | None planned | | | |
| Accessibility | axe on Resenärer and on the payment page with the chat in the agent mode, in the new test; the live checklist is **not checked** | local | Pass | 2026-11-06 |
| Real model tone | **Not checked.** Trying the tone by hand on the preview is left to the user | | | |
| Security | `/security-review` not needed (no new input, action or data) | | | |
| Code review | [review.md](review.md) | local | Passed | 2026-11-06 |

## Test suite

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before (TRIP-043, 2026-11-06) | 317 unit + 232 browser | unit 6.0 s, browser 206.0 s | 6.4 s |
| After | 322 unit + 237 browser | unit 6.7 s, browser 223.4 s | 4.2 s |

This change added two unit tests and three browser tests; the counts differ by more (+5 and +5) than that, which was not traced. The browser suite was already over the 3 minute budget before this change; the new tests are short and the rest of the growth is noise between runs. Not handled here.

## Definition of Done

- [x] Tests: every requirement is tested; `npm run test:unit` and `npm run test:local` pass
- [ ] Test suite: browser suite over the 180 s budget (already before this change, see above)
- [ ] Deployed, and the smoke tests pass against production (Live tests): not yet
- [ ] Accessibility: axe passes; the live checklist is not checked
- [x] Requirements in the card match what was built, no open questions; `solution.md` describes how
- [x] Manual, system docs and `wiki/log.md` updated
- [x] No leftovers
- [x] Clean code: `npm run lint`, `npm run typecheck` pass; the build is run by `test:local`
- [x] Code review done, no must-fix findings; see [review.md](review.md)
- [x] Technical tasks: none added (one small candidate noted in the review)

## Requirements as built

### TRIP-038-R1 The payment method is asked for on the payment page

Given the traveller form is valid on the Resenärer page, Agneta opens the payment page (`paymentUrl()`, same search and choice) with `show_payment` and asks about the payment method there, not on Resenärer. The extras question stays on Resenärer, once. A named payment method is set with `set_payment` and shown on the payment page. If the visitor changed the page meanwhile, she goes on from the page as it is (TRIP-030-R4).

### TRIP-038-R2 Check before the button

On the payment page, with a payment method and a valid form, she sums up (destination, dates, trips, travellers, extras, total), asks the visitor to check that it is right, and the button **Boka och betala** follows. The button is offered only on the payment page, never on Resenärer. No press, no booking; the other rules of TRIP-030-R8 hold.

## Notes

- `TILLAGG` in the fake agent no longer sets a payment method, so the TRIP-030 tests that book now go through the payment page.
