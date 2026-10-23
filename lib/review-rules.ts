// Regler för omdömen som både servern och formuläret behöver.
// Ligger utanför lib/reviews.ts, som är server-only och inte kan importeras av klientkomponenter.

// Databasen tillåter 255 tecken, men kortet på startsidan rymmer namn, rubrik
// (en rad) och text av de här längderna utan att växa (TRIP-021-R4)
export const MAX_AUTHOR_LENGTH = 20;
export const MAX_TITLE_LENGTH = 25;
export const MAX_REVIEW_LENGTH = 145;
