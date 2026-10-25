import type { Metadata } from "next";
import Link from "next/link";
import { StateBadge } from "@/components/accessibility/StateBadge";
import { PlaceMap } from "@/components/map/PlaceMap";
import { FEATURE_KEYS, featureLabel } from "@/lib/access-features";
import { getPlace } from "@/lib/data/places";
import { FRESHNESS_DAYS, observationAge } from "@/lib/freshness";
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

  return { title: name };
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
      <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6">
        <div role="alert" className="card card-pad border-no/30 bg-no-soft">
          <h1 className="text-2xl text-no">{t(lang, "common.errorTitle")}</h1>
          <p className="mt-2 text-sm text-ink-soft">{t(lang, "common.errorBody")}</p>
        </div>
      </div>
    );
  }

  if (!result.place) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6">
        <p className="tag text-ink-faint">404</p>
        <h1 className="mt-3 text-[clamp(2rem,5vw,3rem)]">{t(lang, "place.notFound")}</h1>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-soft">
          {t(lang, "place.notFoundHelp")}
        </p>
        <Link href="/" className="btn btn-secondary mt-6">
          {t(lang, "place.backToSearch")}
        </Link>
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

  return (
    <article>
      <header className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_90%_-20%,var(--color-accent-soft)_0%,transparent_65%)]"
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-10 pt-7 sm:px-6 sm:pb-14 sm:pt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg py-1 text-sm text-ink-faint transition-colors hover:text-ink"
          >
            <span aria-hidden="true">←</span>
            {t(lang, "place.backToSearch")}
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="pill bg-accent-soft text-accent-ink">
              {t(lang, `category.${listing.category}`)}
            </span>
            {result.isDemo ? (
              <span className="pill bg-signal-soft text-partial">{t(lang, "place.demoRecord")}</span>
            ) : null}
            {latest ? (
              <span className="pill bg-surface text-ink-faint shadow-soft">
                {t(lang, "place.lastChecked")}
                <span className="tabular text-ink-soft">{formatDate(latest, lang)}</span>
              </span>
            ) : null}
          </div>

          <h1 className="mt-5 max-w-[24ch] text-[clamp(2.1rem,5.6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            {name}
          </h1>

          {summary ? (
            <p className="mt-4 max-w-[58ch] text-[1.0625rem] leading-relaxed text-ink-soft">
              {summary}
            </p>
          ) : null}

          {meta.length > 0 ? (
            <dl className="mt-8 grid gap-x-8 gap-y-4 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-4">
              {meta.map((row) => (
                <div key={row.label}>
                  <dt className="tag text-ink-faint">{row.label}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink">
                    {row.href ? (
                      <a
                        href={row.href}
                        {...(row.href.startsWith("http")
                          ? { target: "_blank", rel: "noreferrer noopener" }
                          : {})}
                        className="break-words text-accent underline decoration-accent/25 underline-offset-4 transition-colors hover:text-accent-ink hover:decoration-accent"
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
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_19rem] lg:items-start lg:gap-10">
          <section aria-labelledby="features-heading" className="min-w-0">
            <h2 id="features-heading" className="text-[clamp(1.5rem,3vw,1.9rem)]">
              {t(lang, "place.featuresTitle")}
            </h2>
            <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-ink-soft">
              {t(lang, "place.featuresIntro")}
            </p>

            <div className="card mt-5 overflow-hidden">
              <dl className="divide-y divide-line">
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
                      className="grid gap-x-6 gap-y-2 px-4 py-4 transition-colors hover:bg-surface-muted/60 sm:grid-cols-[1.25fr_9rem_1fr] sm:items-start sm:px-5 sm:py-5"
                    >
                      <dt>
                        <span className="text-[1rem] font-medium leading-snug">
                          {featureLabel(key, lang)}
                        </span>
                        {feature?.notes_public ? (
                          <span className="mt-1 block max-w-[46ch] text-sm leading-relaxed text-ink-soft">
                            {feature.notes_public}
                          </span>
                        ) : null}
                      </dt>
                      <dd>
                        <StateBadge
                          state={feature?.state ?? "not_checked"}
                          lang={lang}
                          needsRecheck={needsRecheck}
                        />
                      </dd>
                      <dd className="text-xs leading-relaxed">
                        {feature && hasResult ? (
                          <>
                            <span className="block text-ink-soft">{evidenceText(feature, lang)}</span>
                            {needsRecheck ? (
                              <span className="mt-2 block max-w-[34ch] rounded-lg bg-signal-soft px-2.5 py-1.5 text-partial">
                                {t(lang, "place.needsRecheck", { days: FRESHNESS_DAYS })}
                              </span>
                            ) : null}
                            {feature.source_url ? (
                              <a
                                href={feature.source_url}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="mt-1 inline-block text-ink-faint underline decoration-line-strong underline-offset-4 hover:text-accent hover:decoration-accent"
                              >
                                {t(lang, "review.source")}
                              </a>
                            ) : null}
                          </>
                        ) : (
                          <span className="text-ink-faint">{t(lang, "place.noObservation")}</span>
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="card card-pad">
              <p className="text-sm leading-relaxed text-ink-soft">{t(lang, "place.reminder")}</p>
              <Link
                href={`/report?place=${listing.id}`}
                className="btn btn-primary mt-4 w-full"
              >
                {t(lang, "place.reportUpdate")}
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            <div className="rounded-card bg-signal-soft px-4 py-3.5 text-xs leading-relaxed text-partial">
              {t(lang, "place.mapNotice")}
            </div>
          </aside>
        </div>

        {listing.latitude !== null && listing.longitude !== null ? (
          <section className="mt-12">
            <PlaceMap
              latitude={listing.latitude}
              longitude={listing.longitude}
              label={name}
              lang={lang}
              approximate={listing.location_precision !== "verified"}
            />
          </section>
        ) : null}
      </div>
    </article>
  );
}
