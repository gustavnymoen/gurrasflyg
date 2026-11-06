---
id: TECH-031
title: Smaller Vercel functions
card: "#139"
depends_on: [TECH-024, TECH-025]
---

# TECH-031 Smaller Vercel functions: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 139`.

## Data

None.

## Interface

Nothing visitors see changes.

- `lib/db.ts` loads `@libsql/client` for a `file:` URL (local and tests) and `@libsql/client/web` for any other URL (Turso, `libsql://`). Both give the same `createClient` and the same exports of the file are unchanged. The two imports are written out in full: `import()` with a text computed in the code is refused by the build ("too dynamic").
- `next.config.ts` has `outputFileTracingExcludes` for `node_modules/@libsql/{darwin,linux,win32}-*`, libsql's native binaries.

## Decisions

- **The exclude is what removes the binary, the web client is what makes that safe.** Measured with a build without the exclude: the file tracer follows every `import()`, also the one that is never run on Vercel, so the binary stayed in 19 of 24 functions. With the exclude alone the Node client would fail to start on Vercel; with the web client chosen by the URL it is never loaded there.
- **Local files keep the regular client**, since the web client cannot open a `file:` database. The unit and browser tests therefore still run on the regular client, and the web client is only exercised on the preview (see `verification.md`).
- **`db/backups/` is traced too** (20 MB in the local trace), because of how `lib/local-db.mjs` reaches the folder. It is not in Git, so it is not in Vercel's build; left as it is.
