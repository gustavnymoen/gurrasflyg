// Regler för omdömen som både servern och formuläret behöver.
// Ligger utanför lib/reviews.ts, som är server-only och inte kan importeras av klientkomponenter.

// Databasen tillåter 255 tecken, men korten på startsidan är byggda för kortare texter
export const MAX_REVIEW_LENGTH = 150;
