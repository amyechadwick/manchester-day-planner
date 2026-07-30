import { EVENT_END, EVENT_START } from "@/data/festival";
import { formatClock } from "@/lib/distance";
import { useSession } from "@/state/session";
import { PointsBadge } from "./PointsBadge";
import { Jorge } from "./Jorge";

export function SimClockControl() {
  const { simNow, setSimNow } = useSession();

  return (
    <div className="sticky top-0 z-40 bg-brand-ink text-brand-cream px-4 py-2 border-b-4 border-brand-red">
      <div className="flex items-center justify-between gap-3">
        <Jorge size="badge" priority />
        <div className="min-w-0">
          <p className="text-[9px] uppercase font-bold tracking-widest opacity-70 leading-none">
            Demo clock · scrub the day
          </p>
          <p className="font-display text-2xl leading-none mt-1">
            {formatClock(simNow)}
          </p>
        </div>
        <input
          type="range"
          min={EVENT_START}
          max={EVENT_END}
          step={5}
          value={simNow}
          onChange={(e) => setSimNow(Number(e.target.value))}
          className="flex-1 accent-brand-yellow"
          aria-label="Simulated time of day"
        />
        <PointsBadge />
      </div>
    </div>
  );
}
