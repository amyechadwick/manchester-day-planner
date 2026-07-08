import { PARADE_ROUTE } from "@/data/festival";
import { formatClock } from "@/lib/distance";
import { useSession } from "@/state/session";

export function ParadeTracker() {
  const { simNow, setUserLocation } = useSession();

  return (
    <section className="px-5 py-12 bg-brand-blue text-brand-cream">
      <div className="flex items-end justify-between mb-6 border-b-2 border-brand-cream/30 pb-2">
        <h3 className="font-display text-5xl leading-none">PARADE ROUTE</h3>
        <span className="text-[10px] uppercase font-bold tracking-widest opacity-70">
          Tap a stop
        </span>
      </div>

      <ol className="relative ml-4 border-l-4 border-brand-yellow pl-8 space-y-8">
        {PARADE_ROUTE.map((stop) => {
          const eta = stop.startsAt!;
          const passed = simNow >= eta + 10;
          const active = simNow >= eta - 5 && simNow < eta + 10;
          return (
            <li key={stop.id} className={passed ? "opacity-50" : ""}>
              <button
                type="button"
                onClick={() => setUserLocation([stop.lat, stop.lng])}
                className="relative text-left w-full"
              >
                <span
                  className={
                    "absolute -left-[42px] top-1 size-6 rounded-full border-4 border-brand-blue " +
                    (active
                      ? "bg-white shadow-[0_0_15px_rgba(255,255,255,0.9)] animate-pulse"
                      : passed
                        ? "bg-brand-yellow/40"
                        : "bg-brand-yellow")
                  }
                />
                <p
                  className={
                    "font-display text-2xl leading-none " +
                    (active ? "text-brand-yellow" : "")
                  }
                >
                  {formatClock(eta)} · {stop.name.toUpperCase()}
                </p>
                {active && (
                  <p className="text-[10px] uppercase font-bold tracking-widest text-white mt-1">
                    Passing through now
                  </p>
                )}
                {stop.description && !active && (
                  <p className="text-xs opacity-70 mt-1">{stop.description}</p>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
