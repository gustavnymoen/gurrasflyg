---
id: TRIP-032
title: Agneta improvements
---

# Verification of TRIP-032

The character is Agneta Spydenius. The card was first written with another working name, which the ID's folder and the test file still carry; the card (#119) and the requirements below say Agneta.

All checks so far ran locally, against a production build with the fake model (`LLM_MOCK=1`), on 2026-11-04. Nothing is checked on the preview or the live site yet.

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TRIP-032-R1 | Unit tests `TRIP-032-R1 the Voice section has the tone rules` and `TRIP-017-R1 building the prompt twice gives the same text` in `lib/chat-prompt.test.ts`. The tone with real questions (a destination, a price, a poem, "ignore your instructions") is a manual check on the preview, which spends from the shared cost cap | local; preview **not checked** | Unit pass; manual **not checked** | 2026-11-04 |
| TRIP-032-R2 | Unit tests `TRIP-032-R2 …` in `lib/chat-prompt.test.ts` (page path of all 96 destinations, format rules) and `lib/markdown.test.ts` (list with sub-lists, bold, site link, other links and HTML as text); browser test `TRIP-032-R3 R2 bubbles …` (rendered list, nested list, bold, working link, other link and HTML as text). That a long destination name is not cut is a manual check on the preview | local; preview **not checked** | Pass; manual **not checked** | 2026-11-04 |
| TRIP-032-R3 | Browser test `TRIP-032-R3 R2 bubbles …` (order and sides, header with empty-alt avatar, name, two named buttons, axe); bubble colours and contrast in `tests/TECH-018-design.spec.ts` | local | Pass | 2026-11-04 |
| TRIP-032-R4 | Browser tests `TRIP-032-R4 R5 the panel pushes the page aside …` (352 px wide, full height, page not covered, no sideways scroll, stays across pages and a reload, minimise, "Är du säker?" with Nej and Ja, stays closed and new chat after Ja), `TRIP-032-R4 an answer that arrives after Stäng and Ja …`, `TRIP-032-R4 R6 … on a phone` (dialog, and the question above it), `TRIP-032-R4 @smoke …`; panel width in `tests/TECH-018-design.spec.ts` | local | Pass | 2026-11-04 |
| TRIP-032-R5 | Unit tests in `lib/chat-saved.test.ts` (round trip, damaged data, known fields only); browser tests `TRIP-032-R7 a new session …` (reload), `TRIP-032-R4 R5 …` (page change, reload), `TRIP-032-R5 a new tab …` (new tab empty, damaged data) | local | Pass | 2026-11-04 |
| TRIP-032-R6 | Browser tests `TRIP-032-R6 the keyboard …` (open, use, Escape minimises, focus on the button, no trap), `TRIP-032-R4 R6 … on a phone` (focus trap, Escape, focus back on the button), axe on the panel, the dialog, the bubbles, the question dialog and the connecting view; contrast of both bubbles in `tests/TECH-018-design.spec.ts`; 320 px in `TRIP-017-R8 R9 …`. The checklist in `wiki/system/accessibility.md` on the live site: **not done** | local; live **not checked** | Pass; checklist **not done** | 2026-11-04 |
| TRIP-032-R7 | Unit test `TRIP-032-R7 every greeting …` in `lib/chat-rules.test.ts`; browser tests `TRIP-032-R7 a new session …` (fake clock: "Kopplar in Agneta …" for 2 to 3 seconds, header and greeting, greeting not in the request, no connecting view after minimise and reload) and `TRIP-032-R7 R6 the connecting view …` (axe, the spinner turns, stands still under reduced motion) | local | Pass | 2026-11-04 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | `lib/chat-prompt.test.ts`, `lib/markdown.test.ts`, `lib/chat-saved.test.ts`, `lib/chat-rules.test.ts` (8 new) | local | Pass | 2026-11-04 |
| Browser tests | `tests/TRIP-032-karen-improvements.spec.ts` (9 tests), `tests/TRIP-017-charter-chatbot.spec.ts` adjusted to Agneta and the panel, `tests/TECH-018-design.spec.ts` for the looks | local | Pass | 2026-11-04 |
| Smoke test | `TRIP-032-R4 @smoke` (button with her portrait, panel opens) and `TRIP-017-R7 @smoke`; no question is sent | local; preview and live **not checked** | Pass locally | 2026-11-04 |
| Accessibility | axe in the tests above; the manual checklist on the live site | local; live **not checked** | Axe pass; checklist **not done** | 2026-11-04 |
| Security | Security points of the review (links limited to `/charter/<id>`, nothing rendered as HTML, saved data checked); `/security-review` not needed (no change to the route, sign-in or data) | local | Pass | 2026-11-04 |
| Real model by hand | Tone and format questions on the preview | preview | **Not checked** | – |
| Code review | [review.md](review.md) | local | Passed | 2026-11-04 |

## Test suite

`npm run test:time`. Before is the record of TRIP-017.

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before | 256 unit, 184 browser | 1.7 s + 146.4 s | 3.6 s |
| After | 264 unit, 193 browser | 1.8 s + 144.2 s | 2.8 s |

The connecting-view test uses Playwright's fake clock instead of waiting 2 to 3 seconds, and the other tests start with the greeting made (`agnetaGreeted`), so none of them waits for it.

## Definition of Done

