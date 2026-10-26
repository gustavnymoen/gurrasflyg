import {
  type CharterChoice,
  type CharterSearch,
  type CharterTrip,
  resultsUrl,
  travellersUrl,
} from "@/lib/charter-rules";
import type { StepItem } from "../flyg/Steps";

// Stegen i charterbokningen, med länkar tillbaka med allt som valts (TRIP-014-R5)
export const charterSteps = (id: string, search: CharterSearch, choice: CharterChoice): StepItem[] => [
  { label: "Resa", href: resultsUrl(id, search, choice) },
  { label: "Resenärer", href: travellersUrl(id, search, choice) },
  { label: "Betala" },
];

// Det sidorna för resenärerna och betalningen får från servern
export type CharterStepProps = {
  id: string;
  title: string;
  search: CharterSearch;
  choice: CharterChoice;
  outbound: CharterTrip;
  home: CharterTrip;
};
