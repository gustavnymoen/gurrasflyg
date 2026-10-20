@AGENTS.md

# Working on Gurras Flyg

This project is built with **specification-driven development**. The specifications in `specs/` are the source of truth: they decide what gets built, and code, tests and documentation follow from them. Read `README.md` for the project layout and conventions, and `specs/overview.md` for the product, its terms and the rules that apply across features.

## The workflow

Every change to the site's behaviour belongs to a feature with an ID (`TRIP-001`, `TRIP-002`, …), and goes through these steps in order:

1. **Specify.** There is one backlog for the whole site (`specs/overview.md`); pick the item with the user. Create `specs/backlog/<ID>-<name>/` from `specs/_template/`, and set `area` (Flight booking, Charter, Administration or Shared): `spec.md` with numbered requirements (`<ID>-R1`, `<ID>-R2`, …) and acceptance criteria, and `flow.mmd`. Add the feature to the list in `specs/overview.md`. Open questions are settled with the user before the spec leaves the backlog.
2. **Start.** Move the folder to `specs/ongoing/` and create a Git branch named after the folder, for example `TRIP-007-charter-search`.
3. **Build.** Implement exactly what the requirements say. If the spec turns out to be wrong or incomplete, stop and update the spec with the user first, then the code. Never let code and spec disagree.
4. **Test.** Write `tests/<ID>-<name>.spec.ts`. Name every test after the requirement it checks, for example `test("TRIP-007-R2 shows only departures on the chosen date", …)`. Every requirement has at least one test, or a manual check or code review recorded in `verification.md` with the reason it can't be automated. Tests must pass both locally and against the live site:
   - Use the helpers in `tests/helpers.ts` (sign-in, unique names, creating classes, add-ons and aircraft).
   - Data a test creates is named with `uniqueName()` ("E2E …") and deleted by the test itself.
   - Tests that would change shared data irreversibly, or read the database directly, are skipped unless `runsLocally`.
   - Never weaken a test to make it pass. A failing test is either a bug in the site (report it to the user) or a wrong test (fix the test and, if needed, the spec).
5. **Verify.** Fill in `verification.md`: each requirement, how it was checked, where (local or live), the result and the date. Only record checks that were actually done; anything not checked is written as not checked. Run `npm run lint`, `npx tsc --noEmit`, `npm run build` and `npm run test:local`, and after deploy `npm test` against the live site.
6. **Document.** Update `wiki/system/` (how it works, in English) and `wiki/manual/` (how to use it, in Swedish), the `index.md` pages, `wiki/system/architecture.md` if the structure changed, and add a line to `wiki/log.md`.
7. **Done.** Move the folder to `specs/done/` and update the feature's status in `specs/overview.md`. Commit with the feature ID in the message, for example `TRIP-007: Sök charterresor`.

Small fixes that don't change behaviour (typos, styling details, refactoring) don't need a new feature, but still keep the specs and wiki true.

## Languages

- Specifications, system documentation (`wiki/system/`), README and this file: **English**.
- User manual (`wiki/manual/`) and everything visitors see on the site: **Swedish**.
- Code comments: Swedish, as in the existing code.

## Rules

- **Course data is read-only.** `data/`, `knowledge/` and `public/images/` are the course's sample data. Specs and tests refer to their IDs. Import or read them, never edit them.
- **Database changes go through migrations** in `db/migrations/NNN_<name>.sql`, run by `scripts/db-setup.mjs` before `dev` and `build`. Never edit an applied migration; add a new one. Prices are stored as integers in öre (SEK). Course prices in EUR are converted at 1 EUR = 10 SEK.
- **The local database is the user's own data.** It lives at `~/Ai Projekt/gurrasflyg-data/gurrasflyg.db`, outside OneDrive, with backups in `db/backups/` (synced by OneDrive). Never reset it, delete from it or write test data to it. Experiments run on a copy (`TURSO_DATABASE_URL=file:<copy>`). Tests that write data must clean up after themselves or run against a separate database.
- **Production** is Vercel with Turso. `npm run db:reset` never runs against Turso. Secrets (`.env.local`, `.env.turso`) are never committed or printed.
- **Git:** work on a branch per feature, commit only when the user asks, and push only when the user asks. Check staged files before every commit.
