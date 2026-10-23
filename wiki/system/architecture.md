---
type: Architecture
title: Architecture
description: The parts of Gurras Flyg, how they fit together, the database, environments and deploys.
resource: app/
tags: [architecture, database, deploy, admin]
timestamp: 2026-10-21
---

# Architecture

Gurras Flyg is one Next.js 16 application (App Router, TypeScript, Tailwind CSS 4). Pages, server actions and API routes run in the same project, and all data is in one SQLite database.

```mermaid
flowchart LR
    Browser -->|pages, server actions| Next[Next.js app on Vercel]
    Browser -->|/api/*| Next
    Next -->|@libsql/client| DB[(Turso / local SQLite)]
    Data[data/*.json, knowledge/] -->|generated migration| DB
    Git[GitHub main] -->|push builds| Vercel
```

## Code

| Folder | Content |
|---|---|
| `app/layout.tsx` | Every page: the header with the wordmark, and the footer (with the photo credit on the start page). |
| `app/page.tsx` | Start page: background photo, heading, search form and review carousel. The photo is `public/brand/skymning.jpg`; `public/brand/` holds the site's own images, `public/images/` the course's. |
| `app/globals.css` | The design tokens (colours, font, radii, shadows, motion) as a Tailwind theme, and base styles. See [`DESIGN.md`](../../DESIGN.md). |
| `app/components/` | Shared interface parts: the design's components (`Button`, `RoundButton`, `Field`, `Switch`, `Card`, `Message`, `Stars`, `Wordmark`, see [`DESIGN.md`](../../DESIGN.md)), `PhotoCredit`, `SearchForm`, `Autocomplete`, `DatePicker` and `Calendar` ([the date picker](date-picker.md)), `ReviewCarousel` and icons. |
| `app/admin/` | Admin page (`page.tsx`), its tables and forms, `admin-ui.tsx` with the admin's own pieces (collapsible card, dialog, icon buttons, see [`DESIGN.md`](../../DESIGN.md)), and `actions.ts` with the server actions that change data. `login/` is the sign-in page. |
| `app/api/airports/` | `GET /api/airports?q=` for the airport autocomplete. |
| `app/api/destinations/` | `GET /api/destinations`, see [the endpoint](api-destinations.md). |
| `proxy.ts` | Runs before every `/admin` request and sends visitors without a valid sign-in to `/admin/login`. |
| `lib/db.ts` | Database connection and helpers (`all`, `get`, `run`, `withTransaction`), airport search and seat availability. |
| `lib/admin.ts` | Cabin classes, add-ons, aircraft and aircraft assignment: validation and database changes. |
| `lib/bookings.ts` | Creating a booking in one transaction, without overbooking. Not yet used by any page. |
| `lib/reviews.ts`, `lib/review-rules.ts` | Reviews. The text limit lives in `review-rules.ts`, without `server-only`, so the admin form can use it too. |
| `lib/session.ts`, `lib/auth.ts` | Admin sign-in: a signed cookie, checked on every admin page and action. |
| `lib/travel.ts` | The course's destinations (charter), read from the database. |
| `lib/format.ts` | Price formatting (whole kronor to "1 290 kr"). |
| `lib/dates.ts` | Which dates can be booked (today up to `MAX_MONTHS_AHEAD` months ahead, in local time), the return limits (`MAX_TRIP_MONTHS`), reading typed dates, the messages and Swedish date formats, for both the search form and the server. |
| `lib/numbers.ts` | `parseWholeNumber`: reads a whole number typed in an admin form ("1 290"), for both the forms and the server. |
| `lib/local-db.mjs` | Where the local database and the test database are. |

Pages read data in server components. Changes go through server actions in `app/admin/actions.ts`, which check the sign-in, call `lib/`, and refresh the page. Errors meant for the user are thrown as `AdminError` or `BookingError` and shown as messages.

This Next.js version has `cacheComponents` turned on: data that depends on the request (database reads, the clock, cookies) is read after `await connection()` or inside `<Suspense>`. See `AGENTS.md`.

## Database

SQLite, reached through `@libsql/client`, so the same SQL works locally and in production.

| Environment | Database |
|---|---|
| Local | The file `~/Ai Projekt/gurrasflyg-data/gurrasflyg.db` (`lib/local-db.mjs`). It is kept outside the project folder, so it survives a fresh clone. Backups go to the project's `db/backups/`, local only and not in Git. |
| Production | A Turso database of its own, set by `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` added by hand in Vercel's environment variables for Production. |
| Preview | The Turso database under Vercel → Storage, connected to Preview only; the integration sets `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` for Preview. It must not be connected to Production too: the integration and the hand-made variables would then compete for the same names. Whether the integration gives each preview deployment a database of its own has not been checked. |

On Vercel the build stops if `TURSO_DATABASE_URL` is missing, so the site can't silently run against a temporary file.

### Tables

- **Airports and routes:** `airports`, `routes` (from, to, flight time, assigned aircraft) and `route_departures` (times of day).
- **Fleet:** `aircraft`, `classes`, `aircraft_capacity` (seats per class on an aircraft), `addons` and `aircraft_class_addons` (which add-ons can be bought in which class on which aircraft).
- **Flights and bookings:** `flights`, `flight_prices`, `contacts`, `passengers`, `bookings`, `booking_flights` and `booking_flight_addons`. The view `available_seats` calculates free seats; they are never stored.
- **Reviews:** `reviews`.
- **Charter** (the course data): `charter_airports`, `destinations` with their aliases, tags, ways of getting there, pages and photos, and `charter_timetables` with their days, flights and stops. Separate from the airline's tables. See [Charter data](data-charter.md).

