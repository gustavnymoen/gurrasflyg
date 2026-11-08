---
id: TRIP-035
title: UX upgrades for Agneta
card: "#127"
depends_on: [TRIP-017, TRIP-032, TRIP-033, TRIP-044]
---

# TRIP-035 UX upgrades for Agneta: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 127`.

## Data

None.

## Interface

- **One scrollbar in the seam (R1).** `app/globals.css`: with the panel open on wide screens (`html[data-agneta-panel]`) the window itself does not scroll (`overflow: hidden` on `html`); `body` is `100dvh` high with `overflow-y: auto` and keeps its right margin. So the page's scrollbar ends up in the seam beside the panel and only the chat's own bar is at the window's right edge.
- **Full-width bubble (R2).** `Bubble` in `ChatBody.tsx`: the visitor's keeps `max-w-[85%]`, Agneta's is `max-w-full`.
- **Bigger picture (R3).** `ChatHeader` in `ChatBody.tsx`: the portrait is a `<button>` ("Förstora bilden på Agneta", `aria-expanded`) that is 64 px, and 128 px when open or hovered with a mouse (`@media (hover: hover)`). Open state lives in the header; while it is open a capturing `keydown` listener on the document makes Escape close the picture only (it never reaches the panel's or dialog's Escape), and a `pointerdown` outside closes it.
- **Surname (R4).** The header `h2` is "Agneta Karenelius"; everything else, including the prompt, says "Agneta". The dialog's accessible name comes from that `h2`.
- **Tone (R5).** The `# Voice` section of `lib/chat-prompt.ts`.
- **Folded lists (R6).** `foldList` in `lib/markdown.ts` is the one place that decides what is shown (first 3 items, sub-bullets travel with their item). `List` in `Answer.tsx` renders it and a "Visa mer"/"Visa mindre" button with `aria-expanded`; folded items are not rendered, so they are not in the accessibility tree. `Answer` takes `whole`: an answer the model ended with `[[ALL]]` is never folded. `takeMarkers` (`lib/agent-rules.ts`) removes `[[ALL]]` like `[[HELP]]` and reports `all`; `askAgneta`, `askAgent` and the route pass `all` on, the chat stores it on the entry (`Entry.all`, kept by `parseSaved`).

## Decisions

- **Body as the scroller (R1).** The window's scrollbar is always at the window edge and a fixed panel cannot sit to its right, so the page gets its own scrolling box instead. The cost: `window.scrollTo` and the browser's scroll restoration no longer act on the page while the panel is open. The site does not call `window.scrollTo` itself, anchor links and Next's scroll to the top of a new page use `scrollIntoView` and were checked (browser test). Scroll restoration on Back is checked by hand.
- **The fold is only in the browser.** The model writes the whole list in order of fit, so no second call is needed; "finns det fler?" gets the whole list again plus `[[ALL]]`, since the first answer is already in the history.
- **Several lists** in one answer are each folded on their own.
- **Escape on a capturing listener** rather than a handler on the button, since focus may have moved after the picture was opened by hover-free means.
- **Tone cannot be tested with the mock.** The prompt text is unit tested; the tone itself is a manual check with the real model.
