import { getDestinations } from "@/lib/travel";

export function GET() {
  return Response.json(getDestinations());
}
