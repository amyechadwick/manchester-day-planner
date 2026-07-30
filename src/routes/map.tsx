import { createFileRoute } from "@tanstack/react-router";
import { FestivalMap } from "@/components/festival/FestivalMap";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Festival Map & Crowd Heatmap — Manchester Day 2026" },
      {
        name: "description",
        content:
          "Manchester Day 2026 map: events, food, first aid, step-free routes, accessible toilets and viewing, transport, your saved My Day route and a schedule-based crowd heatmap.",
      },
      { property: "og:title", content: "Festival Map & Crowd Heatmap — Manchester Day 2026" },
      {
        property: "og:description",
        content:
          "Events, amenities, accessibility layers, your own route and a predicted crowd heatmap.",
      },
    ],
  }),
  component: () => <FestivalMap />,
});
