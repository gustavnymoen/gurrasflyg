---
id: TRIP-018
title: Switch between flight booking and charter
card: "#24"
depends_on: [TRIP-020, TRIP-012]
---

# TRIP-018 Switch between flight booking and charter: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 24`.

## Data

None. The booking in progress stays in `sessionStorage` (`gurrasflyg-bokning`, `gurrasflyg-bokad`); `clearBooking()` in `app/flyg/boka/store.ts` removes both keys.

## Interface

- **`Tabs`** (`app/components/Tabs.tsx`): WAI-ARIA tabs. Props: `label` (the tablist's name) and `tabs` (`id`, `label`, `content`). Roving `tabIndex` (only the selected tab is in the tab order), ArrowLeft/ArrowRight (wrapping), Home and End move and select. All panels stay in the page and the hidden ones have `hidden`, so what was typed in the flight form is still there after a visit to Charter.
- **Start page** (`app/page.tsx`): `Tabs` with **Flyg** (`SearchForm`, as before) and **Charter** (a `Card` with a short text and the link **Utforska charterresor** to `/charter`, styled with `buttonClass()`).
- **`/charter`** (`app/charter/page.tsx`): only the heading "Charter" until TRIP-013 and TRIP-014.
- **`Dialog`** (`app/components/Dialog.tsx`): the dialog from `admin-ui.tsx`, moved here to be shared (native `<dialog>` with `showModal()`, Escape and click outside close it, focus returns to the opener). New: a `role` prop (`alertdialog` as before for the admin's delete questions, `dialog` for the abort question), `aria-modal="true"`, and Tab that cycles between the buttons so focus never leaves the dialog for the browser's own controls.
- **`AbortFlow`** (`app/components/AbortFlow.tsx`): `AbortButton` (the **Avbryt** button in the header, shown only in a flow) and `StartLink` (a link to `/` outside a flow, a button that opens the question inside one; used by the wordmark and the footer's Start). Both open `AbortDialog`: "Är du säker?", "Det du har valt kastas bort.", **Ja, avbryt** (`clearBooking()`, then `router.push("/")`) and **Nej, fortsätt** (focused first).
- **`isInFlow(pathname)`** (`lib/flow.ts`): `/flyg` and below (except `/flyg/bokad`) and `/charter` and below.
- **`app/layout.tsx`**: the header holds the wordmark and `AbortButton`; the footer's Start is a `StartLink`. Admin stays a plain link.

## Decisions

- **One Avbryt in the header, not one per page.** The layout is shared, so a single client component that reads `usePathname()` covers every flow page, including the ones TRIP-013 and TRIP-014 will add under `/charter`. The pages themselves did not change.
- **No link from a flow page to the start page at all.** The wordmark and Start are the only ways to `/`, and in a flow they are buttons that ask first. The start page has the tabs, so a link there would be a link to the other area (R2).
- **Dialog moved, not copied.** The admin already had the right dialog; copying it would have made two to keep in step. The tab trap was added there as well, so the admin's dialogs get it too.
- **Tab trap by hand.** A native modal `<dialog>` keeps focus in the document but lets Tab continue into the browser's own controls (the address bar), which the browser tests saw as focus leaving the dialog. The handler cycles between the dialog's buttons instead.
- **The error link too.** `Problem` (the "Adressen saknar något" message) uses `StartLink` for its link to `/`, so even that link asks first inside a flow.
- **`/flyg/bokad` is not a flow.** The booking is complete there, so the wordmark is an ordinary link and there is no Avbryt (out of scope in the card).
- **The question closes before navigating**, so it is not still open the next time the traveller is in a flow (the header's state lives across page changes).
- **Tab styling** follows the buttons: the selected tab has the primary button's tone and border, the others are plain text.
