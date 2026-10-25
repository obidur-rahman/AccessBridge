import Link from "next/link";
import { t } from "@/lib/i18n/core";
import type { Lang } from "@/lib/types";

export function SiteFooter({ lang, isReviewer }: { lang: Lang; isReviewer: boolean }) {
  const notes: { label: string; body: string }[] = [
    { label: t(lang, "footer.limitsTitle"), body: t(lang, "footer.disclaimer") },
    { label: t(lang, "footer.privacyTitle"), body: t(lang, "footer.privacy") },
    { label: t(lang, "footer.coverageTitle"), body: t(lang, "footer.pilotCoverage") },
  ];

  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="text-[1.4rem] font-semibold tracking-[-0.025em]">{t(lang, "app.name")}</p>
            {lang === "en" ? (
              <p className="mt-1 text-[0.95rem] text-ink-faint" lang="bn">
                প্রবেশগম্যতার সেতু
              </p>
            ) : null}
            <p className="mt-4 max-w-[28ch] text-sm leading-relaxed text-ink-soft">
              {t(lang, "app.tagline")}
            </p>
          </div>

          <dl className="grid gap-8 sm:grid-cols-3">
            {notes.map((note) => (
              <div key={note.label}>
                <dt className="tag text-ink">{note.label}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-soft">{note.body}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <p className="tag text-ink-faint">{t(lang, "app.pilot")}</p>
          <Link
            href={isReviewer ? "/review" : "/login"}
            className="text-sm font-medium text-accent underline decoration-accent/30 decoration-1 underline-offset-4 transition-colors hover:text-accent-ink hover:decoration-accent"
          >
            {isReviewer ? t(lang, "nav.review") : t(lang, "nav.signIn")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
