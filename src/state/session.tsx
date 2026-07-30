import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MCR_CENTER, PERSONAS, type Persona } from "@/data/festival";

interface SessionState {
  persona: Persona;
  setPersona: (p: Persona) => void;
  /** Simulated user location (draggable "I am here" pin). */
  userLocation: [number, number];
  setUserLocation: (loc: [number, number]) => void;
  /** Minutes since midnight on event day. */
  simNow: number;
  setSimNow: (m: number) => void;
  walkKmh: number;
  /** POI ids the user has saved into "My Day". */
  agenda: string[];
  toggleAgenda: (id: string) => void;
  isInAgenda: (id: string) => boolean;
  clearAgenda: () => void;
}

const SessionContext = createContext<SessionState | null>(null);

const AGENDA_KEY = "md26-agenda";
const PERSONA_KEY = "md26-persona";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [persona, setPersonaState] = useState<Persona>("families");
  // Default user location: near Piccadilly Gardens, a realistic arrival point.
  const [userLocation, setUserLocationState] = useState<[number, number]>([
    53.4808, -2.2378,
  ]);
  // Default sim time: 13:20 — lively part of the day, parade just starting.
  const [simNow, setSimNowState] = useState<number>(13 * 60 + 20);
  const [agenda, setAgenda] = useState<string[]>([]);

  // Hydrate from localStorage after mount so SSR markup matches.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(AGENDA_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setAgenda(parsed.filter((x) => typeof x === "string"));
      }
      const p = window.localStorage.getItem(PERSONA_KEY);
      if (p && p in PERSONAS) setPersonaState(p as Persona);
    } catch {
      /* ignore */
    }
  }, []);

  const setPersona = useCallback((p: Persona) => {
    setPersonaState(p);
    try {
      window.localStorage.setItem(PERSONA_KEY, p);
    } catch {
      /* ignore */
    }
  }, []);
  const setUserLocation = useCallback(
    (loc: [number, number]) => setUserLocationState(loc),
    [],
  );
  const setSimNow = useCallback((m: number) => setSimNowState(m), []);

  const persist = useCallback((next: string[]) => {
    try {
      window.localStorage.setItem(AGENDA_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    return next;
  }, []);

  const toggleAgenda = useCallback(
    (id: string) =>
      setAgenda((prev) =>
        persist(prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]),
      ),
    [persist],
  );
  const clearAgenda = useCallback(() => setAgenda(persist([])), [persist]);
  const isInAgenda = useCallback((id: string) => agenda.includes(id), [agenda]);

  const value = useMemo<SessionState>(
    () => ({
      persona,
      setPersona,
      userLocation,
      setUserLocation,
      simNow,
      setSimNow,
      walkKmh: PERSONAS[persona].walkKmh,
      agenda,
      toggleAgenda,
      isInAgenda,
      clearAgenda,
    }),
    [
      persona,
      setPersona,
      userLocation,
      setUserLocation,
      simNow,
      setSimNow,
      agenda,
      toggleAgenda,
      isInAgenda,
      clearAgenda,
    ],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionState {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}

// Silences unused import warning if the constant is imported for side-effect.
void MCR_CENTER;
