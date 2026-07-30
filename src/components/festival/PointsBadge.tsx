import { Link } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import { useSession } from "@/state/session";

export function PointsBadge() {
  const { points } = useSession();

  return (
    <Link
      to="/day-share"
      aria-label={`${points} points — open Day Share`}
      className="shrink-0 flex items-center gap-1 border-2 border-brand-yellow bg-brand-yellow text-brand-ink px-2 py-1 leading-none hover:bg-brand-red hover:text-brand-cream hover:border-brand-red transition"
    >
      <Trophy className="size-4" strokeWidth={2.5} />
      <span className="font-display text-lg leading-none">{points} PTS</span>
    </Link>
  );
}
