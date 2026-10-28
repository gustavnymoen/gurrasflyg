import type { NextRequest } from "next/server";
import { countryName } from "@/lib/destination-names";
import { suggestDestinations } from "@/lib/destinations";
import { apiLimitResponse } from "@/lib/flow-limits";
import { getDestinationCards } from "@/lib/travel";

const MAX_QUERY_LENGTH = 100;

// GET /api/destination-search?q=field  ->  max 5 resmål som matchar, för sökfältet på /charter.
// Söktexten jämförs i minnet med resmålen och går aldrig in i en databasfråga (TRIP-013-R1).
export async function GET(request: NextRequest) {
  const limited = await apiLimitResponse("destination-search");
  if (limited) return limited;
  // En söktext är några ord; längre text kapas så att ingen skickar en jättelång
  const query = request.nextUrl.searchParams.get("q")?.trim().slice(0, MAX_QUERY_LENGTH) ?? "";
  if (query === "") {
    return Response.json([]);
  }
  const matches = suggestDestinations(await getDestinationCards(), query);
  return Response.json(
    matches.map((d) => ({ id: d.id, name: d.title, detail: `${d.locality}, ${countryName(d.country)}` })),
  );
}
