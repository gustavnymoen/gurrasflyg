---
id: TRIP-017
title: Charter chatbot Agneta
card: "#23"
depends_on: [TRIP-013, TRIP-014, TECH-025]
---

# TRIP-017 Charter chatbot Agneta: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 23`.

## Data

None. No table or migration: the questions are not stored (the card's privacy requirement). The knowledge is read from the existing charter tables. The rate limit uses the existing `login_attempts` table with the key `api:chat:<ip>`.

New package: `@anthropic-ai/sdk` (the official SDK, as the course guide says). New environment variable `LLM_API_KEY` (Vercel Production and Preview, `.env.local`), and `LLM_MOCK=1`, which `scripts/test-server.mjs` sets for the local test server.

## Interface

- **`POST /api/chat`** (`app/api/chat/route.ts`): body `{ messages: [{ role, content }, …] }`, answer `{ reply }`. 400 for a body that fails `parseMessages`, 429 with `Retry-After` over the limit, 502 when the API fails, is too slow, refuses or answers with nothing. `maxDuration` is 60 s; the SDK times out after 50 s.
- **`app/components/Chat.tsx`**: the button "Fråga Agneta" (fixed at the bottom right) and the chat in a `Dialog`. It is rendered by the start page and by `app/charter/layout.tsx`, so it is on the start page and every page under `/charter` and nowhere else. The conversation is state in the button component, so it survives closing the dialog but not a reload.
- **`Dialog`** got `wide` (a wider box with left-aligned text) and now also cycles Tab through text fields, not only buttons.
- Texts (Swedish): the dialog's note about personal data; "Agneta tänker …"; the failure text and the "come back in N minutes" text in `lib/chat-rules.ts`.

## Code

| File | What |
|---|---|
| `lib/chat-rules.ts` | Limits, `parseMessages` (server check), `lastMessages` (client: the last 6, never starting with an answer), the friendly texts. Shared by browser and server. |
| `lib/chat-prompt.ts` | `buildSystemPrompt()`: instructions and voice, the booking text, then one `<destination id="…">` block per destination sorted by id. |
| `lib/chat.ts` | `askAgneta(messages, client?)`: the one place that reads `LLM_API_KEY`; the request, the usage log, the mock client. |
| `lib/flow-limits.ts` | `CHAT_LIMIT` (10 in 5 minutes), `apiLimitResponse(route, limit)`. |
| `lib/charter.ts` | `readDepartureTimetables()`: all timetables to or from ARN/CPH in four queries, sharing code with `readTimetables`. |

## Decisions

- **The prompt is built per request, not at build time** (R1: "follows a change in the database"). It costs about seven queries; the text is the same as long as the data is. Prompt caching on Anthropic's side is what makes the 40 000+ tokens cheap, and it needs the text to be byte for byte the same: no date, no time, nothing about the visitor. Timetable lines are sorted (to the airport, then from it, each by departure then id) and the days are put in week order for the same reason.
- **Same airport and price as the page.** The "Flights" line uses `tripTo()`, the rule the destination page uses, so the airport (nearest, else gateway) and the "round trip from" price are the page's. The timetables listed are those between that airport and ARN/CPH.
- **Arrival times** are worked out with `makeTrip()` (the site's rule: departure plus travel time in the arrival airport's time zone), for the first day of the period. After the clocks change in March an arrival can be an hour off; the prompt says "local time". Good enough for a chatbot; the booking itself uses the exact date.
- **Mock client by environment variable**, chosen inside `askAgneta`, so the real route, validation, limit and prompt are exercised by the browser tests. A question with "FEL" makes the mock fail.
- **Validation of the history.** The sent history is the prompt-injection channel, so the server accepts at most 6 messages that alternate user/assistant from a user message, end with a user message, with questions up to 500 and answers up to 4 000 characters. The client drops a leading answer from "the last 6" because the API needs a conversation to start with a question.
- **Errors never say why.** All failures give the same in-character text; the route logs only the error's class name, never the error (which can carry the API's reply).
- **A failed question** stays on screen but is not sent again (marked `failed` in the chat state).
- **Dialog, not a new chat widget**: reuses `Dialog` (native `<dialog>`, focus back to the button, Escape), which already meets the focus rules.
- **Rate limit before the model, after validation**: a malformed body costs nothing and counts nothing; every valid question counts, also one that fails at the API.
