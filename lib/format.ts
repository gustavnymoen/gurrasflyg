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
