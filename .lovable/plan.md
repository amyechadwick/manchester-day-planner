# Gamification: snap, points and Day Share

## What you get

1. **Camera icon on every My Day / track stop** — tapping it instantly attaches a photo for that spot (simulated snapshot, no permissions needed) and awards **10 points**. Once snapped, the icon shows as "SNAPPED" with a thumbnail.
2. **"See others" icon** on each stop — opens a small sheet showing one photo per person for that spot (a handful of seeded festival-goers), with name and caption.
3. **Points badge** in the top bar of every page (e.g. "40 PTS"), plus a bigger score card on the new Day Share tab with a simple streak/level line ("3 of 8 spots snapped").
4. **New DAY SHARE tab** in the bottom nav — a vertical Instagram-style scroll feed of photos: yours first-class (badged "YOU"), mixed with other attendees, each card showing photo, spot name, time, person and a like count. Filter chips: ALL / MINE / OTHERS.

## How it works (technical)

- `src/data/photos.ts` — new: pool of seeded photos (spot id, author name, caption, likes) covering one image per spot per author, plus the stock images used for "your" snapshots. Images generated into `src/assets/` and imported as ES modules.
- `src/state/session.tsx` — add `snaps: Record<spotId, {imageKey, takenAtMin}>`, `takeSnap(id)`, `hasSnap(id)`, `points` (10 × snaps), persisted to localStorage under `md26-snaps`. Points are derived, not stored separately.
- `src/components/festival/SnapButton.tsx` — new: camera icon + points feedback toast (sonner), disabled state once snapped.
- `src/components/festival/SpotPhotosSheet.tsx` — new: icon button opening a Dialog/Sheet listing other people's single photo for that spot.
- `src/components/festival/PointsBadge.tsx` — new: pill rendered in the shared header area (`src/routes/__root.tsx`).
- `src/components/festival/MyDayList.tsx` and `TrackList.tsx` — add the two icon buttons to each row. These are always available, including while a track is selected (they don't add/remove agenda items, so the locked-track rule still holds).
- `src/routes/day-share.tsx` — new route: score card, filter chips, feed of `PhotoCard`s (`src/components/festival/PhotoCard.tsx`), own head() metadata.
- `src/components/festival/BottomNav.tsx` — add fifth tab "SHARE" (Camera icon); tighten padding/label sizing so five tabs fit mobile widths.

Everything stays local to the device — no accounts, no backend; other people's photos are prototype seed data.
