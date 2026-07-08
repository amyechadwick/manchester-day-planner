## Manchester Day 2026 Companion — build plan

Prototype for ProductTank Manchester. Mobile-first (390px), no accounts, no live GPS, no ticketing. Built in the chosen "Playful editorial sprawl" direction: locked palette (#E63329 red, #FFD21F yellow, #1E4FB8 blue, #FBF3E2 cream, #1A1A1A ink), Bebas Neue display + Barlow body, stacked full-width sections, sticky bottom persona bar, poster-style typographic hero, chunky borders and offset drop shadows.

### Scope (P0 only, plus P1 heatmap)

Every P0 in the PRD, plus the schedule-based predictive heatmap. Treasure hunt is deferred as the PRD specifies.

### App structure

Single mobile screen made of stacked sections, all reading from one shared data model. No auth, no backend — pure frontend prototype.

```text
src/routes/
  __root.tsx        real head metadata (title, description, og), Bebas+Barlow via <link>
  index.tsx         the whole companion screen
src/data/
  festival.ts       shared POI/event/parade dataset + persona configs
src/lib/
  festival-time.ts  "simulated now" clock (starts at 13:30 on event day), walking math
  distance.ts       haversine + persona-adjusted ETA
src/state/
  session.tsx       React context: persona, simulated user location, simulated now
src/components/festival/
  NowNextHero.tsx           poster hero + next-event card + clash sticker
  ParadeTracker.tsx         vertical blue timeline, 7 stops with per-stop ETA
  FestivalMap.tsx           react-leaflet OSM map, filter pills, POI pins, "I am here" draggable pin, heatmap overlay toggle
  AmenityFinder.tsx         nearest food / first aid / accessible toilet / step-free / accessible viewing / transport
  ProgrammeList.tsx         full schedule grouped by time, persona-boosted items highlighted
  PersonaBar.tsx            sticky bottom chip bar (Families / Elderly / Young / Wheelchair)
  SimClockControl.tsx       small "simulated time" slider so judges can scrub the day
```

### Data model (single source of truth)

One `POI` type covers events, food, first aid, transport, accessibility points, and parade stops. Persona rules and heatmap intensities are derived from this dataset — no duplicated stores.

```text
POI {
  id, name, kind: "event" | "food" | "first_aid" | "toilet_accessible"
              | "step_free" | "accessible_viewing" | "transport" | "parade_stop",
  lat, lng,
  startsAt?, endsAt?,          // events + parade stops
  paradeStopOrder?,            // 1..7 along the route
  personaBoost?: Persona[],    // e.g. ["families"] for kid-friendly acts
  description?
}
```

Hand-authored fixtures: ~25 events (Catalan-themed acts, family workshops, music, Castellers, sardana dance), ~10 food stalls, 4 first aid points, transport pins (Piccadilly, Victoria, Deansgate tram, key bus stops), full wheelchair layer with the three distinct sub-types, and the 7-stop parade route with per-stop ETAs.

### Persona logic

```text
families    (default): walking 4.0 km/h, boosts kid-friendly + shorter walks
elderly              : walking 3.0 km/h, boosts short-walk + seated events, surfaces toilets
young                : walking 5.0 km/h, boosts music/higher-energy
wheelchair           : walking 3.5 km/h, only routes flagged step-free,
                       surfaces accessible viewing + accessible toilets
```

Switching persona mid-session immediately recomputes the Now/Next ETA, updates the clash banner, re-sorts Programme, and changes which POIs are emphasised on the map — no reload.

### Itinerary + clash logic

`walkMinutes = distanceKm / personaSpeed * 60`. Show clash sticker when `walkMinutes > minutesUntilStart`. Copy tuned to the persona ("You won't make it at family pace — try the tram").

### Map

`react-leaflet` + OpenStreetMap tiles (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, standard OSM attribution — no API key). Centered on Manchester city centre (~53.4794, -2.2453). Custom SVG pins per POI kind in the brand palette. Draggable "I am here" pin (tap map to move). Filter pills switch which kinds are visible. Wheelchair filter reveals the three sub-types as separately-styled pins, not merged.

### Predictive heatmap (P1)

Toggle over the map. Intensity per zone derived from concurrent event counts at the current simulated time (e.g. Albert Sq + St Peter's Sq spike around parade finish). Rendered with `leaflet.heat`. Visible caption on the toggle and on the legend: "Predicted crowd — based on the published schedule, not live data."

### Parade tracker

Vertical blue timeline (from selected direction). All 7 stops from the PRD in order with time estimates. "Currently here" state derived from simulated clock. Tap a stop to jump the map to it.

### Simulated clock control

Small unobtrusive time slider (12:00 → 17:00) so judges can scrub the day and see Now/Next, parade progress, and heatmap update live. Defaults to a lively point in the day.

### Head metadata + SEO

Real `title` "Manchester Day 2026 Companion — What's on, where, and can you make it?", matching description, og:title/og:description/og:type/twitter:card in `__root.tsx`. og:image set on `index.tsx` only, pointing at a generated poster-style hero image.

### Assets

Generate one hero/OG poster image (Catalan-flavoured, sardines/sunbursts, brand palette) via `imagegen`. Custom inline SVG icons for pin kinds, no Lucide sparkle-slop.

### Dependencies

`bun add react-leaflet leaflet leaflet.heat @types/leaflet`. Leaflet CSS + Bebas Neue/Barlow loaded via `<link>` in `__root.tsx` head (Tailwind v4 rules).

### Explicit out of scope

Live GPS, live crowd data, ticketing, accounts, multi-event, treasure hunt, backend, auth. No Lovable Cloud needed.

### Open questions parked (not blockers)

Walking-speed figures are the PRD's own open question — I'll use the values above and note them in a small footnote in the app so they're honest, not hidden. Heatmap visual treatment: soft radial blobs + explicit "predicted" caption + dashed legend swatch so it never reads as live.

### Verification before handoff

Playwright shell run at 390px viewport: capture Now/Next with a clash, persona switch changing ETA + clash text, parade tracker at two different simulated times, map with heatmap on and wheelchair filter showing three distinct sub-types.
