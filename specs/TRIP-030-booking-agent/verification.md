---
id: TRIP-030
title: Booking agent
---

# Verification of TRIP-030

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-030-R1 | Browser test `TRIP-030-R1 R10 a request for help gets the button …` (button only for a request, keyboard, status, focus, Sluta, kept after reload, cleared by Stäng) and unit tests in `lib/chat.test.ts`, `lib/chat-saved.test.ts` | local | Pass | 2026-11-05 |
| TRIP-030-R2 | Unit tests `TRIP-030-R2 …` in `lib/agent.test.ts` (cap of 6, usage per call, wrong arguments, answer with nothing, API failure); browser tests `TRIP-030-R2 …` (route shape, 400, 502 text, cap). In-character tone: manual, see below | local; tone not checked | Pass (see where) | 2026-11-05 |
| TRIP-030-R3 | Browser tests `TRIP-030-R3 …` (list with filters, results with a chosen trip, a page the tools cannot open); unit tests `TRIP-030-R3 …` in `lib/agent-rules.test.ts` and `lib/agent.test.ts` | local | Pass | 2026-11-05 |
| TRIP-030-R4 | Browser test `TRIP-030-R4 what the visitor changed …` (answer too late is dropped, next question carries the new page) and `TRIP-030-R4 R5 destination, dates …` (shortcut, no booking dates); unit tests for `readPage` and the context | local; the airport question is in the prompt and not tried | Pass | 2026-11-05 |
| TRIP-030-R5 | Unit test `TRIP-030-R5 find_trips …` (same trips as `findTrips`), browser shortcut test (dates that cannot be booked go nowhere) | local; "recommend one trip in her voice" not checked (needs the real model) | Pass (see where) | 2026-11-05 |
| TRIP-030-R6 | Browser test `TRIP-030-R6 …` (extras and payment written to the form and shown; drinks not set with a traveller of 12); unit test `TRIP-030-R6` | local | Pass | 2026-11-05 |
| TRIP-030-R7 | Browser test `TRIP-030-R7 R8 …` (request bodies contain no name, address or e-mail; button only with a valid form) and unit test `TRIP-030-R7` | local | Pass | 2026-11-05 |
| TRIP-030-R8 | Browser tests `TRIP-030-R7 R8 …` (no press no booking, two presses one booking, the number in the chat) and `TRIP-030-R8 a booking that fails …`; unit test `TRIP-030-R8 the booking button is offered only …`. Code review: no other path to `bookCharterAction` | local | Pass | 2026-11-05 |
| TRIP-030-R9 | Cache: the page is in the last user message and the tools and the system text are fixed (unit test `TRIP-030-R2 R9 the request carries …`). `cache_read_input_tokens` above 0 and the time limit with the real model: not checked | local; real-model part not checked | Pass (see where) | 2026-11-05 |
| TRIP-030-R10 | axe in the button state, the mode, the booking button, the summary page and the dialog on a small screen, in the browser tests above. Checklist in `wiki/system/accessibility.md` on live: not checked | local; live checklist not checked | Pass (see where) | 2026-11-05 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `lib/agent-rules.test.ts`, `lib/agent.test.ts`, additions to `lib/chat.test.ts` and `lib/chat-saved.test.ts`; `npm run test:unit` 296 passed | local | Pass | 2026-11-05 |
| Browser tests | `tests/TRIP-030-booking-agent.spec.ts`, 12 tests with the fake agent; `npm run test:local` 214 passed | local | Pass | 2026-11-05 |
| Real model | Not checked: to be tried by hand on the preview and live with a real question, including the cost in the log (`cache_read_input_tokens` on the second question) and Agneta's tone in every answer | preview, live | Not checked | |
| Smoke test | Not applicable: none new, `/charter` and a destination page are covered | | | |
| Accessibility | axe in each new state (browser tests); the checklist in `wiki/system/accessibility.md` on `/charter` with the mode on: not checked | local | Pass (axe); checklist not checked | 2026-11-05 |
| Security | `/security-review`: no findings | local | Pass | 2026-11-05 |
| Code review | [review.md](review.md) | local | Passed | 2026-11-05 |

