// Kort som "poppar" ut från bakgrunden: tunn mässingstonad kant och djup
// skugga med ett svagt vinrött sken (DESIGN.md)

const look = "border border-edge bg-surface shadow-card";
// default: startsidan och inloggningen, compact: adminsidan
const sizes = { default: "rounded-card p-6", compact: "rounded-card-compact p-4" };

// Det som svävar ovanför sidan: förslagslistor och dialoger
export const floatClass = "border border-line bg-surface-float shadow-float";
// Ett kort som svävar, t.ex. en dialog
export const floatingCardClass = `${sizes.default} ${floatClass}`;

export default function Card({
  size = "default",
  className = "",
  children,
}: {
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
}) {
  return <section className={`${sizes[size]} ${look} ${className}`}>{children}</section>;
}
