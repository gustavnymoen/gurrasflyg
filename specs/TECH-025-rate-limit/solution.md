---
id: TECH-025
title: Rate limit on public flows
card: "#99"
depends_on: [TECH-017]
---

# TECH-025 Rate limit on public flows: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 99`.

## Data

None. The counters use the existing table `login_attempts` (`ip` is the key, `attempts`, `last_failed_at`), with the flow as a prefix in the key: `bokning:<ip>`, `api:<route>:<ip>`, `uppslag:<ip>` (Min bokning), and the bare address for the admin sign-in. Renaming the table is out of scope.

## Interface

- **`lib/rate-limit.ts`**: the generic part. `registerAttempt(key, { max, windowMs })` counts one attempt in one SQL statement and returns `{ msLeft }` when the key is locked, otherwise `null`. `clearAttempts(key)`, `minutesLeft()` and `tooManyMessage()` ("För många försök. Försök igen om N minuter.") are shared by every flow.
- **`lib/login-limit.ts`**: now a thin layer with the sign-in's limit (5 in 15 minutes). Its exports and tests are unchanged.
- **`lib/flow-limits.ts`**: the limits of the public flows and the two functions that apply them to a request: `bookingLimitError()` (10 presses of Betala in 15 minutes, per address) and `apiLimitResponse(route)` (60 calls in a minute, per route and address; answers 429 with `Retry-After` and `{ error: "För många anrop. Försök igen om N sekunder." }`).
- **`lib/client-ip.ts`**: `clientIp()`, which used to be copied in the sign-in and Min bokning actions.
- **`bookAction`, `bookCharterAction`**: refuse a `query` longer than `MAX_QUERY_LENGTH` (1 000, `lib/booking-rules.ts`) as "ändrats", then count the press. The booking is refused with `tooManyMessage` when the address is locked.
- **`/api/airports`, `/api/destination-search`, `/api/destinations`**: call `apiLimitResponse()` first.

## Decisions

- **Counted before anything is checked.** Like the sign-in: one `INSERT … ON CONFLICT … RETURNING`, so many requests at once can't slip past the limit. Every press counts, also one that fails validation; 10 in 15 minutes is far above what an honest visitor needs.
- **Fixed window for the new flows.** The card says "10 in 15 minutes" and "60 in a minute", so the window is counted from the first attempt (`fixedWindow`), not the latest: otherwise 61 calls spread over 20 minutes, never more than a few a minute, would lock a visitor (found in the review). `last_failed_at` then holds the window's start. The sign-in keeps its older meaning, a lock counted from the latest guess.
- **Cleanup per flow.** The flows have different windows (15 minutes and 1 minute) in one table. Expiry is judged by the cleanup, so a statement deletes the key's own row after the flow's window, and every row older than the longest window (`LONGEST_WINDOW_MS`, 15 minutes), which is expired for all flows. Another flow's rows are never removed early. A window longer than `LONGEST_WINDOW_MS` is refused with an error, since its rows could be cleaned up too early.
- **A request without `x-forwarded-for` is not limited** by `flow-limits.ts` (`LOCAL_IP`). Vercel always sets the header, so the live site is covered; a local run and the test suite, which books many times from one address, are not. The limits are tested with an address of their own (`tests/TECH-025-rate-limit.spec.ts`), with the counter already filled in the test database. The sign-in and Min bokning keep counting `local`, as before. The card did not say this; it was added to R1 and R3 when the tests turned out to need it.
- **The database for the API routes too.** One extra query per call, in return for a limit that holds when every request runs in a new Vercel function. A limit in memory per instance would be easy to walk around.
- **`/api/destinations` becomes dynamic.** Reading the address needs `headers()`, which ends prerendering (the route already read the database).
- **`tripDays()` moved to `tests/helpers.ts`** as `charterTripDays()`, since the new browser test needs the same dates as `tests/TRIP-014-charter-booking.spec.ts`.
