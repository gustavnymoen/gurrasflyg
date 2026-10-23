// "Billigast" (eller "Snabbast"), eller hur mycket mer, t.ex. "+4 500 kr / person" (R2, R3)
export default function Comparison({ best, bestLabel, diff }: { best: boolean; bestLabel: string; diff: string }) {
  return best ? (
    <span className="self-start rounded-pill border border-line-strong px-2 text-xs font-bold sm:self-end">{bestLabel}</span>
  ) : (
    <span className="text-ink-muted">{diff}</span>
  );
}
