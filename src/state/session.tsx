import {
  createContext,
  useCallback,
  useContext,
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
}

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [persona, setPersonaState] = useState<Persona>("families");
  // Default user location: near Piccadilly Gardens, a realistic arrival point.
  const [userLocation, setUserLocationState] = useState<[number, number]>([
    53.4808, -2.2378,
  ]);
  // Default sim time: 13:20 — lively part of the day, parade just starting.
  const [simNow, setSimNowState] = useState<number>(13 * 60 + 20);

  const setPersona = useCallback((p: Persona) => setPersonaState(p), []);
  const setUserLocation = useCallback(
    (loc: [number, number]) => setUserLocationState(loc),
    [],
  );
  const setSimNow = useCallback((m: number) => setSimNowState(m), []);

  const value = useMemo<SessionState>(
    () => ({
      persona,
      setPersona,
      userLocation,
      setUserLocation,
      simNow,
      setSimNow,
      walkKmh: PERSONAS[persona].walkKmh,
    }),
    [persona, setPersona, userLocation, setUserLocation, simNow, setSimNow],
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
