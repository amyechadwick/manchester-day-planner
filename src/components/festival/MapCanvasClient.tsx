import { useEffect, useMemo } from "react";
import L from "leaflet";
import "leaflet.heat";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { KIND_META, MCR_CENTER, PARADE_ROUTE, POIS, type POI } from "@/data/festival";
import { useSession } from "@/state/session";
import { distanceKm, walkMinutes, formatMinutes } from "@/lib/distance";
import { JORGE_HEAD_URL } from "./Jorge";

function pinIcon(color: string, label: string, big = false) {
  const size = big ? 34 : 26;
  const html = `
    <div style="
      width:${size}px;height:${size}px;border-radius:9999px;
      background:${color};border:3px solid #1A1A1A;color:#FBF3E2;
      display:flex;align-items:center;justify-content:center;
      font-family:'Bebas Neue',sans-serif;font-size:${big ? 14 : 11}px;
      box-shadow:2px 2px 0 #1A1A1A;line-height:1;">${label}</div>`;
  return L.divIcon({
    className: "md-pin",
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function meIcon() {
  const html = `
    <div style="position:relative;">
      <img src="${JORGE_HEAD_URL}" alt="" style="width:42px;height:42px;object-fit:contain;
        border-radius:9999px;background:#FFD21F;border:3px solid #1A1A1A;
        box-shadow:0 0 0 6px rgba(255,210,31,0.35);" />
      <div style="position:absolute;top:46px;left:50%;transform:translateX(-50%);
        background:#1A1A1A;color:#FBF3E2;padding:2px 6px;font-family:'Bebas Neue',sans-serif;
        font-size:11px;white-space:nowrap;">YOU &amp; JORGE</div>
    </div>`;
  return L.divIcon({
    className: "md-me",
    html,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  });
}

function numberIcon(n: number, color: string) {
  const html = `
    <div style="
      width:30px;height:30px;border-radius:9999px;
      background:${color};border:3px solid #1A1A1A;color:#FBF3E2;
      display:flex;align-items:center;justify-content:center;
      font-family:'Bebas Neue',sans-serif;font-size:14px;
      box-shadow:2px 2px 0 #FFD21F;line-height:1;">${n}</div>`;
  return L.divIcon({
    className: "md-num",
    html,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function ClickToMoveMe() {
  const { setUserLocation } = useSession();
  useMapEvents({
    click(e) {
      setUserLocation([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function HeatLayer({ active }: { active: boolean }) {
  const map = useMap();
  const { simNow } = useSession();

  useEffect(() => {
    if (!active) return;
    // Predict crowd intensity per zone from concurrent events at simNow.
    const zones: Record<string, { lat: number; lng: number; w: number }> = {
      albert: { lat: 53.4794, lng: -2.2452, w: 0 },
      stpeters: { lat: 53.4778, lng: -2.2436, w: 0 },
      deansgate: { lat: 53.4802, lng: -2.2487, w: 0 },
      cross: { lat: 53.4824, lng: -2.2432, w: 0 },
      princess: { lat: 53.4790, lng: -2.2415, w: 0 },
      stmary: { lat: 53.4838, lng: -2.2451, w: 0 },
      peter: { lat: 53.4785, lng: -2.2470, w: 0 },
    };
    const areaKey = (a?: string) => {
      if (!a) return null;
      const s = a.toLowerCase();
      if (s.includes("albert")) return "albert";
      if (s.includes("st peter")) return "stpeters";
      if (s.includes("deansgate")) return "deansgate";
      if (s.includes("cross")) return "cross";
      if (s.includes("princess")) return "princess";
      if (s.includes("mary")) return "stmary";
      if (s.includes("peter")) return "peter";
      return null;
    };
    for (const p of POIS) {
      if (p.kind !== "event" && p.kind !== "parade_stop") continue;
      const s = p.startsAt ?? 0;
      const e = p.endsAt ?? s + 20;
      if (simNow < s - 10 || simNow > e + 5) continue;
      const k = areaKey(p.area);
      if (k && zones[k]) zones[k].w += p.kind === "parade_stop" ? 1.8 : 1;
    }
    const points: [number, number, number][] = Object.values(zones)
      .filter((z) => z.w > 0)
      .map((z) => [z.lat, z.lng, Math.min(1, 0.3 + z.w * 0.35)]);

    // @ts-expect-error leaflet.heat augments L at runtime
    const layer = L.heatLayer(points, {
      radius: 55,
      blur: 45,
      maxZoom: 17,
      gradient: { 0.2: "#1E4FB8", 0.5: "#FFD21F", 0.9: "#E63329" },
    }).addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [active, map, simNow]);

  return null;
}

export function MapCanvasClient({
  pois,
  heatmap,
  activeFilter,
}: {
  pois: POI[];
  heatmap: boolean;
  activeFilter: string;
}) {
  const { userLocation, walkKmh } = useSession();
  const isMyDay = activeFilter === "my_day";
  const isTrack = activeFilter === "track";
  const numbered = isMyDay || isTrack;

  const paradeLine = useMemo<[number, number][]>(
    () => PARADE_ROUTE.map((p) => [p.lat, p.lng]),
    [],
  );

  const myDayLine = useMemo<[number, number][]>(
    () =>
      isMyDay && pois.length > 0
        ? [userLocation, ...pois.map((p) => [p.lat, p.lng] as [number, number])]
        : [],
    [isMyDay, pois, userLocation],
  );

  const trackLine = useMemo<[number, number][]>(
    () =>
      isTrack && pois.length > 0
        ? [userLocation, ...pois.map((p) => [p.lat, p.lng] as [number, number])]
        : [],
    [isTrack, pois, userLocation],
  );

  const showParadeLine =
    !isTrack && pois.some((p) => p.kind === "parade_stop");

  return (
    <MapContainer
      center={MCR_CENTER}
      zoom={15}
      scrollWheelZoom={false}
      style={{ width: "100%", height: "100%", background: "#FBF3E2" }}
      attributionControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {showParadeLine && !isMyDay && (
        <Polyline
          positions={paradeLine}
          pathOptions={{ color: "#E63329", weight: 5, opacity: 0.85 }}
        />
      )}

      {trackLine.length > 1 && (
        <Polyline
          positions={trackLine}
          pathOptions={{ color: "#1E4FB8", weight: 5, opacity: 0.9 }}
        />
      )}

      {myDayLine.length > 1 && (
        <Polyline
          positions={myDayLine}
          pathOptions={{
            color: "#1E4FB8",
            weight: 5,
            opacity: 0.9,
            dashArray: "10 8",
          }}
        />
      )}

      {pois.map((p, i) => {
        const meta = KIND_META[p.kind];
        return (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={
              numbered
                ? numberIcon(i + 1, meta.color)
                : pinIcon(meta.color, meta.short, p.kind === "parade_stop")
            }
          >
            <Popup>
              <div style={{ fontFamily: "Barlow, sans-serif" }}>
                {numbered && <span style={{ opacity: 0.7 }}>Stop {i + 1} · </span>}
                <strong>{p.name}</strong>
                <br />
                <span style={{ opacity: 0.7 }}>{meta.label}</span>
                {p.description && (
                  <>
                    <br />
                    {p.description}
                  </>
                )}
                <br />
                <em style={{ fontSize: 11 }}>
                  {formatMinutes(
                    walkMinutes(distanceKm(userLocation, [p.lat, p.lng]), walkKmh),
                  )}{" "}
                  walk
                </em>
              </div>
            </Popup>
          </Marker>
        );
      })}

      <Marker position={userLocation} icon={meIcon()} />
      <ClickToMoveMe />
      <HeatLayer active={heatmap} />
    </MapContainer>
  );
}
