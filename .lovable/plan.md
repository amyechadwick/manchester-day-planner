# Complete track routes on the map

## What's wrong now

The "TRACK ROUTE" layer only shows POIs whose `personaBoost` list contains the selected track. Given the current data:

- None of the 7 parade stops have a `personaBoost` value, so **no parade stop ever appears on a track route**, even though the code intends to include them.
- Boosted event counts are very uneven: Culture 12, Families 8, Elderly 7, Young 7, Music 5, Wheelchair 3, **Foodie 1**. A track can render as a 1–3 stop line that looks broken.

The pin numbers themselves don't skip integers (pins are numbered 1..n in time order), but stops are genuinely missing from each track, which is what reads as "missing numbers".

## The fix

1. Tag every parade stop with tracks so parade stops appear on track routes, with per-track sense kept: the Wheelchair track uses the stops with accessible viewing nearby; other tracks get the full stop list.
2. Fill in track tags across the event list so every track has a coherent, day-long route (roughly 6–9 stops spread across 12:00–17:00) instead of one or two.
3. Foodie track additionally includes the food stops (tapas, paella, churros, picnic) so it forms a real trail.
4. Track panel shows the true stop count, and when a stop is intentionally dropped for a track (e.g. non step-free for Wheelchair) it says so in one line rather than silently omitting it.

## Technical notes

- `src/data/festival.ts`: add `personaBoost` to each entry in `PARADE_STOPS`; broaden and rebalance `personaBoost` on events. `POI` shape unchanged.
- `src/components/festival/FestivalMap.tsx`: extend the `trackPois` filter so the Foodie track also admits `kind: "food"`, keep the time-order sort and contiguous numbering.
- No other changes to map rendering, agenda, or amenity logic beyond the count/copy line in the track panel.