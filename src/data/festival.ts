// Manchester Day 2026 — hand-authored fixture dataset.
// Single source of truth: events, food, first aid, wheelchair sub-types,
// transport, and parade stops all live in this one array.

export type Persona =
  | "families"
  | "elderly"
  | "young"
  | "wheelchair"
  | "music"
  | "foodie"
  | "culture";

export type POIKind =
  | "event"
  | "food"
  | "first_aid"
  | "toilet_accessible"
  | "step_free"
  | "accessible_viewing"
  | "transport"
  | "parade_stop";

export interface POI {
  id: string;
  name: string;
  kind: POIKind;
  lat: number;
  lng: number;
  /** Minutes since midnight on event day. */
  startsAt?: number;
  /** Minutes since midnight on event day. */
  endsAt?: number;
  /** 1..7 along the parade route. */
  paradeStopOrder?: number;
  personaBoost?: Persona[];
  area?: string;
  description?: string;
}

export interface PersonaConfig {
  id: Persona;
  label: string;
  /** Walking speed in km/h. */
  walkKmh: number;
  /** Copy used in the clash sticker. */
  clashPhrase: string;
  blurb: string;
}

export const PERSONAS: Record<Persona, PersonaConfig> = {
  families: {
    id: "families",
    label: "Families",
    walkKmh: 4.0,
    clashPhrase: "Won't make it at family pace",
    blurb: "Kid-friendly picks, shorter walks, baby-change nearby.",
  },
  elderly: {
    id: "elderly",
    label: "Elderly",
    walkKmh: 3.0,
    clashPhrase: "Too far to walk in time",
    blurb: "Slower pace, seated events surfaced, shorter routes.",
  },
  young: {
    id: "young",
    label: "Young",
    walkKmh: 5.0,
    clashPhrase: "Cutting it fine on foot",
    blurb: "Music and higher-energy acts boosted.",
  },
  wheelchair: {
    id: "wheelchair",
    label: "Wheelchair",
    walkKmh: 3.5,
    clashPhrase: "Step-free route too long in time",
    blurb: "Step-free routes, accessible toilets & viewing surfaced.",
  },
  music: {
    id: "music",
    label: "Music",
    walkKmh: 4.5,
    clashPhrase: "Won't make it before the set",
    blurb: "Brass, DJ sets, flamenco and choir surfaced first.",
  },
  foodie: {
    id: "foodie",
    label: "Foodie",
    walkKmh: 4.0,
    clashPhrase: "Won't make it before the tasting",
    blurb: "Tapas, paella, churros and picnic stops surfaced first.",
  },
  culture: {
    id: "culture",
    label: "Culture",
    walkKmh: 4.0,
    clashPhrase: "Won't make it before the act",
    blurb: "Castellers, cinema, puppetry, poetry and artisan stalls.",
  },
};

/** Helper: convert "HH:MM" to minutes since midnight. */
const t = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const EVENT_DAY = "Sunday 26 July 2026";
export const EVENT_START = t("12:00");
export const EVENT_END = t("17:00");

// Manchester city centre anchor
export const MCR_CENTER: [number, number] = [53.4794, -2.2445];

