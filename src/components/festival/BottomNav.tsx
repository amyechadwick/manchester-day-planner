import { Link } from "@tanstack/react-router";
import { MapPin, Route as RouteIcon, CalendarDays, Home, Camera } from "lucide-react";
import { useSession } from "@/state/session";

const TABS = [
  { to: "/", label: "HOME", icon: Home },
  { to: "/parade", label: "PARADE", icon: RouteIcon },
  { to: "/map", label: "MAP", icon: MapPin },
  { to: "/itinerary", label: "MY DAY", icon: CalendarDays },
  { to: "/day-share", label: "SHARE", icon: Camera },
] as const;

export function BottomNav() {
  const { agenda } = useSession();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-brand-ink text-brand-cream border-t-4 border-brand-yellow z-[1000] shadow-[0_-10px_30px_rgba(0,0,0,0.25)]">
      <div className="flex justify-between items-stretch">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              activeOptions={{ exact: t.to === "/" }}
              activeProps={{ className: "bg-brand-red" }}
              className="relative flex-1 py-2 px-1 flex flex-col items-center gap-1 hover:bg-brand-red/80 transition"
            >
              <Icon className="size-5" strokeWidth={2.5} />
              <span className="font-display text-[11px] leading-none tracking-wide">
                {t.label}
              </span>
              {t.to === "/itinerary" && agenda.length > 0 && (
                <span className="absolute top-1 right-1/2 translate-x-5 min-w-4 h-4 px-1 rounded-full bg-brand-yellow text-brand-ink font-display text-[11px] leading-4 text-center border-2 border-brand-ink">
                  {agenda.length}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