## Test suite

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 276 unit, 202 browser | 1.8 s + 162.5 s | 3.5 s |
| After | 296 unit, 214 browser | 5.1 s + 169.0 s | 3.0 s |

Total browser time grew by 4 %; the new tests take about 17 s together (12 tests), within the budgets (180 s, 5 s per test). The unit time figure is for the whole run including starting the database.

## Definition of Done

- [x] Tests: every automatic check in the plan is done; `npm run test:unit` and `npm run test:local` pass
- [x] Test suite: within the time budgets, total time grown by 4 %, the new tests follow the quality rules
- [ ] Deployed, and the smoke tests pass against production (Live tests): not done yet
- [ ] Accessibility: axe passes; the checklist on the live site is not checked yet
- [x] Requirements in the card match what was built (copied below), no open questions; `solution.md` describes how it was built
- [x] Manual, system docs and `wiki/log.md` updated
- [x] No leftovers
- [x] Clean code: `npm run lint` and `npm run typecheck` pass; the build is made by `npm run test:local` (in `.next-test`, since a dev server runs on port 3000)
- [x] Code review done, no must-fix findings left: see [review.md](review.md)
- [x] Technical tasks: none added

## Requirements as built

### TRIP-030-R1 Hjälp mig

When a visitor asks Agneta to do something and not only to answer ("kan du boka åt mig?", "hjälp mig hitta en resa"), she answers in her voice and the chat shows a button **Hjälp mig** under her answer. Pressing it starts the agent mode.

Acceptance criteria:

- **Given** a question that asks for help doing something, **then** her answer is followed by the button; a plain question about a destination gets no button.
- **Given** the button is pressed, **then** the chat shows that Agneta is helping ("Agneta hjälper dig") with a way out, **Sluta**, which returns to answering only; the mode is kept in the tab with the conversation and cleared with it.
- The button and the way out work with keyboard and screen reader; pressing the button announces that the mode started, and focus goes to the field.

### TRIP-030-R2 Agent mode

In the agent mode a question is answered by the model with tools, in a loop on the server, until it answers in text or reaches the cap.

Acceptance criteria:

- **Given** a question, **then** the model can call at most 6 tools before it must answer; at the cap the route answers with what it has, and never loops further.
- The route's limits still apply: the question limit (10 in 5 minutes per address), 400 for a wrongly shaped request, and an answer within the 60 second limit; a failure shows the same in-character error as today, never a status, a tool result or the key.
- **In character.** Every answer in the agent mode is Agneta the grumpy travel agent (the voice rules of TRIP-032 and TRIP-033: the tone from the first answer, grumpy but not tiring), also when she asks, confirms, refuses and reports an error; the tone is checked by hand (see the test plan).
- Only the tools in the list below exist; a tool call with wrong arguments is answered to the model with an error text, and nothing happens.
- `usage` of every model call of a question is logged.

### TRIP-030-R3 The agent steers the page

Agneta can open pages for the visitor. The chat does it, not the model: the route answers `{ reply, actions }`, the server checks each action and the chat carries it out.

Acceptance criteria:

- **Given** "visa gruvor i Europa", **then** the page goes to `/charter` with the filters in the address (the format of `parseFilters`), and the list shows them.
- **Given** a destination, dates and travellers, **then** the page goes to its results (`/charter/<id>/resor?fran=…&utresa=…&hemresa=…&resenarer=…`), with the chosen trips in `ut` and `hem` when the visitor has agreed to them.
- An action may only open a path under `/charter` of the shapes above, with values checked against the data; anything else is dropped. The visitor can always use the page themselves and the agent mode goes on from what they did.
- Moving the page keeps the chat open (the panel is not modal) and does not clear the conversation.

### TRIP-030-R4 The agent sees the page, does not overwrite the visitor, and takes the shortcut

Each question in the agent mode carries the page the visitor is on (path and address) and what they chose that is not personal, and the server reads it with the pages' own parsers. The visitor can click in the flow at any moment, and what Agneta does never overwrites what they did.

Acceptance criteria:

