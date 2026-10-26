import Link from "next/link";
import { buttonClass } from "@/app/components/Button";

// Ett resmål som inte finns (TRIP-013-R7)
export default function DestinationNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-start gap-6 px-4 pt-8 pb-16 md:pt-12">
      <h1 className="text-title-phone font-bold">Resmålet finns inte</h1>
      <p>Vi hittar inget resmål med den adressen.</p>
      <Link href="/charter" className={buttonClass()}>
        Till charterresorna
      </Link>
    </main>
  );
}
