import Image from "next/image";
import Link from "next/link";
import { t } from "@/lib/i18n/core";
import type { Lang } from "@/lib/types";

const NOTE_RULES = ["bg-accent", "bg-accent-2", "bg-warm"];

export function SiteFooter({ lang, isReviewer, isAdmin }: { lang: Lang; isReviewer: boolean; isAdmin: boolean }) {
  const notes: { label: string; body: string }[] = [
    { label: t(lang, "footer.limitsTitle"), body: t(lang, "footer.disclaimer") },
    { label: t(lang, "footer.privacyTitle"), body: t(lang, "footer.privacy") },
    { label: t(lang, "footer.coverageTitle"), body: t(lang, "footer.pilotCoverage") },
  ];

  const staffHref = isAdmin ? "/admin" : isReviewer ? "/review" : "/login";
  const staffLabel = isAdmin
    ? t(lang, "nav.admin")
    : isReviewer
      ? t(lang, "nav.review")
      : t(lang, "nav.signIn");

  return (
    <footer className="mt-12 border-t border-line bg-surface">
      <div className="sheet py-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)]">
          <div>
            <Image
              src="/logo.png"
              alt={t(lang, "app.name")}
              width={316}
              height={67}
              unoptimized
              className="logo-on-light h-7 w-auto"
            />
            <Image
              src="/logo-on-dark.png"
              alt={t(lang, "app.name")}
              width={316}
              height={67}
              unoptimized
              className="logo-on-dark h-7 w-auto"
            />

            <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-ink-soft">
              {t(lang, "app.tagline")}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/report" className="btn btn-primary min-h-10 px-4 text-sm">
                {t(lang, "nav.report")}
              </Link>
              <Link href="/roadmap" className="btn btn-secondary min-h-10 px-4 text-sm">
                {t(lang, "nav.roadmap")}
              </Link>
            </div>
          </div>

          <dl className="grid gap-6 sm:grid-cols-3">
            {notes.map((note, index) => (
              <div key={note.label}>
                <span
                  aria-hidden="true"
                  className={`block h-1 w-8 rounded-full ${NOTE_RULES[index]}`}
                />
                <dt className="tag mt-2.5 text-ink">{note.label}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-ink-soft">{note.body}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-5 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label={t(lang, "nav.primary")} className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/directory" className="foot-link hover:text-accent-ink">
              {t(lang, "nav.directory")}
            </Link>
            <Link href="/report" className="foot-link hover:text-accent-ink">
              {t(lang, "nav.report")}
            </Link>
            <Link href="/roadmap" className="foot-link hover:text-accent-ink">
              {t(lang, "nav.roadmap")}
            </Link>
            <Link href={staffHref} className="foot-link hover:text-accent-ink">
              {staffLabel}
            </Link>
          </nav>

          <p className="max-w-[44ch] leading-relaxed">{t(lang, "place.reminder")}</p>
        </div>
      </div>
    </footer>
  );
}
