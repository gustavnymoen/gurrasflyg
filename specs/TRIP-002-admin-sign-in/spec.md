---
id: TRIP-002
title: Admin sign-in
area: Administration
status: done
created: 2026-10-20
updated: 2026-10-20
depends_on: []
---

# TRIP-002 Admin sign-in

## Goal

Only the administrator can open the admin page and change the airline's data. The administrator signs in with a password and stays signed in until the browser closes, at most 8 hours.

## Background

Built before specification-driven development was introduced and specified afterwards. There is one shared password and no user accounts.

## Users

Administrator.

## Scope

**In scope**

- Sign-in page, sign-out, protection of `/admin` and of every admin change.

**Out of scope**

- Several administrators, user accounts, password reset.

## Requirements

### TRIP-002-R1 Admin requires sign-in

A visitor who isn't signed in and opens `/admin`, or any page under it, shall be sent to `/admin/login`.

Acceptance criteria:

- **Given** a visitor without a sign-in, **when** they open `/admin`, **then** they end up on `/admin/login`, which shows the heading "Admin", a password field and the button "Logga in".

### TRIP-002-R2 Wrong password

A wrong password shall show "Fel lösenord." under the field, and the visitor stays on the sign-in page.

Acceptance criteria:

- **When** the visitor enters a wrong password and presses "Logga in", **then** "Fel lösenord." is shown and the URL is still `/admin/login`.

### TRIP-002-R3 Sign in

The right password (the environment variable `ADMIN_PASSWORD`) shall sign the administrator in and open `/admin`. A signed-in administrator who opens `/admin/login` is sent to `/admin`.

Acceptance criteria:

- **When** the administrator enters the right password, **then** `/admin` opens with the heading "Admin".
- **Given** a signed-in administrator, **when** they open `/admin/login`, **then** they end up on `/admin`.

### TRIP-002-R4 Sign-in lasts until the browser closes, at most 8 hours

The sign-in shall be stored in an HTTP-only cookie without an expiry date, so the browser deletes it when it closes. The cookie holds its own expiry time, 8 hours after sign-in, and is rejected after that.

Acceptance criteria:

- **Given** a signed-in administrator, **then** the cookie `gurrasflyg_admin` is HTTP-only and has no expiry date (a session cookie).
- **Given** a cookie whose expiry time has passed, **then** it is not accepted. (Checked in code review: the test can't wait 8 hours, and a valid old cookie can't be made without the secret.)

### TRIP-002-R5 Forged sign-in is rejected

The cookie shall be signed with HMAC-SHA256 using the secret `ADMIN_SESSION_SECRET`. A cookie with a wrong or missing signature is treated as not signed in.

Acceptance criteria:

- **Given** a visitor who sets the cookie `gurrasflyg_admin` to a made-up value, **when** they open `/admin`, **then** they end up on `/admin/login`.

### TRIP-002-R6 Sign out

The button "Logga ut" on the admin page shall sign the administrator out and open the sign-in page. After that, `/admin` requires a new sign-in.

Acceptance criteria:

- **When** the administrator presses "Logga ut", **then** `/admin/login` opens; **when** they then open `/admin`, **then** they are sent back to `/admin/login`.

### TRIP-002-R7 Every change checks the sign-in

Every server action that changes data shall check the sign-in itself, not rely on the page check. Without a valid sign-in it changes nothing and returns "Du är inte inloggad längre. Ladda om sidan och logga in."

Acceptance criteria:

- **Given** an expired or missing sign-in, **when** a server action is called, **then** nothing changes. (Checked in code review: `run()` in `app/admin/actions.ts` calls `isAdmin()` first.)

## Data

None. The sign-in is only stored in the cookie.

## Interface

- `app/admin/login/` (page, form and the actions `loginAction` and `logoutAction`).
- `proxy.ts` checks the cookie before every request under `/admin`.
- `lib/session.ts` creates and checks the cookie; `lib/auth.ts` is used by pages and actions.
- Texts: "Lösenord", "Logga in", "Loggar in…", "Fel lösenord.", "Logga ut".

## Non-functional requirements

- The password and signature are compared in constant time, so response times don't reveal how many characters were right.
- The cookie is `Secure` in production and `SameSite=Lax`.
- `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` are set in `.env.local` locally and in Vercel's environment variables in production, never in the code.