// Parade route: St Peter's Sq → Peter St → Deansgate → St Mary's Gate →
// Cross St → Princess St → Albert Sq. Times per PRD (1pm start at St Peter's Sq).
const PARADE_STOPS: POI[] = [
  {
    id: "parade-1",
    name: "St Peter's Square",
    kind: "parade_stop",
    lat: 53.4778,
    lng: -2.2436,
    startsAt: t("13:00"),
    paradeStopOrder: 1,
    area: "St Peter's Sq",
    description: "Parade start. Opening flourish with the Castellers.",
  },
  {
    id: "parade-2",
    name: "Peter Street",
    kind: "parade_stop",
    lat: 53.4785,
    lng: -2.2470,
    startsAt: t("13:15"),
    paradeStopOrder: 2,
    area: "Peter St",
  },
  {
    id: "parade-3",
    name: "Deansgate",
    kind: "parade_stop",
    lat: 53.4802,
    lng: -2.2487,
    startsAt: t("13:35"),
    paradeStopOrder: 3,
    area: "Deansgate",
    description: "Widest viewing. Great for pushchairs and wheelchairs.",
  },
  {
    id: "parade-4",
    name: "St Mary's Gate",
    kind: "parade_stop",
    lat: 53.4838,
    lng: -2.2451,
    startsAt: t("13:55"),
    paradeStopOrder: 4,
    area: "St Mary's Gate",
  },
  {
    id: "parade-5",
    name: "Cross Street",
    kind: "parade_stop",
    lat: 53.4824,
    lng: -2.2432,
    startsAt: t("14:15"),
    paradeStopOrder: 5,
    area: "Cross St",
  },
  {
    id: "parade-6",
    name: "Princess Street",
    kind: "parade_stop",
    lat: 53.4802,
    lng: -2.2410,
    startsAt: t("14:35"),
    paradeStopOrder: 6,
    area: "Princess St",
  },
  {
    id: "parade-7",
    name: "Albert Square (Finale)",
    kind: "parade_stop",
    lat: 53.4794,
    lng: -2.2452,
    startsAt: t("14:55"),
    paradeStopOrder: 7,
    area: "Albert Sq",
    description: "Big finale. Expect it to be packed — plan around it.",
  },
];

const EVENTS: POI[] = [
  {
    id: "ev-castellers",
    name: "Castellers Human Towers",
    kind: "event",
    lat: 53.4794,
    lng: -2.2452,
    startsAt: t("12:15"),
    endsAt: t("13:00"),
    area: "Albert Sq",
    personaBoost: ["families", "young", "wheelchair", "culture"],
    description: "Signature Catalan acrobatic act. Big crowd pull.",
  },
  {
    id: "ev-sardana",
    name: "Sardana Circle Dance",
    kind: "event",
    lat: 53.4778,
    lng: -2.2436,
    startsAt: t("12:30"),
    endsAt: t("13:00"),
    area: "St Peter's Sq",
    personaBoost: ["families", "elderly", "music", "culture"],
    description: "Learn the traditional Catalan circle dance. All ages.",
  },
  {
    id: "ev-parade",
    name: "Book-themed Parade",
    kind: "event",
    lat: 53.4778,
    lng: -2.2436,
    startsAt: t("13:00"),
    endsAt: t("15:15"),
    area: "Full route",
    personaBoost: ["families", "young", "wheelchair", "elderly", "culture"],
    description: "Walk the Plank's book-themed procession. New route.",
  },
  {
    id: "ev-puppets",
    name: "Giant Sardine Puppets",
    kind: "event",
    lat: 53.4802,
    lng: -2.2487,
    startsAt: t("13:35"),
    endsAt: t("14:00"),
    area: "Deansgate",
    personaBoost: ["families", "culture"],
    description: "Huge illustrated sardines. Photo goldmine.",
  },
  {
    id: "ev-brass",
    name: "Manchester Brass Band",
    kind: "event",
    lat: 53.4824,
    lng: -2.2432,
    startsAt: t("12:00"),
    endsAt: t("12:45"),
    area: "Cross St",
    personaBoost: ["elderly", "music", "culture"],
    description: "Local brass, seated area available.",
  },
  {
    id: "ev-storytime",
    name: "Storytime Tent (National Year of Reading)",
    kind: "event",
    lat: 53.4790,
    lng: -2.2415,
    startsAt: t("12:30"),
    endsAt: t("16:30"),
    area: "Princess St",
    personaBoost: ["families", "culture"],
    description: "Drop-in readings for kids all afternoon.",
  },
  {
    id: "ev-flamenco",
    name: "Flamenco Fusion Set",
    kind: "event",
    lat: 53.4805,
    lng: -2.2432,
    startsAt: t("15:30"),
    endsAt: t("16:15"),
    area: "Cross St stage",
    personaBoost: ["young", "music", "culture"],
  },
  {
    id: "ev-dj",
    name: "Hola R'Kid DJ Set",
    kind: "event",
    lat: 53.4794,
    lng: -2.2452,
    startsAt: t("15:30"),
    endsAt: t("17:00"),
    area: "Albert Sq",
    personaBoost: ["young", "music"],
    description: "Barcelona meets Manchester on the decks.",
  },
  {
    id: "ev-workshop",
    name: "Kids' Puppet Workshop",
    kind: "event",
    lat: 53.4770,
    lng: -2.2450,
    startsAt: t("12:00"),
    endsAt: t("14:00"),
    area: "St Peter's Sq",
    personaBoost: ["families", "culture"],
  },
  {
    id: "ev-choir",
    name: "Manchester Community Choir",
    kind: "event",
    lat: 53.4794,
    lng: -2.2452,
    startsAt: t("15:00"),
    endsAt: t("15:30"),
    area: "Albert Sq",
    personaBoost: ["elderly", "families", "music", "culture"],
  },
  {
    id: "ev-poetry",
    name: "Poetry on the Steps",
    kind: "event",
    lat: 53.4790,
    lng: -2.2415,
    startsAt: t("14:00"),
    endsAt: t("14:45"),
    area: "Princess St",
    personaBoost: ["young", "elderly", "culture"],
  },
  {
    id: "ev-catalan-cinema",
    name: "Catalan Short Films (seated)",
    kind: "event",
    lat: 53.4785,
    lng: -2.2470,
    startsAt: t("15:00"),
    endsAt: t("16:30"),
    area: "Peter St",
    personaBoost: ["elderly", "young", "culture"],
  },
  {
    id: "ev-face-paint",
    name: "Face Painting Corner",
    kind: "event",
    lat: 53.4770,
    lng: -2.2440,
    startsAt: t("12:00"),
    endsAt: t("17:00"),
    area: "St Peter's Sq",
    personaBoost: ["families"],
  },
  {
    id: "ev-catalan-market",
    name: "Catalan Artisan Market",
    kind: "event",
    lat: 53.4810,
    lng: -2.2470,
    startsAt: t("12:00"),
    endsAt: t("17:00"),
    area: "Deansgate",
    personaBoost: ["elderly", "young", "wheelchair", "culture", "foodie"],
  },
];

