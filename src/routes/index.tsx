import { createFileRoute, Link } from "@tanstack/react-router";
import posterImg from "@/assets/manchester-day-poster.jpg";
import { NowNextHero } from "@/components/festival/NowNextHero";
import { PersonaBar } from "@/components/festival/PersonaBar";

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

const LINKS = [
  { to: "/parade", label: "PARADE ROUTE", note: "Live-ish tracker & stop times" },
  { to: "/map", label: "MAP", note: "Filters, access layers, crowd heatmap" },
  { to: "/itinerary", label: "MY DAY", note: "Pick your own agenda" },
  { to: "/settings", label: "SETUP", note: "Who you're with & amenities" },
] as const;

function Index() {
  return (
    <>
      <NowNextHero />
      <section className="px-5 pb-12">
        <h2 className="font-display text-4xl leading-none mb-4">JUMP IN</h2>
        <div className="grid gap-3">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="block border-2 border-brand-ink bg-white p-4 shadow-[6px_6px_0px_0px_rgba(255,210,31,1)] hover:bg-brand-yellow transition"
            >
              <p className="font-display text-3xl leading-none">{l.label}</p>
              <p className="text-xs opacity-70 mt-1">{l.note}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
