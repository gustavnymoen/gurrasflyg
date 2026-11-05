"use client";

import type { useRouter } from "next/navigation";
import { CHARTER_BOOKED_PATH, type CharterChoice, charterParams, type CharterForm, type CharterSearch } from "@/lib/charter-rules";
import { CHARTER_BOOKED_KEY, CHARTER_FORM_KEY, store } from "../flyg/boka/store";
import { bookCharterAction } from "./actions";

// Bokar och går till sammanfattningen. Både Betala och knappen i chatten (TRIP-030-R8) använder den:
// samma åtgärd, samma kontroller. Svarar med felet, eller bokningsnumret när det gick.
export async function bookCharter(
  router: ReturnType<typeof useRouter>,
  id: string,
  search: CharterSearch,
  choice: CharterChoice,
  form: CharterForm,
): Promise<{ error: string } | { bookingNumber: string }> {
  const result = await bookCharterAction(id, charterParams(search, choice).toString(), form);
  if (!result.ok) return { error: result.error };
  // Sammanfattningen visas bara i den här fliken, och formuläret töms
  store(CHARTER_BOOKED_KEY, result.summary);
  store(CHARTER_FORM_KEY, null);
  router.replace(CHARTER_BOOKED_PATH);
  return { bookingNumber: result.summary.bookingNumber };
}