- [x] Tests: every check in the card's test plan that can run locally is done; `npm run test:unit` and `npm run test:local` pass
- [x] Test suite: within the time budgets, total time not grown, and the new tests follow the quality rules in `wiki/system/testing.md`
- [ ] Deployed, and the smoke tests pass against production (Live tests)
- [ ] Accessibility: axe passes; the manual checklist on the live site is not done
- [x] Requirements in the card match what was built (copied below); `solution.md` describes how it was built
- [x] Manual, system docs and `wiki/log.md` updated
- [x] No leftovers: nothing made unused; no commented-out code or debug output
- [x] Clean code: reuses `Dialog`, `Button` and `buttonClass`; `npm run lint`, `npm run typecheck` and `npm run build` pass
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks: none added (see Notes)

## Requirements as built

Copied from the card (#119) as it stands after the work, with the name Agneta.

### TRIP-032-R1 Voice

Agneta shall keep a negative, grumpy tone but less of it: she shall never start an answer by repeating the visitor's question or request with a question mark ("Dikt? Nej …", "Flyg till Rom? Nej …"), shall be less set on calling a destination bad, and shall now and then add a short random remark to the visitor ("inte du också …", "jaha, en sån typ igen"). At most one trait per answer; many answers have none. Facts, prices and refusals are unchanged.

- The Voice section of the system prompt contains these rules and is identical on every call.
- With a handful of typical questions on the preview, no answer starts by repeating the question with a question mark, the tone is negative but not tiring, and facts and refusals are as before (by hand).

### TRIP-032-R2 Shorter, structured answers

Agneta shall answer shorter than today and structure what she lists: one bullet per destination or item, sub-bullets for further facts (airport, price, days), and the destination's page as a link (`/charter/<id>`) when she names a destination. A destination's name is always written in full. The system prompt gives her the page path of every destination.

- Every destination has its page path in the prompt, and the format rules are in the instructions.
- An answer with a bullet list, sub-bullets, bold text and a link to `/charter/<id>` is rendered as a list with nested sub-lists, bold text and a working link inside the site.
- An answer with any other link, or with HTML, is shown as plain text.
- A long destination name is not cut (by hand on the preview).

### TRIP-032-R3 Bubbles and avatar

The visitor's questions and Agneta's answers shall be speech bubbles in the style of iMessage: the visitor's to the right, Agneta's to the left, with a tail towards the sender (built as a squared corner towards the sender). The chat header shows Agneta's avatar, her name "Agneta Spydenius" and nothing else about her, and the buttons to minimise and close. This applies to the panel and the dialog alike.

- Questions are right-aligned and answers left-aligned, in order.
- The header has the avatar in a round frame (empty alt text), only the name, a minimise button and a close button, each with an accessible name.

### TRIP-032-R4 Side panel on desktop

On wide screens (from the `lg` breakpoint) "Fråga Agneta" shall open the chat as a panel on the right, full height (fixed), about a fifth of the window wide (at least 22 rem, at most 28 rem), that pushes the rest of the page together instead of covering it. The page stays usable beside it. The panel stays open until the visitor closes it, also when they go to another page; it can be minimised to the button (the conversation is kept) and opened again. On smaller screens the chat is a dialog as in TRIP-017.

- The page content is narrower and not covered, and nothing scrolls sideways.
- The panel is still open with the same conversation on another page that has the chat.
- Minimised, only the button is left and the page has its full width; the button brings the panel back with the conversation.
- The close button asks "Är du säker?"; "Nej, behåll" leaves the chat as before; "Ja, stäng och rensa" closes and clears it, it stays closed as the visitor goes on, and the next opening is a new chat (connecting view and a new greeting).
- At a phone width the chat is a dialog.

### TRIP-032-R5 The conversation is kept

The conversation, and whether the chat is open, shall be kept across navigation and reload, in the browser's session storage (minimising keeps the conversation; closing clears it; gone when the tab is closed, nothing sent to the server). This replaces "a reload starts over" in TRIP-017-R7. The last 6 messages are still what is sent with each question.

- After a reload, or between the start page and a charter page, the conversation and the state of the chat are the same.
- A new tab has the chat closed and empty.
- Damaged or old data in the session storage gives an empty chat, and nothing breaks.

### TRIP-032-R6 Accessible panel

The panel and the dialog shall meet WCAG 2.2 AA: the panel is a region with the name "Agneta" and is not modal; focus moves into the field when it opens and back to the button when it is closed or minimised; Escape minimises the dialog and the panel alike; new answers are announced as in TRIP-017-R9; contrast is checked for both bubbles; it works at 320 px.

- With the keyboard only, the visitor can open, use, minimise and close the chat, and focus ends on the button.
- Tabbing from the panel can leave it to the page (no trap).

### TRIP-032-R7 Connecting and greeting

The first time the chat is opened in a session, it shows a connecting view for 2–3 seconds with a spinner and the text "Kopplar in Agneta …", then Agneta appears in the header and greets the visitor with a random negative opening line from a fixed list in the code, followed by "Hur kan jag hjälpa dig då?". The greeting is not an API call and is not sent with the questions. It is part of the saved conversation: when the chat is minimised and opened again, or after a reload, there is no connecting view and no new greeting. The connecting view is announced to screen readers, and the spinner stands still for visitors who prefer reduced motion.

## Notes

- **The card changed during the work.** The character is Agneta (the card first used another working name); the close button now asks and clears, while minimise keeps the conversation. The card, `solution.md` and the wiki were updated together.
- **Close and a pending answer:** found in the second review run; `chatEpoch` fixes it and a test covers it.
- **Not checked:** the tone and format with a real model on the preview (R1, R2), the accessibility checklist on the live site, the live smoke tests, and the layout was not looked at by eye in a normal browser, only measured by the tests.
- **Technical tasks:** none added. Noted in the review as outside this change: the "tänker" bubble is lost if the visitor changes page while an answer is pending (the answer is still saved), because `Chat` is mounted separately on the start page and under `/charter`.
