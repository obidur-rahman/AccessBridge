import Link from "next/link";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { t } from "@/lib/i18n/core";
import type { Lang } from "@/lib/types";

function Mark() {
  return (
    <span
      aria-hidden="true"
      className="grid h-8 w-8 place-items-center rounded-[0.65rem] bg-accent text-white shadow-soft"
    >
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none">
        <path
          d="M5 18.5V14a7 7 0 0 1 14 0v4.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path d="M9.5 18.5v-4a2.5 2.5 0 0 1 5 0v4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function SiteHeader({ lang, isReviewer }: { lang: Lang; isReviewer: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 rounded-lg py-1">
          <Mark />
          <span className="text-[1.0625rem] font-semibold tracking-[-0.02em] sm:text-[1.125rem]">
            {t(lang, "app.name")}
          </span>
        </Link>

        <nav aria-label={t(lang, "nav.home")} className="flex items-center gap-1 sm:gap-1.5">
          <Link
            href="/"
            className="hidden rounded-lg px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink sm:inline-flex"
          >
            {t(lang, "nav.home")}
          </Link>

          {isReviewer ? (
            <Link
              href="/review"
              className="hidden rounded-lg px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink sm:inline-flex"
            >
              {t(lang, "nav.review")}
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-lg px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink md:inline-flex"
            >
              {t(lang, "nav.signIn")}
            </Link>
          )}

          <LanguageSwitch lang={lang} />

          <Link
            href="/report"
            aria-label={t(lang, "nav.report")}
            className="ml-1 inline-flex h-10 w-10 shrink-0 items-center justify-center gap-1.5 rounded-control bg-accent text-sm font-medium text-white transition-colors hover:bg-accent-ink sm:w-auto sm:px-3.5"
          >
            <span className="hidden sm:inline">{t(lang, "nav.report")}</span>
            <span aria-hidden="true" className="text-base leading-none sm:text-[0.95em]">
              +
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
