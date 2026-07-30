import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { POIS, KIND_META, PERSONAS } from "@/data/festival";
import { distanceKm, walkMinutes, formatMinutes, formatClock } from "@/lib/distance";
import { useSession } from "@/state/session";

export function MyDayList() {
  const {
    agenda,
    toggleAgenda,
    clearAgenda,
    userLocation,
    walkKmh,
    persona,
    simNow,
    trackSelected,
    chooseMyOwnDay,
  } = useSession();

  const items = useMemo(() => {
    const picked = POIS.filter((p) => agenda.includes(p.id));
    return picked.sort(
      (a, b) => (a.startsAt ?? 24 * 60) - (b.startsAt ?? 24 * 60),
    );
  }, [agenda]);

  const legs = useMemo(
    () =>
      items.map((p, i) => {
        const from: [number, number] =
          i === 0 ? userLocation : [items[i - 1].lat, items[i - 1].lng];
        const km = distanceKm(from, [p.lat, p.lng]);
        const walk = walkMinutes(km, walkKmh);
        return { km, walk };
      }),
    [items, userLocation, walkKmh],
  );

  if (items.length === 0) {
    return (
      <div className="border-2 border-dashed border-brand-ink/40 p-6 text-center bg-brand-cream">
        <p className="font-display text-3xl leading-none">MY DAY IS EMPTY</p>
        <p className="text-xs opacity-70 mt-2">
          Hit ADD on anything in the programme or parade below to build your own
          agenda. Your picks show up here and as a route on the map.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {trackSelected && (
        <div className="border-2 border-brand-ink bg-brand-yellow p-4">
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
      )}

      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">
          {items.length} saved · walking times at {PERSONAS[persona].label.toLowerCase()} pace
        </p>
        {!trackSelected && (
          <button
            type="button"
            onClick={clearAgenda}
            className="font-display text-sm border-2 border-brand-ink px-2 py-1 leading-none hover:bg-brand-red hover:text-brand-cream transition"
          >
            CLEAR
          </button>
        )}
      </div>

      <ol className="space-y-2">
        {items.map((p, i) => (
          <li
            key={p.id}
            className="border-2 border-brand-ink bg-white p-3 flex gap-3 items-start"
          >
            <span
              className="shrink-0 size-7 rounded-full border-2 border-brand-ink flex items-center justify-center font-display text-sm"
              style={{ backgroundColor: KIND_META[p.kind].color, color: "#FBF3E2" }}
            >
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm">{p.name}</p>
              <p className="text-[11px] opacity-70">
                {p.startsAt != null ? `${formatClock(p.startsAt)} · ` : ""}
                {p.area}
              </p>
              <p className="text-[10px] uppercase font-bold tracking-widest mt-1 opacity-70">
                {i === 0 ? "From your pin" : `From stop ${i}`} ·{" "}
                {formatMinutes(legs[i].walk)} walk
              </p>
            </div>
            {!trackSelected && (
              <button
                type="button"
                onClick={() => toggleAgenda(p.id)}
                className="shrink-0 font-display text-sm border-2 border-brand-ink px-2 py-1 leading-none hover:bg-brand-red hover:text-brand-cream transition"
              >
                REMOVE
              </button>
            )}
          </li>
        ))}
      </ol>

      <Link
        to="/map"
        className="block text-center font-display text-2xl bg-brand-ink text-brand-cream py-3 border-2 border-brand-ink hover:bg-brand-blue transition"
      >
        SEE MY ROUTE ON THE MAP
      </Link>
    </div>
  );
}
