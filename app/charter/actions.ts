"use server";

// Betala (TRIP-014-R8). En server action går att anropa utan sidan, med vad
// som helst, så allt kontrolleras igen här och i createCharterBooking, och
// priserna räknas från databasen.

import { CharterBookingError, CHANGED, createCharterBooking } from "@/lib/charter-bookings";
import { type CharterForm, type CharterSummary, charterSummary, parseCharterSearch, parseChoice } from "@/lib/charter-rules";
import { getDestinationAirport } from "@/lib/travel";

export type CharterBookResult = { ok: true; summary: CharterSummary } | { ok: false; error: string };

// id är resmålet, query resans adress efter "?", form det besökaren fyllt i
export async function bookCharterAction(id: string, query: string, form: CharterForm): Promise<CharterBookResult> {
  if (typeof id !== "string" || typeof query !== "string") return { ok: false, error: CHANGED };
  const params = Object.fromEntries(new URLSearchParams(query));
  const search = parseCharterSearch(params);
  const destination = search ? await getDestinationAirport(id) : null;
  if (!search || !destination) return { ok: false, error: CHANGED };
  try {
    const { bookingNumber, trips } = await createCharterBooking({
      destination,
      search,
      choice: parseChoice(params),
      form,
    });
    return { ok: true, summary: charterSummary(bookingNumber, destination.title, form, trips) };
  } catch (e) {
    if (e instanceof CharterBookingError) return { ok: false, error: e.message };
    console.error(e);
    return { ok: false, error: "Något gick fel, försök igen." };
  }
}
