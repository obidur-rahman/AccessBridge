"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { t } from "@/lib/i18n/core";
import type { Lang } from "@/lib/types";

// The Leaflet bundle is not requested until `showMap` is true, because the
// dynamic component is only mounted after the visitor asks for the map.
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => null,
});

export function PlaceMap({
  latitude,
  longitude,
  label,
  lang,
  approximate,
}: {
  latitude: number;
  longitude: number;
  label: string;
  lang: Lang;
  approximate: boolean;
}) {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="card card-pad">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[1.25rem]">{t(lang, "place.mapTitle")}</h2>
        <button
          type="button"
          aria-expanded={showMap}
          aria-controls="place-map"
          onClick={() => setShowMap((shown) => !shown)}
          className="btn btn-secondary min-h-10 px-3.5 text-sm"
        >
          {showMap ? t(lang, "place.hideMap") : t(lang, "place.showMap")}
          <span aria-hidden="true" className="text-ink-faint">
            {showMap ? "−" : "+"}
          </span>
        </button>
      </div>

      <p className="mt-2 max-w-prose text-xs leading-relaxed text-ink-faint">
        {t(lang, "place.mapNotice")}
      </p>

      <div id="place-map" className="mt-4" hidden={!showMap}>
        {showMap ? (
          <MapView
            latitude={latitude}
            longitude={longitude}
            label={label}
            approximate={approximate}
            lang={lang}
          />
        ) : null}
      </div>
    </div>
  );
}
