import { createFileRoute } from "@tanstack/react-router";
import { FestivalMap } from "@/components/festival/FestivalMap";
import { AmenityFinder } from "@/components/festival/AmenityFinder";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Festival Map, Crowd Heatmap & Nearest Amenities — Manchester Day 2026" },
      {
        name: "description",
        content:
          "Manchester Day 2026 map: events, food, first aid, step-free routes, accessible toilets and viewing, transport, your saved My Day route, a schedule-based crowd heatmap and the nearest amenities from your pin.",
      },
      { property: "og:title", content: "Festival Map, Crowd Heatmap & Nearest Amenities — Manchester Day 2026" },
      {
        property: "og:description",
        content:
          "Events, amenities, accessibility layers, your own route, a predicted crowd heatmap and nearest-to-you suggestions.",
      },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  return (
    <>
      <FestivalMap />
      <AmenityFinder />
    </>
  );
}

