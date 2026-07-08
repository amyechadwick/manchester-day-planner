import { createFileRoute } from "@tanstack/react-router";
import posterImg from "@/assets/manchester-day-poster.jpg";
import { SessionProvider } from "@/state/session";
import { SimClockControl } from "@/components/festival/SimClockControl";
import { NowNextHero } from "@/components/festival/NowNextHero";
import { ParadeTracker } from "@/components/festival/ParadeTracker";
import { FestivalMap } from "@/components/festival/FestivalMap";
import { AmenityFinder } from "@/components/festival/AmenityFinder";
import { ProgrammeList } from "@/components/festival/ProgrammeList";
import { PersonaBar } from "@/components/festival/PersonaBar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        property: "og:image",
        content:
          "https://id-preview--3d7a46f4-c52d-4fc4-84a7-e98ffb4f130e.lovable.app" +
          posterImg,
      },
      {
        name: "twitter:image",
        content:
          "https://id-preview--3d7a46f4-c52d-4fc4-84a7-e98ffb4f130e.lovable.app" +
          posterImg,
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SessionProvider>
      <main className="min-h-screen bg-brand-cream text-brand-ink font-body selection:bg-brand-yellow pb-28 overflow-x-hidden">
        <SimClockControl />
        <NowNextHero />
        <ParadeTracker />
        <FestivalMap />
        <AmenityFinder />
        <ProgrammeList />
        <PersonaBar />
      </main>
    </SessionProvider>
  );
}
