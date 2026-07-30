import { PERSONAS, type Persona } from "@/data/festival";
import { useSession } from "@/state/session";

const ORDER: Persona[] = [
  "families",
  "elderly",
  "young",
  "wheelchair",
  "music",
  "foodie",
  "culture",
];

export function PersonaBar() {
  const { persona, setPersona, trackSelected } = useSession();

  return (
    <nav className="bg-white border-b-4 border-brand-ink px-3 py-3">
      <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-center opacity-50 italic">
        Who are you with today? Switch anytime.
      </p>
      <div className="grid grid-cols-4 gap-2">
        {ORDER.map((id) => {
          const p = PERSONAS[id];
          const active = trackSelected && persona === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setPersona(id)}
              className={
                "py-2 border-2 border-brand-ink flex flex-col items-center leading-none transition " +
                (active
                  ? "bg-brand-yellow text-brand-ink"
                  : "bg-white text-brand-ink/50")
              }
            >
              <span className="font-display text-base leading-none">
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

