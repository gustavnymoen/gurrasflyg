---
type: Architecture
title: Architecture
description: The parts of Gurras Flyg, how they fit together, the database, environments and deploys.
resource: app/
tags: [architecture, database, deploy, admin]
timestamp: 2026-10-24
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
| `app/layout.tsx` | Every page: the header with the wordmark and, in a flow, Avbryt, and the footer (with the photo credit on the start page). See [flows](flows.md). |
| `app/flyg/` | The results page `/flyg`: the search from the address, the simulated search, flight cards, sorting and choosing flights ([search results](search-results.md)). `app/flyg/plan/` is `/flyg/plan`, choosing aircraft and classes ([aircraft and classes](aircraft-and-classes.md)); `app/flyg/boka/` the booking's steps Resenärer and Betala with the server action `bookAction`, and `app/flyg/bokad/` the summary ([booking](booking.md)). `Steps`, `FlightLine`, `TripOverview` and `Problem` are shared. |
| `app/page.tsx` | Start page: background photo, heading, the tabs Flyg (search form) and Charter, and review carousel. `app/charter/` is `/charter` and `/charter/<id>` ([Charter destinations](charter-destinations.md)). The photo is `public/brand/skymning.jpg`; `public/brand/` holds the site's own images, `public/images/` the course's. |
| `app/globals.css` | The design tokens (colours, font, radii, shadows, motion) as a Tailwind theme, and base styles. See [`DESIGN.md`](../../DESIGN.md). |
| `app/components/` | Shared interface parts: the design's components (`Button`, `RoundButton`, `Field`, `Checkbox`, `Switch`, `Card`, `ChoiceCard`, `Message`, `Stars`, `Wordmark`, `Tabs`, `Dialog`, `AbortFlow`, see [`DESIGN.md`](../../DESIGN.md)), `PhotoCredit`, `SearchForm`, `Autocomplete`, `DatePicker` and `Calendar` ([the date picker](date-picker.md)), `ReviewCarousel` and icons. |
| `app/admin/` | Admin page (`page.tsx`), its tables and forms, `admin-ui.tsx` with the admin's own pieces (collapsible card, icon buttons, see [`DESIGN.md`](../../DESIGN.md)), and `actions.ts` with the server actions that change data. Whether a class, add-on or aircraft is in use is decided only by the delete functions in `lib/admin.ts`, inside the delete transaction; the page holds no such flag, since it can be old right after a change (TRIP-016). `login/` is the sign-in page. |
| `app/api/airports/` | `GET /api/airports?q=` for the airport autocomplete. |
| `app/api/destinations/` | `GET /api/destinations`, see [the endpoint](api-destinations.md). |
| `proxy.ts` | Runs before every `/admin` request and sends visitors without a valid sign-in to `/admin/login`. |
| `lib/db.ts` | Database connection and helpers (`all`, `get`, `run`, `withTransaction`) and airport search. |
| `lib/admin.ts` | Cabin classes, add-ons and aircraft, with their factors: validation and database changes. |
| `lib/flights.ts` | The flights between two airports on a date with their "från" price, the search's airports, the aircraft with their classes and factors (`listFleet`, `readFleet`), their add-ons (`readAddons`), and the trip in the address read from the database (`loadTrip`, `loadBookingTrip`). |
| `lib/search.ts`, `lib/flight-rules.ts` | The search and its address; flight numbers, prices, sorting and which departures have left. Without `server-only`, for both the page and the browser. |
| `lib/trip.ts`, `lib/fare-rules.ts` | The trip's address after the search (chosen flights, aircraft and classes); prices with factors, flight times, arrivals, which aircraft and numbers per class are possible. Without `server-only`. |
| `lib/booking-rules.ts` | The booking's rules for both the page and the server: the form, the checks, the prices, what a change clears, the summary. Without `server-only`. |
| `lib/bookings.ts` | Saving a booking in one write transaction, with everything checked and priced from the database (`createBooking`). |
| `lib/reviews.ts`, `lib/review-rules.ts` | Reviews. The text limit lives in `review-rules.ts`, without `server-only`, so the admin form can use it too. |
| `lib/session.ts`, `lib/auth.ts` | Admin sign-in: a signed cookie, checked on every admin page and action. |
| `lib/travel.ts` | The course's destinations (charter), read from the database, with the "från" price and airport. |
| `lib/destinations.ts`, `lib/destination-names.ts`, `lib/markdown.ts` | Charter search, filters, address, price rule, Swedish names and text parsing, without a database (usable in the browser). |
| `lib/format.ts` | Price formatting (whole kronor to "1 290 kr") and durations ("9 h 20 min"). |
| `lib/dates.ts` | Which dates can be booked (today up to `MAX_MONTHS_AHEAD` months ahead, in local time), the return limits (`MAX_TRIP_MONTHS`), reading typed dates, the messages and Swedish date formats, for both the search form and the server. |
| `lib/numbers.ts` | `parseWholeNumber` and `parseFactor`: read a whole number ("1 290") or a factor ("1,50") typed in an admin form, for both the forms and the server. |
| `lib/local-db.mjs` | Where the local database and the test database are. |

Pages read data in server components. Changes go through server actions: `app/admin/actions.ts`, which check the sign-in, call `lib/`, and refresh the page, and `app/flyg/boka/actions.ts`, which saves a booking. Errors meant for the user are thrown as `AdminError` or `BookingError` and shown as messages.

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

