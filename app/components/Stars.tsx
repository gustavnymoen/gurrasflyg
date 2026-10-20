// Visar 1–5 stjärnor, t.ex. ★★★☆☆

export default function Stars({ rating, className = "text-base" }: { rating: number; className?: string }) {
  return (
    <span role="img" aria-label={`${rating} av 5 stjärnor`} className={`tracking-wider ${className}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} aria-hidden="true" className={n <= rating ? "text-wine-light" : "text-neutral-700"}>
          ★
        </span>
      ))}
    </span>
  );
}
