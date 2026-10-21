import { getDestinations } from "@/lib/travel";

// GET /api/destinations  ->  alla resmål från kursdatan, sorterade på id
export async function GET() {
  return Response.json(await getDestinations());
}
