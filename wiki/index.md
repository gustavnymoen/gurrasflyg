---
okf_version: "0.2"
---

# Gurras Flyg wiki

- [System documentation](system/index.md) (English): how the site is built and how its parts work.
- [Användarmanual](manual/index.md) (svenska): how to use the site, for travellers and administrators.
- [Log](log.md): what has changed, newest first.

## Page format

The wiki follows the [Open Knowledge Format](https://github.com/GoogleCloudPlatform/open-knowledge-format/blob/main/SPEC.md) (OKF) v0.2: markdown files in a folder tree, one subject per page, linked to each other, so that an agent can start here and follow the links to every page.

Every page starts with frontmatter:

| Field | Meaning |
|---|---|
| `type` | Kind of page, for example `Feature`, `Architecture`, `API endpoint`, `Data file` or `Guide`. The only field OKF requires. |
| `title` | Title of the page. |
| `description` | One-sentence summary. The `index.md` pages reuse it for their entries. |
| `resource` | The code or data file the page describes, when there is one. |
| `feature` | The feature IDs the page belongs to, for example `TRIP-001`, when there is one. Not part of OKF, which allows extra fields. |
| `tags` | Free keywords. |
| `generated` | `by` (who wrote it: `claude`, or `human:<name>` for text written by a person) and `at` (when it was last updated, ISO 8601 with a UTC offset). Replaces the older `timestamp`. |

`index.md` and `log.md` are special in OKF and have no frontmatter; only this root `index.md` has one, with `okf_version`. Every folder has an `index.md` listing its pages with their descriptions, and `log.md` lists changes by date, newest first. Pages link to related pages, code, specifications and tests.

Product purpose, terms and features are in [specs/overview.md](../specs/overview.md).
