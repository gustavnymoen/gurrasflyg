import Image from "next/image";

// Agnetas porträtt i rund ram (TRIP-032-R3). Alt-texten är tom: namnet står bredvid.
export default function AgnetaAvatar({ size, className = "" }: { size: number; className?: string }) {
  return <Image src="/agneta.webp" alt="" width={size} height={size} className={`shrink-0 rounded-full object-cover ${className}`} />;
}
