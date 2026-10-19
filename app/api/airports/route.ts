import type { NextRequest } from "next/server";
import { searchAirports } from "@/lib/db";

// GET /api/airports?q=lon  ->  max 5 flygplatser som matchar
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (query === "") {
    return Response.json([]);
  }
  return Response.json(await searchAirports(query));
}
