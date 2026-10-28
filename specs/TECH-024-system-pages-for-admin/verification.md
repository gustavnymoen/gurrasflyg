---
id: TECH-024
title: System pages for the administration and reviews
---

# Verification of TECH-024

| Requirement | How it was checked | Where | Result | Date |
|---|---|---|---|---|
| TECH-024-R1 | Manual: every statement in `admin.md`, `admin-sign-in.md` and `reviews.md` compared with the code by the reviewer ([review.md](review.md)); the file names, functions, tables, limits and messages exist and match. No test: a text's truth to the code can't be automated | local | Pass | 2026-10-27 |
| TECH-024-R2 | Manual: `design.md` read against `DESIGN.md` in the review; it summarises and links, and the link path is valid | local | Pass | 2026-10-27 |
| TECH-024-R3 | Manual: a throwaway script over `wiki/` checks the frontmatter of every page, no frontmatter on `index.md` and `log.md` (only `okf_version` in the root), every page listed in its folder's index and reachable from `wiki/index.md`, every relative link and anchor, and every index entry equal to its page's `description` (38 pages, no problems). The reviewer ran its own script. No test: the script is not part of the repo | local | Pass | 2026-10-27 |

## The test plan

| Check | How it was done | Where | Result | Date |
|---|---|---|---|---|
| Unit tests | Not applicable: no code changes. `npm run test:unit` still passes (204) | local | Pass | 2026-10-27 |
| Browser tests | Not applicable: the site is unchanged. `npm run test:local` still passes (173) | local | Pass | 2026-10-27 |
| Smoke test | Not applicable: no page or flow changes | | | |
| Accessibility | Not applicable: nothing visitors see changes | | | |
| Security | Not applicable: no code. The reviewer checked that the pages name `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` but no values; `/security-review` not needed | local | Pass | 2026-10-27 |
| Code review | [review.md](review.md) | local | Passed | 2026-10-27 |

## Test suite

`npm run test:time` before and after the change (budgets and rules in `wiki/system/testing.md`). The change adds no tests, so the numbers are the same; the time varies between runs.

| | Tests | Total time | Slowest test |
|---|---|---|---|
| Before (TRIP-029, `verification.md`) | 204 unit, 173 browser | 173.3 s | 6.2 s, `TRIP-013-R1` |
| After | 204 unit, 173 browser | 0.8 s + 167.0 s | 3.7 s, `TRIP-029-R3 R4` |

Within the budgets (30 s, 180 s, 5 s per test). The "before" slowest test was over the budget at the time and is not slower now; nothing in this change touches it.

## Definition of Done

- [x] Tests: every check in the card's test plan is done; every requirement has a recorded manual check (no test can check a text against code); `npm run test:unit` and `npm run test:local` pass (`npm run test:time`)
- [x] Test suite: within the time budgets, no tests added
- [x] Deployed, and the smoke tests pass against production (Live tests)
- [x] Accessibility: not applicable, visitors see no change
- [x] Requirements in the card match what was built, no open questions left; copied below as built; `solution.md` describes how it was built
- [x] Manual (`wiki/manual/`: a line to the new system pages on five pages), system docs (`wiki/system/`) and `wiki/log.md` updated
- [x] No leftovers: the Design bullet that went to `DESIGN.md` now goes to `design.md`; two index bullets that repeated listed pages are removed; the throwaway scripts are not in the repo
- [x] Clean code: no code changed; `npm run lint` and `npm run typecheck` pass (`npm run build` not run: the site is unchanged and `test:local` builds it)
- [x] Code review done, no must-fix findings left; see [review.md](review.md)
- [x] Technical tasks for larger improvements noticed along the way: none new (a `solution.md` for the oldest spec folders is named as out of scope in the card)

## Requirements as built

### TECH-024-R1 System pages for the administration and reviews

`wiki/system/` shall have pages that describe how sign-in, classes and add-ons, aircraft, routes and aircraft assignment, and reviews are built: the pages and server actions, the rules in `lib/`, the tables, and the decisions and why.

Acceptance criteria:

- **Given** a feature built in TRIP-002 to TRIP-006, **when** its code is looked for in the wiki, **then** a system page names the files in `resource` and links to its spec folder and its manual page.
- **Given** the page text, **when** it is compared with the code, **then** the file names, tables and rules in it exist and are correct.

### TECH-024-R2 A system page for the design

`wiki/system/` shall have a page for the design "Loungen" that says what `DESIGN.md` contains and links to it.

Acceptance criteria:

- **Given** `wiki/system/index.md`, **when** the design is looked for, **then** it links to the page, and the page links to `DESIGN.md`.

### TECH-024-R3 Reachable and linked

Every page in `wiki/` shall be reachable from `wiki/index.md` through the `index.md` pages and shall have the frontmatter fields listed there.

Acceptance criteria:

- **Given** the files in `wiki/system/` and `wiki/manual/`, **when** each is looked for in its folder's `index.md`, **then** every one is listed.
- **Given** every wiki page, **when** the frontmatter is read, **then** `type`, `title`, `description` and `timestamp` are there, and `resource`, `feature` and `tags` where the page has them to give.
- **Given** the links between pages, **when** they are followed, **then** none is broken.
- **Given** every `index.md` in `wiki/`, **when** it is read, **then** it has no frontmatter, except `wiki/index.md`, which has only `okf_version: "0.2"`. The same goes for `wiki/log.md`, which OKF also reserves.
- **Given** every wiki page that is not an `index.md` or `log.md`, **when** the frontmatter is read, **then** it has `type` and `generated` with `by` and `at` (ISO 8601 with a UTC offset), and no `timestamp`.
- **Given** an entry in an `index.md`, **when** it is compared with the page it links to, **then** its text is that page's `description`.

## Notes

- `wiki/log.md` is treated like `index.md` (no frontmatter), since OKF reserves both. The card's R3 was reworded to say so.
- The review found one wrong sentence (the heading "Vad våra resenärer säger" stays when there are no reviews), one imprecise one (the attempt counter still counts while an address is locked) and two index entries that did not repeat their page's description. All fixed. The second run suggested a one-line fix of a misleading comment in `lib/login-limit.ts` (it said no more attempts are counted once locked); done, comment only.
