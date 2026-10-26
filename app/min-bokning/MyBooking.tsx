"use client";

import { useState } from "react";
import type { MyBooking as Booking } from "@/lib/cancel-rules";
import type { Credentials } from "@/lib/my-booking";
import BookingView from "./BookingView";
import LookupForm from "./LookupForm";

// Först formuläret, sedan bokningen. Numret och efternamnet finns bara här i minnet, för att
// kunna skickas igen när något avbokas; en omladdning börjar om från formuläret (R2).
export default function MyBooking() {
  const [found, setFound] = useState<{ booking: Booking; credentials: Credentials } | null>(null);
  if (!found) return <LookupForm onFound={(booking, credentials) => setFound({ booking, credentials })} />;
  return <BookingView initial={found.booking} credentials={found.credentials} onReset={() => setFound(null)} />;
}
