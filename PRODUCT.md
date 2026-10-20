# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Traveller:** a visitor who searches for a flight from airport A to airport B on a date, or for a charter trip to an urban exploration destination, compares the options and books. No account; a booking is identified by its booking number. Uses the site on a computer or a phone.
- **Administrator:** signs in at `/admin` with a shared password and manages the airline's aircraft, cabin classes, add-ons, routes and the reviews on the start page. Works on a computer.

## Product Purpose

Gurras Flyg is a fictional airline's booking site, built as a course project to practise real product development (specifications, backlog, tests, deploys, documentation). It has two product areas: **flight booking** on the airline's own routes, and **charter** trips from Stockholm Arlanda and Copenhagen to abandoned towns, industrial sites, Cold War relics and other urban exploration destinations. Success is a traveller who finds and books a trip without help, and an administrator who keeps the data right without mistakes.

## Positioning

A small airline with a personality: it flies you to ordinary cities and to places most airlines would never sell a ticket to (ghost towns, abandoned sanatoriums, Cold War listening stations).

## Operating Context

- The start page holds the flight search (from, to, date, passengers, return trip) and a carousel of reviews.
- Admin is one page of foldable cards with tables and inline forms, used now and then to set up data.
- Charter pages (later) show destinations with photos from Wikimedia Commons, each with its credit.

## Capabilities and Constraints

- Next.js with Tailwind CSS 4; shared styles in `app/globals.css` and `app/components/ui.tsx`.
- Everything visitors see is in Swedish.
- All data is fake; no real payments or personal data.
- Course photos in `public/images/` are read-only and always shown with author and licence.

## Brand Commitments

- Name: Gurras Flyg. Slogan: "Ditt livs flygresa".
- Dark site.
- Cards and modules have borders and shadows so they stand out from the background.
- The reviews are shown in a carousel.
- Voice: a twinkle in the eye. A proper airline on the surface, with humour in the details (the reviews and copy are playful).
- One consistent design pattern: one style per kind of element (buttons, fields, cards), built so a font, colour or component can be swapped in one place.

## Evidence on Hand

- Reviews written in admin (humorous, made up).
- 96 destination photos with credits (`data/destinations.json`).
- No real customers, press or statistics: none may be invented.

## Product Principles

1. The task comes first: searching and booking must be obvious on a phone and a computer.
2. Humour lives in words and small details, never at the cost of clarity.
3. One pattern per element, changed in one place.
4. Honest content: credits on every photo, no invented claims.

## Accessibility & Inclusion

Every field has a label, everything works with the keyboard, and every page works on a phone screen (`specs/overview.md`).
