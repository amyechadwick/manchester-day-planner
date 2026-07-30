import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { POIS } from "@/data/festival";
import { SEED_PHOTOS, SNAPPABLE_KINDS } from "@/data/photos";
import { PhotoCard, type FeedItem } from "@/components/festival/PhotoCard";
import { useSession } from "@/state/session";
import { Jorge, JorgeSays } from "@/components/festival/Jorge";

export const Route = createFileRoute("/day-share")({
  head: () => ({
    meta: [
      { title: "Day Share — Manchester Day 2026 photo feed" },
      {
        name: "description",
        content:
          "Snap a photo at every stop on your Manchester Day 2026 route, earn 10 points a picture, and scroll the shared feed of everyone else's shots from around the city.",
      },
      { property: "og:title", content: "Day Share — Manchester Day 2026 photo feed" },
      {
        property: "og:description",
        content:
          "Earn points for photos at each stop and scroll everyone's Manchester Day pictures.",
      },
    ],
  }),
  component: DayShare,
});

type Filter = "all" | "mine" | "others";

function DayShare() {
  const { snaps, points } = useSession();
  const [filter, setFilter] = useState<Filter>("all");

  const snappableCount = POIS.filter((p) =>
    (SNAPPABLE_KINDS as readonly string[]).includes(p.kind),
  ).length;

  const feed = useMemo<FeedItem[]>(() => {
    const mine: FeedItem[] = Object.values(snaps).map((s) => {
      const poi = POIS.find((p) => p.id === s.poiId);
      return {
        id: `mine-${s.poiId}`,
        author: "You",
        mine: true,
        spotName: poi?.name ?? s.poiId,
        area: poi?.area,
        caption: "My shot from this stop. +10 points banked.",
        imageKey: s.imageKey,
        takenAt: s.takenAt,
        likes: 12,
      };
    });
    const others: FeedItem[] = SEED_PHOTOS.map((s) => {
      const poi = POIS.find((p) => p.id === s.poiId);
      return {
        id: s.id,
        author: s.author,
        mine: false,
        spotName: poi?.name ?? s.poiId,
        area: poi?.area,
        caption: s.caption,
        imageKey: s.imageKey,
        takenAt: s.takenAt,
        likes: s.likes,
      };
    });
    const pool =
      filter === "mine" ? mine : filter === "others" ? others : [...mine, ...others];
    return pool.sort((a, b) => b.takenAt - a.takenAt);
  }, [snaps, filter]);

  const mineCount = Object.keys(snaps).length;

  return (
    <section className="px-5 pt-8 pb-8">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="font-display text-6xl leading-[0.85]">
          DAY
          <br />
          <span className="text-brand-red">SHARE</span>
        </h1>
        <Jorge variant="full" size="medium" className="ml-auto" />
      </div>

      <div className="border-2 border-brand-ink bg-brand-yellow p-4 mb-4">
        <p className="font-display text-5xl leading-none">{points} POINTS</p>
        <p className="text-xs opacity-80 mt-1">
          {mineCount} of {snappableCount} spots snapped · 10 points a picture. Hit
          the camera on any stop in your day to bank more.
        </p>
      </div>

      <div className="flex gap-2 mb-4">
        {(["all", "mine", "others"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`flex-1 font-display text-xl py-2 border-2 border-brand-ink transition ${
              filter === f
                ? "bg-brand-ink text-brand-cream"
                : "bg-white hover:bg-brand-yellow"
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {feed.length === 0 ? (
        <div className="border-2 border-dashed border-brand-ink/40 p-6 text-center">
          <JorgeSays variant="full" size="medium">
            <p className="font-display text-2xl leading-none">NO PICTURES YET</p>
            <p className="text-xs opacity-70 mt-1 text-left">
              Tap the camera icon on a stop in My Day to take your first photo —
              Jorge wants to see it.
            </p>
          </JorgeSays>
        </div>
      ) : (
        <div className="space-y-4">
          {feed.map((item) => (
            <PhotoCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
