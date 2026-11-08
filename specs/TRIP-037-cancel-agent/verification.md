---
id: TRIP-037
title: Booking agent for finding and cancelling a booking
---

# Verification of TRIP-037

All checks were run locally on 2026-11-08 (unit tests; `npm run test:time`, a production build on port 3100 with its own test database, and the fake agent `LLM_MOCK=1`). **Not done:** the real model has not been tried, the live checklist is not checked, and nothing is deployed, so the Live tests have not run.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-037-R1 | Browser tests `TRIP-037-R1 R6` (the button on Min bokning, Hjälp mig offered there and the mode started, the mode and conversation kept from `/charter`, the page opened by the tool) and `TRIP-017-R7 TRIP-036-R1` (the button on `/min-bokning`); unit tests `TRIP-037-R1` in `lib/agent.test.ts` and `lib/agent-rules.test.ts` | local | Pass | 2026-11-08 |
| TRIP-037-R2 | Unit tests `TRIP-037-R2` (no tool that looks up or cancels, none takes a number or name; the rules tell her to send both to the page's fields and say nothing can be found without the number); browser test `TRIP-037-R2` (a number and name in the chat: no server action, fields empty, no extract). The wrong-attempt limit is unchanged and still tested by `TRIP-023-R3`. How she actually answers (voice, "no workaround") is the model's: **not checked** with the real model | local | Pass (voice not checked) | 2026-11-08 |
| TRIP-037-R3 | Unit test `TRIP-037-R2 R3` (the rules contain `LOTTERY_TEXT`, 24 hours, no undo, never promise a refund); `LOTTERY_TEXT` is the page's paragraph (browser tests of TRIP-023 still pass). The explanation in her voice is the model's: **not checked** with the real model | local | Pass (voice not checked) | 2026-11-08 |
| TRIP-037-R4 | Unit tests `TRIP-037-R4` in `lib/cancel-extract.test.ts` (flight and charter extract, none of the forbidden fields in the JSON or text, the parse) and `lib/agent.test.ts` (the whole request and the log searched for names, e-mail, phone, address and number; no extract before a lookup); browser tests `TRIP-037-R4 R5 R6` and `TRIP-037-R4 R5` (no extract before the lookup, the extract after it, searched for the seed's number, last name, e-mail and names) | local | Pass | 2026-11-08 |
| TRIP-037-R5 | Unit tests `TRIP-037-R5` (exactly the ids asked for, the refund text, already cancelled and too late refused with the reason, an empty list clears, no booking no tick, the button never offered, `tick` action checks); browser tests `TRIP-037-R4 R5 R6` (outbound, one traveller on both flights replacing the ticks, the visitor's unticking carried to the next question, no server action by the chat, Avboka asks first, Nej cancels nothing), `TRIP-037-R5` (a flight too late not ticked) and the charter test. The cancelling itself is `cancelAction`, unchanged and tested by TRIP-023 | local | Pass | 2026-11-08 |
| TRIP-037-R6 | `expectNoA11yViolations` in each state of the browser tests (the chat on the page, boxes ticked by an action, the dialog, charter, too late); the test checks the status text "Agneta kryssade: …" and that focus stays in the chat field. The live checklist is **not checked** | local | Pass (live not checked) | 2026-11-08 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `lib/cancel-extract.test.ts` (8), `lib/agent.test.ts` (+9), `lib/agent-rules.test.ts` (+3) | local | Pass | 2026-11-08 |
| Browser tests | `tests/TRIP-037-cancel-agent.spec.ts` (5 tests); `TRIP-017-R7` test updated (the button is now on Min bokning) | local | Pass | 2026-11-08 |
| Smoke test | None planned | | | |
| Accessibility | axe in each state of the new tests; the checklist of `wiki/system/accessibility.md` on `/min-bokning` with the mode on is **not checked** (live, after deploy) | local | Pass | 2026-11-08 |
| Real model | **Not checked.** The explanation and the voice are to be tried by hand on the preview and live | | | |
| Security | `/security-review` run on the working tree: no finding. The review covers the security points | local | Pass | 2026-11-08 |
| Code review | [review.md](review.md) | local | Passed | 2026-11-08 |

## Test suite

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before (TRIP-036) | 336 unit + 244 browser | unit 12.3 s, browser 240.4 s | 5.2 s |
| After | 356 unit + 249 browser | unit 10.8 s, browser 254.3 s | 5.2 s |

The browser suite was over the 180 s budget before this change (TRIP-036 recorded 240 s) and grew 6 %. The slowest test is the unchanged TRIP-017-R7, which visits one page more. The five new tests take 5.4 s together. A first run of `test:time` had 10 failing tests in `lib/agent.test.ts` while other test runs used the same unit database at the same time; all 356 passed when run alone.

## Definition of Done

- [x] Tests: every requirement is tested; `npm run test:unit` and `npm run test:local` (through `test:time`) pass; the one failure of that run (`TRIP-017-R7`, the old list of pages without the chat) was fixed and the test passes
- [ ] Test suite: browser suite over the 180 s budget (already before)
- [ ] Deployed, and the smoke tests pass against production (Live tests): not yet
- [ ] Accessibility: axe passes; the live checklist is not checked
- [x] Requirements in the card match what was built, no open questions; `solution.md` describes how
- [x] Manual, system docs and `wiki/log.md` updated
- [x] No leftovers
- [x] Clean code: `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review: see [review.md](review.md)
- [x] Technical tasks: none added

## Requirements as built

Copied from the card (unchanged by the work).

### TRIP-037-R1 Agneta on Min bokning

The chat is on `/min-bokning`, and the agent mode works there.

Acceptance criteria:

- **Given** `/min-bokning`, **then** "Fråga Agneta" is there; the conversation and mode follow the visitor from the other pages.
- **Given** a visitor who asks for help with a booking, **then** the button **Hjälp mig** is offered (TRIP-030-R1) and the page goes to `/min-bokning`.

### TRIP-037-R2 The visitor types the number and the name

She tells the visitor to type the booking number and the last name on the page, and never asks for them in the chat.

Acceptance criteria:

- **Given** a visitor who types a booking number, a last name, a name or an e-mail address in the chat, **then** she does not use it: she tells them to type it in the page's fields and that she can't look a booking up (the model is never given a lookup tool).
- **Given** a visitor who has lost the number, **then** she says it can't be found without it, in her voice, and does not suggest a workaround.
- The wrong-attempt limit and the same answer for a wrong number and a wrong name are unchanged (TECH-026).

### TRIP-037-R3 She knows the rules

Acceptance criteria:

- She explains the lottery (50/50, a win refunds what is cancelled, a loss refunds nothing), the 24 hour rule and that a cancellation can't be undone, in her voice and in line with `wiki/manual/min-bokning.md`; the text she follows is the page's own wording, kept in one place.
- She does not promise a refund.

### TRIP-037-R4 She sees an extract of the booking

When a booking is found on the page, the chat sends an extract with each question: only what is needed to help choose what to cancel.

Acceptance criteria:

- **Given** a found flight booking, **then** the extract has, per flight, route, date and departure, whether it can still be cancelled, and per passenger "Resenär 1", "Resenär 2", class and the amount; for a charter booking the destination, the trips, "Resenär 1…", the amounts and whether it can be cancelled; and which parts are already cancelled.
- The extract never has a name, contact detail, booking number, last name, payment method or address, and these are not written in a log (checked in a test that searches the request).
- **Given** no booking on the page, **then** no extract is sent.

### TRIP-037-R5 She ticks, the visitor cancels

Agneta ticks the parts the visitor wants to cancel, by an action the chat carries out, and the visitor presses the page's **Avboka**.

Acceptance criteria:

- **Given** "avboka utresan" or "avboka resenär 2", **then** the boxes of exactly those parts are ticked on the page, and she says what a win would refund.
- **Given** a part that can't be cancelled (too late, already cancelled), **then** it is not ticked and she says why.
- **Given** no press of **Avboka** and **Ja, avboka**, **then** nothing is cancelled, whatever the model says or calls; the cancellation goes through `cancelAction` as today, with its checks, the draw and the limit.
- The visitor can tick and untick on the page and she goes on from that.

### TRIP-037-R6 Accessibility

Every state the card adds (the chat on the page, ticked boxes set by an action) is checked with axe; the ticked boxes are announced when they change by an action; focus is not moved from the chat to the page.

## Notes

- Small change outside the card: the note under the chat field now says "Namn, bokningsnummer och kontaktuppgifter fyller du i på sidan, aldrig här." in agent mode.
- A tick that she asks for and that nothing allows leaves the visitor's own ticks untouched, and the answer says so (found in the review).
