import type { Metadata } from "next";
import Link from "next/link";
import { StateBadge } from "@/components/accessibility/StateBadge";
import { PlaceMap } from "@/components/map/PlaceMap";
import { FEATURE_KEYS, featureLabel } from "@/lib/access-features";
import { getPlace } from "@/lib/data/places";
import { observationAge } from "@/lib/freshness";
import { formatDate, t, todayIso } from "@/lib/i18n/core";
import { getLang } from "@/lib/i18n/server";
import { sourceLabel } from "@/lib/source-labels";
import type { CurrentFeature, Lang } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const [{ id }, lang] = await Promise.all([params, getLang()]);
  const result = await getPlace(id);
  if (!result.ok || !result.place) return { title: t(lang, "app.name") };

  const name =
    (lang === "bn" ? result.place.listing.name_bn : result.place.listing.name_en) ??
    result.place.listing.name_en ??
    result.place.listing.name_bn ??
    "";

  return {
    title: name,
    alternates: { canonical: `/places/${id}` },
  };
}

function evidenceText(feature: CurrentFeature, lang: Lang): string {
  return `${sourceLabel(feature.source_type, lang)}, ${formatDate(feature.observed_at, lang)}`;
}

export default async function PlacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, lang] = await Promise.all([params, getLang()]);
  const result = await getPlace(id);

  if (!result.ok) {
    return (
      <div className="sheet max-w-2xl py-16">
        <div role="alert" className="card border-no/30 bg-no-soft p-5">
          <h1 className="text-xl text-no">{t(lang, "common.errorTitle")}</h1>
          <p className="mt-1.5 text-sm text-ink-soft">{t(lang, "common.errorBody")}</p>
        </div>
      </div>
    );
  }

  if (!result.place) {
    return (
      <div className="sheet max-w-2xl py-16">
        <div className="card p-6">
          <p className="tag text-ink-faint">404</p>
          <h1 className="mt-1 text-[clamp(1.8rem,4.5vw,2.4rem)]">{t(lang, "place.notFound")}</h1>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-soft">
            {t(lang, "place.notFoundHelp")}
          </p>
          <Link href="/directory" className="btn btn-secondary mt-5">
            {t(lang, "place.backToSearch")}
          </Link>
        </div>
      </div>
    );
  }

  const { listing, features } = result.place;
  const name =
    (lang === "bn" ? listing.name_bn : listing.name_en) ??
    listing.name_en ??
    listing.name_bn ??
    "";
  const summary = lang === "bn" ? listing.summary_bn : listing.summary_en;
  const address = lang === "bn" ? listing.address_bn : listing.address_en;
  const today = todayIso();
  const byFeature = new Map(features.map((feature) => [feature.feature_key, feature]));
  const latest = features.reduce<string | null>(
    (current, feature) =>
      feature.state !== "not_checked" && (!current || feature.observed_at > current)
        ? feature.observed_at
        : current,
    null,
  );

  const meta: { label: string; value: string; href?: string }[] = [];
  if (address) meta.push({ label: t(lang, "place.address"), value: address });
  if (listing.area_name) meta.push({ label: t(lang, "place.area"), value: listing.area_name });
  if (listing.phone_public)
    meta.push({
      label: t(lang, "place.contact"),
      value: listing.phone_public,
      href: `tel:${listing.phone_public}`,
    });
  if (listing.website_url)
    meta.push({
      label: t(lang, "place.website"),
      value: listing.website_url.replace(/^https?:\/\//, ""),
      href: listing.website_url,
    });

  const placeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name,
    ...(summary ? { description: summary } : {}),
    ...(address ? { address } : {}),
    ...(listing.latitude !== null && listing.longitude !== null
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: listing.latitude,
            longitude: listing.longitude,
          },
        }
      : {}),
    accessibilityFeature: features
      .filter((feature) => feature.state !== "not_checked")
      .map((feature) => `${featureLabel(feature.feature_key, lang)}: ${feature.state.replace("_", " ")}`),
    ...(latest ? { dateModified: latest } : {}),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeJsonLd) }}
      />

      <header className="sheet pb-4 pt-2 sm:pt-3">
        <Link
          href="/directory"
          className="inline-flex min-h-9 items-center gap-2 rounded-full border border-line-strong bg-surface px-3.5 text-sm font-bold text-accent-ink shadow-soft transition-[background-color,border-color,transform] duration-200 hover:-translate-y-px hover:border-accent hover:bg-accent-soft"
        >
          <span aria-hidden="true">←</span>
          {t(lang, "place.backToSearch")}
        </Link>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="pill bg-accent-soft text-accent-ink">
            {t(lang, `category.${listing.category}`)}
          </span>
          {result.isDemo ? (
            <span className="pill bg-signal-soft text-signal">{t(lang, "common.demoLabel")}</span>
          ) : null}
          {latest ? (
            <span className="pill pill-plain">
              {t(lang, "place.lastChecked")}
              <span className="tabular">{formatDate(latest, lang)}</span>
            </span>
          ) : null}
        </div>

        <h1 className="mt-2 max-w-[24ch] text-[clamp(1.9rem,4.4vw,2.6rem)]">{name}</h1>

        {summary ? (
          <p className="mt-2 max-w-[58ch] text-[0.9375rem] leading-relaxed text-ink-soft sm:text-base">
            {summary}
          </p>
        ) : null}

        {meta.length > 0 ? (
          <dl className="card mt-4 grid grid-cols-2 gap-x-5 gap-y-4 p-4 sm:grid-cols-4">
            {meta.map((row) => (
              <div key={row.label} className="min-w-0">
                <dt className="tag text-ink-faint">{row.label}</dt>
                <dd className="mt-0.5 break-words text-sm leading-relaxed text-ink">
                  {row.href ? (
                    <a
                      href={row.href}
                      {...(row.href.startsWith("http")
                        ? { target: "_blank", rel: "noreferrer noopener" }
                        : {})}
                      className="text-accent-ink underline decoration-accent/30 underline-offset-4 transition-colors hover:text-ink"
                    >
                      {row.value}
                    </a>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center lg:hidden">
          <Link href={`/report?place=${listing.id}`} className="btn btn-primary flex-1">
            {t(lang, "place.reportUpdate")}
          </Link>
          <p className="text-xs leading-relaxed text-ink-soft">{t(lang, "place.reminder")}</p>
        </div>
      </header>

      <div className="sheet grid gap-6 pb-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <section aria-labelledby="features-heading" className="min-w-0">
          <h2 id="features-heading" className="text-[1.35rem]">
            {t(lang, "place.featuresTitle")}
          </h2>
          <p className="mt-1 max-w-[62ch] text-sm leading-relaxed text-ink-soft">
            {t(lang, "place.featuresIntro")}
          </p>

          <div className="stagger card mt-3 divide-y divide-line">
            {FEATURE_KEYS.map((key) => {
              const feature = byFeature.get(key);
              const hasResult = Boolean(feature && feature.state !== "not_checked");
              const needsRecheck =
                hasResult && feature
                  ? observationAge(feature.observed_at, today) === "needs_recheck"
                  : false;

              return (
                <div
                  key={key}
                  className="flex flex-col gap-2 p-4 transition-colors duration-150 hover:bg-surface-sunk sm:flex-row sm:items-start sm:justify-between sm:gap-5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold leading-snug">{featureLabel(key, lang)}</p>
                    {feature?.notes_public ? (
                      <p className="mt-1 max-w-[48ch] text-sm leading-relaxed text-ink-soft">
                        {feature.notes_public}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:shrink-0 sm:flex-col sm:items-end sm:gap-1 sm:text-right">
                    <StateBadge
                      state={feature?.state ?? "not_checked"}
                      lang={lang}
                      needsRecheck={needsRecheck}
                    />
                    {feature && hasResult ? (
                      <span className="text-xs text-ink-faint">
                        {evidenceText(feature, lang)}
                        {feature.source_url ? (
                          <>
                            {" · "}
                            <a
                              href={feature.source_url}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="underline decoration-line-strong underline-offset-2 hover:text-accent"
                            >
                              {t(lang, "review.source")}
                            </a>
                          </>
                        ) : null}
                      </span>
                    ) : (
                      <span className="text-xs text-ink-faint">
                        {t(lang, "place.noObservation")}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="hidden space-y-3 lg:sticky lg:top-[4.5rem] lg:block">
          <div className="card p-4">
            <p className="text-sm leading-relaxed text-ink-soft">{t(lang, "place.reminder")}</p>
            <Link href={`/report?place=${listing.id}`} className="btn btn-primary mt-3 w-full">
              {t(lang, "place.reportUpdate")}
            </Link>
          </div>

          <p className="px-1 text-xs leading-relaxed text-ink-faint">{t(lang, "place.mapNotice")}</p>
        </aside>
      </div>

      {listing.latitude !== null && listing.longitude !== null ? (
        <section className="sheet pb-10">
          <PlaceMap
            latitude={listing.latitude}
            longitude={listing.longitude}
            label={name}
            lang={lang}
            approximate={listing.location_precision !== "verified"}
          />
        </section>
      ) : null}
    </article>
  );
}
