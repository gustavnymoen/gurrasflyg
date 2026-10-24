"use server";

// Betala (TRIP-012-R8). En server action går att anropa utan sidan, med vad
// som helst, så allt kontrolleras igen här och i createBooking, och priserna
// räknas från databasen.

import { type BookingForm, type BookingSummary, bookingSummary } from "@/lib/booking-rules";
import { BookingError, CHANGED, createBooking } from "@/lib/bookings";
import { loadTrip } from "@/lib/flights";

export type BookResult = { ok: true; summary: BookingSummary } | { ok: false; error: string };

// query är resans adress efter "?", form det besökaren fyllt i
export async function bookAction(query: string, form: BookingForm): Promise<BookResult> {
  if (typeof query !== "string") return { ok: false, error: CHANGED };
  const trip = await loadTrip(Object.fromEntries(new URLSearchParams(query)));
  if ("problem" in trip) return { ok: false, error: CHANGED };
  try {
    const { bookingNumber, legs } = await createBooking({ search: trip.search, legs: trip.legs, form });
    return { ok: true, summary: bookingSummary(bookingNumber, form, legs, trip.flights) };
  } catch (e) {
    if (e instanceof BookingError) return { ok: false, error: e.message };
    console.error(e);
    return { ok: false, error: "Något gick fel, försök igen." };
  }
}
