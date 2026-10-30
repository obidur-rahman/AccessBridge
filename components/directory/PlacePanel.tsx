"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StateBadge } from "@/components/accessibility/StateBadge";
import { FEATURE_KEYS, featureLabel } from "@/lib/access-features";
import { formatDate, t } from "@/lib/i18n/core";
import { sourceLabel } from "@/lib/source-labels";
import type { Lang, PlaceDetail } from "@/lib/types";

type PanelState =
  | { status: "loading" }
  | { status: "ready"; place: PlaceDetail }
  | { status: "error" };

/**
 * Reads one public place for the split view. Only accepted observations are
 * returned by the endpoint, so nothing pending can appear here.
 */
export function PlacePanel({ id, lang }: { id: string; lang: Lang }) {
  const [state, setState] = useState<PanelState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/places/${id}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("failed");
        const data = (await response.json()) as { place: PlaceDetail };
        setState({ status: "ready", place: data.place });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({ status: "error" });
      });

    return () => controller.abort();
  }, [id]);

  if (state.status === "loading") {
    return (
      <div className="card p-5" aria-busy="true">
        <p className="text-sm text-ink-faint">{t(lang, "directory.loading")}</p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div role="alert" className="card border-no/30 bg-no-soft p-5">
        <p className="text-sm font-bold text-no">{t(lang, "common.errorTitle")}</p>
        <p className="mt-1 text-sm text-ink-soft">{t(lang, "common.errorBody")}</p>
      </div>
    );
  }

  const { listing, features } = state.place;
  const name =
    (lang === "bn" ? listing.name_bn : listing.name_en) ??
    listing.name_en ??
    listing.name_bn ??
    "";
  const summary = lang === "bn" ? listing.summary_bn : listing.summary_en;
  const address = lang === "bn" ? listing.address_bn : listing.address_en;
  const byFeature = new Map(features.map((feature) => [feature.feature_key, feature]));
  const latest = features.reduce<string | null>(
    (current, feature) =>
      feature.state !== "not_checked" && (!current || feature.observed_at > current)
        ? feature.observed_at
        : current,
    null,
  );

  return (
    <section
      aria-label={name}
      aria-live="polite"
      className="card soft-in overflow-hidden shadow-lift"
    >
      <div className="border-b border-line p-5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="pill bg-accent-soft text-accent-ink">
            {t(lang, `category.${listing.category}`)}
          </span>
          {listing.area_name ? <span className="pill pill-plain">{listing.area_name}</span> : null}
          {latest ? (
            <span className="pill pill-plain">
              {t(lang, "place.lastChecked")}
              <span className="tabular">{formatDate(latest, lang)}</span>
            </span>
          ) : null}
        </div>

        <h2 className="mt-2 font-display text-[1.55rem] leading-tight">{name}</h2>
        {summary ? (
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{summary}</p>
        ) : null}
        {address ? <p className="mt-2 text-xs text-ink-faint">{address}</p> : null}
      </div>

      <div className="p-5">
        <h3 className="text-[1.1rem]">{t(lang, "place.featuresTitle")}</h3>
        <p className="mt-1 text-xs leading-relaxed text-ink-soft">
          {t(lang, "place.featuresIntro")}
        </p>

        <dl className="mt-3 divide-y divide-line rounded-[0.625rem] border border-line">
          {FEATURE_KEYS.map((key) => {
            const feature = byFeature.get(key);
            const hasResult = Boolean(feature && feature.state !== "not_checked");

            return (
              <div
                key={key}
                className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5"
              >
                <dt className="text-sm font-bold">{featureLabel(key, lang)}</dt>
                <dd className="flex flex-wrap items-center justify-end gap-2">
                  <StateBadge state={feature?.state ?? "not_checked"} lang={lang} />
                  {feature && hasResult ? (
                    <span className="text-[0.7rem] text-ink-faint">
                      {sourceLabel(feature.source_type, lang)},{" "}
                      {formatDate(feature.observed_at, lang)}
                    </span>
                  ) : null}
                </dd>
              </div>
            );
          })}
        </dl>

        <p className="mt-4 rounded-[0.625rem] border border-line bg-surface-sunk px-3 py-2.5 text-xs leading-relaxed text-ink-soft">
          {t(lang, "place.reminder")}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/report?place=${listing.id}`} className="btn btn-primary px-4 text-sm">
            {t(lang, "place.reportUpdate")}
          </Link>
          <Link href={`/places/${listing.id}`} className="btn btn-secondary px-4 text-sm">
            {t(lang, "directory.openFull")}
          </Link>
        </div>
      </div>
    </section>
  );
}
