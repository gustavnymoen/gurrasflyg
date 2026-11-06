"use client";

import type { useRouter } from "next/navigation";
import type { BookingForm } from "@/lib/booking-rules";
import { bookAction } from "./actions";
import { BOOKED_KEY, FORM_KEY, store } from "./store";

const BOOKED_PATH = "/flyg/bokad";

// Bokar och går till sammanfattningen. Både Betala och knappen i chatten (TRIP-036-R6) använder den:
// samma åtgärd, samma kontroller. query är resans adress efter "?". Svarar med felet, eller bokningsnumret när det gick.
export async function bookFlight(
  router: ReturnType<typeof useRouter>,
  query: string,
  form: BookingForm,
): Promise<{ error: string } | { bookingNumber: string }> {
  const result = await bookAction(query, form);
  if (!result.ok) return { error: result.error };
  // Sammanfattningen visas bara i den här fliken, och formuläret töms
  store(BOOKED_KEY, result.summary);
  store(FORM_KEY, null);
  router.replace(BOOKED_PATH);
  return { bookingNumber: result.summary.bookingNumber };
}
