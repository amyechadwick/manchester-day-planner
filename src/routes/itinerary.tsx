import { createFileRoute, Link } from "@tanstack/react-router";
import { PERSONAS } from "@/data/festival";
import { MyDayList } from "@/components/festival/MyDayList";
import { TrackList } from "@/components/festival/TrackList";
import { ProgrammeList } from "@/components/festival/ProgrammeList";
import { useSession } from "@/state/session";
import { JorgeSays } from "@/components/festival/Jorge";

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
  const { trackSelected, persona, chooseMyOwnDay } = useSession();

  if (trackSelected) {
    return (
      <>
        <section className="px-5 pt-8 pb-8">
          <h1 className="font-display text-6xl leading-[0.85] mb-4">
            YOUR
            <br />
            <span className="text-brand-red">TRACK</span>
          </h1>
          <div className="border-2 border-brand-ink bg-brand-yellow p-4 mb-3">
            <div className="mb-3">
              <JorgeSays variant="full" size="medium">
                <p className="text-sm">
                  Jorge picked these stops for you — follow them in order.
                </p>
              </JorgeSays>
            </div>
            <p className="font-display text-2xl leading-none">
              {PERSONAS[persona].label.toUpperCase()} TRACK LOADED
            </p>
            <p className="text-xs opacity-80 mt-1">
              This itinerary doesn't work for you? Pick your own.
            </p>
            <button
              type="button"
              onClick={chooseMyOwnDay}
              className="mt-3 w-full font-display text-2xl bg-brand-ink text-brand-cream py-2 border-2 border-brand-ink hover:bg-brand-red transition"
            >
              CHOOSE MY OWN DAY
            </button>
          </div>
          <TrackList />
          <Link
            to="/map"
            className="mt-3 block text-center font-display text-2xl bg-brand-ink text-brand-cream py-3 border-2 border-brand-ink hover:bg-brand-blue transition"
          >
            SEE THIS TRACK ON THE MAP
          </Link>
        </section>
        <ProgrammeList />
      </>
    );
  }

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
      <ProgrammeList />
    </>
  );
}
