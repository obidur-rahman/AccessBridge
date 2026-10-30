import Link from "next/link";
import { PlaceCard } from "@/components/listing/PlaceCard";
import { QuickFind } from "@/components/search/QuickFind";
import { getDirectory } from "@/lib/data/places";
import { t } from "@/lib/i18n/core";
import { getLang } from "@/lib/i18n/server";

const STEP_TITLES = ["report.step1Title", "report.step2Title", "report.step3Title"] as const;
const STEP_BODIES = ["report.step1Body", "report.step2Body", "report.step3Body"] as const;
const STEP_TONES = [
  "bg-accent-soft text-accent-ink",
  "bg-accent-2-soft text-accent-2-ink",
  "bg-warm-soft text-warm",
] as const;

function Arrow() {
  return (
    <span className="travel" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <path
          d="M5 12h14M13 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default async function HomePage() {
  const [lang, directory] = await Promise.all([getLang(), getDirectory()]);
  const listings = directory.ok ? directory.listings : [];
  const recent = listings.slice(0, 4);

  return (
    <div>
      <section className="relative -mt-[4.5rem] overflow-hidden border-b border-line sm:-mt-[5rem]">
        <div className="aurora" aria-hidden="true" />
        <div className="sheet relative pb-8 pt-[6.5rem] sm:pb-11 sm:pt-[6.75rem]">
          <div className="stagger grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-12">
            <div className="min-w-0">
              <h1 className="hero-title max-w-[14ch] text-[clamp(2.2rem,5vw,3.6rem)]">
                {t(lang, "home.title")}
              </h1>

              <p className="mt-4 max-w-[46ch] text-[1.02rem] leading-relaxed text-ink-soft sm:text-[1.125rem]">
                {t(lang, "home.intro")}
              </p>
            </div>

            <div className="min-w-0 lg:pb-1">
              <QuickFind listings={listings} lang={lang} />
            </div>
          </div>
        </div>
      </section>

      {directory.ok && directory.isDemo ? (
        <div className="border-b border-signal/25 bg-signal-soft">
          <div className="sheet flex flex-wrap items-center gap-2 py-2.5 text-xs leading-relaxed text-signal">
            <span className="pill shrink-0 bg-signal-soft text-signal">
              {t(lang, "common.demoLabel")}
            </span>
            <span className="min-w-0">{t(lang, "home.demoBanner")}</span>
          </div>
        </div>
      ) : null}

      {!directory.ok ? (
        <div className="sheet py-8">
          <div role="alert" className="card border-no/30 bg-no-soft p-5">
            <h2 className="text-lg text-no">{t(lang, "common.errorTitle")}</h2>
            <p className="mt-1 text-sm text-ink-soft">{t(lang, "common.errorBody")}</p>
            <Link
              href="/directory"
              className="mt-3 inline-flex min-h-10 items-center text-sm font-bold text-no underline underline-offset-4"
            >
              {t(lang, "common.retry")}
            </Link>
          </div>
        </div>
      ) : (
        <>
          <section aria-labelledby="recent-heading" className="sheet py-7">
            <div className="section-head">
              <h2 id="recent-heading" className="text-[1.5rem]">
                {t(lang, "home.recent")}
              </h2>
              <Link
                href="/directory"
                className="flex min-h-9 items-center gap-1 text-sm font-bold text-accent-ink hover:text-accent"
              >
                {t(lang, "home.openDirectory")}
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            {recent.length > 0 ? (
              <div className="stagger mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {recent.map((listing) => (
                  <PlaceCard key={listing.id} listing={listing} lang={lang} />
                ))}
              </div>
            ) : (
              <p className="card mt-4 p-5 text-sm text-ink-faint">{t(lang, "home.noResults")}</p>
            )}
          </section>

          <section aria-labelledby="how-heading" className="sheet pb-2">
            <div id="how" className="card scroll-mt-24 p-5 sm:p-6">
              <h2 id="how-heading" className="text-[1.4rem]">
                {t(lang, "home.howTitle")}
              </h2>

              <ol className="stagger mt-4 grid gap-5 sm:grid-cols-3">
                {STEP_TITLES.map((titleKey, i) => (
                  <li key={titleKey} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full ${STEP_TONES[i]}`}
                    >
                      {i === 0 ? (
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      ) : i === 1 ? (
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                          <path d="m4 12.5 5 5L20 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                          <path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-ink">{t(lang, titleKey)}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                        {t(lang, STEP_BODIES[i])}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section aria-labelledby="report-card-heading" className="sheet py-7">
            <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-[linear-gradient(135deg,var(--color-accent)_0%,var(--color-accent-2)_100%)] px-5 py-7 text-white sm:px-8 sm:py-8">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/15 blur-2xl"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-[var(--color-warm)] opacity-25 blur-2xl"
              />
              <div className="relative grid gap-5 sm:grid-cols-[1.2fr_1fr] sm:items-center">
                <div>
                  <h2 id="report-card-heading" className="max-w-[20ch] text-[1.6rem] text-white sm:text-[1.9rem]">
                    {t(lang, "report.title")}
                  </h2>
                  <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-white/85">
                    {t(lang, "report.intro")}
                  </p>
                </div>
                <div className="sm:justify-self-end">
                  <Link
                    href="/report"
                    className="btn bg-white px-5 text-accent hover:bg-[#fffdf7]"
                  >
                    {t(lang, "nav.report")}
                    <Arrow />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
