---
id: TRIP-032
title: Agneta improvements
card: "#119"
depends_on: [TRIP-017]
---

# TRIP-032 Agneta improvements: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 119`. The card and this folder were named when the character had another working name; she is **Agneta Spydenius** (visible name "Agneta", full name in the header), so every text, test and file in the code says Agneta.

## Data

None. The conversation lives in the visitor's `sessionStorage` (key `agneta-chat`); nothing is stored on the server.

## Interface

- **Button** "Fråga Agneta" with her portrait (`public/agneta.webp`, 128 px, cropped square on the face from the course's AI-generated original, shown in a round frame by `AgnetaAvatar.tsx`).
- **Panel** (from `lg`, 64 rem): `section` named "Agneta", `fixed` on the right, `h-dvh`, `w-(--agneta-panel-width)` (a variable in `app/globals.css`, `clamp(22rem, 20vw, 28rem)`, also used for the margin), not modal. While it is open `Chat.tsx` sets `data-agneta-panel` on `<html>` and `app/globals.css` gives `body` the same right margin, so header, page and footer are pushed together. Below `lg` the same content is in `Dialog` (`wide`), which got an optional `header` render prop for the avatar row.
- **Header** (`ChatHeader` in `ChatBody.tsx`): avatar (empty alt), "Agneta Spydenius", "Minimera chatten" (hides, keeps the conversation) and "Stäng chatten" (asks, then clears). While connecting only the buttons show; the name is then a screen-reader-only "Agneta" so the box has a name.
- **Bubbles** (`Bubble`): the visitor's right in the accent colour with white text, Agneta's left in `surface-sunk` with a border, a squared corner towards the sender. `Answer.tsx` shows her answers.
- **Connecting view**: `role="status"`, "Kopplar in Agneta …", a spinner that stops under `prefers-reduced-motion` (`motion-reduce:animate-none`); 2 to 3 seconds (`setTimeout` of 2 000 + random 1 000 ms), then the greeting.
- **Texts** (Swedish): `GREETINGS` and "Hur kan jag hjälpa dig då?" in `lib/chat-rules.ts` (`pickGreeting`).
- **System prompt** (`lib/chat-prompt.ts`): the Voice section is rewritten (no repeating the question, milder, one trait at most), a Format rule is added, and every destination has a `Page: /charter/<id>` line.
- **Reader** (`lib/markdown.ts`): `parseInline` also makes `[text](/charter/<id>)` a link (only that pattern); `parseAnswer` adds sub-bullets (an indented line).

## Decisions

- **State in a tiny external store.** `useSavedChat.ts` reads `sessionStorage` with `useSyncExternalStore` and writes through `updateChat()`, which notifies listeners. This avoids a "load in an effect, then save in another effect" pair and the flash of an empty chat, and a late answer still lands in the saved conversation if the visitor already went to another page. `parseSaved` (`lib/chat-saved.ts`) is the one place that validates what comes back and keeps only known fields. If `sessionStorage` is blocked, a variable in memory keeps the chat working for the page.
- **The greeting is the first entry**, so "has the chat been opened before" is simply "are there entries". `lastMessages` already drops a leading answer, so the greeting is never sent and the route needed no change.
- **`fixed` panel with a margin on `body` instead of a layout wrapper.** The page header sits in the root layout, outside each page, so a flex wrapper in the pages would leave the header covered or the panel cut off. A fixed panel plus one CSS rule pushes everything. The card says "sticky"; a fixed full-height panel behaves the same for the visitor.
- **Minimise keeps the chat, Close clears it.** Minimise (and Escape) only sets `open` to false, so the chat is the button and the conversation stays. Close first asks "Är du säker?" (a second `Dialog`, like the abort question in `AbortFlow.tsx`); "Ja, stäng och rensa" saves an empty chat, so the next opening has the connecting view and a new greeting. A question still waiting when the chat is cleared is forgotten: `clearChat()` bumps `chatEpoch`, and `ChatBody` writes an answer, a failure notice or the end of the waiting only if the epoch is the one the question was sent in, so nothing lands in the new chat. This came from the product owner after the card was specified; the card was updated to match.
- **Tail on the bubbles** is a squared corner towards the sender, not iMessage's curved tail drawn with pseudo-elements.
- **The panel is a `section` with `aria-label="Agneta"`** (a region) and no focus trap; the dialog keeps the trap and `Escape` handling of `Dialog`.
- **Tests start with the greeting made** (`agnetaGreeted` in `tests/helpers.ts`), except the tests of the connecting view, which use Playwright's fake clock instead of a shorter delay in the code.
