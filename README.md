# Gurras Flyg

A flight booking site with fake data, built as part of a course in AI engineering. The course is about **how** software is built: specification-driven development, requirements in a backlog, tests, deploys, documentation and user manuals.

The site has two separate product areas (see `specs/overview.md`):

- **Flight booking:** search and book flights from airport A to B, on the airline's own routes, aircraft, cabin classes and add-ons, managed in admin.
- **Charter** (planned): trips to urban exploration destinations (abandoned towns, industrial sites, Cold War relics) from Stockholm Arlanda and Copenhagen, based on the course's sample data.

The live site is <https://gurrasflyg.vercel.app>.

## How it is built

- **Next.js 16** (App Router, TypeScript, Tailwind CSS) on **Node.js**. Pages and backend API routes are in the same project. This Next.js version differs from older ones; see `AGENTS.md`.
- **Database:** SQLite through `@libsql/client`. Locally a file, `~/Ai Projekt/gurrasflyg-data/gurrasflyg.db`, kept outside OneDrive because OneDrive breaks SQLite files while they are in use. Backups are saved in the project's `db/backups/`, which OneDrive does sync (see [Local database and backups](#local-database-and-backups)). In production **Turso**, a hosted SQLite.
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

The site is built one feature at a time, and the specifications decide what is built. `CLAUDE.md` describes the workflow step by step; it is also the instruction file for AI coding tools.

- **Feature IDs** are given in the order features are specified: `TRIP-001`, `TRIP-002` and so on.
- **Specification:** a folder `specs/<status>/<feature ID>-<name>/` with `spec.md` (the specification), `flow.mmd` (a Mermaid flow diagram) and, once work starts, `verification.md` (how it was checked) and `review.md` (the code review). The folder moves between `backlog/`, `ongoing/` and `done/` as the work progresses. Start from `specs/_template/`.
- **One backlog** for the whole site, in `specs/overview.md`. Each spec says in its `area` field which part of the site it belongs to: Flight booking, Charter, Administration or Shared.
- **Requirements** have IDs within their feature: `TRIP-001-R1`, `TRIP-001-R2` and so on.
- **Tests:** one file per feature, `tests/<feature ID>-<name>.spec.ts`, with each test named after the requirement it checks.
- **Product overview:** `specs/overview.md` describes the product's purpose, shared terms, scope, the list of features and rules that apply across features.
- **Wiki:** `wiki/system/` documents how the site works (English) and `wiki/manual/` how to use it (Swedish). Every page starts with frontmatter (`type`, `title`, `description`, `resource`, `feature` when the page belongs to one, `tags`, `timestamp`), so the wiki can later feed a chatbot. The `index.md` pages, `wiki/system/architecture.md` and `wiki/log.md` grow as features are finished.
- **Code review:** before a feature is done, a reviewer agent reviews the change and its report is posted on the pull request. See [wiki/system/code-review.md](wiki/system/code-review.md).
- **Definition of Done:** tests, updated spec, updated manual and wiki, no leftovers, clean code, code review, and technical tasks recorded for improvements found along the way. See `CLAUDE.md`.
- **Technical tasks** (`TECH-001`, …) are improvements to the code that don't change what the site does. They are in the same backlog as features.
- **Git:** one branch per feature, named after its spec folder. Commit messages start with the feature ID.

## Folders

- `app/`: pages, and API routes under `app/api/`. Admin pages under `app/admin/`, shared interface parts under `app/components/`.
- `lib/`: shared backend code: database access, admin logic, bookings, reviews, sign-in.
- `db/`: `schema.sql` and `seed.sql` for a new database, and `migrations/` with numbered changes.
- `scripts/`: database setup, route generation, copying data to production and the Playwright install.
- `data/` and `knowledge/`: the course's sample data, see below.
- `specs/`: product overview and feature specifications.
- `tests/`: Playwright tests.
- `wiki/`: system documentation and user manual.
- `public/`: images and other files served as they are.

## Course sample data

Ready-made sample data from the course. It is read-only: features read or import it but don't change it, and specifications and tests refer to its IDs. Descriptions are written from general knowledge, and airports, travel times, flight times and prices are approximate or invented.

- `knowledge/`: one page per destination (96), with its description, nearest airport, how to get there and visiting notes. Start at `knowledge/index.md`.
- `data/destinations.json`: the facts from the destination pages, in one file.
- `data/flights.json`: flight timetables to and from Stockholm Arlanda (ARN) and Copenhagen (CPH), November 2026 to April 2027. See `wiki/system/data-flights.md`.
- `data/airports.json`: names and locations of the airports.
- `public/images/`: a photo of each destination, from Wikimedia Commons. The `image` field of each destination gives the photo's credit: author, licence and source. Most licences require the credit to be shown with the photo.

