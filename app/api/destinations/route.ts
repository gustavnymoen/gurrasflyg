import { apiLimitResponse } from "@/lib/flow-limits";
import { getDestinations } from "@/lib/travel";

// GET /api/destinations  ->  alla resmål från kursdatan, sorterade på id
export async function GET() {
  const limited = await apiLimitResponse("destinations");
  if (limited) return limited;
  return Response.json(await getDestinations());
}
