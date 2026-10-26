"use client";

import { useMemo, useSyncExternalStore } from "react";

// Det besökaren fyllt i under bokningen (TRIP-012-R10) och sammanfattningen
// efter den (R9) sparas i webbläsarfliken (sessionStorage), aldrig i adressen,
// eftersom de är personuppgifter. De finns kvar när besökaren går tillbaka
// och fram mellan stegen och försvinner när fliken stängs.
export const FORM_KEY = "gurrasflyg-bokning";
export const BOOKED_KEY = "gurrasflyg-bokad";
// Charterbokningens formulär och sammanfattning (TRIP-014-R6, R9), skilda från flygbokningens
export const CHARTER_FORM_KEY = "gurrasflyg-charter";
export const CHARTER_BOOKED_KEY = "gurrasflyg-charter-bokad";

const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// sessionStorage kan vara avstängt; då sparas inget
function read(key: string) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

// Det som sparats under nyckeln: undefined innan sidan läst det (på servern
// och vid första renderingen), null om inget finns
export function useStored(key: string): unknown {
  const raw = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => undefined,
  );
  return useMemo(() => {
    if (raw === undefined || raw === null) return raw;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, [raw]);
}

// Sparar ett värde, eller tar bort det med null
export function store(key: string, value: unknown) {
  try {
    if (value === null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Utan sessionStorage finns inget att spara i
  }
  for (const listener of listeners) listener();
}

// Kastar bort den pågående bokningen och sammanfattningen, för flyg och charter,
// när besökaren avbryter (TRIP-018-R3, TRIP-014-R10)
export function clearBooking() {
  for (const key of [FORM_KEY, BOOKED_KEY, CHARTER_FORM_KEY, CHARTER_BOOKED_KEY]) store(key, null);
}
