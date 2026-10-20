import "server-only";
import destinations from "@/data/destinations.json";

// The course's sample destinations, straight from the JSON file
export function getDestinations() {
  return destinations;
}
