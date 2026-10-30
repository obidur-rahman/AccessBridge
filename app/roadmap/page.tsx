import type { Metadata } from "next";
import Link from "next/link";
import { t } from "@/lib/i18n/core";
import { getLang } from "@/lib/i18n/server";
import { ROADMAP, type RoadmapStatus } from "@/lib/roadmap";

const GROUPS: {
  status: RoadmapStatus;
  key: "roadmap.statusNow" | "roadmap.statusNext" | "roadmap.statusLater" | "roadmap.statusNot";
}[] = [
  { status: "now", key: "roadmap.statusNow" },
  { status: "next", key: "roadmap.statusNext" },
  { status: "later", key: "roadmap.statusLater" },
  { status: "not", key: "roadmap.statusNot" },
];

/** A thin coloured dot on each card. The group heading carries the word. */
const STATUS_DOT: Record<RoadmapStatus, string> = {
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

  return (
    <div>
      <header className="sheet pb-2 pt-3 sm:pt-4">
        <h1 className="text-[clamp(1.9rem,4.5vw,2.8rem)]">{t(lang, "roadmap.title")}</h1>
        <span
          aria-hidden="true"
          className="mt-3 block h-1 w-12 rounded-full bg-[linear-gradient(90deg,var(--color-accent),var(--color-accent-2))]"
        />
        <p className="mt-3 max-w-[66ch] text-[0.9375rem] leading-relaxed text-ink-soft sm:text-base">
          {t(lang, "roadmap.intro")}
        </p>
      </header>

      <div className="sheet pb-12">
        {GROUPS.map(({ status, key }) => {
          const phases = ROADMAP.filter((phase) => phase.status === status);
          if (phases.length === 0) return null;

          return (
            <section
              key={status}
              aria-labelledby={`phase-${status}`}
              className="mt-7 first:mt-4"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[status]}`}
                />
                <h2 id={`phase-${status}`} className="text-[1.15rem] leading-none">
                  {t(lang, key)}
                </h2>
                <span aria-hidden="true" className="h-px min-w-6 flex-1 bg-line" />
              </div>

              <div
                className={`stagger mt-3 grid gap-4 ${phases.length > 1 ? "lg:grid-cols-2" : ""}`}
              >
                {phases.map((phase) => (
                  <article key={phase.id} className="card p-5 sm:p-6">
                    <h3 className="text-[1.25rem] leading-snug sm:text-[1.35rem]">
                      {phase.title[lang]}
                    </h3>
                    <p className="mt-1.5 max-w-[62ch] text-sm leading-relaxed text-ink-soft">
                      {phase.summary[lang]}
                    </p>

                    <ul className="mt-4 grid list-none gap-2 border-t border-line pt-4 sm:grid-cols-2 sm:gap-x-8">
                      {phase.items.map((item) => (
                        <li key={item.en} className="flex gap-2.5">
                          <span
                            aria-hidden="true"
                            className={`mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[status]}`}
                          />
                          <span className="text-sm leading-relaxed text-ink-soft">
                            {item[lang]}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          );
        })}

        <aside className="relative mt-8 overflow-hidden rounded-[var(--radius-card)] bg-[linear-gradient(135deg,var(--color-accent)_0%,var(--color-accent-2)_100%)] px-5 py-6 text-white sm:px-8 sm:py-7">
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
