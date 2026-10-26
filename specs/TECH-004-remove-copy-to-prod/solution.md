---
id: TECH-004
title: Remove copy-to-prod
card: "#22"
depends_on: [TECH-013]
---

# TECH-004 Remove copy-to-prod: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 22`.

## Data

None. The script only read the local database and wrote to Turso; nothing in the site or the migrations used it.

## Interface

None. Visitors and administrators see no change.

## Decisions

- Deleted `scripts/copy-to-prod.mjs`, the `copy-to-prod` entry in `package.json`, the row in the `README.md` command table and the paragraph in `wiki/system/architecture.md` ("Pipeline"). A line is added to `wiki/log.md`.
- Nothing else is left unused: `lib/local-db.mjs` is still used by `scripts/db-setup.mjs`, `scripts/test-server.mjs`, `tests/plan.ts` and `vitest.global-setup.mjs`, and `.env.turso` is still read by `npm run db:turso`.
- Older specs (`TECH-005`, `TECH-013`) still mention the script; they record what was true then and are not changed.
