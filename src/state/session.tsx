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
import { trackStops } from "@/lib/track";
import { ownImageKeyFor } from "@/data/photos";

export interface Snap {
  poiId: string;
  imageKey: string;
  /** Minutes since midnight when the snap was taken. */
  takenAt: number;
}

interface SessionState {
  persona: Persona;
  setPersona: (p: Persona) => void;
  /** Whether the user has actively picked a track (home page selection). */
  trackSelected: boolean;
  /** Clears My Day, deselects the track and hands control back to the user. */
  chooseMyOwnDay: () => void;
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
  /** Photos the user has "taken", keyed by POI id. */
  snaps: Record<string, Snap>;
  takeSnap: (id: string) => boolean;
  hasSnap: (id: string) => boolean;
  /** 10 points per photo taken. */
  points: number;
}

const SessionContext = createContext<SessionState | null>(null);

const AGENDA_KEY = "md26-agenda";
const PERSONA_KEY = "md26-persona";
const TRACK_KEY = "md26-track-selected";
const SNAPS_KEY = "md26-snaps";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [persona, setPersonaState] = useState<Persona>("families");
  // Default user location: near Piccadilly Gardens, a realistic arrival point.
  const [userLocation, setUserLocationState] = useState<[number, number]>([
    53.4808, -2.2378,
  ]);
  // Default sim time: 13:20 — lively part of the day, parade just starting.
  const [simNow, setSimNowState] = useState<number>(13 * 60 + 20);
  const [agenda, setAgenda] = useState<string[]>([]);
  const [trackSelected, setTrackSelected] = useState(false);
  const [snaps, setSnaps] = useState<Record<string, Snap>>({});

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
      setTrackSelected(window.localStorage.getItem(TRACK_KEY) === "1");
      const s = window.localStorage.getItem(SNAPS_KEY);
      if (s) {
        const parsed = JSON.parse(s);
        if (parsed && typeof parsed === "object") setSnaps(parsed);
      }
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

  // Picking a track pre-fills My Day with that track's stops.
  const setPersona = useCallback(
    (p: Persona) => {
      setPersonaState(p);
      setTrackSelected(true);
      // Prototype cap: at most 10 stops in a track day.
      setAgenda(persist(trackStops(p).slice(0, 10).map((s) => s.id)));
      try {
        window.localStorage.setItem(PERSONA_KEY, p);
        window.localStorage.setItem(TRACK_KEY, "1");
      } catch {
        /* ignore */
      }
    },
    [persist],
  );

  const chooseMyOwnDay = useCallback(() => {
    setTrackSelected(false);
    setAgenda(persist([]));
    try {
      window.localStorage.setItem(TRACK_KEY, "0");
    } catch {
      /* ignore */
    }
  }, [persist]);

  const toggleAgenda = useCallback(
    (id: string) =>
      setAgenda((prev) =>
        persist(prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]),
      ),
    [persist],
  );
  const clearAgenda = useCallback(() => setAgenda(persist([])), [persist]);
  const isInAgenda = useCallback((id: string) => agenda.includes(id), [agenda]);

  const takeSnap = useCallback(
    (id: string) => {
      let added = false;
      setSnaps((prev) => {
        if (prev[id]) return prev;
        added = true;
        const next = {
          ...prev,
          [id]: { poiId: id, imageKey: ownImageKeyFor(id), takenAt: simNow },
        };
        try {
          window.localStorage.setItem(SNAPS_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
      return added;
    },
    [simNow],
  );
  const hasSnap = useCallback((id: string) => Boolean(snaps[id]), [snaps]);
  const points = Object.keys(snaps).length * 10;

  const value = useMemo<SessionState>(
    () => ({
      persona,
      setPersona,
      trackSelected,
      chooseMyOwnDay,
      userLocation,
      setUserLocation,
      simNow,
      setSimNow,
      walkKmh: PERSONAS[persona].walkKmh,
      agenda,
      toggleAgenda,
      isInAgenda,
      clearAgenda,
      snaps,
      takeSnap,
      hasSnap,
      points,
    }),
    [
      persona,
      setPersona,
      trackSelected,
      chooseMyOwnDay,
      userLocation,
      setUserLocation,
      simNow,
      setSimNow,
      agenda,
      toggleAgenda,
      isInAgenda,
      clearAgenda,
      snaps,
      takeSnap,
      hasSnap,
      points,
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
