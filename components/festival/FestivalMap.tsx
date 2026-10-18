"use client";

import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip } from "react-leaflet";
import type { Festival } from "@/lib/festivals";
import { formatRange } from "@/lib/format";
import { useLang } from "@/lib/i18n";
import { usePassport } from "@/lib/store";
import { origins } from "@/lib/geo";

/** Mapa de festivales. Se carga solo en el cliente (ver MapView) porque Leaflet necesita window. */
export default function FestivalMap({ festivals, height = 520 }: { festivals: Festival[]; height?: number }) {
  const { lang, L } = useLang();
  const origin = usePassport((s) => s.origin);
  const favorites = usePassport((s) => s.favorites);

  return (
    <div className="wcs-map relative isolate z-0 overflow-hidden rounded-3xl border border-white/10" style={{ height }}>
      <MapContainer center={[48.5, 8]} zoom={4} minZoom={3} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CircleMarker
          center={origins[origin].coords as [number, number]}
          radius={7}
          pathOptions={{ color: "#fff", weight: 2, fillColor: "#22c55e", fillOpacity: 1 }}
        >
          <Tooltip direction="top">{L("Tu punto de salida", "Your starting point")}: {origins[origin].name}</Tooltip>
        </CircleMarker>
        {festivals.map((f) => {
          const fav = favorites.includes(f.slug);
          return (
            <CircleMarker
              key={f.slug}
              center={f.coords}
              radius={fav ? 11 : 8}
              pathOptions={{
                color: "#ffffff",
                weight: 1.5,
                fillColor: fav ? "#D946EF" : f.region === "espana" ? "#f59e0b" : "#06B6D4",
                fillOpacity: 0.9,
              }}
            >
              <Popup>
                <div className="space-y-1">
                  <strong className="block text-sm">{f.name}</strong>
                  <span className="block text-xs">{formatRange(f, lang)}</span>
                  <Link href={`/festival/${f.slug}/`} className="block text-xs font-semibold underline">
                    {L("Ver ficha", "View details")} →
                  </Link>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