`GET /api/destinations` returns all destinations (see `wiki/system/api-destinations.md`). The smoke test uses it.

## Pipeline

```
branch ──push──▶ pull request ──▶ CI (GitHub): npm ci → lint → type check → build → test:local
   │                          └─▶ Vercel preview ──▶ Preview tests (GitHub): npm test against the preview
   │                                     both green?
   └──────────────▶ merge to main ──▶ Vercel publishes ──▶ Live tests (GitHub): npm test
```

- **CI** (`.github/workflows/ci.yml`) runs on every pull request to `main` and every push to `main`. A branch without a pull request is checked locally until its pull request is opened. CI uses a throw-away admin password and its own test database, never production. A newer push to the same branch cancels the older run.
- **Preview tests** (`.github/workflows/preview-tests.yml`) run on every pull request to `main`: the job waits until Vercel reports the branch's preview deployment as ready, then runs `npm test` against it. The preview has its own Turso database, so test data never reaches production. Vercel's Deployment Protection is passed with the repository secret `VERCEL_AUTOMATION_BYPASS_SECRET` (created in Vercel under Settings → Deployment Protection → Protection Bypass for Automation); the admin tests use `ADMIN_PASSWORD`, which is the same on Preview as on Production.
- **Live tests** (`.github/workflows/live-tests.yml`) run after every successful production deploy on Vercel, against <https://gurrasflyg.vercel.app>. They can also be started by hand under Actions → Live tests → Run workflow. The admin tests need the repository secret `ADMIN_PASSWORD` (GitHub → Settings → Secrets and variables → Actions); without it they are skipped.
- The three workflows share their setup (`.github/actions/setup-tests/`): Node, `npm ci` and Chromium, which is cached between runs per Playwright version.
- When tests fail, the run saves Playwright's report with screenshots as an artifact, downloadable from the run's page. Preview tests save no traces, since a trace would hold the bypass secret.
- Merge to `main` only when CI and Preview tests are green. The repository is private on a free plan, so GitHub doesn't enforce this; it is part of the way of working.

## Local database and backups

- The database is `~/Ai Projekt/gurrasflyg-data/gurrasflyg.db`, outside OneDrive.
- A backup is saved in `db/backups/` every time `npm run dev` starts, before migrations and before `npm run db:reset`. `npm run db:backup` saves one whenever you want. The 20 newest are kept.
- `db/backups/` is in the project folder, so OneDrive syncs it to the cloud, but it is not in Git.
- **To restore:** stop the dev server, copy a backup to `~/Ai Projekt/gurrasflyg-data/gurrasflyg.db` (replacing the file, and delete any `gurrasflyg.db-wal` and `gurrasflyg.db-shm` next to it), and start `npm run dev`.
- On a new computer, `npm run dev` creates an empty database with sample data. Restore a backup to get your own data back.

## Tests

- Every requirement has a test named after its ID, for example `TRIP-003-R5 delete a cabin class, unless it is in use`, in `tests/<feature ID>-<name>.spec.ts`. Requirements that can't be tested from the browser are checked in code review, recorded in the feature's `verification.md`.
- `npm run test:local` (`scripts/test-server.mjs`) builds the site in `.next-test/`, rebuilds the test database `~/Ai Projekt/gurrasflyg-data/test.db` from scratch and starts the site on port 3100. Your own local database is never touched, and a running `npm run dev` isn't disturbed.
- `npm test` runs against <https://gurrasflyg.vercel.app>. Admin tests sign in with `ADMIN_PASSWORD` from `.env.local` and are skipped without it.
- Tests create their own data named "E2E …" and delete it again. `tests/global-teardown.ts` removes any leftovers after every run. Tests that would change shared data irreversibly (for example reassigning every route's aircraft) or read the database directly run only locally.
- Run both before a feature is done: locally before pushing, against the live site after the deploy.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Installs the dependencies and Playwright's browser. |
| `npm run dev` | Updates the local database and starts the dev server. |
| `npm run build` | Builds the site locally, to catch build errors before pushing. |
| `npm run lint` | Checks the code with ESLint. |
| `npm run typecheck` | Generates Next.js route types and checks the TypeScript types. |
| `npm test` | Runs all tests against the live site. `BASE_URL=<address> npm test` runs them against another address. |
| `npm run test:local` | Runs all tests against a local production build with a fresh test database. |
| `npm run db:backup` | Saves a backup of the local database in `db/backups/`. |
| `npm run db:reset` | Rebuilds the local database from scratch, after saving a backup. Never runs against Turso. |
| `npm run db:turso` | Runs new migrations against Turso, using `.env.turso`. |
| `npm run copy-to-prod` | Shows which classes, add-ons, aircraft and reviews exist locally but not in production. Add `-- --go` to copy them. Only adds, never removes. |
