import { useEffect, useMemo, useState } from "react";
import { KIND_META, MCR_CENTER, POIS, type POIKind } from "@/data/festival";
import { useSession } from "@/state/session";

type FilterId = "events" | "food" | "first_aid" | "accessible" | "transport" | "parade";

const FILTERS: { id: FilterId; label: string; kinds: POIKind[] }[] = [
  { id: "events", label: "EVENTS", kinds: ["event"] },
  { id: "parade", label: "PARADE", kinds: ["parade_stop"] },
  { id: "food", label: "FOOD", kinds: ["food"] },
  { id: "first_aid", label: "FIRST AID", kinds: ["first_aid"] },
  {
    id: "accessible",
    label: "ACCESSIBLE",
    kinds: ["toilet_accessible", "step_free", "accessible_viewing"],
  },
  { id: "transport", label: "TRANSPORT", kinds: ["transport"] },
];

const ACCESSIBLE_SUBS: { kind: POIKind; label: string; swatch: string }[] = [
  { kind: "step_free", label: "Step-free routes", swatch: "bg-brand-blue" },
  { kind: "toilet_accessible", label: "Accessible toilets", swatch: "bg-brand-red" },
  { kind: "accessible_viewing", label: "Parade viewing", swatch: "bg-brand-ink" },
];

export function FestivalMap() {
  const [active, setActive] = useState<FilterId>("events");
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const visibleKinds = useMemo(
    () => FILTERS.find((f) => f.id === active)!.kinds,
    [active],
  );
  const visiblePois = useMemo(
    () => POIS.filter((p) => visibleKinds.includes(p.kind)),
    [visibleKinds],
  );

  return (
    <section className="px-5 py-12 bg-brand-cream">
      <div className="flex justify-between items-end mb-6">
        <h3 className="font-display text-5xl leading-none">
          FIND YOUR
          <br />
          WAY
        </h3>
        <button
          type="button"
          onClick={() => setShowHeatmap((v) => !v)}
          className={
            "p-2 border-2 border-brand-ink text-left transition " +
            (showHeatmap ? "bg-brand-ink text-brand-cream" : "bg-brand-cream text-brand-ink")
          }
        >
          <p className="text-[10px] uppercase font-bold leading-tight">
            Crowd heatmap
            <br />
            <span className="italic tracking-normal lowercase font-normal opacity-80">
              schedule-based, not live
            </span>
          </p>
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 -mx-5 px-5 no-scrollbar">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActive(f.id)}
            className={
              "flex-none px-4 py-2 font-display text-lg border-2 border-brand-ink transition " +
              (active === f.id
                ? "bg-brand-ink text-brand-cream"
                : "bg-brand-cream text-brand-ink")
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="relative w-full aspect-square bg-white border-2 border-brand-ink shadow-[8px_8px_0px_0px_rgba(255,210,31,1)] overflow-hidden">
        {mounted ? (
          <MapCanvas
            pois={visiblePois}
            heatmap={showHeatmap}
            activeFilter={active}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-display text-brand-ink/20 text-4xl">
            LOADING MAP…
          </div>
        )}
      </div>

      <p className="mt-2 text-[10px] opacity-60 italic">
        Tap the map to move your "I am here" pin. Distances and walking times
        update from wherever it is.
      </p>

      {active === "accessible" && (
        <div className="mt-6 space-y-3">
          <p className="font-display text-2xl text-brand-blue leading-none">
            WHEELCHAIR ACCESS · 3 LAYERS
          </p>
          <p className="text-xs opacity-70">
            We show step-free routes, accessible toilets, and accessible parade
            viewing separately — never merged behind one generic icon.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {ACCESSIBLE_SUBS.map((s) => (
              <div
                key={s.kind}
                className="border-2 border-brand-ink p-3 bg-white flex flex-col gap-2"
              >
                <span
                  className={`size-4 rounded-full ${s.swatch} border-2 border-brand-ink`}
                />
                <p className="text-[10px] font-bold uppercase leading-tight">
                  {s.label}
                </p>
                <p className="text-[10px] opacity-60">
                  {POIS.filter((p) => p.kind === s.kind).length} on map
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <MapLegend visible={visibleKinds} />
    </section>
  );
}

function MapLegend({ visible }: { visible: POIKind[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {visible.map((k) => (
        <span
          key={k}
          className="inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest"
        >
          <span
            className="inline-block size-3 rounded-full border-2 border-brand-ink"
            style={{ backgroundColor: KIND_META[k].color }}
          />
          {KIND_META[k].label}
        </span>
      ))}
    </div>
  );
}

// ---- Client-only Leaflet canvas ----

type CanvasProps = {
  pois: typeof POIS;
  heatmap: boolean;
  activeFilter: FilterId;
};

function MapCanvas(props: CanvasProps) {
  const [Comp, setComp] = useState<React.ComponentType<CanvasProps> | null>(null);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const mod = await import("./MapCanvasClient");
      if (alive) setComp(() => mod.MapCanvasClient);
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!Comp) {
    return (
      <div className="w-full h-full flex items-center justify-center font-display text-brand-ink/30 text-3xl">
        LOADING MAP…
      </div>
    );
  }
  return <Comp {...props} />;
}

// Export MCR_CENTER re-use for the client module to avoid re-imports elsewhere.
export { MCR_CENTER };
