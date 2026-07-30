import { useMemo } from "react";
import { KIND_META, POIS, type POIKind } from "@/data/festival";
import { useSession } from "@/state/session";
import { MAP_FILTERS, type FilterId } from "./FestivalMap";
import { distanceKm, walkMinutes, formatMinutes } from "@/lib/distance";

const CATEGORIES: { title: string; kinds: POIKind[]; blurb: string }[] = [
  { title: "FOOD", kinds: ["food"], blurb: "Nearest stall to your pin" },
  { title: "FIRST AID", kinds: ["first_aid"], blurb: "In an emergency" },
  {
    title: "ACCESSIBLE TOILETS",
    kinds: ["toilet_accessible"],
    blurb: "Radar keys noted where required",
  },
  {
    title: "STEP-FREE ROUTES",
    kinds: ["step_free"],
    blurb: "Dropped kerbs the whole way",
  },
  {
    title: "ACCESSIBLE VIEWING",
    kinds: ["accessible_viewing"],
    blurb: "Reserved wheelchair viewing points",
  },
  { title: "TRANSPORT", kinds: ["transport"], blurb: "Trams, trains, buses" },
];

export function AmenityFinder({ activeFilter }: { activeFilter?: FilterId }) {
  const { userLocation, walkKmh, persona } = useSession();

  const rows = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const candidates = POIS.filter((p) => cat.kinds.includes(p.kind))
        .map((p) => ({
          p,
          km: distanceKm(userLocation, [p.lat, p.lng]),
        }))
        .sort((a, b) => a.km - b.km)
        .slice(0, 2);
      return { cat, candidates };
    });
  }, [userLocation]);

  const filterKinds =
    MAP_FILTERS.find((f) => f.id === activeFilter)?.kinds ?? [];

  const emphasise = (title: string) => {
    if (filterKinds.length > 0) {
      const cat = CATEGORIES.find((c) => c.title === title)!;
      return cat.kinds.some((k) => filterKinds.includes(k));
    }
    if (persona === "wheelchair")
      return ["ACCESSIBLE TOILETS", "STEP-FREE ROUTES", "ACCESSIBLE VIEWING"].includes(title);
    if (persona === "elderly")
      return ["ACCESSIBLE TOILETS", "TRANSPORT"].includes(title);
    if (persona === "families")
      return ["FOOD", "FIRST AID"].includes(title);
    if (persona === "foodie") return title === "FOOD";
    return title === "FOOD";
  };


  return (
    <section className="px-5 py-12 bg-brand-cream border-t-4 border-brand-ink">
      <h3 className="font-display text-5xl leading-none mb-2">NEAREST TO YOU</h3>
      <p className="text-xs opacity-70 mb-6">
        Distances from your "I am here" pin at {walkKmh} km/h. Highlighted rows
        match what you've selected on the map above.
      </p>

      <div className="space-y-4">
        {rows.map(({ cat, candidates }) => {
          const hot = emphasise(cat.title);
          return (
            <div
              key={cat.title}
              className={
                "border-2 border-brand-ink p-4 " +
                (hot ? "bg-brand-yellow" : "bg-white")
              }
            >
              <div className="flex justify-between items-baseline">
                <p className="font-display text-2xl leading-none">{cat.title}</p>
                {hot && (
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-brand-ink text-brand-cream px-2 py-1">
                    {filterKinds.length > 0 ? "On map now" : `For ${persona}`}
                  </span>
                )}
              </div>
              <p className="text-[11px] opacity-70 mb-3">{cat.blurb}</p>
              <ul className="space-y-2">
                {candidates.map(({ p, km }) => (
                  <li key={p.id} className="flex justify-between items-baseline gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{p.name}</p>
                      <p className="text-[11px] opacity-70 truncate">
                        {p.area ?? KIND_META[p.kind].label}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-display text-xl leading-none text-brand-red">
                        {formatMinutes(walkMinutes(km, walkKmh))}
                      </p>
                      <p className="text-[10px] opacity-60">{km.toFixed(2)} km</p>
                    </div>
                  </li>
                ))}
                {candidates.length === 0 && (
                  <li className="text-xs opacity-60">Nothing tagged yet.</li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
