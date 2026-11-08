---
id: TRIP-037
title: Booking agent for finding and cancelling a booking
card: "#129"
depends_on: [TRIP-030, TRIP-036, TRIP-023, TECH-026]
---

# TRIP-037 Booking agent for finding and cancelling a booking: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 129`. It builds on the agent of TRIP-030 (`specs/TRIP-030-booking-agent/solution.md`) and TRIP-036; this page only says what is new.

## Data

None. No table or migration. The booking is never read on the server for the chat: it lives in the page's state (`MyBooking`, TRIP-023) and the chat gets a stripped extract of it.

## Interface

- **The chat on Min bokning** (`app/min-bokning/layout.tsx`): `<Chat />` in a layout for `/min-bokning`, as for `/charter` and `/flyg`. The saved chat is the same, so the conversation and the mode follow the visitor.
- **`POST /api/chat`**: the agent context gets one optional field, `booking` (the extract below), accepted only when the page is `/min-bokning` and checked by `parseExtract`; anything else is a 400, like a wrongly shaped context. Nothing of it is logged.
- **New tools** (`lib/agent-tools.ts`): `show_my_booking` (opens `/min-bokning`; nothing if the visitor is already there) and `tick_cancellation` (`ids`: the parts to tick, replacing the boxes ticked now). There is no tool that looks a booking up or cancels one, and none takes a number or a name.
- **New action** `{ type: "tick", ids }` (`lib/agent-rules.ts`): the chat carries it out by asking the page to tick; `isAgentUrl` accepts `/min-bokning`.
- **The page** (`BookingView.tsx`): registers the extract and a `tick` function in a small module (`app/min-bokning/bookingBridge.ts`) while a booking is shown, and has a screen-reader-only `role="status"` that says "Agneta kryssade: …" (or "Agneta tog bort alla kryss.") when she ticked. Focus is not moved.
- **Texts** (Swedish, from the page and the chat): the lottery text `LOTTERY_TEXT` in `lib/cancel-rules.ts`, shown by `CancelPanel` and followed by Agneta; the note under the chat field says "Namn, bokningsnummer och kontaktuppgifter fyller du i på sidan, aldrig här."

## Code

| File | What |
|---|---|
| `lib/cancel-extract.ts` | `bookingExtract()` (booking + ticked ids to the extract), `parseExtract()`, `extractText()` (what the model reads), `allParts()`, `whyNot()`. |
| `lib/cancel-rules.ts` | `LOTTERY_TEXT`, `tickableIds()` (what can be ticked: also used by the page). |
| `lib/agent-rules.ts` | `AgentContext.booking`, the `tick` action in `safeActions`, `isMyBookingUrl()`. |
| `lib/agent-page.ts` | `PageInfo` kind `booking`: the `<page>` block says whether a booking is found and lists its parts. |
| `lib/agent-tools.ts` | `show_my_booking`, `tick_cancellation`, `AgentState.booking`. |
| `lib/agent.ts` | `MY_BOOKING_RULES`: the system block for Min bokning (built from `LOTTERY_TEXT` and `CANCEL_HOURS`). |
| `app/components/chatAgent.ts` | `readContext()` has the extract on Min bokning; `applyActions()` carries out `tick`. |
| `lib/chat-mock.ts` | The fake agent: `MINBOKNING`, `KRYSSA del=…`, `UPPGIFTER`. |

## Decisions

- **The model never gets a way to look up or cancel.** The booking can only be found by number and last name, and a guess must give the same answer as nothing (TECH-026). So the number and name are typed into the page's fields by the visitor and the lookup stays `lookUpAction`; the tools can only open the page and tick boxes. Cancelling stays `cancelAction` behind the page's own **Avboka** and **Ja, avboka**: no marker, tool or action leads to it, and `[[BOOK]]` is never honoured on this page (`canBook` accepts only the trip and flight payment pages).
- **The extract comes from the page and is rebuilt for each question.** `bookingExtract()` runs in the browser on the booking in the page's state: groups (a flight each, or the whole charter trip) with route, date, departure, "too late", and parts with an id, a label ("Resenär 2, Ekonomi"), the amount and whether it is cancelled, plus the ids ticked now. It has no field for a name, contact, number, payment or address, so it cannot carry one (a unit test searches the JSON and the text for them, another searches the whole request and the log). The ids are the database ids of the seats and travellers that the page's checkboxes use already; they say nothing about a person.
- **The server trusts the extract only for what it is.** It cannot check it against a booking (it never has one), so `tick_cancellation` works on the extract it was sent, and the browser checks again: the page's `tick` keeps only ids in `tickableIds(booking)` (not cancelled, flight not too late), so a made-up or tampered extract can at most tick boxes the visitor could tick by hand.
- **Ticking replaces.** The tool takes the whole set to tick, like the boxes, and "ticks exactly those parts". The visitor's own ticks are in the `<page>` block, so she can keep them. If nothing asked for can be ticked, no action is sent and the visitor's boxes are not touched.
- **Same "page changed" rule as before.** The extract is part of `readContext()`, which includes the ticks, so if the visitor ticks or unticks while she is answering, `sameContext` fails and the actions are dropped with the usual line.
- **A bridge module, not context or props.** The chat sits in a layout and the booking in the page below it, so they cannot share state through React. `bookingBridge.ts` is a module variable that `BookingView` sets in an effect and clears on unmount; `readContext()` and `applyActions()` read it. It is used only in the browser.
- **The rules in one place.** `LOTTERY_TEXT` is the paragraph above the page's button, and `MY_BOOKING_RULES` interpolates it, `CANCEL_HOURS` and the no-undo rule; `wiki/manual/min-bokning.md` says the same in Swedish.
- **Tried by hand with the real model:** see `verification.md`.
