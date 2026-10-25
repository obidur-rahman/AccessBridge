import Link from "next/link";
import { CoverageBoard } from "@/components/listing/CoverageBoard";
import { SearchDirectory } from "@/components/search/SearchDirectory";
import { getDirectory } from "@/lib/data/places";
import { t, toBengaliDigits } from "@/lib/i18n/core";
import { getLang } from "@/lib/i18n/server";

function figure(value: number, lang: "en" | "bn") {
  return lang === "bn" ? toBengaliDigits(value) : String(value);
}

export default async function HomePage() {
  const [lang, directory] = await Promise.all([getLang(), getDirectory()]);
  const listings = directory.ok ? directory.listings : [];
  const reviewed = listings.filter((listing) => listing.checked_features.length > 0).length;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_80%_at_85%_-10%,var(--color-accent-soft)_0%,transparent_60%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-10 hidden h-[30rem] w-[30rem] rounded-t-full border border-accent/15 lg:block"
        >
          <div className="absolute inset-10 rounded-t-full border border-accent/12" />
          <div className="absolute inset-24 rounded-t-full border border-accent/10" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-16">
            <div className="soft-in min-w-0">
              <p className="pill bg-surface text-ink-soft shadow-soft">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
                {t(lang, "app.pilot")}
              </p>

              <h1 className="mt-6 max-w-[17ch] text-[clamp(2.5rem,6.4vw,4.25rem)] font-semibold leading-[1.04] tracking-[-0.035em]">
                {t(lang, "home.title")}
              </h1>

              <p className="mt-6 max-w-[48ch] text-[1.0625rem] leading-relaxed text-ink-soft sm:text-lg">
                {t(lang, "home.intro")}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#directory" className="btn btn-primary px-5">
                  {t(lang, "home.searchLabel")}
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                    <path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <Link href="/report" className="btn btn-secondary px-5">
                  {t(lang, "nav.report")}
                </Link>
              </div>

              <dl className="mt-12 grid max-w-lg grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-6">
                <div>
                  <dt className="tag text-ink-faint">{t(lang, "home.statPlaces")}</dt>
                  <dd className="tabular mt-1 text-2xl font-semibold tracking-tight">
                    {figure(listings.length, lang)}
                  </dd>
                </div>
                <div>
                  <dt className="tag text-ink-faint">{t(lang, "home.statChecked")}</dt>
                  <dd className="tabular mt-1 text-2xl font-semibold tracking-tight">
                    {figure(reviewed, lang)}
                  </dd>
                </div>
              </dl>
            </div>

            {directory.ok ? (
              <div className="soft-in min-w-0">
                <CoverageBoard listings={listings} lang={lang} />
                <p className="mt-4 max-w-[42ch] px-1 text-xs leading-relaxed text-ink-faint">
                  {t(lang, "home.statNote")}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {!directory.ok ? (
          <div role="alert" className="card card-pad mt-10 border-no/30 bg-no-soft">
            <p className="text-base font-semibold text-no">{t(lang, "common.errorTitle")}</p>
            <p className="mt-1 text-sm text-ink-soft">{t(lang, "common.errorBody")}</p>
            <Link
              href="/"
              className="mt-4 inline-flex min-h-10 items-center rounded-lg border border-no/40 px-3 text-sm font-medium text-no transition-colors hover:bg-no/5"
            >
              {t(lang, "common.retry")}
            </Link>
          </div>
        ) : (
          <>
            {directory.isDemo ? (
              <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-control border border-signal/30 bg-signal-soft px-4 py-2.5 text-sm leading-relaxed text-partial">
                <span className="pill shrink-0 bg-signal text-ink">{t(lang, "common.demoLabel")}</span>
                <span className="min-w-0">{t(lang, "home.demoBanner")}</span>
              </div>
            ) : null}

            <div className="py-14 sm:py-16">
              <SearchDirectory listings={listings} lang={lang} />
            </div>
          </>
        )}

        <section className="mb-20 rounded-[1.5rem] border border-line bg-surface px-6 py-10 sm:px-10 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="tag text-ink-faint">{t(lang, "nav.report")}</p>
              <h2 className="mt-3 max-w-[18ch] text-[clamp(1.75rem,3.4vw,2.5rem)]">
                {t(lang, "report.title")}
              </h2>
            </div>
            <div className="lg:pt-1">
              <p className="max-w-prose text-base leading-relaxed text-ink-soft">
                {t(lang, "report.intro")}
              </p>
              <Link href="/report" className="btn btn-primary mt-6 px-5">
                {t(lang, "nav.report")}
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
