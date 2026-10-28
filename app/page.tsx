import Link from "next/link";
import { Gauge } from "@/components/accessibility/Gauge";
import { CoverageBoard } from "@/components/listing/CoverageBoard";
import { SearchDirectory } from "@/components/search/SearchDirectory";
import { getDirectory } from "@/lib/data/places";
import { t, toBengaliDigits } from "@/lib/i18n/core";
import { getLang } from "@/lib/i18n/server";

function figure(value: number, lang: "en" | "bn") {
  return lang === "bn" ? toBengaliDigits(value) : String(value);
}

const STEP_TITLES = ["report.step1Title", "report.step2Title", "report.step3Title"] as const;
const STEP_BODIES = ["report.step1Body", "report.step2Body", "report.step3Body"] as const;

export default async function HomePage() {
  const [lang, directory] = await Promise.all([getLang(), getDirectory()]);
  const listings = directory.ok ? directory.listings : [];
  const reviewed = listings.filter((listing) => listing.checked_features.length > 0).length;
  const areas = new Set(listings.map((listing) => listing.area_name).filter(Boolean)).size;
  const categories = new Set(listings.map((listing) => listing.category)).size;
  const coverage = listings.length > 0 ? reviewed / listings.length : 0;

  const stats: { label: string; value: number; gauge?: boolean }[] = [
    { label: t(lang, "home.statPlaces"), value: listings.length },
    { label: t(lang, "home.statChecked"), value: reviewed, gauge: true },
    { label: t(lang, "home.statAreas"), value: areas },
    { label: t(lang, "home.statCategories"), value: categories },
  ];

  return (
    <div>
      <section className="relative border-b border-line">
        <div
          aria-hidden="true"
          className="tick-rail pointer-events-none absolute inset-x-0 bottom-0 h-2.5 opacity-80"
        />

        <div className="relative w-full px-4 pb-14 pt-12 sm:px-6 sm:pt-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
            <div className="soft-in min-w-0">
              <p className="pill pill-plain">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
                {t(lang, "app.pilot")}
              </p>

              <h1 className="mt-7 max-w-[13ch] text-[clamp(2.7rem,7vw,5.25rem)] font-semibold leading-[1.0] tracking-[-0.04em]">
                {t(lang, "home.title")}
              </h1>

              <p className="mt-7 max-w-[54ch] text-[1.0625rem] leading-relaxed text-ink-soft sm:text-xl">
                {t(lang, "home.intro")}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link href="/directory" className="btn btn-primary px-5">
                  {t(lang, "home.searchLabel")}
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                    <path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link href="/report" className="btn btn-secondary px-5">
                  {t(lang, "nav.report")}
                </Link>
              </div>
            </div>

            {directory.ok ? (
              <div className="soft-in min-w-0">
                <CoverageBoard listings={listings} lang={lang} />
                <p className="mt-4 max-w-[46ch] px-1 text-xs leading-relaxed text-ink-faint">
                  {t(lang, "home.statNote")}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* The instrument strip: four readings across the full width. */}
        <dl className="relative grid grid-cols-2 gap-px border-t border-line bg-line lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-canvas px-4 py-5 sm:px-6 lg:px-8">
              <dt className="tag text-ink-faint">{stat.label}</dt>
              <dd className="mt-1.5 flex items-center gap-3">
                <span className="tabular text-3xl font-semibold tracking-tight">
                  {figure(stat.value, lang)}
                </span>
                {stat.gauge ? <Gauge value={coverage} size={56} idle /> : null}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="directory" aria-label={t(lang, "nav.directory")} className="border-b border-line bg-surface scroll-mt-20">
        <div className="w-full px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          {directory.ok ? (
            <>
              {directory.isDemo ? (
                <div className="mb-8 flex flex-wrap items-center gap-3 border-y border-signal/50 bg-signal-soft px-4 py-3 text-sm leading-relaxed text-partial">
                  <span className="pill bg-signal text-ink">{t(lang, "common.demoLabel")}</span>
                  <span>{t(lang, "home.demoBanner")}</span>
                </div>
              ) : null}
              <SearchDirectory listings={listings} lang={lang} />
            </>
          ) : (
            <div role="alert" className="border-y border-no/30 bg-no-soft px-4 py-5">
              <h2 className="text-lg text-no">{t(lang, "common.errorTitle")}</h2>
              <p className="mt-1 text-sm text-ink-soft">{t(lang, "common.errorBody")}</p>
              <Link href="/directory" className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-no underline underline-offset-4">
                {t(lang, "common.retry")}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How a report is checked: three stations, one row. */}
      <section id="how" aria-label={t(lang, "home.howTitle")} className="border-y border-line bg-surface">
        <p className="tag px-4 pt-6 text-ink-faint sm:px-6 lg:px-8">
          {t(lang, "home.howTitle")}
        </p>
        <ol className="mt-4 grid list-none gap-px border-t border-line bg-line sm:grid-cols-3">
          {STEP_TITLES.map((titleKey, i) => (
            <li key={titleKey} className="bg-surface px-4 py-6 sm:px-6 lg:px-8">
              <span className="tag tabular text-accent">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-2 text-base font-semibold text-ink">{t(lang, titleKey)}</p>
              <p className="mt-1 max-w-[46ch] text-sm leading-relaxed text-ink-soft">
                {t(lang, STEP_BODIES[i])}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-b border-line bg-surface">
        <div className="grid gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-14">
          <div>
            <p className="tag text-ink-faint">{t(lang, "nav.report")}</p>
            <h2 className="mt-3 max-w-[18ch] text-[clamp(1.75rem,3.4vw,2.75rem)]">
              {t(lang, "report.title")}
            </h2>
          </div>
          <div className="lg:pt-1">
            <p className="max-w-prose text-base leading-relaxed text-ink-soft">
              {t(lang, "report.intro")}
            </p>
            <Link href="/report" className="btn btn-primary mt-6 px-5">
              {t(lang, "nav.report")}
              <span className="travel" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
