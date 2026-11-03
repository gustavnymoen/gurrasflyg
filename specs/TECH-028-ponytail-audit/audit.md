---
id: TECH-028
title: Ponytail audit of the solution
---

# Audit report

- **Date:** 2026-11-03
- **Tool:** `ponytail:ponytail-audit`, plugin `ponytail@ponytail` version 5.3.3, level **full**
- **Branch:** `TECH-028-ponytail-audit`, based on `main` after PR #112
- **Assumed load:** a hobby site with a few visitors at a time; the rate limits (10 bookings and 60 API calls per address) are the only protection against many requests.

## Scope

**Audited:** `app/`, `lib/`, `db/` (schema, seed, migrations), `scripts/`, `tests/`, the configuration files in the root, `.github/` (workflows, actions).

**Left out:** `data/`, `knowledge/`, `public/images/` (read-only course data), `node_modules`, the text of `wiki/` and `specs/` (read only to check that code and requirements agree), and `.claude/` (tools for the development, not the site).

**Read in full:** sign-in and session (`lib/session.ts`, `lib/auth.ts`, `proxy.ts`, `app/admin/login/actions.ts`), the rate limits (`lib/rate-limit.ts`, `login-limit.ts`, `flow-limits.ts`, `client-ip.ts`), booking and cancelling (`lib/bookings.ts`, `charter-bookings.ts`, `my-booking.ts`), the admin code (`lib/admin.ts`, `reviews.ts`, `app/admin/actions.ts`), the API routes, `lib/db.ts`, `lib/travel.ts`, `lib/markdown.ts`, `scripts/db-setup.mjs`, `scripts/test-server.mjs`, the CI and live workflows, `next.config.ts`. **Skimmed, not read line by line:** the React components, `lib/booking-rules.ts`, `charter-rules.ts`, `fare-rules.ts`, `flight-rules.ts`, `dates.ts`, the migrations' data and most browser tests (their names and the unit tests' presence were checked).

## Marks

Marks are the card's: **must-fix**, **should-fix**, **not needed**. The marks below are proposed by Claude and settled with the user.

| # | Finding | Mark | Reason | Fix |
|---|---|---|---|---|
| F1 | The admin session cookie (`lib/session.ts`) has no unit test. The browser test TRIP-002-R5 only forges a cookie with a zero signature. Nothing checks that a cookie with a **valid signature but past expiry** is refused, that a changed expiry is refused, that malformed values are refused, or that the password check and `safeEqual` compare correctly. | must-fix | Security code with no test that fails when it breaks (the card's rule for risky code). | `lib/session.test.ts`, tests `TECH-028-R2 F1 …`. No code change in `session.ts`: it behaves correctly. |
| F2 | Reading the whole destination list (5 queries) to find one destination: `getCharterDestination`, `getDestinationAirport` (every charter booking) and the two destination API routes do it for every request. | should-fix | Slow path, not a problem at about 100 destinations and a rate limit of 60 per minute. Larger than a small fix: a query per destination in `lib/travel.ts`. | Card TECH-029 (#113). |
| F3 | `createBooking` and `createCharterBooking` are near-copies: `newBookingNumber`, the `existing` check by `request_id`, the error class and the `CHANGED`/`INVALID` texts, and the two server actions. | should-fix | Duplication that must change together. Larger than a small fix. | Card TECH-029 (#113). |
| F4 | `lib/reviews.ts` (`createReview` validation: rating 1–5, empty and too-long texts) has no unit test; it is covered only through the browser in TRIP-006. | should-fix | Smaller code without a unit test; the browser test covers the main case. | Card TECH-029 (#113). |
| F5 | Every call of an API route does two extra database statements for the rate limit (`DELETE` then `INSERT … RETURNING`), so one keystroke in the airport search costs three database round trips on Turso. | should-fix | Real but small cost; the site is not slow because of it today. | Card TECH-029 (#113). |
| F6 | `db/gurrasflyg.db` (156 kB, dated 2026-10-20) is a leftover in the project folder from before the database moved to `~/Ai Projekt/gurrasflyg-data/`. It is ignored by Git and not used. | should-fix | Leftover file. It is the user's data, so Claude does not delete it; the user decides. | Left to the user. |
| F7 | "Foreign keys are switched off after the first transaction on the local file" (suspected from how `libsql` hands out connections). | not needed | Wrong. Tested on a copy: foreign keys stay enforced before, inside and after a transaction (libsql keeps a pool). | None. |
| F8 | "`requestId` of a booking is not limited in length". | not needed | Wrong. `fitsForm` in `lib/booking-rules.ts` requires `^[\w-]{8,64}$`, and charter bookings use it too. | None. |
| F9 | `clientIp` and `flow-limits` have no unit test. | not needed | Covered by the browser test `tests/TECH-025-rate-limit.spec.ts` (address from `x-forwarded-for`, no header means unlimited), and `lib/rate-limit.test.ts` covers the counting. | None. |
| F10 | `'unsafe-inline'` in the Content Security Policy. | not needed | A recorded decision: TECH-026-R3 and TECH-027 (`wiki/system/security-headers.md`). | None. |
| F11 | A booking's capacity is checked per booking, not across all bookings of the same flight. | not needed | A deliberate rule of TRIP-012 (the admin code and its error text say "i en bokning"). | None. |

No bugs, security holes or data-loss risks were found in the code that was read; the only must-fix finding is the missing test in F1.

## How the must-fix findings were fixed

- **F1:** `lib/session.test.ts`, in the commit `TECH-028: Ponytail-granskning av lösningen` on this branch. Checked locally with `npm run test:unit`; see [verification.md](verification.md).

## Verdict

Healthy. The weakest spots are duplication between the flight and charter booking code (F3) and the destination list being read in full for each request (F2).

Lean: about 100 lines could go if F3 is merged; no dependencies. Not checked: the React components line by line, the generated data in the migrations, and `.claude/`.
