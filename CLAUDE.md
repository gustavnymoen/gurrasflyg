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
5. **Verify.** Fill in `verification.md`: each requirement, how it was checked, where (local or live), the result and the date. Only record checks that were actually done; anything not checked is written as not checked. Run `npm run lint`, `npm run typecheck`, `npm run build` and `npm run test:local`, and after deploy `npm test` against the live site.
6. **Document.** Update `wiki/system/` (how it works, in English) and `wiki/manual/` (how to use it, in Swedish), the `index.md` pages, `wiki/system/architecture.md` if the structure changed, and add a line to `wiki/log.md`.
7. **Review.** Run the reviewer agent (`.claude/agents/code-reviewer.md`), which follows `wiki/system/code-review.md`. Save its report as `review.md` in the feature's folder, from `specs/_template/review.md`. Fix every must-fix finding, run lint, the type check and the affected tests again, and run the review again until none are left; fix small should-fix findings now and add larger ones to the backlog. If the review stopped the feature, tell the user in a few lines what it found and how it was fixed; otherwise just say that it passed.
8. **Done.** Check every point in the Definition of Done below. Move the folder to `specs/done/` and update the feature's status in `specs/overview.md`. Commit with the feature ID in the message, for example `TRIP-007: Sök charterresor`.
9. **Merge.** Push the branch (when the user asks) and open a pull request to `main`. Post the feature's `review.md` on it as a comment (`gh pr comment`); if the review is run again later, post the new report as a new comment. GitHub's "CI" check runs lint, type check, build and `npm run test:local`. Merge only when it is green; the merge publishes the site, and "Live tests" then runs `npm test` against it.

Small fixes that don't change behaviour (typos, styling details) don't need a new feature, but still keep the specs and wiki true.

## Definition of Done

A feature or technical task is done when all of these hold. Record them in its `verification.md`.

1. **Tests:** every requirement has a test named after it (or a recorded manual check or code review), and `npm run test:local` and, after deploy, `npm test` pass.
2. **Accessibility:** what visitors see meets WCAG 2.2 level AA. Every page or state the change adds or alters is checked with `expectNoA11yViolations` (axe) in its tests, and the relevant items of the checklist in `wiki/system/accessibility.md` are gone through on the live site and recorded per item.
3. **Spec:** `spec.md` describes what was actually built. Anything that changed during the work is updated, and no open questions remain.
4. **Manual:** `wiki/manual/` (Swedish) describes how to use the feature, `wiki/system/` how it works, and `wiki/log.md` has a line.
5. **No leftovers:** code, files, exports, styles, scripts and documentation that the change made unused are deleted. No commented-out code, debug output or temporary files. Claude is responsible for the code being clean.
6. **Clean code:** reads like the surrounding code, reuses existing components and helpers instead of copying them, and `npm run lint`, `npm run typecheck` and `npm run build` pass without errors or warnings.
7. **Code review:** the review is done, `review.md` is saved, and no must-fix findings are left.
8. **Improvements handled:** small cleanups related to the work are fixed in the same change; larger or unrelated ones are added to the backlog as technical tasks (see below).

## Technical tasks

Improvements to the code that don't change what the site does: removing leftovers, removing duplicated code, making shared components (for example one button component instead of the same classes in many places), and making things faster.

- **Small and related: fix it now.** A small improvement in or right next to the code being changed is done as part of that change, without a backlog item. Mention it in the commit and in `verification.md`.
- **Large or unrelated: add a technical task.** Only what is too big for the current change, or concerns other parts of the code, goes to the backlog. Group small unrelated findings into one task instead of one task each. The backlog should not fill up with technical tasks.
- They are in the same backlog as features, in `specs/overview.md`, with the type **Tech** and IDs `TECH-001`, `TECH-002`, …, and a short description of the problem and where it is.
- When one is started it gets a folder like a feature, `specs/ongoing/TECH-001-<name>/`, from the same template. Its requirements are usually "the site behaves as before" (shown by the existing tests passing) plus the concrete change.
- The Definition of Done applies to them too.

## Code quality

This is a hobby project and a learning project. The code doesn't have to be perfect, but it should be tidy, consistent and easy to follow: clear names, small functions, shared components instead of copies, comments that explain why. Prefer the simple solution over the clever one. When a choice is worth learning from (a pattern, a trade-off, why something was refactored), explain it briefly to the user.

## Languages

- Specifications, system documentation (`wiki/system/`), README and this file: **English**.
- User manual (`wiki/manual/`) and everything visitors see on the site: **Swedish**.
- Code comments: Swedish, as in the existing code.

## Rules

- **Course data is read-only.** `data/`, `knowledge/` and `public/images/` are the course's sample data. Specs and tests refer to their IDs. Import or read them, never edit them.
- **Database changes go through migrations** in `db/migrations/NNN_<name>.sql`, run by `scripts/db-setup.mjs` before `dev` and `build`. Never edit an applied migration; add a new one. Prices are stored as whole kronor (SEK). Course prices in EUR are converted at 1 EUR = 10 SEK.
- **The local database is the user's own data.** It lives at `~/Ai Projekt/gurrasflyg-data/gurrasflyg.db`, outside OneDrive, with backups in `db/backups/` (synced by OneDrive). Never reset it, delete from it or write test data to it. Experiments run on a copy (`TURSO_DATABASE_URL=file:<copy>`). Tests that write data must clean up after themselves or run against a separate database.
- **Production** is Vercel with Turso. `npm run db:reset` never runs against Turso. Secrets (`.env.local`, `.env.turso`) are never committed or printed.
- **Git:** work on a branch per feature, commit only when the user asks, and push only when the user asks. Check staged files before every commit. Don't push directly to `main`; changes reach `main` through a pull request with a green "CI" check.