const FOOD: POI[] = [
  { id: "food-1", name: "Tapas Cart", kind: "food", lat: 53.4788, lng: -2.2455, area: "Albert Sq" },
  { id: "food-2", name: "Paella Pan", kind: "food", lat: 53.4808, lng: -2.2478, area: "Deansgate" },
  { id: "food-3", name: "Manc Bakery Stall", kind: "food", lat: 53.4795, lng: -2.2420, area: "Cross St" },
  { id: "food-4", name: "Churros & Chocolate", kind: "food", lat: 53.4775, lng: -2.2432, area: "St Peter's Sq" },
  { id: "food-5", name: "Veggie Bocadillos", kind: "food", lat: 53.4818, lng: -2.2445, area: "St Mary's Gate" },
  { id: "food-6", name: "Family Picnic Zone", kind: "food", lat: 53.4772, lng: -2.2415, area: "Princess St" },
  { id: "food-7", name: "Cava Bar (18+)", kind: "food", lat: 53.4790, lng: -2.2405, area: "Princess St" },
  { id: "food-8", name: "Halal Grill", kind: "food", lat: 53.4820, lng: -2.2455, area: "St Mary's Gate" },
  { id: "food-9", name: "Ice Cream Cart", kind: "food", lat: 53.4794, lng: -2.2440, area: "Albert Sq" },
];

const FIRST_AID: POI[] = [
  { id: "fa-1", name: "First Aid — Albert Sq", kind: "first_aid", lat: 53.4796, lng: -2.2458, area: "Albert Sq" },
  { id: "fa-2", name: "First Aid — Deansgate", kind: "first_aid", lat: 53.4812, lng: -2.2483, area: "Deansgate" },
  { id: "fa-3", name: "First Aid — St Peter's", kind: "first_aid", lat: 53.4775, lng: -2.2440, area: "St Peter's Sq" },
  { id: "fa-4", name: "First Aid — Princess St", kind: "first_aid", lat: 53.4795, lng: -2.2412, area: "Princess St" },
];

