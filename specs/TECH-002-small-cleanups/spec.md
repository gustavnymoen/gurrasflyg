---
id: TECH-002
title: Small cleanups
area: Shared
status: done
created: 2026-10-20
updated: 2026-10-21
depends_on: []
---

# TECH-002 Small cleanups

## Goal

Remove leftovers that nothing uses, and define the review text limit in one place, so the code is easier to read and the limit can't drift between the admin form and the database rules. The site behaves exactly as before.

## Background

Small findings from earlier features, grouped into one task:

- `public/` still holds the images from the Next.js project template (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`). No page, style or document refers to them.
- `getAirports()` in `lib/db.ts` lists all airports, but no page or route calls it. The airport field uses `searchAirports()` (TRIP-001).
- `textareaClass` in `app/components/ui.tsx` is exported but not used. The review form uses `compactTextareaClass` (TRIP-006).
- The review text limit of 150 characters (TRIP-006-R3) is defined twice: as `MAX_REVIEW_LENGTH` in `lib/reviews.ts`, which the server checks against, and as `MAX_LENGTH` in `app/admin/ReviewSection.tsx`, which the form's counter and `maxLength` use. The copy exists because `lib/reviews.ts` is marked `server-only` and therefore can't be imported by a client component.

## Users

Developers. Visitors and the administrator don't see any difference.

## Scope

**In scope**

- Deleting the five template images, `getAirports()` and `textareaClass`.
- One definition of the review text limit, used by both the server and the form.

**Out of scope**

- Other cleanups. New findings go to the backlog as their own technical task.
- Changing the limit itself, or anything else in how reviews work.

## Requirements

### TECH-002-R1 The site behaves as before

After the change, the site shall work exactly as before.

Acceptance criteria:

- **Then** `npm run lint`, `npm run typecheck` and `npm run build` pass without errors or warnings.
- **Then** the existing tests pass, both `npm run test:local` and, after deploy, `npm test` against the live site.

### TECH-002-R2 Unused template images are removed

`public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg` and `public/window.svg` shall be deleted.

Acceptance criteria:

- **Then** the five files don't exist, and no file in the project (outside `node_modules/`) refers to them.
- **Then** the course photos in `public/images/` are unchanged.

### TECH-002-R3 Unused code is removed

`getAirports()` in `lib/db.ts` and `textareaClass` in `app/components/ui.tsx` shall be deleted. The `Airport` type stays, since `searchAirports()` uses it.

Acceptance criteria:

- **Then** neither name occurs in the code, and the airport field on the start page still gives suggestions (covered by the TRIP-001 tests).

### TECH-002-R4 The review text limit is defined once

The limit of 150 characters shall be defined once, in a small module without `server-only`, `lib/review-rules.ts`, that both `lib/reviews.ts` and `app/admin/ReviewSection.tsx` import. The constant `MAX_LENGTH` in `ReviewSection.tsx` and its comment are removed.

Acceptance criteria:

- **Then** the number 150 for the review text occurs once in the code.
- **Given** a signed-in administrator, **then** the review form still shows the counter "0/150" and keeps only 150 characters (covered by the TRIP-006-R3 tests).
- **Then** the server still rejects a longer text with "Texten får vara max 150 tecken."

## Data

None.

## Interface

No visible change.

- `lib/review-rules.ts` (new): the review text limit.
- `lib/reviews.ts`, `app/admin/ReviewSection.tsx`: import the limit from there.
- `lib/db.ts`, `app/components/ui.tsx`, `public/`: leftovers deleted.

## Non-functional requirements

None beyond `specs/overview.md`.

## Open questions

None.
