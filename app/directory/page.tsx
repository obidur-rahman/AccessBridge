import type { Metadata } from "next";
import Link from "next/link";
import { SearchDirectory } from "@/components/search/SearchDirectory";
import { getDirectory } from "@/lib/data/places";
import { t } from "@/lib/i18n/core";
import { getLang } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: `${t(lang, "home.resultsTitle")} — ${t(lang, "app.name")}`,
    alternates: { canonical: "/directory" },
  };
}

export default async function DirectoryPage() {
  const [lang, directory] = await Promise.all([getLang(), getDirectory()]);
  const listings = directory.ok ? directory.listings : [];

  return (
    <div>
      <header className="relative border-b border-line">
        <div className="relative w-full px-4 pb-9 pt-10 sm:px-6 sm:pb-11 sm:pt-12 lg:px-8">
          <h1 className="max-w-[20ch] text-[clamp(2.4rem,6vw,4rem)]">
            {t(lang, "home.resultsTitle")}
          </h1>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 lg:px-8">
        {!directory.ok ? (
          <div role="alert" className="card card-pad mt-10 border-no/30 bg-no-soft">
            <p className="text-base font-semibold text-no">{t(lang, "common.errorTitle")}</p>
            <p className="mt-1 text-sm text-ink-soft">{t(lang, "common.errorBody")}</p>
            <Link
              href="/directory"
              className="mt-4 inline-flex min-h-10 items-center rounded-control border border-no/40 px-3 text-sm font-medium text-no transition-colors hover:bg-no/5"
            >
              {t(lang, "common.retry")}
            </Link>
          </div>
        ) : (
          <>
            {directory.isDemo ? (
              <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-signal/60 bg-signal-soft px-4 py-3 text-sm leading-relaxed text-partial">
                <span className="pill shrink-0 bg-signal text-ink">{t(lang, "common.demoLabel")}</span>
                <span className="min-w-0">{t(lang, "home.demoBanner")}</span>
              </div>
            ) : null}

            <div className="py-10 sm:py-12">
              <SearchDirectory listings={listings} lang={lang} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
