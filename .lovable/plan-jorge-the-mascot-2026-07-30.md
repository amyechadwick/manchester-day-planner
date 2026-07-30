# Jorge the Mascot

Add a llama mascot named Jorge across the app, in the style of the uploaded reference (cartoon llama in a black sombrero, warm orange, playful hand-drawn lines).

## Note on the reference image
The uploaded file is a watermarked stock image, so it can't ship in the app. Instead I'll generate an original Jorge illustration inspired by it, tuned to the festival palette (pillar-box red, sunshine yellow, Catalan blue, cream, ink) — same friendly llama-in-a-hat energy, our colours.

## Where Jorge appears
- **Home** — Jorge as a hero character next to the Now & Next block, with a speech bubble greeting ("Hola! I'm Jorge, your Manchester Day guide").
- **Top bar** — small Jorge head icon beside the clock/points badge, on every page.
- **Track picker** — Jorge nudges the "Pick your track" section with a short line of encouragement.
- **Parade** — Jorge peeking beside the parade tracker header.
- **Map** — Jorge marks the simulated "I am here" pin.
- **My Day / Your Track** — Jorge appears in the empty state ("No stops yet — Jorge is waiting").
- **Day Share** — Jorge in the feed empty state and as the avatar on your own snaps.
- **Favicon / social preview** — Jorge head as the app icon.

## Technical notes
- Generate two assets: a full-body Jorge (transparent PNG) and a cropped head/badge version; upload both as CDN assets and import the pointers.
- New `src/components/festival/Jorge.tsx` with size variants (`badge`, `inline`, `hero`) plus an optional speech-bubble wrapper, so every placement uses one component.
- Placements are presentation-only additions to existing routes/components — no changes to agenda, track, points, or map logic.
- Alt text on every instance ("Jorge, the Manchester Day mascot"); decorative-only instances get empty alt.
