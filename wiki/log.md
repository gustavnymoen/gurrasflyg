---
type: Log
title: Log
description: Changes to the site and its documentation, newest first.
timestamp: 2026-10-20
---

# Log

## 2026-10-20

- Introduced specification-driven development: `specs/` with overview, template and status folders, this wiki, Playwright tests and `CLAUDE.md`.
- Added the course sample data (`data/`, `knowledge/`, `public/images/`) and `GET /api/destinations`.
- Moved the local database out of OneDrive to `~/Ai Projekt/gurrasflyg-data/gurrasflyg.db`. Backups are saved in the project's `db/backups/`, synced by OneDrive, every time `npm run dev` starts and with `npm run db:backup`.
- Specified the features built before this date, TRIP-001 to TRIP-006, in `specs/done/`, with Playwright tests per requirement and verification records. All tests pass locally and against the live site.
- `npm run test:local` now runs a production build against its own fresh test database (`~/Ai Projekt/gurrasflyg-data/test.db`); leftover "E2E" test data is removed after every run.
- User manual (Swedish): searching for flights, reviews, and the admin pages. System documentation: `GET /api/airports`.
- Found while verifying: pressing Enter before new airport suggestions have loaded chooses from the previous list (TRIP-001); right after deleting an aircraft, its add-ons and classes briefly look in use (TRIP-004). Both are backlog candidates.
