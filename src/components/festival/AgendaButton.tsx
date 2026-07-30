import { Check, Plus } from "lucide-react";
import { useSession } from "@/state/session";

export function AgendaButton({
  id,
  tone = "light",
}: {
  id: string;
  tone?: "light" | "dark";
}) {
  const { isInAgenda, toggleAgenda } = useSession();
  const on = isInAgenda(id);

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Remove from My Day" : "Add to My Day"}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleAgenda(id);
      }}
      className={
        "shrink-0 inline-flex items-center gap-1 px-2 py-1 border-2 font-display text-sm leading-none transition " +
        (on
          ? "bg-brand-ink text-brand-cream border-brand-ink"
          : tone === "dark"
            ? "bg-transparent text-brand-cream border-brand-cream/60 hover:bg-brand-cream/10"
            : "bg-white text-brand-ink border-brand-ink hover:bg-brand-yellow")
      }
    >
      {on ? <Check className="size-3.5" strokeWidth={3} /> : <Plus className="size-3.5" strokeWidth={3} />}
      {on ? "SAVED" : "ADD"}
    </button>
  );
}
