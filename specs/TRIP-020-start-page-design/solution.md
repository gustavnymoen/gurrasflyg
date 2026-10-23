---
id: TRIP-020
title: "Visual design: start page"
card: "#29"
depends_on: [TRIP-001, TRIP-006, TRIP-008]
---

# TRIP-020 Visual design: start page: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 29`.

## Data

None. The photo is a new file, `public/brand/skymning.jpg`: the design board's `skymning.jpg` resized to 1600 px wide at JPEG quality 60 (`sips`), 254 kB.

## Interface

- `app/components/Wordmark.tsx` (new, R1): the plane in a brass ring and "Gurras Flyg", a `Link` to `/`. The take-off and the contrail are `motion-safe:animate-takeoff` and `motion-safe:animate-trail`; the hop is `motion-safe:group-hover:animate-hop` on a wrapper around the plane. A client component: when the take-off has ended (`onAnimationEnd`), its classes are removed.
- `app/layout.tsx` (R1, R3): a `<header>` with `Wordmark` before every page; `body` is `relative isolate`, so the start page's photo can sit behind the header (`-z-10`) and still in front of the page background. The footer shows `PhotoCredit`.
- `app/components/PhotoCredit.tsx` (new, R3): "Foto: Bill Abbott, CC BY-SA 2.0, via Wikimedia Commons" with the two links, only when `usePathname()` is `/`.
- `app/page.tsx` (R2, R3): `HeroPhoto` (a `next/image` with `fill`, `sizes="100vw"`, `fetchPriority="high"`, `loading="eager"`, `alt=""`, and a shade over it), the `h1`, the text, `SearchForm` and the reviews. The old heading with `PlaneIcon` is gone.
- `app/globals.css`:
  - `--animate-takeoff`, `--animate-trail`, `--animate-hop` and their keyframes in `@theme` (R1).
  - `@utility photo-shade` and `photo-shade-wide`: gradients of the ground colour over the photo (R3).
  - A `prefers-reduced-motion: reduce` rule in `@layer base`: no animations, transitions only for colours and opacity (R5).
- `app/components/ReviewCarousel.tsx` (R4): cards 15 × 12 rem (`w-60 h-48`), all with the card shadow, the focused one with the accent border; body text clamped to 4 lines; arrows on the edges at ±7.5 rem; the carousel 13 rem high. `motion-reduce:transition-none` is removed, since the global rule covers it. *Changed by TRIP-021-R4 (2026-10-23): the card is 12 rem high as before but grows when its text needs it (`min-h-48`, `self-start` in a grid instead of absolute positioning), `line-clamp` is removed and the padding is `py-3.5`; reviews have at most 20/25/145 characters.*
- `app/components/SearchForm.tsx` (R6): the form is a two-column grid on phones (Från and Till span both columns, Datum and Resenärer side by side) and a row from `md`.
- `tests/TRIP-001-flight-search-form.spec.ts`: TRIP-001-R1 checks the new heading and text (R2). `specs/TRIP-001-flight-search-form/spec.md` notes the change under R1.
- `tests/TRIP-008-visual-design.spec.ts`: TRIP-008-R9 tabs to the wordmark first, then to Från (R7).
- `tests/helpers.ts`: `BRASS`.
- `DESIGN.md`: `Wordmark`, the animation tokens, the photo and its shade, reduced motion.

New texts for visitors:

| Where | Text |
|---|---|
| Start page heading | Vi ordnar det ingen annan kan |
| Under the heading | Ditt livs flygresa, till städer och till platser andra flygbolag glömt bort. |
| Footer of the start page | Foto: Bill Abbott, CC BY-SA 2.0, via Wikimedia Commons |

## Decisions

- **The take-off is removed after it has played.** Chromium keeps a finished CSS animation in `document.getAnimations()` for as long as the class is there, even with `animation-fill-mode: backwards`. The TRIP-006 test waits until the page has no animations before it clicks a card, so the wordmark made it wait forever. Removing the class when the animation ends lets the page stand still, and keeps the TRIP-006 tests unchanged.
- **Take-off and hop on different elements.** On the same element, hovering replaces the take-off animation, and leaving the wordmark would play the take-off again. The hop is on a wrapper around the plane.
- **The plane is rotated inside the SVG** (`transform` on the `<path>`), not with CSS, because the take-off's keyframes animate the SVG's `transform` and end at `none`.
- **The credit is in the shared footer, shown only on `/`.** The footer is in the layout; a small client component with `usePathname()` is simpler than a footer per page.
- **Two shade utilities, chosen with a breakpoint in the page.** `photo-shade` evenly darkens the photo; `lg:photo-shade-wide` darkens towards the text on the left. The breakpoint is then visible where the shade is used, like any other responsive class. With the shade towards the left from `md` (768 px), the text under the heading reached only 4.2:1 against the lightest pixel behind it, since at that width the text reaches far into the brighter part; from `lg` (1024 px) it is at least 5.1:1.
- **One global rule for reduced motion** instead of `motion-reduce:` on each element: new motion is covered without anyone remembering it.
- **The arbitrary sizes** (`text-[22px]`, `max-w-165` and so on) come from the design board; they are sizes, not colours, so TRIP-008-R1 allows them.
