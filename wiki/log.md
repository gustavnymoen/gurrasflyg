---
type: Log
title: Log
description: Changes to the site and its documentation, newest first.
timestamp: 2026-10-21
---

# Log

## 2026-10-21

- TECH-002: removed leftovers (the project template's images in `public/`, `getAirports` and `textareaClass`); the review text limit is defined once, in `lib/review-rules.ts`. No change for visitors.

## 2026-10-20

- TECH-001: GitHub Actions pipeline. CI checks every push and pull request; Live tests run against the live site after every production deploy.
- Fixed in the reviews carousel (TRIP-006): a swipe also counted as a click on the card it ended on, so the cards stood still. Found by the first CI run on GitHub.
- Added `npm run typecheck` (`next typegen && tsc --noEmit`). `tsc` alone fails in a fresh checkout, because Next.js generates types such as `LayoutProps` into `.next/`.
- Added a Definition of Done and technical tasks (`TECH-`) to the way of working (`CLAUDE.md`), and four technical tasks to the backlog. Small related cleanups are done directly in the change they belong to.
- Introduced specification-driven development: `specs/` with overview, template and status folders, this wiki, Playwright tests and `CLAUDE.md`.
- Added the course sample data (`data/`, `knowledge/`, `public/images/`) and `GET /api/destinations`.
- Moved the local database out of OneDrive to `~/Ai Projekt/gurrasflyg-data/gurrasflyg.db`. Backups are saved in the project's `db/backups/`, synced by OneDrive, every time `npm run dev` starts and with `npm run db:backup`.
- Specified the features built before this date, TRIP-001 to TRIP-006, in `specs/done/`, with Playwright tests per requirement and verification records. All tests pass locally and against the live site.
- `npm run test:local` now runs a production build against its own fresh test database (`~/Ai Projekt/gurrasflyg-data/test.db`); leftover "E2E" test data is removed after every run.
- User manual (Swedish): searching for flights, reviews, and the admin pages. System documentation: `GET /api/airports`.
- Found while verifying: pressing Enter before new airport suggestions have loaded chooses from the previous list (TRIP-001); right after deleting an aircraft, its add-ons and classes briefly look in use (TRIP-004). Both are backlog candidates.
