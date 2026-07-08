import { useMemo } from "react";
import { useSession } from "@/state/session";
import { POIS, PERSONAS } from "@/data/festival";
import { distanceKm, walkMinutes, formatMinutes, formatClock } from "@/lib/distance";

export function NowNextHero() {
  const { simNow, userLocation, persona, walkKmh } = useSession();

  const { nowEvent, nextEvent } = useMemo(() => {
    const events = POIS.filter((p) => p.kind === "event" && p.startsAt != null);
    const now = events.find(
      (e) => e.startsAt! <= simNow && (e.endsAt ?? e.startsAt! + 30) > simNow,
    );
    const boosted = (a: typeof events[number]) =>
      a.personaBoost?.includes(persona) ? 0 : 1;
    const next = events
      .filter((e) => e.startsAt! > simNow)
      .sort((a, b) => boosted(a) - boosted(b) || a.startsAt! - b.startsAt!)[0];
    return { nowEvent: now, nextEvent: next };
  }, [simNow, persona]);

  const nextInfo = useMemo(() => {
    if (!nextEvent) return null;
    const km = distanceKm(userLocation, [nextEvent.lat, nextEvent.lng]);
    const walk = walkMinutes(km, walkKmh);
    const untilStart = nextEvent.startsAt! - simNow;
    return { km, walk, untilStart, clash: walk > untilStart };
  }, [nextEvent, userLocation, walkKmh, simNow]);

  return (
    <section className="relative px-5 pt-8 pb-14 overflow-hidden">
      <div className="absolute -top-12 -right-12 size-64 bg-brand-yellow rounded-full opacity-30 blur-3xl" />
      <div className="relative z-10">
        <div className="flex justify-between items-end mb-4">
          <h1 className="font-display text-7xl leading-[0.85] tracking-tight">
            NOW
            <br />
            <span className="text-brand-red">&</span>NEXT
          </h1>
          <div className="text-right">
            <p className="font-display text-2xl">{formatClock(simNow)}</p>
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">
              Sun 26 July · {PERSONAS[persona].label}
            </p>
          </div>
        </div>

        {nowEvent && (
          <div className="mb-3 border-l-4 border-brand-red pl-3">
            <p className="text-[10px] uppercase font-bold tracking-widest text-brand-red">
              Happening now
            </p>
            <p className="font-display text-2xl leading-none mt-1">{nowEvent.name}</p>
            <p className="text-xs opacity-70 uppercase">{nowEvent.area}</p>
          </div>
        )}

        {nextEvent && nextInfo && (
          <div className="group relative bg-white border-2 border-brand-ink p-5 shadow-[8px_8px_0px_0px_rgba(26,26,26,1)]">
            <div className="flex justify-between items-start mb-3">
              <span className="bg-brand-blue text-white font-display text-xl px-3 pt-1 leading-none">
                IN {Math.max(1, nextInfo.untilStart)} MIN
              </span>
              <div className="text-right">
                <p className="text-[10px] font-bold tracking-widest uppercase">
                  Walking
                </p>
                <p className="font-display text-3xl text-brand-red leading-none">
                  {formatMinutes(nextInfo.walk)}
                </p>
                <p className="text-[10px] opacity-60">
                  {nextInfo.km.toFixed(1)} km · {walkKmh} km/h
                </p>
              </div>
            </div>
            <h2 className="font-display text-3xl mb-1 leading-none uppercase">
              {nextEvent.name}
            </h2>
            <p className="text-xs font-medium opacity-80 uppercase tracking-wide mb-2">
              {nextEvent.area} · Starts {formatClock(nextEvent.startsAt!)}
            </p>
            {nextEvent.description && (
              <p className="text-sm opacity-70">{nextEvent.description}</p>
            )}

            {nextInfo.clash && (
              <div className="absolute -right-2 -bottom-4 rotate-3 bg-brand-red text-white font-display text-xl px-4 py-2 shadow-lg max-w-[80%]">
                CLASH · {PERSONAS[persona].clashPhrase.toUpperCase()}
              </div>
            )}
          </div>
        )}

        {!nextEvent && (
          <div className="bg-white border-2 border-brand-ink p-5">
            <p className="font-display text-2xl">That's a wrap for today.</p>
            <p className="text-sm opacity-70">Scrub the clock back up top to explore earlier moments.</p>
          </div>
        )}
      </div>
    </section>
  );
}
