---
type: Feature
title: Reviews
description: The carousel of reviews on the start page and the card Omdömen in admin where the administrator creates and deletes them, with the limits on length and how they are checked and stored.
resource: lib/reviews.ts
feature: TRIP-006, TRIP-021
tags: [reviews, carousel, admin, start-page, server-actions, accessibility]
generated:
  by: claude
  at: 2026-10-27T13:20:47+01:00
---

# Reviews

The start page shows what travellers think of Gurras Flyg in a carousel under the search form, headed "Vad våra resenärer säger". The reviews are written by the administrator in the card **Omdömen** on [the admin page](admin.md); travellers can't write them. For the administrator: [Omdömen i admin](../manual/admin-omdomen.md); for travellers: [Omdömen på startsidan](../manual/omdomen.md).

## Data

The table `reviews` (migration `003_reviews.sql`): `rating` (1–5, checked by the database), `title`, `author`, `body` and `created_at`. A new database starts with three made-up reviews. The database allows 255 characters in `body`; the site allows less, so that the cards stay small:

| Field | Longest | Constant in `lib/review-rules.ts` |
|---|---|---|
| Name (`author`) | 20 | `MAX_AUTHOR_LENGTH` |
| Title | 25 | `MAX_TITLE_LENGTH` |
| Text (`body`) | 145 | `MAX_REVIEW_LENGTH` |

The limits live in `review-rules.ts`, without `server-only`, so that the admin form (a client component) and the server use the same numbers (TRIP-021-R4).

## The code

`lib/reviews.ts`:

- `listReviews()` returns every review, **newest first** (`ORDER BY id DESC`). It waits for `connection()` first, so a page isn't prerendered with an old list.
- `createReview()` checks on the server: 1–5 stars, a title, a name and a text that aren't empty after trimming, and the three length limits. A mistake is an `AdminError` with a message in Swedish ("Välj mellan 1 och 5 stjärnor.", "Omdömet måste ha en rubrik." …).
- `deleteReview()` deletes by id.

They are called by `createReviewAction` and `deleteReviewAction` in `app/admin/actions.ts`, which check the sign-in first like every admin action ([Administration](admin.md#changing-data)).

## In admin

`app/admin/ReviewSection.tsx` is the card **Omdömen**. The form **Nytt omdöme** has, in this order, the name, the stars (clickable, 1–5), the title and the text with a counter ("0/145"); the fields stop typing at their limits. **Spara omdöme** shows what is missing ("Välj antal stjärnor." …) or "Omdömet sparades.", empties the form, and the review is first in the list and in the carousel. **Alla omdömen** lists name and stars, with a trash can that asks "Är du säker?".

## On the start page

`app/page.tsx` reads the reviews in `Reviews()` and gives them to `ReviewCarousel` (`app/components/ReviewCarousel.tsx`). Without reviews the carousel shows nothing; the heading, which is in `app/page.tsx`, stays.

- One card is in focus in the middle, the next ones are smaller and fainter behind it (`LOOK`: scale, shift and opacity by distance). All cards are stacked in one grid cell, so the carousel grows with the tallest card.
- The carousel **goes round**: `go()` wraps with modulo, and `offsetOf()` places the first card to the right of the last.
- The arrows **Föregående omdöme** and **Nästa omdöme** sit on the edges of the card in focus, Arrow left/right move it when the carousel has focus, a click on a side card brings it forward, and a swipe of more than 40 px moves one step on a phone; a swipe that ends on a side card doesn't also count as a click on it.
- It is a `region` with `aria-roledescription="karusell"`, and `Stars` gives "<n> av 5 stjärnor" to screen readers. The movement is a CSS transition, which the reduced motion rule turns off ([Design](design.md)).

## Tests

Browser: `tests/TRIP-006-reviews.spec.ts` (the carousel on the start page, and the form, saving and deleting in admin) and the `TRIP-021-R4` tests in `tests/TRIP-021-wcag.spec.ts` (the length limits, and the longest review fitting its card with larger text spacing).

Requirements and verification: `specs/TRIP-006-reviews/` and `specs/TRIP-021-wcag/`.

[System documentation](index.md)
