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
      <header className="sheet pb-4 pt-3 sm:pt-4">
        <h1 className="text-[clamp(1.9rem,4.5vw,2.8rem)]">{t(lang, "home.resultsTitle")}</h1>
        <span
          aria-hidden="true"
          className="mt-3 block h-1 w-12 rounded-full bg-[linear-gradient(90deg,var(--color-accent),var(--color-accent-2))]"
        />
      </header>

      <div className="sheet pb-9">
        {!directory.ok ? (
          <div role="alert" className="card border-no/30 bg-no-soft p-5">
            <p className="text-base font-bold text-no">{t(lang, "common.errorTitle")}</p>
            <p className="mt-1 text-sm text-ink-soft">{t(lang, "common.errorBody")}</p>
            <Link
              href="/directory"
              className="mt-4 inline-flex min-h-10 items-center rounded-[0.625rem] border border-no/40 px-3 text-sm font-bold text-no transition-colors hover:bg-no/5"
            >
              {t(lang, "common.retry")}
            </Link>
          </div>
        ) : (
          <>
            {directory.isDemo ? (
              <div className="mb-4 flex flex-wrap items-center gap-2 border-y border-signal/25 bg-signal-soft px-3 py-2.5 text-xs leading-relaxed text-signal">
                <span className="pill shrink-0 bg-signal-soft text-signal">
                  {t(lang, "common.demoLabel")}
                </span>
                <span className="min-w-0">{t(lang, "home.demoBanner")}</span>
              </div>
            ) : null}

            <SearchDirectory listings={listings} lang={lang} />
          </>
        )}
      </div>
    </div>
  );
}
