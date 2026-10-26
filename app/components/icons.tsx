// Små ikoner som SVG. De ärver textfärgen (currentColor).

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export function PencilIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  );
}

export function TrashIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

export function XIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

// Pil som pekar åt höger, eller nedåt när open är true
export function ChevronIcon({ open, className = "h-4 w-4" }: { open: boolean; className?: string }) {
  return (
    <svg {...iconProps} className={`${className} transition-transform ${open ? "rotate-90" : ""}`}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function MenuIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
