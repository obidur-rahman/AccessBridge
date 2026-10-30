import type { Metadata } from "next";
import { ReportForm } from "@/components/report/ReportForm";
import { getReportPlaceOptions } from "@/lib/data/places";
import { t, todayIso } from "@/lib/i18n/core";
import { getLang } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: `${t(lang, "report.title")} — ${t(lang, "app.name")}`,
    alternates: { canonical: "/report" },
    robots: { index: false },
  };
}

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ place?: string }>;
}) {
  const [lang, places, params] = await Promise.all([
    getLang(),
    getReportPlaceOptions(),
    searchParams,
  ]);

  return (
    <div>
      <header className="sheet max-w-2xl pb-3 pt-2 sm:pt-3">
        <h1 className="text-[clamp(1.9rem,4.4vw,2.6rem)]">{t(lang, "report.title")}</h1>
        <p className="mt-2 max-w-[56ch] text-[0.9375rem] leading-relaxed text-ink-soft sm:text-base">
          {t(lang, "report.intro")}
        </p>
      </header>

      <div className="sheet max-w-2xl pb-10 pt-3">
        <ReportForm
          places={places}
          lang={lang}
          today={todayIso()}
          initialPlaceId={typeof params.place === "string" ? params.place : undefined}
        />
      </div>
    </div>
  );
}
