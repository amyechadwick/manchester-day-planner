import { createFileRoute } from "@tanstack/react-router";
import { ParadeTracker } from "@/components/festival/ParadeTracker";

export const Route = createFileRoute("/parade")({
  head: () => ({
    meta: [
      { title: "Parade Route & Times — Manchester Day 2026" },
      {
        name: "description",
        content:
          "Follow the Manchester Day 2026 book-themed parade stop by stop, from St Peter's Square to the Albert Square finale, and save stops to your own day.",
      },
      { property: "og:title", content: "Parade Route & Times — Manchester Day 2026" },
      {
        property: "og:description",
        content:
          "Stop-by-stop parade times from St Peter's Square to the Albert Square finale.",
      },
    ],
  }),
  component: () => <ParadeTracker />,
});
