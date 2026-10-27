---
id: TECH-024
title: System pages for the administration and reviews
card: "#97"
depends_on: [TRIP-002, TRIP-003, TRIP-004, TRIP-005, TRIP-006, TRIP-008, TRIP-016, TRIP-019, TECH-017]
---

# TECH-024 System pages for the administration and reviews: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 97`.

## Data

None. Documentation only; no migration and no change to the site.

## Interface

New pages in `wiki/system/`, each written from the code and checked against it (R1, R2):

- **`admin.md`**: the admin page and its three cards, how a server action runs (`run()` in `app/admin/actions.ts`), the checks in `lib/admin.ts`, the all-at-once save of an aircraft, what "in use" means for a class, an add-on and an aircraft (TRIP-016), the tables, and the route data with its generators (TRIP-005).
- **`admin-sign-in.md`**: the session cookie, the three places that check it, the password check and the limit on attempts (TECH-017).
- **`reviews.md`**: the table, the length limits, `lib/reviews.ts`, the form in admin and the carousel on the start page.
- **`design.md`**: what `DESIGN.md` holds and how the parts fit; it links to the file and does not copy it.

Links added (R3): the four pages from `wiki/system/index.md` (the old Design bullet now goes to `design.md`), from `architecture.md`, `aircraft-and-classes.md` and `search-results.md`; a line at the end of the five Swedish manual pages for the administration and reviews; and a line "How it works today" at the end of the old spec folders TRIP-002 to TRIP-006, TRIP-008 and TRIP-019.

The wiki's shape (R3):

- Every page except `index.md` and `log.md` has `generated: {by, at}` instead of `timestamp`. `by` is `claude`. `at` is the time of the page's last commit, or of this change where the page is edited; the new pages use the time they were written.
- `index.md` and `log.md` have no frontmatter. The OKF spec reserves them; only the root `wiki/index.md` has one, with `okf_version: "0.2"`.
- Entries in the `index.md` pages repeat the linked page's `description`, so the pages that had none (the administrator's pages in the manual index) got one.
- "Page format" in `wiki/index.md` and the README describe the new shape, and `CLAUDE.md` says to set `generated.at` on a changed page.

## Decisions

- **Grouped pages, like the existing ones.** One page for the administration, one for the sign-in and one for the reviews, not one per card or per feature. The sign-in is apart because it is about security and is used by [My booking](../../wiki/system/my-booking.md) too. What `aircraft-and-classes.md` and `search-results.md` already say about factors, prices and routes is linked, not repeated.
- **Routes belong to the administration page.** TRIP-005 was the admin's route work, but its button and `routes.aircraft_id` are gone, so what is left (the data and its generators) is a section on `admin.md`, with the history, and the search is described where it is, in `search-results.md`.
- **OKF v0.2 from its spec, not from articles.** The conversion follows [SPEC.md](https://github.com/GoogleCloudPlatform/open-knowledge-format/blob/main/SPEC.md): `timestamp` is only a legacy field there, index pages have no frontmatter, and extra fields (`feature`) are allowed. Links stay relative, which the spec allows (it recommends paths from the bundle root).
- **Two throwaway scripts** did the conversion and the check (frontmatter, links and anchors, every page reachable from `wiki/index.md`, entries equal to descriptions). They are not committed: the wiki is checked again by the reviewer and `generated.at` is set by hand, like the old `timestamp` was.
