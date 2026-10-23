"use server";

// Server actions: funktioner som körs på servern men anropas direkt från
// knapparna på adminsidan. De går att anropa utan att gå via sidan, så
// varje anrop kontrollerar att man är inloggad.

import { refresh } from "next/cache";
import * as admin from "@/lib/admin";
import { isAdmin } from "@/lib/auth";
import { createReview, deleteReview, type ReviewInput } from "@/lib/reviews";
import type { AddonInput, AircraftInput } from "@/lib/admin";

export type ActionResult = { ok: true } | { ok: false; error: string };

// Kollar inloggningen, kör ändringen, laddar om sidans data och gör om fel
// till ett svar sidan kan visa
async function run(change: () => Promise<void>): Promise<ActionResult> {
  if (!(await isAdmin())) {
    return { ok: false, error: "Du är inte inloggad längre. Ladda om sidan och logga in." };
  }
  try {
    await change();
  } catch (e) {
    if (e instanceof admin.AdminError) return { ok: false, error: e.message };
    console.error(e);
    return { ok: false, error: "Något gick fel, försök igen." };
  }
  refresh();
  return { ok: true };
}

export async function createClassAction(name: string) {
  return run(() => admin.createClass(name));
}
export async function updateClassAction(id: number, name: string) {
  return run(() => admin.updateClass(admin.requireId(id), name));
}
export async function deleteClassAction(id: number) {
  return run(() => admin.deleteClass(admin.requireId(id)));
}

export async function createAddonAction(addon: AddonInput) {
  return run(() => admin.createAddon(addon));
}
export async function updateAddonAction(id: number, addon: AddonInput) {
  return run(() => admin.updateAddon(admin.requireId(id), addon));
}
export async function deleteAddonAction(id: number) {
  return run(() => admin.deleteAddon(admin.requireId(id)));
}

export async function createAircraftAction(input: AircraftInput) {
  return run(() => admin.createAircraft(input));
}
export async function updateAircraftAction(id: number, input: AircraftInput) {
  return run(() => admin.updateAircraft(admin.requireId(id), input));
}
export async function deleteAircraftAction(id: number) {
  return run(() => admin.deleteAircraft(admin.requireId(id)));
}

export async function createReviewAction(input: ReviewInput) {
  return run(() => createReview(input));
}
export async function deleteReviewAction(id: number) {
  return run(() => deleteReview(admin.requireId(id)));
}
