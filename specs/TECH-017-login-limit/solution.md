---
id: TECH-017
title: Limit admin sign-in attempts
card: "#52"
depends_on: [TRIP-002, TECH-013]
---

# TECH-017 Limit admin sign-in attempts: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 52`.

## Data

Migration `010_login_attempts.sql`: the table `login_attempts` (`ip` primary key, `attempts`, `last_failed_at` in milliseconds). One row per address that has tried; no password or other data is stored.

## Interface

- **`lib/login-limit.ts`**: `registerLoginAttempt(ip, now)` counts an attempt and returns `{ minutesLeft }` when the address is locked, otherwise `null`; `clearLoginAttempts(ip)` removes the row after a right password. `now` is a parameter so the unit tests don't wait.
- **`loginAction`** (`app/admin/login/actions.ts`) reads the address (`x-forwarded-for`, first entry, at most 45 characters, "local" when missing), registers the attempt, and only then checks the password. A locked address gets "För många försök. Försök igen om N minuter." ("1 minut" for one) without the one-second delay. A wrong password still gets "Fel lösenord." after one second; a right one clears the count and signs in.

## Decisions

- **The attempt is counted before the password is checked**, in one SQL statement (`INSERT … ON CONFLICT DO UPDATE … RETURNING`). If the count were updated only after a failure, a script could send many guesses at once and all would pass the check before any was counted.
- **A right password also needs fewer than six attempts.** The sixth attempt within the window is refused, even with the right password (R2). A locked address's `last_failed_at` stays as it was, so trying again does not lengthen the lock; it ends 15 minutes after the fifth attempt.
- **Per address, not in total**, so a stranger can't lock the administrator out from another address. On Vercel `x-forwarded-for` is set by Vercel itself; elsewhere it could be forged, which only lets someone use many addresses and is no worse than before.
- **IPv6.** An attacker with a whole IPv6 /64 can use a new address for every guess and so get past the limit. Accepted for this site, where the limit is a first barrier, not the only one; a limit across all addresses would be a separate card.
- **Old rows are deleted** at every attempt (`last_failed_at` older than 15 minutes), so the table stays small and an address is not kept longer than it is needed.
- **The browser test seeds the table** with five attempts for an address of its own instead of failing five times, which would take five seconds of delay, and uses `x-forwarded-for` so no other test is locked out.
