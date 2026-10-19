// Ören -> "1 299 kr"
export function formatPrice(ore: number) {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    ...decimalsFor(ore),
  }).format(ore / 100);
}

// Ören -> "1 299" (utan "kr", när valutan redan står i t.ex. en rubrik)
export function formatAmount(ore: number) {
  return new Intl.NumberFormat("sv-SE", decimalsFor(ore)).format(ore / 100);
}

// Inga ören om det är jämna kronor
function decimalsFor(ore: number) {
  const decimals = ore % 100 === 0 ? 0 : 2;
  return { minimumFractionDigits: decimals, maximumFractionDigits: decimals };
}
