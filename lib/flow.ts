// Flödena där besökaren inte når det andra området (TRIP-018-R2, R3):
// flygbokningen och charter. Sammanfattningen efter en klar bokning,
// /flyg/bokad, ingår inte; där går besökaren bara till startsidan.
export function isInFlow(pathname: string): boolean {
  return /^\/(flyg|charter)(\/|$)/.test(pathname) && pathname !== "/flyg/bokad";
}
