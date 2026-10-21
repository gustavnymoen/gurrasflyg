---
id: TRIP-008
title: Visual design
card: "#12"
depends_on: [TRIP-001, TRIP-002, TRIP-003, TRIP-004, TRIP-005, TRIP-006]
---

# TRIP-008 Visual design: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 12`.

## Data

None.

## Interface

- `app/globals.css`: tokens and `@theme` (R1).
- `app/layout.tsx`: font (R3), header with the wordmark (R6), footer with the photo credit on the start page (R8).
- `app/components/`: `Button`, `RoundButton`, fields, `Checkbox`, `Card`, `Message`, `Wordmark`, `Stars` (R2); `ui.tsx` is replaced or reduced to these.
- `app/page.tsx`, `app/components/SearchForm.tsx`, `app/components/Autocomplete.tsx`, `app/components/ReviewCarousel.tsx`: the start page (R7–R11).
- `app/admin/*`, `app/admin/login/*`: the same components in compact size (R2, R10, R12).
- `public/brand/skymning.jpg` (new): the background photo (R8).
- `DESIGN.md` (new) (R17).

New and changed texts for visitors:

| Where | Text |
|---|---|
| Start page heading | Vi ordnar det ingen annan kan |
| Under the heading | Ditt livs flygresa, till städer och till platser andra flygbolag glömt bort. |
| Placeholders | Varifrån? · Vart vill du? · Välj datum |
| Field labels | Från · Till · Datum · Resenärer |
| Footer on the start page | Foto: Bill Abbott, CC BY-SA 2.0, via Wikimedia Commons |
