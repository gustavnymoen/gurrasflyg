# Gurras Flyg

A flight booking site with fake data, built as part of a course in AI engineering. The course is about **how** software is built: specification-driven development, requirements on a backlog board, tests, deploys, documentation and user manuals.

The site has two separate product areas (see `specs/overview.md`):

- **Flight booking:** search and book flights from airport A to B, on the airline's own routes, aircraft, cabin classes and add-ons, managed in admin.
- **Charter** (planned): trips to urban exploration destinations (abandoned towns, industrial sites, Cold War relics) from Stockholm Arlanda and Copenhagen, based on the course's sample data.

The live site is <https://gurrasflyg.vercel.app>.

## How it is built

- **Next.js 16** (App Router, TypeScript, Tailwind CSS) on **Node.js**. Pages and backend API routes are in the same project. This Next.js version differs from older ones; see `AGENTS.md`.
- **Database:** SQLite through `@libsql/client`. Locally a file, `~/Ai Projekt/gurrasflyg-data/gurrasflyg.db`, kept outside the project folder so it survives a fresh clone. Backups are saved in the project's `db/backups/` (see [Local database and backups](#local-database-and-backups)). In production **Turso**, a hosted SQLite.
- **Git and Vercel:** the code is on GitHub. A push to `main` builds and publishes the site on Vercel; other branches get preview deployments.
- **Pipeline:** GitHub Actions checks every pull request, tests its preview deployment before merge, and tests the live site after every deploy. See [Pipeline](#pipeline).
- **Tests:** Playwright, one file per feature. `npm test` runs against the live site, as the course prescribes; `npm run test:local` against a local production build with its own test database. See [Tests](#tests).
- **Admin:** `/admin`, protected by a password (`ADMIN_PASSWORD`). Manage cabin classes, add-ons, aircraft and reviews, and assign aircraft to routes.

`wiki/system/architecture.md` describes the parts in more detail.

## Getting started

1. `npm install` installs the dependencies and downloads the browser Playwright uses (`scripts/postinstall.mjs`).
2. Copy `.env.example` to `.env.local` and fill in `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`.
3. `npm run dev` creates or updates the local database and starts the site on <http://localhost:3000>.

## Way of working

The site is built one feature at a time, and the requirements decide what is built. `CLAUDE.md` describes the workflow step by step; it is also the instruction file for AI coding tools.

- **One backlog** for the whole site: the GitHub board ["Gurras Flyg"](https://github.com/users/gustavnymoen/projects/2), with the columns Backlog, Specified, Ongoing, Review and Done. The top card in Backlog is next. Each card has a Work type (Feature, Fix or Tech) and an Area: Flight booking, Charter, Administration or Shared.
- **IDs** are given when a card is created, and start its title: `TRIP-001`, `TRIP-002` and so on.
- **The card** holds what is built and why: a short explanation, then the goal, scope and requirements, worked out together. New cards start from `.github/ISSUE_TEMPLATE/card.md`. A merged pull request with "Closes #<card>" moves the card to Done.
- **The solution:** a folder `specs/<feature ID>-<name>/`, created when the work starts from `specs/_template/`, with `solution.md` (how it is built), `flow.mmd` (a Mermaid flow diagram), `verification.md` (how it was checked, and the requirements as built) and `review.md` (the code review). Features finished before the board also keep their `spec.md` as history.
- **Requirements** have IDs within their feature: `TRIP-001-R1`, `TRIP-001-R2` and so on.
- **Tests:** one file per feature, `tests/<feature ID>-<name>.spec.ts`, with each test named after the requirement it checks.
- **Product overview:** `specs/overview.md` describes the product's purpose, shared terms, scope, the list of features and rules that apply across features.
- **Wiki:** `wiki/system/` documents how the site works (English) and `wiki/manual/` how to use it (Swedish). Every page starts with frontmatter (`type`, `title`, `description`, `resource`, `feature` when the page belongs to one, `tags`, `timestamp`), so the wiki can later feed a chatbot. The `index.md` pages, `wiki/system/architecture.md` and `wiki/log.md` grow as features are finished.
- **Code review:** before a feature is done, a reviewer agent reviews the change and its report is posted on the pull request. See [wiki/system/code-review.md](wiki/system/code-review.md).
- **Definition of Done:** tests, requirements that match what was built, updated manual and wiki, no leftovers, clean code, code review, and technical tasks recorded for improvements found along the way. See `CLAUDE.md`.
- **Technical tasks** (`TECH-001`, …) are improvements to the code that don't change what the site does. They are cards on the same board as features.
- **Git:** one branch per feature, named after its folder in `specs/`. Commit messages start with the feature ID.

## Folders

- `app/`: pages, and API routes under `app/api/`. Admin pages under `app/admin/`, shared interface parts under `app/components/`.
- `lib/`: shared backend code: database access, admin logic, bookings, reviews, sign-in.
- `db/`: `schema.sql` and `seed.sql` for a new database, and `migrations/` with numbered changes.
- `scripts/`: database setup, generating the route and charter data migrations, copying data to production and the Playwright install.
- `data/` and `knowledge/`: the course's sample data, see below.
- `specs/`: product overview, and each feature's solution, flow, verification and review.
- `tests/`: Playwright tests.
- `wiki/`: system documentation and user manual.
- `public/`: images and other files served as they are.

## Course sample data

Ready-made sample data from the course. It is read-only: features read or import it but don't change it, and specifications and tests refer to its IDs. The destination texts are summaries of the places' articles on [Wikipedia](https://www.wikipedia.org/) (confirmed by the course leader on 2026-10-23), so Wikipedia is credited as their source wherever they are shown; airports, travel times, flight times and prices are approximate or invented. The photos are from Wikimedia Commons, each with its own credit and licence (see below).

- `knowledge/`: one page per destination (96), with its description, nearest airport, how to get there and visiting notes. Start at `knowledge/index.md`.
- `data/destinations.json`: the facts from the destination pages, in one file.
- `data/flights.json`: flight timetables to and from Stockholm Arlanda (ARN) and Copenhagen (CPH), November 2026 to April 2027. See `wiki/system/data-flights.md`.
- `data/airports.json`: names and locations of the airports.
- `public/images/`: a photo of each destination, from Wikimedia Commons. The `image` field of each destination gives the photo's credit: author, licence and source. Most licences require the credit to be shown with the photo.

The course data is imported into tables of its own in the database by a generated migration, with prices in whole kronor (see `wiki/system/data-charter.md`). `GET /api/destinations` returns all destinations from there (see `wiki/system/api-destinations.md`).

## Pipeline

The whole test suite runs once, in CI; the preview and the live site get read-only smoke tests (`npm run test:smoke`). `main` is protected: GitHub merges only a pull request whose checks are green and whose branch is up to date. The workflows, their events, secrets and the branch protection are described in [Pipeline](wiki/system/pipeline.md).

## Local database and backups

- The database is `~/Ai Projekt/gurrasflyg-data/gurrasflyg.db`, outside the project folder.
- A backup is saved in `db/backups/` every time `npm run dev` starts, before migrations and before `npm run db:reset`. `npm run db:backup` saves one whenever you want. The 20 newest are kept.
- `db/backups/` is in the project folder but not in Git. Nothing is copied to a cloud: the code is backed up by Git, and the local database can be rebuilt (production data is in Turso).
- **To restore:** stop the dev server, copy a backup to `~/Ai Projekt/gurrasflyg-data/gurrasflyg.db` (replacing the file, and delete any `gurrasflyg.db-wal` and `gurrasflyg.db-shm` next to it), and start `npm run dev`.
- On a new computer, `npm run dev` creates an empty database with sample data. Restore a backup to get your own data back.

## Tests

Which kind of test checks what, how tests are named, the rules for test data and the time budgets are in [Testing](wiki/system/testing.md). How to run them:

- `npm run test:unit` runs the unit tests (Vitest, `*.test.ts` next to the code) in well under a second, after building their own test database; `npm run test:unit -- --watch` reruns them on every save.

- `npm run test:local` (`scripts/test-server.mjs`) builds the site in `.next-test/`, rebuilds the test database `~/Ai Projekt/gurrasflyg-data/test.db` from scratch and starts the site on port 3100. Your own local database is never touched, and a running `npm run dev` isn't disturbed.
- `npm test` runs every test against <https://gurrasflyg.vercel.app>, by hand only (the pipeline runs the smoke tests there). Admin tests sign in with `ADMIN_PASSWORD` from `.env.local` and are skipped without it; they create and delete their own "E2E" data in production.
- `tests/global-teardown.ts` removes any leftover "E2E" test data after every run.
- Run both before a feature is done: locally before pushing, against the live site after the deploy.
- `npm run test:time` runs `npm run test:local` and prints the number of tests, their total time and the five slowest, marking what is over the time budgets in `wiki/system/testing.md`.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Installs the dependencies and Playwright's browser. |
| `npm run dev` | Updates the local database and starts the dev server. |
| `npm run build` | Builds the site locally, to catch build errors before pushing. |
| `npm run lint` | Checks the code with ESLint. |
| `npm run typecheck` | Generates Next.js route types and checks the TypeScript types. |
| `npm test` | Runs all tests against the live site. `BASE_URL=<address> npm test` runs them against another address. |
| `npm run test:unit` | Runs the unit tests (Vitest). Add `-- --watch` to rerun them on every save. |
| `npm run test:local` | Runs all browser tests against a local production build with a fresh test database. |
| `npm run test:smoke` | Runs the read-only smoke tests (`@smoke`) against the live site, or against `BASE_URL`. |
| `npm run test:time` | Runs the unit tests and `npm run test:local` and prints the number of tests, the total time and the slowest tests, against the time budgets. |
| `npm run db:backup` | Saves a backup of the local database in `db/backups/`. |
| `npm run db:reset` | Rebuilds the local database from scratch, after saving a backup. Never runs against Turso. |
| `npm run db:turso` | Runs new migrations against Turso, using `.env.turso`. |
| `npm run copy-to-prod` | Shows which classes, add-ons, aircraft and reviews exist locally but not in production. Add `-- --go` to copy them. Only adds, never removes. |
