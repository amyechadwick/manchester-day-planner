import { PERSONAS, type Persona } from "@/data/festival";
import { useSession } from "@/state/session";

const ORDER: Persona[] = ["families", "elderly", "young", "wheelchair"];

export function PersonaBar() {
  const { persona, setPersona } = useSession();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-brand-ink px-3 py-3 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.12)]">
      <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-center opacity-50 italic">
        Who are you with today? Switch anytime.
      </p>
      <div className="flex justify-between items-stretch gap-2">
        {ORDER.map((id) => {
          const p = PERSONAS[id];
          const active = persona === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setPersona(id)}
              className={
                "flex-1 py-2 border-2 border-brand-ink flex flex-col items-center leading-none transition " +
                (active
                  ? "bg-brand-yellow text-brand-ink"
                  : "bg-white text-brand-ink/50")
              }
            >
              <span className="font-display text-lg leading-none">
                {p.label.toUpperCase()}
              </span>
              <span className="text-[9px] font-bold mt-1">{p.walkKmh} km/h</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
