import type { Metadata } from "next";
import Link from "next/link";
import { t } from "@/lib/i18n/core";
import { getLang } from "@/lib/i18n/server";
import { ROADMAP, type RoadmapStatus } from "@/lib/roadmap";

const STATUS_KEY: Record<
  RoadmapStatus,
  "roadmap.statusNow" | "roadmap.statusNext" | "roadmap.statusLater" | "roadmap.statusNot"
> = {
  now: "roadmap.statusNow",
  next: "roadmap.statusNext",
  later: "roadmap.statusLater",
  not: "roadmap.statusNot",
};

const STATUS_TONE: Record<RoadmapStatus, string> = {
  now: "bg-yes-soft text-yes",
  next: "bg-accent-soft text-accent-ink",
  later: "bg-accent-2-soft text-accent-2-ink",
  not: "bg-unknown-soft text-unknown",
};

/** A thin coloured edge on each phase card. The pill still carries the word. */
const STATUS_EDGE: Record<RoadmapStatus, string> = {
  now: "bg-yes",
  next: "bg-accent",
  later: "bg-accent-2",
  not: "bg-unknown",
};

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: `${t(lang, "roadmap.title")} — ${t(lang, "app.name")}`,
    description: t(lang, "roadmap.intro"),
    alternates: { canonical: "/roadmap" },
  };
}

export default async function RoadmapPage() {
  const lang = await getLang();
  const statuses: RoadmapStatus[] = ["now", "next", "later", "not"];
  const total = String(ROADMAP.length).padStart(2, "0");

  return (
    <div>
      <header className="sheet pb-5 pt-3 sm:pt-4">
        <h1 className="text-[clamp(1.9rem,4.5vw,2.8rem)]">{t(lang, "roadmap.title")}</h1>
        <span
          aria-hidden="true"
          className="mt-3 block h-1 w-12 rounded-full bg-[linear-gradient(90deg,var(--color-accent),var(--color-accent-2))]"
        />

        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-[66ch] text-[0.9375rem] leading-relaxed text-ink-soft sm:text-base">
            {t(lang, "roadmap.intro")}
          </p>
          <ul className="flex list-none flex-wrap gap-1.5" aria-label={t(lang, "roadmap.title")}>
            {statuses.map((status) => (
              <li key={status}>
                <span className={`pill ${STATUS_TONE[status]}`}>{t(lang, STATUS_KEY[status])}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className="sheet pb-12">
        {/* The whole plan at a glance: one line of phases, nothing to click. */}
        <ol
          className="stagger grid list-none gap-2 sm:grid-cols-2 lg:grid-cols-5"
          aria-label={t(lang, "roadmap.title")}
        >
          {ROADMAP.map((phase, index) => (
            <li
              key={phase.id}
              className="flex flex-col rounded-[var(--radius-card)] border border-line bg-surface px-3.5 py-3"
            >
              <span className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                <span className="tabular text-xs text-ink-faint">
                  {String(index + 1).padStart(2, "0")}
                  <span className="text-ink-faint/60"> / {total}</span>
                </span>
                <span className={`pill ${STATUS_TONE[phase.status]}`}>
                  {t(lang, STATUS_KEY[phase.status])}
                </span>
              </span>
              <span className="mt-1.5 text-sm font-bold leading-snug text-ink">
                {phase.title[lang]}
              </span>
            </li>
          ))}
        </ol>

        <div className="stagger mt-4 grid gap-4 lg:grid-cols-2">
          {ROADMAP.map((phase, index) => {
            const wide = phase.status === "not";
            return (
              <article
                key={phase.id}
                className={`card relative overflow-hidden p-5 sm:p-6 ${wide ? "lg:col-span-2" : ""}`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-0 left-0 w-[3px] ${STATUS_EDGE[phase.status]}`}
                />

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="tabular text-xs text-ink-faint">
                    {String(index + 1).padStart(2, "0")}
                    <span className="text-ink-faint/60"> / {total}</span>
                  </span>
                  <span className={`pill ${STATUS_TONE[phase.status]}`}>
                    {t(lang, STATUS_KEY[phase.status])}
                  </span>
                </div>

                <h2 className="mt-2 text-[1.3rem] leading-snug sm:text-[1.45rem]">
                  {phase.title[lang]}
                </h2>
                <p className="mt-1.5 max-w-[62ch] text-sm leading-relaxed text-ink-soft">
                  {phase.summary[lang]}
                </p>

                <ul
                  className={`mt-4 grid list-none gap-2 border-t border-line pt-4 sm:grid-cols-2 sm:gap-x-8 ${
                    wide ? "xl:grid-cols-4" : ""
                  }`}
                >
                  {phase.items.map((item) => (
                    <li key={item.en} className="flex gap-2.5">
                      <span
                        aria-hidden="true"
                        className={`mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_EDGE[phase.status]}`}
                      />
                      <span className="text-sm leading-relaxed text-ink-soft">{item[lang]}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <aside className="relative mt-4 overflow-hidden rounded-[var(--radius-card)] bg-[linear-gradient(135deg,var(--color-accent)_0%,var(--color-accent-2)_100%)] px-5 py-6 text-white sm:px-8 sm:py-7">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-14 -top-20 h-52 w-52 rounded-full bg-white/15 blur-2xl"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-[var(--color-warm)] opacity-25 blur-2xl"
          />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[1.35rem] text-white">{t(lang, "roadmap.helpTitle")}</h2>
              <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-white/85">
                {t(lang, "roadmap.helpBody")}
              </p>
            </div>
            <Link
              href="/report"
              className="btn shrink-0 bg-white px-4 text-accent hover:bg-[#fffdf7]"
            >
              {t(lang, "roadmap.helpReport")}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
