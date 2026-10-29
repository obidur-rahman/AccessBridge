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

  const steps = [
    { title: t(lang, "report.step1Title"), body: t(lang, "report.step1Body") },
    { title: t(lang, "report.step2Title"), body: t(lang, "report.step2Body") },
    { title: t(lang, "report.step3Title"), body: t(lang, "report.step3Body") },
  ];

  return (
    <div>
      <header className="relative overflow-hidden border-b border-line">
        <div className="relative w-full px-4 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-14 lg:px-8">
          <h1 className="max-w-[22ch] text-[clamp(2.4rem,6vw,4rem)]">
            {t(lang, "report.title")}
          </h1>
          <p className="mt-4 max-w-[56ch] text-[1.0625rem] leading-relaxed text-ink-soft">
            {t(lang, "report.intro")}
          </p>

          <ol className="mt-9 grid max-w-5xl list-none gap-px border-y border-line bg-line sm:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="bg-canvas px-4 py-4 sm:px-5">
                <span className="tag tabular text-ink-faint">{String(index + 1).padStart(2, "0")}</span>
                <p className="mt-2 text-sm font-semibold text-ink">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
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
