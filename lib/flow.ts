// Flödena där besökaren inte når det andra området (TRIP-018-R2, R3):
// flygbokningen och charter. Sammanfattningarna efter en klar bokning,
// /flyg/bokad och /charter/bokad, ingår inte; där går besökaren bara till startsidan.
export function isInFlow(pathname: string): boolean {
  return /^\/(flyg|charter)(\/|$)/.test(pathname) && pathname !== "/flyg/bokad" && pathname !== "/charter/bokad";
}

// Dit Avbryt går (TRIP-014-R10): efter sökningen i charter till charterresorna,
// annars till startsidan
export function abortTarget(pathname: string): string {
  return /^\/charter\/[^/]+\/(resor|boka)(\/|$)/.test(pathname) ? "/charter" : "/";
}
