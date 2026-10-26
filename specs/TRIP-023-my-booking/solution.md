---
id: TRIP-023
title: Manage my booking
card: "#59"
depends_on: [TRIP-012, TRIP-014, TECH-017]
---

# TRIP-023 Manage my booking: solution

How it is built. What is built and why (goal, scope, requirements) is in the card: `gh issue view 59`.

## Data

Migration `012_cancellations.sql`, which only adds:

- `booking_cancellations` (flight) and `charter_booking_cancellations` (charter): one row per cancellation with the booking, a `request_id` (unique, from the browser), `won` (0/1), `amount` (what was cancelled), `refunded` (`amount` on a win, else 0) and `cancelled_at`. Both cascade when their booking is deleted.
- `booking_seats.cancellation_id` and `charter_booking_passengers.cancellation_id`: null until cancelled, then the cancellation. The cancelled parts are never deleted (R11). The seat is the unit on a flight booking (a passenger's place on one flight, with its add-ons), the passenger is the unit on a charter booking (both trips and the extras per person). A flight or a whole booking is cancelled when all its seats or passengers are; that is derived, not stored.
- The guess limit reuses `login_attempts` (TECH-017) with the key `uppslag:<ip>`, so it is counted apart from the admin sign-in and can never collide with an IP address.

`bookings.total` is not changed by a cancellation. What was refunded is the sum of `refunded`; what is left to pay is `total` minus that.

## Interface

- **Menu** (`app/components/Menu.tsx`, in the header of `app/layout.tsx`): a ring button "Meny" like the wordmark's, opening a list with Start, Min bokning and Admin; the footer's links are gone. The items are `FlowLink`s (new in `AbortFlow.tsx`, `StartLink` is built on it): inside the flight or charter flow they are buttons that ask "Är du säker?" first. The list is open only on the page where it was opened (`openOn === pathname`), so it closes by itself when the page changes, and the question lives inside the list so it is not unmounted while it is open.
- **`/min-bokning`** (`app/min-bokning/`): `MyBooking` shows `LookupForm` and then `BookingView`. The number and last name are typed into controlled fields and sent in a server action (`lookUpAction`), never in the address; the booking exists only in the component's state, so a reload starts over. `FlightParts` and `CharterParts` draw the cards with the ticking boxes, `BookingParts` the contact, totals and history, `CancelPanel` the rules, the button and the "Är du säker?" dialog.
- **Server actions** (`app/min-bokning/actions.ts`): `lookUpAction` and `cancelAction` check the types, take the IP from `x-forwarded-for` as the sign-in does and call `lib/my-booking.ts`.
- Texts: "Vi hittar ingen bokning med de uppgifterna." (the same for a wrong number and a wrong last name), "Skriv bokningsnumret." / "Skriv efternamnet.", "För många försök. Försök igen om N minuter.", "Det är för sent att avboka", "Avbokad", the result texts of the lottery and the dialog.

## Decisions

- **The server computes everything.** `cancelParts(ip, { bookingNumber, lastName, requestId, ids })` gets only the ticked ids. In one write transaction it reads the whole booking again (`readFlightBooking`/`readCharterBooking`, the same code that draws the page, so the page and the check agree), refuses an id that is not in the booking, already cancelled or too late, sums the amount, draws, inserts the cancellation and marks the parts. The browser sends no amount and no outcome (R10, R12).
- **One draw per confirmation.** The browser makes a new `requestId` each time the question opens; a second request with the same id (a double click) finds the cancellation and returns it without a second draw. Two at the same moment are serialised by the write transaction.
- **Lottery:** `winsLottery(random)` is `random < 0.5`, with `random` from `crypto.randomInt` (`secureRandom`); the unit tests inject the number. A win refunds the whole amount cancelled.
- **24 hours** (`canCancel` in `lib/cancel-rules.ts`): the departure's instant (`instant()` from `lib/fare-rules.ts`, in the departure airport's time zone, summer time included) must be more than 24 hours after now. Flights are judged each; a charter booking by its outbound trip.
- **Same error for number and last name.** `findBooking` returns null for both; the lookup is by number, and the last name is compared in JavaScript with `toLocaleLowerCase("sv")` since SQLite's `lower()` only knows ASCII.
- **Guess count.** The attempt is counted before the credentials are checked (so parallel requests can't slip past), and a right lookup or cancellation clears the count, as the card says. This lets someone who owns a booking reset their own count between guesses; accepted because the number has about 10⁹ values and the last name must match too (noted in the review).
- **No amount in the browser's request** also means the page's "Vinner du får du …" is only a preview, computed by the same functions as the server.
- Mid-flow links: the question belongs to `FlowLink`, so Start, Min bokning and Admin ask the same "Är du säker?" as the wordmark.
