---
id: TRIP-000
title: Short name of the feature
---

# Verification of TRIP-000

How each requirement was checked. Create this file when work starts and fill it in before the feature is done.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-017-R1 | Unit tests `TRIP-017-R1 …` in `lib/chat-prompt.test.ts` (same twice, 96 destinations in id order, page airport and price, no flights, follows the database) | local | Pass | 2026-11-04 |
| TRIP-017-R2 | Manual with the real model: not checked yet (preview, then live) | – | Not checked | – |
| TRIP-017-R3 | Booking text in the prompt (`TRIP-017-R1 R3` unit test); that it matches `wiki/manual/boka-charter.md` is the code review (compared, agrees). The answers with the real model: not checked yet | local | Pass (text), answers not checked | 2026-11-04 |
| TRIP-017-R4 | Instructions are in the prompt (unit test); refusals with the real model: not checked yet | – | Not checked | – |
| TRIP-017-R5 | The voice is the prompt's job; tried by hand with the real model: not checked yet | – | Not checked | – |
| TRIP-017-R6 | Unit tests in `lib/chat.test.ts` (model, system prompt, `cache_control`, `max_tokens` 600, usage logged, key not logged, mock makes no request). Cache read above 0 and the bundle search for the key: not checked yet (preview, live) | local | Pass (unit), manual not checked | 2026-11-04 |
| TRIP-017-R7 | Browser tests `TRIP-017-R7 …` in `tests/TRIP-017-charter-chatbot.spec.ts`, and the look in `tests/TECH-018-design.spec.ts`; smoke test | local | Pass | 2026-11-04 |
| TRIP-017-R8 | Unit tests `lib/chat-rules.test.ts`, `lib/chat.test.ts` (11th question locked); browser tests for 400, the 501st character and the error state | local | Pass | 2026-11-04 |
| TRIP-017-R9 | Browser tests: keyboard run, focus in and back, Escape, 320 px, `expectNoA11yViolations` on the start page and a charter page. Screen reader announcement (`role="log"`) not tried with a real screen reader | local | Pass (screen reader not checked) | 2026-11-04 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `lib/chat-rules.test.ts`, `lib/chat-prompt.test.ts`, `lib/chat.test.ts` | local | Pass | 2026-11-04 |
| Browser tests | `tests/TRIP-017-charter-chatbot.spec.ts` (7 tests), one added check in `tests/TECH-018-design.spec.ts` | local | Pass | 2026-11-04 |
| Smoke test | `TRIP-017-R7 @smoke` (no question is sent) | preview, live | Not run yet (after the pull request and the deploy) | – |
| Accessibility | axe in the browser tests; the checklist in `wiki/system/accessibility.md` on the live site: not checked yet | local | axe pass, checklist not checked | 2026-11-04 |
| Security | Security points in the review; `/security-review` run: no findings | local | Pass | 2026-11-04 |
| Real model by hand | Not checked yet: two questions within 5 minutes (cache), bundle search, the refusal questions | preview, live | Not checked | – |
| Code review | [review.md](review.md) | local | Passed | 2026-11-04 |

## Test suite

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 237 unit, 178 browser | 0.8 s + 136.2 s | 2.8 s |
| After | 256 unit, 184 browser | 1.7 s + 146.4 s (+7 %) | 3.6 s |

## Definition of Done

- [x] Tests: every check in the card's test plan that can run locally is done; `npm run test:unit` and `npm run test:local` pass
- [x] Test suite: within the time budgets, total time grown by less than 25 %
- [ ] Deployed, and the smoke tests pass against production (Live tests)
- [ ] Accessibility: axe passes; the manual checklist on the live site is not done
- [x] Requirements in the card match what was built (copied below); `solution.md` describes how it was built
- [x] Manual, system docs and `wiki/log.md` updated
- [x] No leftovers
- [x] Clean code: `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical task candidate noted (the outdated sentence in `boka-charter.md`), not added to the board

## Requirements as built

As on the card (`gh issue view 23`, R1–R9 with acceptance criteria) at the time of building; nothing was changed while building. The arrival times in the prompt are worked out for the first day of each period (see `solution.md`).

## Notes

- The real model has not been called yet; R2–R6's manual checks wait for the preview.
- Unit tests share `unit-test.db` with other checkouts, so a second run at the same moment can fail one test; it passed on rerun (the last full run had 17 unit failures and one design test failing for the same reason; both passed alone).