- **Given** the visitor changed the dates, a filter, a trip, an extra or the payment method on the page, **then** the next answer is based on that, not on what Agneta last opened.
- What is sent is the address (only the shape the parsers accept; an address that doesn't parse is "an unknown page"), the codes of the chosen extras and the payment method. Never a name, an age, a contact detail or an answer to the three questions, and nothing of it is logged.
- **Given** the visitor changed the page while a question was being answered, **then** the actions that come back are dropped, because each action carries the address and choices its answer was based on and the chat carries it out only if the page is unchanged; Agneta then says that they changed something, in her voice, and asks how they want it.
- **Given** a visitor who gives a destination, dates and a number of travellers in one sentence ("jag vill till X mellan dessa datum, vi är tre"), **then**, if trips run on those dates (R5), the page goes straight to Resenärer with the destination, dates, travellers and one outbound and one return trip already in the address, without stepping through the pages in between; she says which trips she chose and why, and the visitor can change them on the page.
- **Given** the departure airport is not said, **then** she asks once (Arlanda or Köpenhamn) before going on.
- **Given** no trip on the dates, **then** she does not go to any booking step: she says so and suggests other dates (R5).

### TRIP-030-R5 Finding trips

Agneta looks up the trips for the visitor's dates and says what she found.

Acceptance criteria:

- **Given** a destination, an airport, dates and a number of travellers, **then** she is told the same trips and prices the results page shows (`findTrips()`, `charterTotal()`), and only those; she never names a trip or a price from memory.
- **Given** no trip on the date, or a return that doesn't fit, **then** she says so and suggests another date, and does not book.
- She recommends one trip in her own voice; the visitor decides.

### TRIP-030-R6 Extras and payment method

Agneta asks once whether the visitor sees an extra they like ("ser du något tillägg du gillar?"), not one extra at a time, and asks how they want to pay.

Acceptance criteria:

- **Given** the visitor names extras or a payment method, **then** the form in the tab gets them (the chat writes to the same store as the Resenärer page), and the page shows them.
- The drinks package is never set when a traveller is under 18 (the booking refuses it).

### TRIP-030-R7 The visitor fills in their details

Names, ages, contact details and the three questions are filled in by the visitor on the Resenärer page, never through the chat.

Acceptance criteria:

- **Given** the visitor has chosen trips and extras, **then** Agneta opens `/charter/<id>/boka` and tells them to fill in the form; she waits.
- **Given** the form is not valid, **then** the booking button is not offered (the chat is told only valid or not valid, from `charterProblems()` on the client).
- No personal detail from the form is sent to the model, put in an address or written in a log.

### TRIP-030-R8 The visitor books with a button

Agneta summarises the trip and the price, and the chat shows **Boka och betala**. The booking happens when the visitor presses it.

Acceptance criteria:

- **Given** a valid form, chosen trips and a payment method, **then** Agneta's summary (destination, dates, trips, travellers, extras, total) is followed by the button; the button calls the same action as Betala (`bookCharterAction()`), with the same checks, the same total from the database and the same rate limit.
- **Given** no button press, **then** no booking is saved, whatever the model says or calls.
- **Given** a successful booking, **then** the page goes to `/charter/bokad` and the chat says the booking number; **given** a failure, **then** it shows the action's message.
- Two presses give one booking (the request id).

### TRIP-030-R9 Cost and time

Acceptance criteria:

- The agent's tools are added to the cached prompt so that the cache still works (`cache_read_input_tokens` above 0 on the second question within five minutes), and a question with up to 6 tool calls ends within the route's time limit.
- The cap on tool calls (R2) and the limits above are the cost protection; no new cost cap is added.

### TRIP-030-R10 Accessibility

Acceptance criteria:

- Every state the card adds (the button, the mode, the booking button, results of an action) is checked with axe, and the keyboard, focus and announcements work as in TRIP-032 (the panel is not modal, focus is not stolen when the page changes).

## Non-functional requirements

Nothing the model returns is trusted: not a path, a date, a price or a code. The model's tool results come from our own database. None beyond `specs/overview.md` otherwise.


## Notes

- Decided while building (in `solution.md`): the model marks a button with a last line `[[HELP]]` or `[[BOOK]]`; the "page changed" check is made in the chat, which keeps what it sent, instead of echoing the address in each action.
- The browser tests give each test its own `x-forwarded-for` address, because the chat's limit is 10 questions in 5 minutes per address.