- **Airports and routes:** `airports` (with `city`), `routes` (from, to, flight time; one for every ordered pair of airports) and `route_departures` (times of day, each with its price per person).
- **Fleet:** `aircraft`, `classes`, `aircraft_capacity` (seats per class on an aircraft), `addons` and `aircraft_class_addons` (which add-ons can be bought in which class on which aircraft).
- **Bookings:** `bookings` (the booking number, the contact, the payment method and the total), `booking_passengers`, `booking_flights` (route, date, departure, aircraft and price per flight), `booking_seats` (a passenger's class and price on a flight) and `booking_addons`. See [Booking](booking.md).
- **Reviews:** `reviews`.
- **Charter** (the course data): `charter_airports`, `destinations` with their aliases, tags, ways of getting there, pages and photos, and `charter_timetables` with their days, flights and stops. Separate from the airline's tables. See [Charter data](data-charter.md).

Rules in the database: foreign keys are on, prices are whole kronor, and names of aircraft, classes and add-ons are unique regardless of case. That a booking only has add-ons allowed for its aircraft and class is checked by `createBooking`.

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
| `007_all_routes.sql` | Routes between every pair of airports with at least 5 departures a day, a price per departure, the airports' cities, and no aircraft on routes (TRIP-010), generated by `scripts/generate-all-routes.mjs`. |
| `008_factors.sql` | Price factors for classes and aircraft and time factors for aircraft (TRIP-011). |
| `009_bookings.sql` | The old flight and booking tables replaced by the booking tables (TRIP-012); stops if the old ones have any rows. |
| `010_login_attempts.sql` | The table `login_attempts`, the admin sign-in attempts per IP address (TECH-017). |

## Admin sign-in

The password is `ADMIN_PASSWORD`. On sign-in the server sets the cookie `gurrasflyg_admin` with an expiry time and an HMAC-SHA256 signature made with `ADMIN_SESSION_SECRET`. The cookie lasts until the browser closes, and is rejected after 8 hours. `proxy.ts` checks it before admin pages load, and every server action checks it again.

Security details (TECH-013):

- The password is compared as SHA-256 hashes with `timingSafeEqual` (`passwordMatches` in `lib/session.ts`), so the response time reveals neither how many characters were right nor how long the password is. A wrong password is answered after one second, which makes guessing slow. After 5 attempts from one IP address within 15 minutes, the sixth is refused, even with the right password, for 15 minutes after the fifth (TECH-017). The attempts are counted before the password is checked, in the table `login_attempts` in the database (`lib/login-limit.ts`), since on Vercel each request may run in a new function. The address is the first entry of `x-forwarded-for`, which Vercel sets itself. A right password clears the address's count, and rows older than 15 minutes are deleted at every attempt, so addresses are not kept longer than needed.
- The session is stateless: signing out deletes the cookie in the browser, but a copied cookie stays valid until its 8 hours are up. To end every session at once, change `ADMIN_SESSION_SECRET` (or the version in `lib/session.ts`). Acceptable for this site, where the admin has no real data.
- Server actions check their input at run time, not only by TypeScript types: ids must be integers (`requireId`), texts strings of at most 200 characters, and lists arrays.
- Every response has security headers from `next.config.ts`: the site can't be shown in a frame on another site (`X-Frame-Options: DENY`, `frame-ancestors 'none'`), file types aren't guessed (`nosniff`), and other sites get only the origin as referrer.

## Environments and deploys

- **Local:** `npm run dev`, with secrets in `.env.local`.
- **Production:** a push to `main` on GitHub builds and publishes <https://gurrasflyg.vercel.app>.
- **Preview:** other branches get their own address on Vercel.

### Pipeline

Changes reach `main` through pull requests, which branch protection merges only when CI (the whole test suite and the security scans) and Preview tests (smoke tests against the preview) are green and the branch is up to date. After each production deploy, Live tests runs the smoke tests against the live site. The workflows, their events and secrets are described in [Pipeline](pipeline.md).

`npm run copy-to-prod` copies cabin classes, add-ons, aircraft and reviews from the local database to production. It only adds what is missing and never deletes.

## Tests

Playwright browser tests in `tests/`, one file per feature (the look is checked in `tests/TECH-018-design.spec.ts`), and Vitest unit tests in `*.test.ts` next to the code they test (`vitest.config.mts`); each test named after a requirement ID. See [Testing](testing.md).

| Command | Site | Database |
|---|---|---|
| `npm run test:smoke` | <https://gurrasflyg.vercel.app>, or `BASE_URL` | Production (Turso), read only: the smoke tests write nothing. |
| `npm test` | <https://gurrasflyg.vercel.app>, or `BASE_URL` | Production (Turso). Run by hand only; tests create and delete their own "E2E" data. |
| `npm run test:unit` | None (no site) | `~/Ai Projekt/gurrasflyg-data/unit-test.db`, rebuilt from schema, seed and migrations by `vitest.global-setup.mjs` every run. |
| `npm run test:local` | Production build on port 3100, built in `.next-test/` by `scripts/test-server.mjs` | `~/Ai Projekt/gurrasflyg-data/test.db`, rebuilt from schema, seed and migrations every run. |

`tests/global-teardown.ts` removes leftover "E2E" data after every run. `npm run test:time` (`scripts/test-time.mjs`) runs the unit tests with Vitest's JSON report and `npm run test:local` with Playwright's, and prints the number of each, their total time (the browser tests without the build) and the five slowest browser tests, against the time budgets in `wiki/system/testing.md`, which also has the rules.

## Related

- Product and features: [specs/overview.md](../../specs/overview.md)
- Workflow: `CLAUDE.md`
