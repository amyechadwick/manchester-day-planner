import { useMemo } from "react";
import { POIS } from "@/data/festival";
import { formatClock } from "@/lib/distance";
import { useSession } from "@/state/session";

export function ProgrammeList() {
  const { simNow, persona } = useSession();

  const grouped = useMemo(() => {
    const events = POIS.filter((p) => p.kind === "event" && p.startsAt != null).sort(
      (a, b) => a.startsAt! - b.startsAt!,
    );
    const bucketFor = (mins: number) => {
      const h = Math.floor(mins / 60);
      return `${h.toString().padStart(2, "0")}:00 – ${(h + 1).toString().padStart(2, "0")}:00`;
    };
    const map = new Map<string, typeof events>();
    for (const e of events) {
      const key = bucketFor(e.startsAt!);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return [...map.entries()];
  }, []);

  return (
    <section className="px-5 py-12 pb-40 bg-white border-t-4 border-brand-ink">
      <div className="flex justify-between items-end mb-8">
        <h3 className="font-display text-5xl leading-none">PROGRAMME</h3>
        <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">
          Boosted for {persona}
        </span>
      </div>

      <div className="space-y-10">
        {grouped.map(([bucket, items]) => {
          const bucketPast = items.every((i) => (i.endsAt ?? i.startsAt! + 30) < simNow);
          return (
            <div key={bucket} className={bucketPast ? "opacity-50" : ""}>
              <p className="font-display text-2xl border-l-4 border-brand-blue pl-3 mb-3">
                {bucket}
              </p>
              <ul className="space-y-2">
                {items.map((e) => {
                  const boosted = e.personaBoost?.includes(persona);
                  return (
                    <li
                      key={e.id}
                      className={
                        "border-2 p-3 flex justify-between gap-3 " +
                        (boosted
                          ? "border-brand-red bg-brand-yellow/40"
                          : "border-brand-ink/20 bg-brand-cream")
                      }
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-sm">{e.name}</p>
                        <p className="text-[11px] opacity-70">{e.area}</p>
                        {boosted && (
                          <p className="text-[10px] uppercase font-bold tracking-widest text-brand-red mt-1">
                            Picked for you
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-display text-xl leading-none">
                          {formatClock(e.startsAt!)}
                        </p>
                        {e.endsAt && (
                          <p className="text-[10px] opacity-60">
                            – {formatClock(e.endsAt)}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
