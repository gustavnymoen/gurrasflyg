import type { Metadata } from "next";
import { Suspense } from "react";
import { getRouteStats, listAddons, listAircraft, listClasses } from "@/lib/admin";
import { requireAdminPage } from "@/lib/auth";
import { listReviews } from "@/lib/reviews";
import { compactSecondaryButtonClass } from "../components/ui";
import AddonTable from "./AddonTable";
import AircraftTable from "./AircraftTable";
import AssignAircraftButton from "./AssignAircraftButton";
import { CollapsibleCard } from "./admin-ui";
import ClassTable from "./ClassTable";
import ReviewSection from "./ReviewSection";
import { logoutAction } from "./login/actions";

export const metadata: Metadata = {
  title: "Admin – Gurras Flyg",
};

export default function AdminPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-8">
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="bg-linear-to-br from-wine-light via-wine to-[#5c1029] bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
            Admin
          </h1>
          <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
            Plan, klasser, addons och omdömen
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Suspense>
            <AssignAircraft />
          </Suspense>
          <form action={logoutAction}>
            <button type="submit" className={compactSecondaryButtonClass}>
              Logga ut
            </button>
          </form>
        </div>
      </header>
      {/* Datan läses från databasen när sidan efterfrågas, så den visas via Suspense */}
      <Suspense fallback={<p className="text-neutral-500">Laddar…</p>}>
        <AdminContent />
      </Suspense>
    </main>
  );
}

// Inloggningen kontrolleras här också, inte bara i proxy.ts
async function AssignAircraft() {
  await requireAdminPage();
  const { total, assigned } = await getRouteStats();
  return <AssignAircraftButton total={total} assigned={assigned} />;
}

async function AdminContent() {
  await requireAdminPage();
  const [classes, addons, aircraft, reviews] = await Promise.all([
    listClasses(),
    listAddons(),
    listAircraft(),
    listReviews(),
  ]);
  return (
    <>
      {/* Klasser till vänster, addons till höger, i samma container */}
      <CollapsibleCard title="Klasser & addons">
        <div className="grid items-start gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <ClassTable classes={classes} />
          </div>
          <div className="border-wine/20 lg:col-span-3 lg:border-l lg:pl-6">
            <AddonTable addons={addons} />
          </div>
        </div>
      </CollapsibleCard>
      <AircraftTable aircraft={aircraft} classes={classes} addons={addons} />
      <ReviewSection reviews={reviews} />
    </>
  );
}
