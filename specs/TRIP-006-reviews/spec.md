---
id: TRIP-006
title: Reviews
area: Shared
status: done
created: 2026-10-20
updated: 2026-10-20
depends_on: [TRIP-002]
---

# TRIP-006 Reviews

## Goal

The start page shows what travellers think of Gurras Flyg in a carousel of review cards, and the administrator decides which reviews are shown.

## Background

Built before specification-driven development was introduced and specified afterwards. The reviews are written by the administrator; travellers can't submit reviews. A new database starts with three sample reviews.

## Users

Traveller (reads), administrator (creates and deletes).

## Scope

**In scope**

- The carousel "Vad våra resenärer säger" on the start page.
- The card "Omdömen" on `/admin`: form and list.

**Out of scope**

- Travellers writing reviews, editing reviews, moderation.

## Requirements

### TRIP-006-R1 Review cards on the start page

Under the search form, the start page shall show the heading "Vad våra resenärer säger" and a carousel of reviews, newest first. Each card shows 1–5 stars, a title, the text and "– <name>". One card is in focus in the middle; the cards next to it are smaller, fainter and behind it. Without reviews the carousel isn't shown.

Acceptance criteria:

- **Given** reviews exist, **then** the card in focus is the newest review, with its stars ("<n> av 5 stjärnor" for screen readers), title, text and name.

### TRIP-006-R2 Browsing the reviews

Arrows on the edges of the card in focus ("Föregående omdöme" and "Nästa omdöme") shall move the cards one step, with a smooth movement. The carousel goes round: after the last card comes the first. The arrow keys work when the carousel has focus, a click on a side card brings it into focus, and on a phone the traveller can swipe.

Acceptance criteria:

- **When** the traveller presses "Nästa omdöme", **then** the second newest review is in focus; **when** they press "Föregående omdöme", **then** the newest is in focus again.
- **Given** the newest review in focus, **when** the traveller presses "Föregående omdöme", **then** the oldest review is in focus.
- **When** the carousel has focus and the traveller presses Arrow right, **then** the next review is in focus.
- **When** the traveller clicks the card to the right, **then** it comes into focus.
- **Given** a phone, **then** a swipe moves the cards. (Checked manually.)
- **When** the traveller swipes, **then** the cards move exactly one step; the swipe doesn't also count as a click on the card it ends on.

### TRIP-006-R3 Review form

The card "Omdömen" on the admin page shall have a form "Nytt omdöme" with, in this order: name of the person, a star rating (1–5, clickable stars), title and text. The text is at most 150 characters, with a counter "<n>/150". *Changed by TRIP-021-R4 (2026-10-23): name at most 20, title at most 25 and text at most 145 characters, counter "<n>/145".*

Acceptance criteria:

- **Given** a signed-in administrator, **then** the fields are shown in that order, and the counter shows "0/150".
- **When** 200 characters are typed in the text, **then** only 150 are kept.

### TRIP-006-R4 Required fields

Every field shall be required: "Välj antal stjärnor.", "Omdömet måste ha en rubrik.", "Ange vem som lämnat omdömet." and "Skriv en text till omdömet.". The database allows 255 characters in the text, but the site allows 150 so the cards stay small.

Acceptance criteria:

- **When** "Spara omdöme" is pressed without stars, **then** "Välj antal stjärnor." is shown.
- **When** a field is empty, **then** its message is shown and nothing is saved.

### TRIP-006-R5 Save a review

"Spara omdöme" shall save the review, show "Omdömet sparades.", empty the form, and add the review to the list and first in the carousel.

Acceptance criteria:

- **When** a complete review is saved, **then** "Omdömet sparades." is shown, the fields are empty, the list shows the name and stars, and the start page shows it in focus.

### TRIP-006-R6 List and delete reviews

Next to the form, the admin page shall list all reviews, newest first, with Person, Betyg (stars) and a trash can. The trash can asks "Är du säker?"; Ja deletes the review, Nej keeps it.

Acceptance criteria:

- **When** the administrator deletes a review and answers Ja, **then** it is removed from the list and from the start page.

## Data

Table `reviews` (rating 1–5, title, author, body up to 255 characters, created date), created by `db/migrations/003_reviews.sql` with three sample reviews.

## Interface

- Start page: `app/page.tsx`, `app/components/ReviewCarousel.tsx`, `app/components/Stars.tsx`.
- Admin: `app/admin/ReviewSection.tsx`, actions `createReviewAction` and `deleteReviewAction`, logic in `lib/reviews.ts`.

## Non-functional requirements

- The carousel respects "reduce motion" in the operating system: the cards move without animation.
- Cards not in focus are hidden from screen readers.

How it works today: [Reviews](../../wiki/system/reviews.md).
