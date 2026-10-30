import type { NextRequest } from "next/server";
import { searchAirports } from "@/lib/db";
import { apiLimitResponse } from "@/lib/flow-limits";
import { searchText } from "@/lib/search-text";

// GET /api/airports?q=lon  ->  max 5 flygplatser som matchar
export async function GET(request: NextRequest) {
  const limited = await apiLimitResponse("airports");
  if (limited) return limited;
  const query = searchText(request.nextUrl.searchParams);
  if (query === "") {
    return Response.json([]);
  }
  return Response.json(await searchAirports(query));
}
