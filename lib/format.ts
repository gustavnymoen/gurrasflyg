// Kronor -> "1 299 kr"
export function formatPrice(kronor: number) {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(kronor);
}

// Kronor -> "1 299" (utan "kr", när valutan redan står i t.ex. en rubrik)
export function formatAmount(kronor: number) {
  return new Intl.NumberFormat("sv-SE").format(kronor);
}

// Minuter -> "9 h 20 min", "2 h", "45 min"
export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}
