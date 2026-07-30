import { POIS, type POI } from "@/data/festival";
import parade from "@/assets/snap-parade.jpg";
import food from "@/assets/snap-food.jpg";
import stage from "@/assets/snap-stage.jpg";
import square from "@/assets/snap-square.jpg";
import samba from "@/assets/snap-samba.jpg";
import craft from "@/assets/snap-craft.jpg";

export const PHOTO_IMAGES = [
  { key: "parade", src: parade },
  { key: "samba", src: samba },
  { key: "stage", src: stage },
  { key: "food", src: food },
  { key: "craft", src: craft },
  { key: "square", src: square },
] as const;

export type PhotoImageKey = (typeof PHOTO_IMAGES)[number]["key"];

export function imageSrc(key: string): string {
  return (PHOTO_IMAGES.find((i) => i.key === key) ?? PHOTO_IMAGES[0]).src;
}

/** Deterministic little hash so the seeded feed is stable between renders. */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const AUTHORS = [
  "Nadia K.",
  "Tom R.",
  "Priya S.",
  "Big Col",
  "Ellie M.",
  "Yusuf A.",
  "Grace O.",
  "Danny P.",
] as const;

const CAPTIONS = [
  "Absolutely buzzing down here 🎉",
  "Best bit of the day so far.",
  "Got here early, worth it.",
  "Sun's out, flags are out.",
  "Kids wouldn't leave this one.",
  "Sound was mint.",
  "Queue moved fast, promise.",
  "Manchester doing what it does.",
] as const;

export interface SeedPhoto {
  id: string;
  poiId: string;
  author: string;
  caption: string;
  imageKey: PhotoImageKey;
  /** Minutes since midnight. */
  takenAt: number;
  likes: number;
}

function imageKeyFor(p: POI, salt: number): PhotoImageKey {
  if (p.kind === "food") return "food";
  if (p.kind === "parade_stop") return salt % 2 === 0 ? "parade" : "samba";
  const pool: PhotoImageKey[] = ["stage", "craft", "square", "samba"];
  return pool[salt % pool.length];
}

/** Spots people can snap: events, parade stops and food stalls. */
export const SNAPPABLE_KINDS = ["event", "parade_stop", "food"] as const;

/**
 * Prototype seed data: one photo per person per spot, a couple of people
 * per spot. No backend — this is what "everyone else" posted.
 */
export const SEED_PHOTOS: SeedPhoto[] = POIS.filter((p) =>
  (SNAPPABLE_KINDS as readonly string[]).includes(p.kind),
).flatMap((p) => {
  const h = hash(p.id);
  const count = 2 + (h % 2); // 2 or 3 people per spot
  return Array.from({ length: count }, (_, i) => {
    const salt = h + i * 7;
    return {
      id: `${p.id}-seed-${i}`,
      poiId: p.id,
      author: AUTHORS[salt % AUTHORS.length],
      caption: CAPTIONS[(salt >> 2) % CAPTIONS.length],
      imageKey: imageKeyFor(p, salt + i),
      takenAt: (p.startsAt ?? 13 * 60) + 5 + ((salt % 5) * 4),
      likes: 6 + (salt % 140),
    } satisfies SeedPhoto;
  });
});

export function seedPhotosForPoi(poiId: string): SeedPhoto[] {
  return SEED_PHOTOS.filter((s) => s.poiId === poiId);
}

/** The stock shot used when the user "takes" a picture at a spot. */
export function ownImageKeyFor(poiId: string): PhotoImageKey {
  const p = POIS.find((x) => x.id === poiId);
  return p ? imageKeyFor(p, hash(poiId)) : "square";
}
