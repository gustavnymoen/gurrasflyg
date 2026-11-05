"use client";

import type { BookingLeg } from "@/lib/booking-rules";
import { asCharterForm, type CharterForm, emptyCharterForm, fitCharterForm, removedAddons } from "@/lib/charter-rules";
import { CHARTER_FORM_KEY, store, useStored } from "../flyg/boka/store";

// Formuläret som det är sparat i fliken (aldrig i adressen: det är personuppgifter),
// anpassat till resenärerna och resorna med plan och klasser, eller undefined innan sidan har läst det
// (TRIP-014-R6). removed är tilläggen som togs bort för att planet eller antalen per klass ändrats
// (TRIP-039-R8); names är tilläggens namn efter id.
export function useCharterForm(travellers: number, legs: BookingLeg[], names: Record<number, string> = {}) {
  const stored = useStored(CHARTER_FORM_KEY);
  if (stored === undefined) return undefined;
  const saved = asCharterForm(stored) ?? emptyCharterForm("");
  return { form: fitCharterForm(saved, legs, travellers), removed: removedAddons(saved, legs, travellers, names) };
}

export const saveCharterForm = (form: CharterForm) => store(CHARTER_FORM_KEY, form);
