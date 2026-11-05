import {
  type BookingLeg,
} from "@/lib/booking-rules";
import {
  type CharterChoice,
  type CharterSearch,
  type CharterTrip,
  planUrl,
  resultsUrl,
  travellersUrl,
} from "@/lib/charter-rules";
import type { StepItem } from "../flyg/Steps";

// Stegen i charterbokningen, med länkar tillbaka med allt som valts (TRIP-014-R5, TRIP-039-R3)
export const charterSteps = (id: string, search: CharterSearch, choice: CharterChoice): StepItem[] => [
  { label: "Resa", href: resultsUrl(id, search, choice) },
  { label: "Plan och klass", href: planUrl(id, search, choice) },
  { label: "Resenärer", href: travellersUrl(id, search, choice) },
  { label: "Betala" },
];

// Det sidorna för resenärerna och betalningen får från servern: resorna med plan, klasser och tillägg
export type CharterStepProps = {
  id: string;
  title: string;
  search: CharterSearch;
  choice: CharterChoice;
  outbound: CharterTrip;
  home: CharterTrip;
  legs: BookingLeg[];
  // Tilläggens namn efter id, för att berätta vilka som togs bort (TRIP-039-R8)
  addonNames: Record<number, string>;
};
