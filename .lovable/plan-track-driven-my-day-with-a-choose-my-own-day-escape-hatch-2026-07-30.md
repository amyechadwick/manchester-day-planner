# Track-driven My Day, with a "choose my own day" escape hatch

## What changes for the user

1. **Picking a track fills My Day for you.** Selecting a track on the home page automatically loads that track's stops (all of them, in time order) into My Day. Switching tracks swaps the itinerary for the new track's stops. My Day is no longer empty by default.
2. **A clear escape hatch.** Above/below the track itinerary on the my day there's a prompt: "This itinerary doesn't work for you? Pick your own." with a button **CHOOSE MY OWN DAY**. Pressing it clears My Day, deselects the track on the home page, and leaves you free to add items yourself from the programme and parade pages.
3. **No track selected state.** With no track chosen, the home page track buttons are all unselected, the map's track-route layer is hidden, and My Day only contains what you add manually.
4. **"Picked for you" removed** from the programme list; boosted events keep no special label.

## Behaviour details

- Track selected -> My Day = that track's stops (manual adds/removes on top still work; you can remove individual items).
- "Choose my own day" -> My Day empty, no track selected, manual mode.
- Choosing a track again after that re-fills My Day from the track.

## Technical notes

- `src/state/session.tsx`: allow `persona: Persona | null` (default `null`, persisted). Add a `mode`-free approach: `setPersona(p)` also replaces `agenda` with `trackStops(p)` ids; new `chooseMyOwnDay()` sets persona to `null` and agenda to `[]`. Persist both to localStorage.
- Everywhere persona is consumed for pace/labels (`walkKmh`, `PERSONAS[persona]`), fall back to a neutral default (families walk speed / "your" pace wording) when persona is `null`: `MyDayList`, `TrackList`, `FestivalMap`, `AmenityFinder`, `ProgrammeList`, `NowNextHero`, `ParadeTracker`.
- `PersonaBar`: no button active when persona is `null`; clicking a track sets it.
- `FestivalMap`: hide the "TRACK ROUTE" filter button and track panel when persona is `null`; reset `active` filter if it was the track layer.
- `src/routes/itinerary.tsx` / `MyDayList.tsx`: add the call-to-action block with the **CHOOSE MY OWN DAY** button wired to `chooseMyOwnDay()`; show it only when a track is selected. Hide the "YOUR TRACK" section when no track is selected.
- `ProgrammeList.tsx`: remove the "Picked for you" line (keep the boosted highlight styling only when a track is selected).