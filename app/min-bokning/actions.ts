"use server";

import type { MyBooking } from "@/lib/cancel-rules";
import { clientIp } from "@/lib/client-ip";
import { type CancelRequest, type Cancelled, type Credentials, cancelParts, lookUpBooking, NOT_FOUND } from "@/lib/my-booking";
import { tooManyMessage } from "@/lib/rate-limit";

// Allt som kommer hit kan vara vad som helst, det är bara en HTTP-förfrågan
const MAX_LENGTH = 100;
const isText = (value: unknown): value is string => typeof value === "string" && value.length <= MAX_LENGTH;

export type LookupResult =
  | { booking: MyBooking }
  | { error: string; missing?: "bookingNumber" | "lastName" };

// Slår upp en bokning (TRIP-023-R2, R3). Numret och efternamnet finns bara i förfrågan, aldrig i adressen.
export async function lookUpAction(credentials: Credentials): Promise<LookupResult> {
  if (!credentials || !isText(credentials.bookingNumber) || !isText(credentials.lastName)) return { error: NOT_FOUND };
  if (credentials.bookingNumber.trim() === "") return { error: "Skriv bokningsnumret.", missing: "bookingNumber" };
  if (credentials.lastName.trim() === "") return { error: "Skriv efternamnet.", missing: "lastName" };
  const result = await lookUpBooking(await clientIp(), credentials);
  if ("booking" in result) return result;
  if ("locked" in result) return { error: tooManyMessage(result.locked.minutesLeft) };
  return { error: NOT_FOUND };
}

export type CancelResult = Cancelled | { error: string };

// Avbokar de kryssade delarna (TRIP-023-R10, R12)
export async function cancelAction(request: CancelRequest): Promise<CancelResult> {
  const valid = request && isText(request.bookingNumber) && isText(request.lastName) && isText(request.requestId);
  if (!valid) return { error: NOT_FOUND };
  const result = await cancelParts(await clientIp(), request);
  if ("booking" in result) return result;
  if ("locked" in result) return { error: tooManyMessage(result.locked.minutesLeft) };
  if ("notFound" in result) return { error: NOT_FOUND };
  return result;
}
