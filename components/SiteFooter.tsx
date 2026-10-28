import Link from "next/link";
import { t } from "@/lib/i18n/core";
import type { Lang } from "@/lib/types";

export function SiteFooter({ lang, isReviewer, isAdmin }: { lang: Lang; isReviewer: boolean; isAdmin: boolean }) {
  const notes: { label: string; body: string }[] = [
    { label: t(lang, "footer.limitsTitle"), body: t(lang, "footer.disclaimer") },
    { label: t(lang, "footer.privacyTitle"), body: t(lang, "footer.privacy") },
    { label: t(lang, "footer.coverageTitle"), body: t(lang, "footer.pilotCoverage") },
  ];

  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="w-full px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.4fr_0.8fr]">
          <div>
            <p className="text-[clamp(1.6rem,3vw,2.2rem)] font-semibold tracking-[-0.03em]">{t(lang, "app.name")}</p>
            {lang === "en" ? (
              <p className="mt-1 text-[0.95rem] text-ink-faint" lang="bn">
                প্রবেশগম্যতার সেতু
              </p>
            ) : null}
            <p className="mt-4 max-w-[28ch] text-sm leading-relaxed text-ink-soft">
              {t(lang, "app.tagline")}
            </p>
          </div>

          <dl className="grid gap-6 sm:grid-cols-3">
            {notes.map((note) => (
              <div key={note.label}>
                <dt className="tag text-ink">{note.label}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-soft">{note.body}</dd>
              </div>
            ))}
          </dl>
          <nav aria-label={t(lang, "nav.home")} className="grid content-start gap-1 border-t border-line pt-4 text-sm">
            <Link href="/directory" className="min-h-10 py-2 text-ink-soft underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent">{t(lang, "nav.directory")}</Link>
            <Link href="/report" className="min-h-10 py-2 text-ink-soft underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent">{t(lang, "nav.report")}</Link>
            <Link href={isAdmin ? "/admin" : isReviewer ? "/review" : "/login"} className="min-h-10 py-2 text-ink-soft underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent">
              {isAdmin ? t(lang, "nav.admin") : isReviewer ? t(lang, "nav.review") : t(lang, "nav.signIn")}
            </Link>
          </nav>
        </div>

        <div className="tick-rail mt-10 h-2.5 opacity-80" aria-hidden="true" />

        {/* Project details stay together as a compact drawing title block. */}
        <div className="mt-6 grid grid-cols-2 border-l border-t border-line lg:grid-cols-4">
          <div className="border-b border-r border-line px-4 py-4">
            <p className="tag text-ink-faint">{t(lang, "footer.blockProject")}</p>
            <p className="mt-1.5 text-sm text-ink">{t(lang, "app.name")}</p>
          </div>
          <div className="border-b border-r border-line px-4 py-4">
            <p className="tag text-ink-faint">{t(lang, "footer.blockArea")}</p>
            <p className="mt-1.5 text-sm text-ink">{t(lang, "footer.blockAreaValue")}</p>
          </div>
          <div className="border-b border-r border-line px-4 py-4">
            <p className="tag text-ink-faint">{t(lang, "nav.language")}</p>
            <p className="mt-1.5 text-sm text-ink">
              {lang === "bn" ? (
                <span lang="bn">বাংলা</span>
              ) : (
                "English"
              )}
            </p>
          </div>
          <div className="border-b border-r border-line px-4 py-4">
            <p className="tag text-ink-faint">{t(lang, "footer.blockAccess")}</p>
            <p className="mt-1.5 text-sm text-ink">{t(lang, "app.pilot")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
