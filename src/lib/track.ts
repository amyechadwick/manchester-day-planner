import { POIS, type POI, type Persona } from "@/data/festival";

/**
 * All stops that make up a track's route, in time order.
 * Every matching stop is included — the map, the legend count and the
 * numbered itinerary all read from this single list so numbering is
 * contiguous (1..n) and identical everywhere.
 */
export function trackStops(persona: Persona): POI[] {
  return POIS.filter((p) => {
    if (p.kind === "event" || p.kind === "parade_stop") {
      return p.personaBoost?.includes(persona) ?? false;
    }
    // The foodie track walks the food stalls too.
    return persona === "foodie" && p.kind === "food";
  }).sort((a, b) => (a.startsAt ?? 24 * 60) - (b.startsAt ?? 24 * 60));
}
