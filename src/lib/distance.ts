// Haversine distance in kilometres.
export function distanceKm(
  a: [number, number],
  b: [number, number],
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function walkMinutes(km: number, kmh: number): number {
  if (kmh <= 0) return Infinity;
  return (km / kmh) * 60;
}

export function formatMinutes(mins: number): string {
  const m = Math.max(0, Math.round(mins));
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return `${h}h ${r}m`;
}

export function formatClock(minutesSinceMidnight: number): string {
  const m = Math.round(minutesSinceMidnight);
  const hh = Math.floor(m / 60) % 24;
  const mm = m % 60;
  return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
}
