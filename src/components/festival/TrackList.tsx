import { useMemo } from "react";
import { KIND_META, PERSONAS } from "@/data/festival";
import { formatClock } from "@/lib/distance";
import { useSession } from "@/state/session";
import { trackStops } from "@/lib/track";
import { AgendaButton } from "./AgendaButton";

export function TrackList() {
  const { persona } = useSession();
  const stops = useMemo(() => trackStops(persona), [persona]);

  return (
    <div className="space-y-3">
      <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">
        {PERSONAS[persona].label} track · {stops.length} stop
        {stops.length === 1 ? "" : "s"} · numbered 1–{stops.length} in time order,
        same numbers as the map
      </p>
      <ol className="space-y-2">
        {stops.map((p, i) => (
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
              <p className="text-[10px] uppercase font-bold tracking-widest mt-1 opacity-60">
                {KIND_META[p.kind].label}
              </p>
            </div>
            <AgendaButton id={p.id} />
          </li>
        ))}
      </ol>
    </div>
  );
}
