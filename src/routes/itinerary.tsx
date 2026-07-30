import { createFileRoute } from "@tanstack/react-router";
import { MyDayList } from "@/components/festival/MyDayList";
import { TrackList } from "@/components/festival/TrackList";
import { ProgrammeList } from "@/components/festival/ProgrammeList";
import { useSession } from "@/state/session";

export const Route = createFileRoute("/itinerary")({
  head: () => ({
    meta: [
      { title: "My Day & Full Programme — Manchester Day 2026" },
      {
        name: "description",
        content:
          "Build your own Manchester Day 2026 agenda: save acts and parade stops, see walking times between them at your pace, and view the whole programme hour by hour.",
      },
      { property: "og:title", content: "My Day & Full Programme — Manchester Day 2026" },
      {
        property: "og:description",
        content:
          "Save acts and parade stops, then see walking times between your picks at your own pace.",
      },
    ],
  }),
  component: Itinerary,
});

function Itinerary() {
  const { trackSelected } = useSession();
  return (
    <>
      <section className="px-5 pt-8 pb-4">
        <h1 className="font-display text-6xl leading-[0.85] mb-4">
          MY
          <br />
          <span className="text-brand-red">DAY</span>
        </h1>
        <MyDayList />
      </section>
      {trackSelected && (
        <section className="px-5 pb-8">
          <h2 className="font-display text-4xl leading-none mb-3">YOUR TRACK</h2>
          <TrackList />
        </section>
      )}
      <ProgrammeList />
    </>
  );
}
