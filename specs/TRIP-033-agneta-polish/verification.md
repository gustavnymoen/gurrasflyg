---
id: TRIP-033
title: Agneta polish
---

# Verification of TRIP-033

All checks so far ran locally, against a production build with the fake model (`LLM_MOCK=1`), on 2026-11-04. Nothing is checked on the preview or the live site, and no question was sent to the real model.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-033-R1 | Browser test `TRIP-033-R1 R2 the header …` (name, Kundtjänstmedarbetare, dot and "Live", in the panel and in the dialog, axe on both); dot and text contrast in `tests/TECH-018-design.spec.ts`. The site has one (dark) theme, so "both themes" is the one | local | Pass | 2026-11-04 |
| TRIP-033-R2 | Unit test `TRIP-033-R2 the greeting is exactly Vad vill du?!`; browser tests `TRIP-033-R1 R2 …` (greeting text) and `TRIP-032-R7 a new session …` (greeting after the connecting view, not in the request) | local | Pass | 2026-11-04 |
| TRIP-033-R3 | Unit tests `TRIP-033-R3 the Voice section …` and `TRIP-017-R1 building the prompt twice gives the same text`. The tone of a handful of first answers on the preview: **not checked** | local; preview **not checked** | Unit pass; manual **not checked** | 2026-11-04 |
| TRIP-033-R4 | Unit tests `TRIP-033-R4 …` in `lib/chat-rules.test.ts` (cut at the last whole bullet with its sub-bullet, at the last whole word, no half link), `lib/chat.test.ts` (cut, logged, `max_tokens` 1000, an answer not cut is unchanged) and `lib/markdown.test.ts` (half link never shown); browser tests `TRIP-033-R4 an answer that stopped at the token limit …` (fake client, via the route) and `TRIP-033-R4 R5 R7 …` (half link in an answer). **Not done:** reproducing the cut on the preview and reading `stop_reason` from the log (the card asks for it before the code), and the list of several destinations by hand | local; preview **not checked** | Pass; manual **not checked** | 2026-11-04 |
| TRIP-033-R5 | Unit test `TRIP-033-R5 R7 the format rules …` (the rule "on every page and in every answer"); browser test `TRIP-033-R4 R5 R7 …` (a link in an answer on the start page works). The model following the rule on the start page and on a charter page: **not checked** | local; preview **not checked** | Pass; manual **not checked** | 2026-11-04 |
| TRIP-033-R6 | `tests/TECH-018-design.spec.ts` and `TRIP-032-R4 R5 the panel pushes the page aside …` (416 px at a 1 280 px window: 26 rem; page not covered, no sideways scroll). Window just above `lg` and the width by eye: **not checked** | local | Pass; by eye **not checked** | 2026-11-04 |
| TRIP-033-R7 | Unit test `TRIP-033-R5 R7 the format rules …`; browser test `TRIP-033-R4 R5 R7 …` (two bullets with links, one sub-bullet each). Real answers on the preview: **not checked** | local; preview **not checked** | Pass; manual **not checked** | 2026-11-04 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `lib/chat-rules.test.ts`, `lib/chat.test.ts`, `lib/chat-prompt.test.ts`, `lib/markdown.test.ts` (6 new) | local | Pass | 2026-11-04 |
| Browser tests | `tests/TRIP-033-agneta-polish.spec.ts` (3 tests), the tests of TRIP-032 adjusted to the greeting and the panel width, `tests/TECH-018-design.spec.ts` for the looks | local | Pass | 2026-11-04 |
| Smoke test | The existing `TRIP-032-R4 @smoke` and `TRIP-017-R7 @smoke` pass; no question is sent | local; preview and live **not checked** | Pass locally | 2026-11-04 |
| Accessibility | axe on the header, greeting and dialog in the tests above; the checklist in `wiki/system/accessibility.md` on the live site: **not done** | local; live **not checked** | Axe pass; checklist **not done** | 2026-11-04 |
| Security | The link rule is unchanged (`/charter/[a-z0-9-]+` only; the half-link removal only deletes text); the route is unchanged except the accepted answer length (6 000); `/security-review` not needed, as the card says | local | Pass | 2026-11-04 |
| Real model by hand | R3, R4, R5, R7 on the preview, start page and a charter page | preview | **Not checked** | – |
| Code review | [review.md](review.md) | local | See the file | 2026-11-04 |

## Test suite

`npm run test:time`. Before is the record of TRIP-032.

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 264 unit, 193 browser | 1.8 s + 144.2 s | 2.8 s |
| After | 270 unit, 196 browser | 1.8 s + 143.8 s | 2.8 s |

One run showed `TRIP-023-R4 and R6 and R9 …` in `tests/TECH-018-design.spec.ts` failing once on a contrast check of `.bg-accent-soft` (not a chat element); it passed in the next two runs and alone. The first run of the new fake-client test hit the chat rate limit shared with other tests (10 questions in 5 minutes per address); it now has an address of its own (`x-forwarded-for`), as `TECH-025-rate-limit.spec.ts` does.

## Definition of Done

- [x] Tests: every check in the card's test plan that can run locally is done; `npm run test:unit` and `npm run test:local` pass
- [x] Test suite: within the time budgets, total time not grown, new tests follow the quality rules
- [ ] Deployed, and the smoke tests pass against production (Live tests)
- [ ] Accessibility: axe passes; the manual checklist on the live site is not done
- [x] Requirements in the card match what was built (copied below); `solution.md` describes how it was built
- [x] Manual, system docs and `wiki/log.md` updated
- [x] No leftovers: `GREETINGS`, `GREETING_QUESTION` and `pickGreeting` removed with their test
- [x] Clean code: `npm run lint` and `npm run typecheck` pass; the production build is made by `npm run test:time`
- [x] Code review done; see [review.md](review.md)
- [x] Technical tasks: none added

