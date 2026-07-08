import { MapPin, Route, CalendarDays, Settings } from "lucide-react";

const TABS = [
  { id: "parade", label: "PARADE", icon: Route },
  { id: "map", label: "MAP", icon: MapPin },
  { id: "itinerary", label: "ITINERARY", icon: CalendarDays },
  { id: "settings", label: "SETTINGS", icon: Settings },
] as const;

export function BottomNav() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-brand-ink text-brand-cream border-t-4 border-brand-yellow z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.25)]">
      <div className="flex justify-between items-stretch">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => scrollTo(t.id)}
              className="flex-1 py-2 flex flex-col items-center gap-1 hover:bg-brand-red/80 transition"
            >
              <Icon className="size-5" strokeWidth={2.5} />
              <span className="font-display text-[13px] leading-none tracking-wide">
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}