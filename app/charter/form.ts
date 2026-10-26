"use client";

import { asCharterForm, type CharterForm, emptyCharterForm, fitCharterForm } from "@/lib/charter-rules";
import { CHARTER_FORM_KEY, store, useStored } from "../flyg/boka/store";

// Formuläret som det är sparat i fliken (aldrig i adressen: det är personuppgifter),
// anpassat till antalet resenärer, eller undefined innan sidan har läst det (TRIP-014-R6)
export function useCharterForm(travellers: number) {
  const stored = useStored(CHARTER_FORM_KEY);
  if (stored === undefined) return undefined;
  return fitCharterForm(asCharterForm(stored) ?? emptyCharterForm(""), travellers);
}

export const saveCharterForm = (form: CharterForm) => store(CHARTER_FORM_KEY, form);
