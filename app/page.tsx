import Link from "next/link";
import { ResultCard } from "@/components/listing/ResultCard";
import { getDirectory } from "@/lib/data/places";
import { t } from "@/lib/i18n/core";
import { getLang } from "@/lib/i18n/server";

const STEP_TITLES = ["report.step1Title", "report.step2Title", "report.step3Title"] as const;
const STEP_BODIES = ["report.step1Body", "report.step2Body", "report.step3Body"] as const;

export default async function HomePage() {
  const [lang, directory] = await Promise.all([getLang(), getDirectory()]);
  const listings = directory.ok ? directory.listings : [];
  const showcase = listings.slice(0, 4);

  return (
    <div>
      <section className="border-b border-line">
        <div className="w-full px-4 pb-14 pt-12 sm:px-6 sm:pt-16 lg:px-8">
          <h1 className="hero-title soft-in max-w-[14ch] text-[clamp(2.75rem,7.4vw,5.5rem)]">
            {t(lang, "home.title")}
          </h1>

          <p
            className="soft-in mt-7 max-w-[54ch] text-[1.0625rem] leading-relaxed text-ink-soft sm:text-xl"
            style={{ animationDelay: "70ms" }}
          >
            {t(lang, "home.intro")}
          </p>

          {/* One dominant action, one quiet link: no twin buttons. */}
          <div
            className="soft-in mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6"
            style={{ animationDelay: "140ms" }}
          >
            <Link href="/directory" className="btn btn-primary w-full px-6 py-3.5 text-base sm:w-auto">
              {t(lang, "home.searchLabel")}
              <span className="travel" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
            <Link
              href="/report"
              className="nav-link py-1 text-base font-semibold text-ink-soft hover:text-accent"
            >
              {t(lang, "nav.report")}
            </Link>
          </div>
        </div>
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

              <div className="section-head">
                <h2 className="max-w-[22ch] text-[clamp(1.6rem,3.2vw,2.4rem)]">
                  {t(lang, "home.showcaseTitle")}
                </h2>
                <Link
                  href="/directory"
                  className="nav-link shrink-0 py-1 text-base font-semibold text-ink-soft hover:text-accent"
                >
                  {t(lang, "home.openDirectory")}
                </Link>
              </div>

              {showcase.length > 0 ? (
                <ul className="mt-6 list-none divide-y divide-line border-y border-line">
                  {showcase.map((listing, index) => (
                    <ResultCard key={listing.id} listing={listing} lang={lang} index={index + 1} />
                  ))}
                </ul>
              ) : (
                <p className="mt-6 border-y border-line px-1 py-10 text-center text-ink-faint">
                  {t(lang, "home.noResults")}
                </p>
              )}

              <Link href="/directory" className="btn btn-primary mt-8 px-5">
                {t(lang, "home.openDirectory")}
                <span className="travel" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
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
