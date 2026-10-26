import type { Metadata } from "next";
import { Suspense } from "react";
import CharterStep from "../../CharterStep";

export const metadata: Metadata = {
  title: "Betala – Gurras Flyg",
};

// Betalsättet och Betala (TRIP-014-R8). Resan står i adressen, resenärerna i fliken.
export default function PaymentPage({ params, searchParams }: PageProps<"/charter/[id]/boka/betala">) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 pt-8 pb-16 md:pt-12">
      <h1 className="text-title-phone font-bold">Betala</h1>
      {/* Sökningen och resorna läses från databasen när sidan efterfrågas */}
      <Suspense>
        <CharterStep params={params} searchParams={searchParams} step="payment" />
      </Suspense>
    </main>
  );
}
