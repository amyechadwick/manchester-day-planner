## App Screenshots

![Manchester Day 2026 Companion screenshot](./assets/screenshot.png)

# Manchester Day 2026 Companion

A mobile-first festival companion for Manchester Day 2026 — real-time itinerary, persona-based tracks, interactive map, and a social photo feed.

## Motivation

I built Manchester Day 2026 Companion to practice vibe coding and build testable proof-of-concepts.

## What you can do

- Pick a ready-made track for **Families**, **Elderly**, **Young**, **Wheelchair**, **Music**, **Foodie** or **Culture** and get an auto-generated itinerary
- Build your own agenda from the programme and parade stops
- See every event and stop on an interactive map with numbered route lines
- Filter the map by layer: Events, Food, First Aid, Accessible Toilets, Step-free Routes, Transport, Parade Route, Heatmap, My Day, or Your Track
- Check what’s on now and next, with walking time estimates from your simulated location
- Snap a simulated photo at each stop to earn 10 points
- View other attendees’ photos at each spot
- Browse everyone’s photos in the Day Share feed
- Adjust the simulated clock and your location to test the app at different times

## How to run locally

1. Clone the repo
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open the local URL printed in the terminal (usually `http://localhost:8080`)

## Where the app data lives

- `src/data/festival.ts` — All POIs, events, parade stops, food stalls, first aid points, accessible toilets, step-free routes, transport links and persona metadata
- `src/data/photos.ts` — Seeded photo feed and image mapping logic for the Day Share feature
- `src/lib/track.ts` — Track generation logic and stop numbering
- `src/lib/distance.ts` — Walking time calculations and distance helpers
- `src/state/session.tsx` — Global state for persona, agenda, simulated clock, location, snaps and points

## Project layout (high level)

```text
src/
  components/festival/   UI components for the festival app
  data/                    Festival data and photo seed data
  lib/                     Track, distance and utility logic
  routes/                  TanStack Router routes (home, parade, map, itinerary, day-share)
  state/                   Global state provider (session context)
  styles.css               Tailwind v4 theme and app tokens
  routes/__root.tsx        App root layout with shared head, nav and providers
```

## Tech stack

- React 19
- TanStack Router / TanStack Start
- TanStack Query
- Tailwind CSS v4
- Radix UI primitives
- Leaflet + React-Leaflet for the map
- date-fns for time formatting
- Zod for validation
- Vite for dev and build
