// Knappar: en form (pill) i tre varianter och två storlekar (DESIGN.md)

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill border-[1.5px] font-bold transition-[transform,background-color,border-color,color] duration-160 ease-out active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-45 disabled:active:scale-100";

const variants = {
  // Tonad accent med fältens kant: det viktigaste besökaren kan göra.
  // Inte fylld vinröd, som kändes som en varning eller Avbryt.
  primary: "border-line-strong bg-accent-soft text-ink hover:border-accent-strong disabled:hover:border-line-strong",
  // Fältens kant, vinröd vid hover: ett alternativ, t.ex. Avbryt
  secondary:
    "border-line-strong bg-transparent hover:border-accent-strong hover:bg-accent/25 disabled:hover:border-line-strong disabled:hover:bg-transparent",
  // Bara text: något mindre viktigt
  quiet: "border-transparent bg-transparent text-ink-muted hover:text-ink",
};

// default: startsidan och inloggningen, compact: adminsidan
const sizes = { default: "h-13 px-7 text-[17px]", compact: "h-8.5 px-3.5 text-sm" };

type ButtonVariant = keyof typeof variants;
type ButtonSize = keyof typeof sizes;

// Klasserna, också för en länk som ska se ut som en knapp (t.ex. Fortsätt till nästa sida)
export const buttonClass = (variant: ButtonVariant = "primary", size: ButtonSize = "default") =>
  `${base} ${variants[variant]} ${sizes[size]}`;

export default function Button({
  variant = "primary",
  size = "default",
  className = "",
  type = "button",
  ...props
}: React.ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button type={type} className={`${buttonClass(variant, size)} ${className}`} {...props} />;
}
