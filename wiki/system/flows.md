---
type: Guide
title: Flows
description: How the start page separates flight booking and charter, why a traveller in one cannot reach the other, and how Avbryt throws away the booking.
resource: app/components/AbortFlow.tsx
feature: TRIP-018
tags: [start page, tabs, charter, flow, dialog, sessionStorage]
timestamp: 2026-10-26
---

# Flows

Flight booking and charter share the site but are two separate **flows**. The start page is where the traveller picks one; after that the other is out of reach until the traveller leaves on purpose. Requirements: [`specs/TRIP-018-start-tabs/`](../../specs/TRIP-018-start-tabs/solution.md).

## The start page

`app/page.tsx` shows `Tabs` (`app/components/Tabs.tsx`) above the search: **Flyg** (selected, `SearchForm`) and **Charter** (a short text and the link **Utforska charterresor** to `/charter`). The tabs follow the WAI-ARIA tabs pattern: `role="tablist"`, `aria-selected`, only the selected tab in the tab order, arrow keys, Home and End move and select. Both panels are in the page and the hidden one has `hidden`, so a half-filled search form survives a visit to Charter.

## What is a flow

`isInFlow(pathname)` in `lib/flow.ts`: `/flyg` and everything below it except `/flyg/bokad`, and `/charter` and everything below it except `/charter/bokad`. `/flyg/bokad` and `/charter/bokad` are the summaries of a finished booking; there the wordmark is an ordinary link and there is no Avbryt.

In a flow there is no link or tab to the other area, and no link to the start page either (the start page has the tabs). The only ways out are Avbryt and, in the footer, Admin. A visitor who types the other address by hand, or uses the browser's back button, is not blocked (out of scope).

## Avbryt

`app/components/AbortFlow.tsx` has two client components, both reading `usePathname()` and using `isInFlow`:

- `AbortButton`, in the header (`app/layout.tsx`): the **Avbryt** button, rendered only in a flow.
- `StartLink`, used by the wordmark and the footer's Start: a link to `/` outside a flow, a button inside one.

Both open the same question, `AbortDialog`, built on the shared `Dialog` (`role="dialog"`, heading "Är du säker?", "Det du har valt kastas bort."):

- **Ja, avbryt:** `clearBooking()` (`app/flyg/boka/store.ts`) removes `gurrasflyg-bokning`, `gurrasflyg-bokad`, `gurrasflyg-charter` and `gurrasflyg-charter-bokad` from `sessionStorage`, the question closes, and the traveller goes to `abortTarget(pathname)` (`lib/flow.ts`): `/charter` from the charter pages after the search (`/charter/<id>/resor`, `/boka` and `/boka/betala`, TRIP-014-R10), otherwise `/`. The wordmark and the footer's Start (`StartLink`) always go to `/`.
- **Nej, fortsätt** (focused first), Escape or a click outside: the question closes and nothing else changes.

## The dialog

`Dialog` (`app/components/Dialog.tsx`) is the browser's `<dialog>` with `showModal()`, so the page behind cannot be reached and Escape closes it. The component adds `aria-modal`, Tab that cycles between its buttons (the browser would otherwise let focus leave for its own controls), a click outside that closes it, and returns focus to the control that opened it. The admin's delete questions use the same component with `role="alertdialog"`.

## Tests

`tests/TRIP-018-start-tabs.spec.ts` (browser) and `lib/flow.test.ts` (unit).

[System documentation](index.md)
