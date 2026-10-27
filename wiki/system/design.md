---
type: Guide
title: Design
description: How the design "Loungen" is built from tokens and shared components, the rules that keep it consistent and accessible, and where each part is described in DESIGN.md and tested.
resource: DESIGN.md
feature: TRIP-008, TRIP-019, TRIP-020, TRIP-022, TECH-018
tags: [design, tokens, components, colours, contrast, motion, accessibility]
generated:
  by: claude
  at: 2026-10-27T13:15:00+01:00
---

# Design

Gurras Flyg looks like an airline lounge in the evening: dark and calm, wine red for what the visitor does, brass for details, and the humour in the words. The full description is [DESIGN.md](../../DESIGN.md) in the project root, which is the file to change when the design changes. This page says what it contains and how the parts fit, so that nobody has to read all of it to find the right place.

## What DESIGN.md holds

| Section | What it says |
|---|---|
| Tokens | Every colour, font size, radius, shadow and animation, named once in `@theme static` in `app/globals.css`. Tailwind turns each into classes (`--color-surface` gives `bg-surface`). Tailwind's own palette and fonts are removed, so no file writes a colour value. |
| Components | The shared pieces in `app/components/` (`Button`, `RoundButton`, `Field`, `Card`, `ChoiceCard`, `Message`, `Stars`, `Dialog`, `Tabs`, `Menu`, `DatePicker` …) with their variants and when to use each. |
| Admin pieces | The admin page's own pieces in `app/admin/admin-ui.tsx`, built on the components above in compact size. See [Administration](admin.md). |
| The start page photo | The evening photo behind the start page, its credit and how it is darkened for contrast. |
| Rules | When the accent and brass are used, one font, pill buttons, messages as coloured text, contrast, motion and reduced motion. |
| How to change | The steps for changing a colour, the font, a component or a token. |

## How it fits together

- **A value is named once.** A colour, a font or a radius is changed in `app/globals.css` and every page follows. A component is changed in its file and every page that uses it follows. Pages use the shared components instead of styling their own buttons, fields, cards or messages.
- **Accessibility is part of the design.** Text and placeholders have at least 4.5:1 contrast, and borders that show a control and the focus ring at least 3:1. The colours that differ from the original design board differ because the board didn't meet this (TRIP-008-R1). An unavailable `RoundButton` is `aria-disabled`, never `disabled`, so it keeps keyboard focus. See [Accessibility](accessibility.md).
- **Motion has a purpose and can be turned off.** It is short, uses `ease-out` and animates only `transform`, `opacity` and colours. A rule in `globals.css` turns off every animation when the visitor prefers reduced motion.
- **Tailwind only finds whole class names**, so a class is never built from parts (`focus:ring-3`, not `` `${state}:ring-3` ``).

## Where it is checked

The look is checked in `tests/TECH-018-design.spec.ts`, one test per page and state, named after every requirement it checks (colours, contrast, focus rings, shadows, borders, the plane's take-off and the carousel's slide, the menu, the admin page). Changing a colour that gets too faint makes those tests fail. The rule for how such tests are written is in [Testing](testing.md).

## History

The design was built in steps, each with a folder in `specs/`: `TRIP-008-visual-design/` (the foundation and the design board `design-board/index.html`), `TRIP-020-start-page-design/`, `TRIP-019-admin-design/` and `TRIP-022-card-border/` (one border colour for cards). `TECH-018-combined-design-tests/` combined the design tests.

[System documentation](index.md)