## Requirements as built

Copied from the card (#122). The panel width is the start value; it was **not** tuned by eye (no change to the requirement either way).

### TRIP-033-R1 Customer-service header

The chat header shall show, under "Agneta Spydenius", the text "Kundtjänstmedarbetare" and a green dot with "Live". This replaces "nothing else about her" in TRIP-032-R3.

Acceptance criteria:

- **Given** the open chat (panel and dialog), **when** it is shown, **then** the header has the name, "Kundtjänstmedarbetare" and a green dot with the word "Live" (always shown).
- **Given** the header, **when** it is checked with axe and for contrast (dot and texts, both themes), **then** there are no violations, and the dot is not the only carrier of the meaning (the word is there).

### TRIP-033-R2 Short greeting

The greeting shall be the single line "Vad vill du?!". The list of opening lines is removed. It is still not an API call, not sent with the questions, and saved with the conversation (TRIP-032-R7).

Acceptance criteria:

- **Given** a new session, **when** the connecting view is done, **then** the greeting is "Vad vill du?!".
- **Given** the question sent after the greeting, **when** the request is made, **then** the greeting is not in the messages sent.

### TRIP-033-R3 Spydigheten from the first answer

Agneta's first answer shall have the same dry tone as later ones, at most one trait per answer as in TRIP-032-R1. Facts, prices and refusals are unchanged.

Acceptance criteria:

- **Given** the system prompt, **when** it is built, **then** the Voice section says that the first answer has the tone too, and the prompt is still identical on every call.
- **Given** a handful of first questions on the preview (checked by hand, recorded in `verification.md`), **when** Agneta answers, **then** the tone is there and no answer starts by repeating the question.

### TRIP-033-R4 Whole answers

An answer shall never end in the middle of a sentence, a name or a link. `MAX_TOKENS` in `lib/chat.ts` is raised from 600 to 1000. If the model still stops at the limit (`stop_reason: "max_tokens"`), the answer is cut at the last whole paragraph or bullet (with its sub-bullet) and shown, and the event is logged with the usage line. A link that is not whole is never shown as raw text.

Acceptance criteria:

- **Given** an answer that stopped at the token limit, **when** it is shown, **then** it ends at a whole paragraph or bullet, with no half link and no cut name.
- **Given** an answer that stopped at the limit with no whole paragraph at all, **when** it is shown, **then** it is cut at the last whole word and has no half link.
- **Given** a question about several destinations on the start page, **when** Agneta answers (by hand on the preview), **then** the list is whole.
- **Given** the cause is not yet known, **when** the work starts, **then** the cut on the start page is first reproduced on the preview and `stop_reason` read from the log (a cut at about 50 tokens would mean the limit is not the whole cause, and the card is updated before the code).

### TRIP-033-R5 Link on the start page

When Agneta names a destination on the start page, the answer shall link to its page (`/charter/<id>`) as on the charter pages, and the link shall be rendered by the reader of TRIP-032-R2.

Acceptance criteria:

- **Given** a question on the start page that names a destination, **when** the answer is shown, **then** the destination is a working link inside the site.
- **Given** the same question on a charter page, **when** the answer is shown, **then** it is the same.

### TRIP-033-R6 Wider panel

The desktop panel shall be wider than in TRIP-032-R4, so that answers take less height. The page is still pushed aside, not covered, and nothing scrolls sideways. The dialog on small screens is unchanged.

Acceptance criteria:

- **Given** a desktop window, **when** the chat is open, **then** the panel is `clamp(26rem, 25vw, 36rem)` wide (before: 22 to 28 rem), a start value that may be tuned by eye during the build without changing the requirement, the page is narrower and not covered, and nothing scrolls sideways.
- **Given** a window just above the `lg` breakpoint, **when** the chat is open, **then** the page content is still usable beside it.

### TRIP-033-R7 A clear list of destinations

When Agneta gives several destinations, the answer shall be a list that makes clear which they are and what they cost, not running text. Each destination is one bullet with exactly one sub-bullet:

- **Bullet:** the destination's name as a link (`/charter/<id>`), then a short summary.
  - **Sub-bullet:** the airport and the price "från" per person.

This narrows the sub-bullets of TRIP-032-R2 (several facts) to one sub-bullet with airport and price. The reader is unchanged.

Acceptance criteria:

- **Given** the system prompt, **when** it is built, **then** the format rules say: one bullet per destination with the name as a link and a short summary, and one sub-bullet with the airport and the price from per person; and the prompt is identical on every call.
- **Given** a question that lists several destinations (by hand on the preview, start page and charter), **when** Agneta answers, **then** every destination has a bullet with a working link and a summary, and a sub-bullet with airport and price from per person, and the list has as many items as she says (no list that stops after the first).

## Notes

- **After the merge (live):** a question on the live site gave a cut answer ending in "…under 4 000 kr:"; the log showed `output_tokens: 1000` with `thinking_tokens: 902`. PR #124 turned thinking off and broke every answer on live (502). The next fix raises `MAX_TOKENS` to 3000 and keeps the thinking; the unit test of the request covers it. Whether a live answer is now whole: **not checked**.

- **The cause of the cut answers is not confirmed.** The card says to reproduce the cut on the preview and read `stop_reason` before changing the code; the build session had no preview and sent no question to the real model. The limit is raised to 1 000 and a cut is handled and logged ("chat cut at the token limit" with the usage). If the preview shows a cut at about 50 tokens, the limit is not the cause and the card must be updated.
- **Not checked:** the tone, the list format and the links with the real model (R3, R4, R5, R7), the panel width by eye and just above `lg` (R6), the accessibility checklist and the live smoke tests.
