import { createFileRoute } from "@tanstack/react-router";
import posterImg from "@/assets/manchester-day-poster.jpg";
import { NowNextHero } from "@/components/festival/NowNextHero";
import { PersonaBar } from "@/components/festival/PersonaBar";
import { Jorge, JorgeSays } from "@/components/festival/Jorge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Manchester Day 2026 Companion — Now & Next" },
      {
        name: "description",
        content:
          "What's on right now at Manchester Day 2026, whether you can make the next act in time, and quick links to the parade tracker, map and your own agenda.",
      },
      { property: "og:title", content: "Manchester Day 2026 Companion — Now & Next" },
      {
        property: "og:description",
        content:
          "What's on right now at Manchester Day 2026 and whether you can make the next act in time.",
      },
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
    <>
      <NowNextHero />
      <section className="px-5 pb-2">
        <JorgeSays variant="full" size="hero">
          <p className="font-display text-2xl leading-none">HOLA! I'M JORGE</p>
          <p className="mt-1 opacity-80">
            Your Manchester Day guide. Stick with me and you'll not miss a thing.
          </p>
        </JorgeSays>
      </section>
      <section className="px-5 py-6 bg-brand-cream">
        <div className="flex items-center gap-2 mb-2">
          <Jorge size="badge" decorative />
          <h2 className="font-display text-3xl leading-none">PICK YOUR TRACK</h2>
        </div>
        <p className="text-sm opacity-80 mb-4">
          Not wanting to spend time planning your day? Select a track most suitable for you.
        </p>
        <PersonaBar />
      </section>
    </>
  );
}

