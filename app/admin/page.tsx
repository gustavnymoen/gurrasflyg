import type { Metadata } from "next";
import { Suspense } from "react";
import { getRouteStats, listAddons, listAircraft, listClasses } from "@/lib/admin";
import { requireAdminPage } from "@/lib/auth";
import { listReviews } from "@/lib/reviews";
import Button from "../components/Button";
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
          <h1 className="text-section font-bold">Admin</h1>
          <p className="text-xs uppercase tracking-[0.35em] text-ink-muted">
            Plan, klasser, addons och omdömen
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Suspense>
            <AssignAircraft />
          </Suspense>
          <form action={logoutAction}>
            <Button type="submit" variant="secondary" size="compact">
              Logga ut
            </Button>
          </form>
        </div>
      </header>
      {/* Datan läses från databasen när sidan efterfrågas, så den visas via Suspense */}
      <Suspense fallback={<p className="text-ink-muted">Laddar…</p>}>
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
          <div className="border-line lg:col-span-3 lg:border-l lg:pl-6">
            <AddonTable addons={addons} />
          </div>
        </div>
      </CollapsibleCard>
      <AircraftTable aircraft={aircraft} classes={classes} addons={addons} />
      <ReviewSection reviews={reviews} />
    </>
  );
}
