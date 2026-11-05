---
id: TRIP-030
title: Booking agent
card: "#110"
depends_on: [TRIP-017, TRIP-032, TRIP-033, TRIP-034]
---

# TRIP-030 Booking agent: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 110`. Flights ([TRIP-036](https://github.com/gustavnymoen/gurrasflyg/issues/128)) and finding or cancelling a booking ([TRIP-037](https://github.com/gustavnymoen/gurrasflyg/issues/129)) are not part of it.

## Data

None. No table or migration. The agent mode is one more field (`agent`) in the saved chat in the tab's `sessionStorage` (`agneta-chat`). The tools read the existing charter tables.

## Interface

- **`POST /api/chat`** takes `{ messages, agent? }`. Without `agent` it is the plain chat and answers `{ reply, help }` (`help`: show the button **Hjälp mig**). With `agent` (`{ url, extras, payment, valid }`, checked by `parseAgentContext`) it is the agent mode and answers `{ reply, actions, book }`. A wrongly shaped `agent` is a 400, like a wrongly shaped message list. The limits, the 502 text and the logging are the plain chat's.
- **Chat** (`ChatBody.tsx`): under an answer with `help` the button **Hjälp mig** (only on the last answer, only when the mode is off); in the mode a bar "Agneta hjälper dig" with **Sluta**, a screen-reader-only `role="status"` that says "Agneta hjälper dig nu.", and under an answer with `book` the button **Boka och betala**. Focus goes to the field when the mode starts or ends. The note about personal data adds that names and contact details go on the page, never in the chat.
- **Chat helpers for the page** (`app/components/chatAgent.ts`): `readContext()` (what is sent with a question), `sameContext()`, `applyActions()` and `bookNow()`.
- **`app/charter/book.ts`**: `bookCharter()` calls `bookCharterAction()` and stores the summary; both Betala (`CharterPaymentForm`) and the chat's button use it, so there is one booking path.
- Texts (Swedish): "Hjälp mig", "Agneta hjälper dig", "Sluta", "Boka och betala", and the three that come from the chat and not from the model (`lib/agent-rules.ts`): `CHANGED_TEXT` ("Du hann ändra något …"), `bookedText()` and `NOT_READY_TEXT`.

## Code

| File | What |
|---|---|
| `lib/agent-rules.ts` | Shared by browser and server: `MAX_TOOL_CALLS` (6), `isAgentUrl` (the pages an action may open), `parseAgentContext`, `safeActions`, `takeMarkers`, the texts. |
| `lib/agent-page.ts` | `readPage(url)`: the page the visitor is on, read with the pages' own parsers (`parseFilters`, `parseCharterSearch`, `readCharter`); `pageText()`: what the model is told before each question. |
| `lib/agent-tools.ts` | The tool definitions (`TOOLS`) and `runTool()`; `AgentState`; `actionsOf()`. |
| `lib/agent.ts` | `askAgent()`: the tool loop, the agent rules (system text), whether the booking button may be offered. |
| `lib/chat-mock.ts` | The fake client for `LLM_MOCK=1`: the plain answer and the scripted agent. Moved out of `lib/chat.ts`. |
| `lib/chat.ts` | `askAgneta()` now also takes the `[[HELP]]` marker out of the answer; `defaultClient()`. |

## Decisions

- **Tools only read; the chat acts.** A tool never opens a page or writes the form. It puts an action in `AgentState.actions` and the route answers `{ reply, actions }`; the chat carries them out. There is no booking tool at all, so no model output can book: the only path to `bookCharterAction()` is the button, which calls it from the page's own address and form (R8).
- **One action per kind, in a fixed order.** If the model opens two pages in one answer only the last is kept (it is where the visitor ends up); the order is extras, payment, then the page, so the form is written before the page that shows it opens.
- **How the model marks that a button should be shown (decided here, as the card says).** The last line of its answer is exactly `[[HELP]]` (plain chat: the question asked for something done) or `[[BOOK]]` (agent mode: the summary is given). The route removes the marker and answers a flag. `[[HELP]]` is only honoured in the plain chat. `[[BOOK]]` is only honoured when the server agrees (`canBook`): the form is valid (as the page reported), a payment method is set, the page is Resenärer or payment with both trips chosen and found in the database, and the answer did not move the page. A marker is a line of text, so it works in both modes without a tool and needs no change to the answer format. If the answer is cut at the token limit, the cut drops the last line, so no button.
- **The page travels with the question, not in the system text.** The `<page>` block is put in the last user message, so the cached system text (and the tools before it) stay the same for every question (R9). The agent mode adds one fixed system block (`AGENT_RULES`) after the knowledge; plain chat and agent mode therefore have two cache entries, each of which the next question within five minutes reads.
- **The context is read with the pages' parsers and rebuilt.** The model is told the filters as `filtersToParams` prints them, the search and the chosen trips from `readCharter` (so a trip id that does not run is "none yet"), never the raw address. An address that does not parse is "a page you do not know". The client sends only the path and query, the codes of the extras, the payment method and whether the form is valid (`charterProblems`): there is no field in the request for a name, an age or a contact detail.
- **"Page changed" is checked in the chat.** The card says each action carries the address and choices its answer was based on. The chat keeps what it sent with the question (`readContext()`), and carries out the actions only if `readContext()` is the same when the answer arrives (`sameContext`); this is the same check with less data on the wire, because the server would only have echoed what the chat already holds. When it is not the same, the actions are dropped and the chat adds Agneta's fixed line `CHANGED_TEXT`.
- **The tool loop.** `askAgent` calls the model with the tools until it stops with text. After 6 tool calls (counted per call, so a turn with 8 calls runs 6 and answers the other 2 with "Tool call limit reached") the next request has `tool_choice: none` and must answer. After 35 s of the 55 s budget it is forced the same way, and each request's timeout is what is left of the budget, without retries, so a question ends before the route's 60 s.
- **Tool errors are answers.** Wrong arguments, an unknown destination, dates that cannot be booked, a trip that does not run or does not fit give `is_error` results the model reads; unexpected errors give a generic text and only the error's class name is logged.
- **Tool descriptions** are in `lib/agent-tools.ts` (`TOOLS`) and written for the model: what it does in the visitor's browser, which exact values to use (the English continent, access and category names, country names from the knowledge, the extras' codes with prices), and what not to do (name no trip or price from memory; give trip ids only when the visitor agreed). `show_destinations` takes English country names and maps them to the codes the filters use. The rules for how to behave (Agneta's voice in every answer, ask the airport once, ask about extras once, never ask for personal details, offer the button only when valid) are in the agent system block.
- **Drinks under 18.** The server never sees ages, so the chat applies `withoutUnavailable()` when it writes extras: the same rule the Resenärer page uses.
- **Requirements untouched.** R1 to R10 are as in the card.
- **The fake agent** (`lib/chat-mock.ts`) answers by a word in the question (`LISTA`, `GENVAG`, `RESULTAT`, `TILLAGG`, `BOKA`, `SLINGA`, `OTILLATEN`, `FEL`) with values like `id=teufelsberg` in the question, and runs the real tools and the real loop, so the tests exercise everything except the model. The plain mock gives the `[[HELP]]` line for "hjälp mig" and "boka åt mig".
