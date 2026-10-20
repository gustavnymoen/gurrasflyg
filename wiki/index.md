---
type: Index
title: Gurras Flyg wiki
description: Documentation of how Gurras Flyg is built, and the user manual for the site.
timestamp: 2026-10-20
---

# Gurras Flyg wiki

- [System documentation](system/index.md) (English): how the site is built and how its parts work.
- [Användarmanual](manual/index.md) (svenska): how to use the site, for travellers and administrators.
- [Log](log.md): what has changed, newest first.

## Page format

Every page starts with frontmatter:

| Field | Meaning |
|---|---|
| `type` | Kind of page, for example `Index`, `Architecture`, `API endpoint`, `Data file`, `Feature` or `Guide`. |
| `title` | Title of the page. |
| `description` | One-sentence summary. |
| `resource` | The code or data file the page describes, when there is one. |
| `feature` | The feature ID the page belongs to, for example `TRIP-001`, when there is one. |
| `tags` | Free keywords. |
| `timestamp` | Date the page was last updated, as `YYYY-MM-DD`. |

Every folder has an `index.md` listing its pages. Pages link to related code, specifications and tests.

Product purpose, terms and features are in [specs/overview.md](../specs/overview.md).