const ACCESSIBLE: POI[] = [
  // Accessible toilets
  { id: "wc-1", name: "Accessible Toilet — Albert Sq", kind: "toilet_accessible", lat: 53.4798, lng: -2.2450, area: "Albert Sq", description: "Radar key required." },
  { id: "wc-2", name: "Accessible Toilet — Deansgate", kind: "toilet_accessible", lat: 53.4810, lng: -2.2485, area: "Deansgate" },
  { id: "wc-3", name: "Accessible Toilet — Princess St", kind: "toilet_accessible", lat: 53.4788, lng: -2.2412, area: "Princess St" },
  // Step-free routes (approx midpoints)
  { id: "sf-1", name: "Step-free route: Deansgate ↔ Albert Sq", kind: "step_free", lat: 53.4807, lng: -2.2470, area: "Deansgate", description: "Dropped kerbs the whole way." },
  { id: "sf-2", name: "Step-free route: Piccadilly → Cross St", kind: "step_free", lat: 53.4795, lng: -2.2400, area: "Cross St" },
  { id: "sf-3", name: "Step-free route: St Peter's Sq tram", kind: "step_free", lat: 53.4780, lng: -2.2436, area: "St Peter's Sq" },
  // Accessible parade viewing
  { id: "av-1", name: "Accessible viewing — Deansgate", kind: "accessible_viewing", lat: 53.4802, lng: -2.2489, area: "Deansgate", description: "Reserved wheelchair viewing pen." },
  { id: "av-2", name: "Accessible viewing — Albert Sq", kind: "accessible_viewing", lat: 53.4790, lng: -2.2452, area: "Albert Sq" },
  { id: "av-3", name: "Accessible viewing — Cross St", kind: "accessible_viewing", lat: 53.4826, lng: -2.2432, area: "Cross St" },
];

const TRANSPORT: POI[] = [
  { id: "tr-1", name: "Piccadilly Station", kind: "transport", lat: 53.4775, lng: -2.2311, area: "Piccadilly", description: "National rail." },
  { id: "tr-2", name: "Victoria Station", kind: "transport", lat: 53.4874, lng: -2.2426, area: "Victoria", description: "National rail + Metrolink." },
  { id: "tr-3", name: "St Peter's Sq Tram", kind: "transport", lat: 53.4780, lng: -2.2437, area: "St Peter's Sq", description: "All Metrolink lines." },
  { id: "tr-4", name: "Deansgate-Castlefield Tram", kind: "transport", lat: 53.4747, lng: -2.2510, area: "Deansgate" },
  { id: "tr-5", name: "Shudehill Interchange (Bus)", kind: "transport", lat: 53.4852, lng: -2.2400, area: "Shudehill" },
  { id: "tr-6", name: "Piccadilly Gardens (Bus)", kind: "transport", lat: 53.4808, lng: -2.2378, area: "Piccadilly Gdns" },
];

export const POIS: POI[] = [
  ...EVENTS,
  ...PARADE_STOPS,
  ...FOOD,
  ...FIRST_AID,
  ...ACCESSIBLE,
  ...TRANSPORT,
];

export const PARADE_ROUTE = PARADE_STOPS;

export const KIND_META: Record<
  POIKind,
  { label: string; color: string; short: string }
> = {
  event: { label: "Events", color: "#1E4FB8", short: "EV" },
  food: { label: "Food", color: "#E63329", short: "FD" },
  first_aid: { label: "First aid", color: "#1A1A1A", short: "＋" },
  toilet_accessible: { label: "Accessible toilets", color: "#1E4FB8", short: "WC" },
  step_free: { label: "Step-free routes", color: "#1E4FB8", short: "SF" },
  accessible_viewing: { label: "Accessible viewing", color: "#1E4FB8", short: "AV" },
  transport: { label: "Transport", color: "#1A1A1A", short: "TR" },
  parade_stop: { label: "Parade stop", color: "#E63329", short: "P" },
};