Rules in the database: foreign keys are on, prices are whole kronor, names of aircraft, classes and add-ons are unique regardless of case, and a booking can only include add-ons allowed for its aircraft and class.

### Schema changes

A new database is built from `db/schema.sql` and `db/seed.sql`. Changes after that are numbered migrations in `db/migrations/`, recorded in the table `schema_migrations` so each runs once per database. `scripts/db-setup.mjs` runs them before `npm run dev` and `npm run build`, so a deploy updates Turso. A local backup is saved in `db/backups/` when `npm run dev` starts, before migrations run and before `npm run db:reset`; the 20 newest are kept. Backups are written to a temporary name and renamed when complete, so a half-written file never has a backup's name.

| Migration | Content |
|---|---|
| `001_routes.sql` | Tables for routes and departures. |
| `002_routes_data.sql` | 51 airports and 200 routes, generated by `scripts/generate-routes.mjs` with realistic flight times. |
| `003_reviews.sql` | Reviews table and three sample reviews. |
| `004_whole_kronor.sql` | Prices from öre to whole kronor (TECH-005). |
| `005_charter.sql` | Tables for the course's charter data. |
| `006_charter_data.sql` | The course's airports, destinations, pages, photo credits and timetables, generated by `scripts/generate-charter-data.mjs`. |

## Admin sign-in

The password is `ADMIN_PASSWORD`. On sign-in the server sets the cookie `gurrasflyg_admin` with an expiry time and an HMAC-SHA256 signature made with `ADMIN_SESSION_SECRET`. The cookie lasts until the browser closes, and is rejected after 8 hours. `proxy.ts` checks it before admin pages load, and every server action checks it again.

## Environments and deploys

- **Local:** `npm run dev`, with secrets in `.env.local`.
- **Production:** a push to `main` on GitHub builds and publishes <https://gurrasflyg.vercel.app>.
- **Preview:** other branches get their own address on Vercel.

### Pipeline

| Workflow | When | What |
|---|---|---|
| CI (`.github/workflows/ci.yml`) | Every pull request to `main` and every push to `main` | `npm ci`, lint, type check, build and `npm run test:local`, with a throw-away admin password and the test database. Never touches production. |
| Preview tests (`.github/workflows/preview-tests.yml`) | Every pull request to `main`; waits for Vercel's commit status `Vercel` to be `success` | `npm test` against the branch's preview address (`gurrasflyg-git-<branch>-aqc-lab.vercel.app`), with the secrets `VERCEL_AUTOMATION_BYPASS_SECRET` (sent as the header `x-vercel-protection-bypass`) and `ADMIN_PASSWORD`. Test data goes to the preview's database. Branch names must keep the address within 63 characters. |
| Live tests (`.github/workflows/live-tests.yml`) | After each successful production deploy (Vercel's commit status `Vercel` on a commit in `main`), or by hand | `npm test` against the live site, with the secret `ADMIN_PASSWORD`. |

The test jobs run in Playwright's Docker image `mcr.microsoft.com/playwright:v<version>-noble` (`options: --user 1001`, as in Playwright's docs), which has Node, Chromium and its system libraries, so nothing is installed with `apt`. Preview tests wait for Vercel in a separate job outside the image, since the image has no `gh`. The jobs share `.github/actions/setup-tests/`: `npm ci` with the npm cache, then `scripts/check-playwright-image.mjs`, which compares the image's version (`/ms-playwright/.docker-info`) with the installed `@playwright/test` and stops the job with both versions if they differ. **Updating Playwright:** change `@playwright/test` and the image's tag in `ci.yml`, `preview-tests.yml` and `live-tests.yml` in the same change. Failing runs save Playwright's HTML report, screenshots and traces as an artifact; Preview tests save no traces, since they would hold the bypass secret. Changes reach `main` through pull requests that are merged when CI and Preview tests are green.

`npm run copy-to-prod` copies cabin classes, add-ons, aircraft and reviews from the local database to production. It only adds what is missing and never deletes.

## Tests

Playwright tests in `tests/`, one file per feature, each test named after a requirement ID.

| Command | Site | Database |
|---|---|---|
| `npm test` | <https://gurrasflyg.vercel.app> | Production (Turso). Tests only create and delete their own "E2E" data. |
| `npm run test:local` | Production build on port 3100, built in `.next-test/` by `scripts/test-server.mjs` | `~/Ai Projekt/gurrasflyg-data/test.db`, rebuilt from schema, seed and migrations every run. |

`tests/global-teardown.ts` removes leftover "E2E" data after every run. `npm run test:time` (`scripts/test-time.mjs`) runs `npm run test:local` with Playwright's JSON report and prints the number of tests, their total time (without the build) and the five slowest, against the time budgets in `wiki/system/testing.md`, which also has the rules.

## Related

- Product and features: [specs/overview.md](../../specs/overview.md)
- Workflow: `CLAUDE.md`
