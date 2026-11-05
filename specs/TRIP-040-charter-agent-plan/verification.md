---
id: TRIP-040
title: Booking agent: aircraft and classes in charter
---

# Verification of TRIP-040

Local = `npm run test:unit` and `npm run test:local` (production build, own test database, `LLM_MOCK=1`). Nothing is deployed yet.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-040-R1 | Unit tests `TRIP-040-R1 R2 list_aircraft …` and `TRIP-030-R3 …` in `lib/agent.test.ts` and `lib/agent-rules.test.ts` (`/plan` allowed, `addons` checked); browser test `TRIP-040-R1 R2 on the plan step …`; axe in it | local | Pass | 2026-11-05 |
| TRIP-040-R2 | Unit tests `TRIP-040-R2 set_plan …` (refusals, no flight time in `list_aircraft`); browser test `TRIP-040-R2 an aircraft that does not exist …`. Recommendation in her voice: manual, not checked with the real model | local | Pass (tone not checked) | 2026-11-05 |
| TRIP-040-R3 | Unit test `TRIP-040-R3 show_plan …`; browser test `TRIP-040-R3 destination, dates and travellers in one sentence …`; `canBook` test in `TRIP-030-R8` | local | Pass | 2026-11-05 |
| TRIP-040-R4 | Unit test `TRIP-040-R4 set_addons …`; browser test `TRIP-040-R4 the add-ons she sets …`. "Asked once" is in `AGENT_RULES`: manual, not checked with the real model | local | Pass (asking not checked) | 2026-11-05 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `lib/agent.test.ts`, `lib/agent-rules.test.ts` | local | Pass | 2026-11-05 |
| Browser tests | `tests/TRIP-040-charter-agent-plan.spec.ts` (4), TRIP-030 test for the shortcut changed | local | Pass | 2026-11-05 |
| Smoke test | none new | n/a | n/a | |
| Accessibility | axe in each state of the new tests; the live checklist not done | local | Pass; live not checked | 2026-11-05 |
| Security | Security points of the review; `/security-review` run, nothing found | local | Pass | 2026-11-05 |
| Code review | [review.md](review.md) | local | Passed | 2026-11-05 |

## Test suite

`npm run test:time`.

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 313 unit, 219 browser | 5.1 s + 188.0 s | 3.8 s |
| After | 317 unit, 223 browser | 6.2 s + 189.1 s | 3.7 s |

The browser time was already over the 180 s budget before this change (TRIP-039); the four new tests cost about 1 s. One unrelated test (`TECH-018-design` TRIP-023 a found booking, axe) failed once in the full run and passed alone and in the other runs; not investigated.

## Definition of Done

- [x] Tests: every check in the plan is done locally; `npm run test:unit` and `npm run test:local` pass (one unrelated flaky test, see above)
- [ ] Test suite: browser time 9 s over the budget, as before this change
- [ ] Deployed, and the smoke tests pass against production (Live tests): not done yet
- [ ] Accessibility: axe passes; the checklist on the live site is not checked yet
- [x] Requirements in the card match what was built, no open questions left; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/`), system docs (`wiki/system/`) and `wiki/log.md` updated
- [x] No leftovers
- [x] Clean code: `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks: TRIP-042 added (the "Snabbast" badge in charter)

## Requirements as built

As in the card (`gh issue view 135`), with these details: `show_travellers` takes no arguments and works on the page she is on; `show_plan` is the shortcut's tool. The add-ons are set per traveller on both trips wherever the add-on exists in the traveller's class; beer is left to the visitor (age rule). Her price summary counts the seats, the extras and the add-ons she set in the same answer.

- **R1** Page text, allowed addresses (`/plan`, the `addons` action) and tools for the plan step; the plan and class checks are shared in `lib/agent-plan.ts`. **R2** `list_aircraft` and `set_plan`, refused as the step refuses, no flight time. **R3** The shortcut goes `show_plan` → `set_plan` → `show_travellers`, refused until both trips have aircraft and classes. **R4** `list_addons` and `set_addons`; she asks once, the form and the page show them.

## Notes

- Not checked: the live site (smoke tests, the accessibility checklist) and the real model (tone of the recommendations, asking once about add-ons).
- Her price total does not include add-ons the visitor chose in the form in earlier answers; the text says so.
