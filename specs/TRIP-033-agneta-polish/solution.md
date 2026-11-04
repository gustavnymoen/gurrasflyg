---
id: TRIP-033
title: Agneta polish
card: "#122"
depends_on: [TRIP-017, TRIP-032]
---

# TRIP-033 Agneta polish: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 122`. It follows up the live test of [TRIP-032](../TRIP-032-karen-improvements/solution.md).

## Data

None.

## Interface

- **Header** (`ChatHeader` in `ChatBody.tsx`, R1): under "Agneta Spydenius" the text "Kundtjänstmedarbetare" and a row with a green dot (`bg-success`, `aria-hidden`, `data-testid="agneta-live-dot"`) and the word "Live". The dot only decorates; the word carries the meaning. While connecting only the buttons show, as before.
- **Greeting** (R2): `GREETING = "Vad vill du?!"` in `lib/chat-rules.ts` replaces `GREETINGS`, `GREETING_QUESTION` and `pickGreeting`. It is still the first saved entry and never sent.
- **System prompt** (`lib/chat-prompt.ts`, R3, R5, R7): the Voice section says the tone is there from the first answer; the Format rule says to link every destination named "on every page and in every answer"; a new rule says one bullet per destination (name as a link and a short summary) with exactly one sub-bullet (airport and price "from" per person), never a list that stops after the first.
- **Whole answers** (R4): `MAX_TOKENS` is 1000 (`lib/chat.ts`). On `stop_reason: "max_tokens"` `askAgneta` logs "chat cut at the token limit" with the usage and returns `cutToWhole(text)` (`lib/chat-rules.ts`). `parseInline` also removes a half link at the end of a text (`HALF_LINK`), so a saved or odd answer never shows `[Name](/charter/ab` as text. `MAX_ANSWER_LENGTH` (what the route accepts back from the history) is 6 000 characters, enough for 1 000 tokens.
- **Panel** (R6): `--agneta-panel-width` is `clamp(26rem, 25vw, 36rem)` in `app/globals.css`.
- **Fake client** (`LLM_MOCK=1`): a question with `KAPAD` gets a list that stops in a link, with `stop_reason: "max_tokens"`, so the cut is testable.

## Decisions

- **Cutting is by lines, not by tokens.** The format makes every bullet and sub-bullet one line, so the last line of an answer that hit the limit is the cut one and is dropped; if it was a sub-bullet its bullet goes too (bullet and sub-bullet belong together). With no whole line left the text is cut at the last whole word. No "…" is added: the answer simply ends earlier. `cutToWhole` is shared code in `lib/chat-rules.ts` with `HALF_LINK`, which lives in `lib/markdown.ts` (the reader) and is imported by the chat rules. It does not run across lines.
- **The cause of the cut answers is not confirmed.** The card asks to reproduce the cut on the preview and read `stop_reason` before the code. This was not possible in the build session (no preview, and no question was sent to the real model, to spare the shared cap); the limit is raised and the cut is handled, and the log line now carries the `stop_reason`-based event so the preview run can settle it. Recorded in `verification.md` as not checked.
- **R5 is a prompt change.** The model gets the same prompt on every page, so there is nothing to switch per page; the rule is stated harder ("on every page and in every answer").
