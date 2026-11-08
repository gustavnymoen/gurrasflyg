---
id: TRIP-035
title: UX upgrades for Agneta
---

# Verification of TRIP-035

All checks ran locally on 2026-11-08, against a production build with the fake model (`LLM_MOCK=1`). Nothing is checked on the preview or the live site, and no question was sent to the real model.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-035-R1 | Browser test `TRIP-035-R1 …` (the window does not scroll, `body` does, a hash change and a new page's top work); `tests/TECH-018-design.spec.ts` (`html` overflow hidden, `body` auto). Scroll restoration on Back and the look of the bars by eye: **not checked** | local | Pass; by eye **not checked** | 2026-11-08 |
| TRIP-035-R2 | `tests/TECH-018-design.spec.ts` (a long answer fills the log, the visitor's bubble is at most 85 %) | local | Pass | 2026-11-08 |
| TRIP-035-R3 | Browser tests `TRIP-035-R3 …` (64 px, 128 px by click, Enter and Space, the log pushed down, second click, Escape first then the chat, click outside, tap in the dialog, axe) and `TECH-018` (64 px) | local | Pass | 2026-11-08 |
| TRIP-035-R4 | Browser test `TRIP-035-R4 …`; unit test `TRIP-035-R4 …` (no surname in the prompt); `grep` of lib, app, tests and wiki shows the surname only in the header code, its tests and the system wiki line about the header | local | Pass | 2026-11-08 |
| TRIP-035-R5 | Unit test `TRIP-035-R5 …` (voice rules kept). The tone with the real model on the preview and live: **not checked** | local; preview and live **not checked** | Unit pass; manual **not checked** | 2026-11-08 |
| TRIP-035-R6 | Unit tests in `lib/markdown.test.ts`, `lib/agent-rules.test.ts` (`takeMarkers`), `lib/chat.test.ts`, `lib/chat-prompt.test.ts`; browser tests `TRIP-035-R6 …` (fold, unfold, 3 items, `all`, with Hjälp mig, the mock's `FLER`, axe). The real model writing the whole list and `[[ALL]]`: **not checked** | local; preview **not checked** | Unit and browser pass; manual **not checked** | 2026-11-08 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `lib/markdown.test.ts`, `lib/agent-rules.test.ts`, `lib/chat.test.ts`, `lib/chat-prompt.test.ts` | local | Pass | 2026-11-08 |
| Browser tests | `tests/TRIP-035-agneta-ux-upgrades.spec.ts` (10 tests), `tests/TECH-018-design.spec.ts`; `TRIP-032` tests adjusted to the third header button | local | Pass | 2026-11-08 |
| Smoke test | None new, as the card says | – | Not applicable | – |
| Accessibility | axe on the folded and unfolded list, the enlarged picture and the dialog. The checklist in `wiki/system/accessibility.md` on the live site: **not done** | local; live **not checked** | Axe pass; checklist **not done** | 2026-11-08 |
| Security | `/security-review` not needed, as the card says (no new input, route or data; `[[ALL]]` is removed by the route like `[[HELP]]`) | – | Not applicable | – |
| Real model by hand | R5 and R6 on the preview and live | – | **Not checked** | – |
| Code review | [review.md](review.md) | local | See the file | 2026-11-08 |

## Test suite

`npm run test:time` could not be used (port 3100 was taken); the same runs were made with `PORT=3101`. Before is from TRIP-044's record in git history (not re-measured).

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | not re-measured | not re-measured | – |
| After | 366 unit, 261 browser | 16 s + about 270 s (includes a production build and the test server start) | not measured |

## Definition of Done

- [ ] Tests: every check in the card's test plan is done; manual real-model checks (R5, R6) **not done**
- [ ] Test suite: time budgets not measured with `npm run test:time` (see above)
- [ ] Deployed, and the smoke tests pass against production (Live tests): not yet
- [ ] Accessibility: axe passes; the checklist on the live site not yet done
- [x] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/`), system docs (`wiki/system/`) and `wiki/log.md` updated
- [x] No leftovers
- [x] Clean code: `npm run lint` and `npm run typecheck` pass (`npm run build` ran as part of `test:local`)
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks: none found

## Requirements as built

As in card #127 (`gh issue view 127`), with one correction: R1's acceptance criterion read "the page's bar is not in the seam"; it was a slip and was settled with the user (the card is corrected) as **the page's bar is in the seam** (the card's title and prototype), so only the chat's own bar is at the window's right edge. Everything else is as written: R1 one scrollbar in the seam, R2 full-width bubble, R3 bigger header picture, R4 surname in the header only, R5 a ruder tone, R6 long lists folded to the top 3 with `[[ALL]]`.

## Notes

- `window.scrollTo` and browser scroll restoration do not act on the page while the panel is open (the page scrolls in `body`); the site does not use them.
