# Real pages, persona parade routes, and a build-your-own agenda

## What changes for the user

1. **The bottom nav becomes real navigation.** Parade, Map, Itinerary and Settings become four separate pages with their own URLs, titles and share metadata, instead of scroll jumps on one long page. The active tab is highlighted, and your persona, demo clock, "you are here" pin and saved agenda carry across every page.
2. **Persona-specific parade routes on the map.** As well as the single red parade line, the map shows the recommended way to follow the itinary based on who  you're with eg. what you have selected
3. **Build your own agenda.** Every programme item and parade stop gets an add/remove control. Saved items appear in a "My Day" list on the Itinerary page, ordered by time, with walking time between consecutive items and a warning sticker when two picks can't be reached in time at your pace. The map gains a "MY DAY" filter that shows only your saved stops, numbered 1..n, connected in time order so you can see your personal route. A counter badge on the Itinerary nav tab shows how many items you've saved. The route for your my day will appear on the map

## Page structure

```text
/            Now & Next home  (hero, quick links)
/parade      Parade tracker + persona route summary
/map         Map, filters, heatmap, accessibility layers, MY DAY layer
/itinerary   My Day agenda + full programme with add/remove
/settings    Demo clock + persona switcher + amenity finder
```

## Technical notes

- Move `SessionProvider` from `src/routes/index.tsx` into `src/routes/__root.tsx` so session state survives route changes; add `agenda: string[]` (POI ids) with `toggleAgenda`/`isInAgenda` to `src/state/session.tsx`, persisted to `localStorage` and hydrated in an effect to avoid SSR mismatch.
- New route files: `src/routes/parade.tsx`, `map.tsx`, `itinerary.tsx`, `settings.tsx`, each with its own `head()` metadata; `index.tsx` keeps only the hero plus links. Reuse existing components unchanged where possible.
- Rewrite `BottomNav.tsx` to use `<Link to="...">` with `activeProps` styling instead of `scrollIntoView`.
- Agenda layer in `MapCanvasClient.tsx`: numbered pins for saved POIs plus a dashed polyline in time order; new `"my_day"` filter in `FestivalMap.tsx`.
- New `MyDayList.tsx` component for the saved agenda with per-leg walking times via existing `distanceKm`/`walkMinutes` helpers.
- No backend needed; all data stays local.