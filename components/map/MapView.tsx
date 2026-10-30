"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { t } from "@/lib/i18n/core";
import type { Lang } from "@/lib/types";

/**
 * Leaflet map. Loaded only after the visitor activates "Show map".
 *
 * TO VERIFY before release: the OpenStreetMap tile usage policy and attribution.
 * The pilot must confirm the tile service terms and keep the provider notice
 * visible next to this control.
 */
export default function MapView({
  latitude,
  longitude,
  label,
  approximate,
  lang,
}: {
  latitude: number;
  longitude: number;
  label: string;
  approximate: boolean;
  lang: Lang;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let map: import("leaflet").Map | null = null;
    let cancelled = false;

    async function mount() {
      const leaflet = await import("leaflet");
      if (cancelled || !containerRef.current) return;

      map = leaflet.map(containerRef.current, {
        scrollWheelZoom: false,
        // A keyboard user can pan with the arrow keys without trapping focus.
        keyboard: true,
      }).setView([latitude, longitude], approximate ? 14 : 16);

      const tiles = leaflet.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          attribution: "© OpenStreetMap contributors",
        },
      );

      tiles.on("tileerror", () => setFailed(true));
      tiles.addTo(map);

      leaflet.circleMarker([latitude, longitude], {
        radius: 9,
        color: "#17405f",
        fillColor: "#17405f",
        fillOpacity: 0.85,
        weight: 2,
      })
        .addTo(map)
        .bindPopup(label);
    }

    void mount();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [latitude, longitude, label, approximate]);

  return (
    <div>
      <div
        ref={containerRef}
        className="leaflet-container"
        role="region"
        aria-label={label}
        tabIndex={0}
      />
      {failed ? (
        <p role="alert" className="mt-1 text-xs text-no">
          {t(lang, "place.mapUnavailable")}
        </p>
      ) : null}
    </div>
  );
}
