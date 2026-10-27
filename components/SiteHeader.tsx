import Image from "next/image";
import Link from "next/link";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { t } from "@/lib/i18n/core";
import type { Lang } from "@/lib/types";

export function SiteHeader({ lang, isReviewer }: { lang: Lang; isReviewer: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-control py-1 transition-transform duration-200 hover:-translate-y-px"
        >
          {/* The wordmark beside it names the link, so the logo itself stays decorative. */}
          <Image
            src="/logo.png"
            alt=""
            width={32}
            height={32}
            priority
            className="h-8 w-8 shrink-0 rounded-control shadow-soft"
          />
          <span className="text-[1.0625rem] font-semibold tracking-[-0.02em] sm:text-[1.125rem]">
            {t(lang, "app.name")}
          </span>
        </Link>

        <nav aria-label={t(lang, "nav.home")} className="flex items-center gap-1 sm:gap-1.5">
          {/* The wordmark is the home link, so the nav carries only the other destinations. */}
          {isReviewer ? (
            <Link
              href="/review"
              className="hidden rounded-control px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink sm:inline-flex"
            >
              {t(lang, "nav.review")}
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-control px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink md:inline-flex"
            >
              {t(lang, "nav.signIn")}
            </Link>
          )}

          <LanguageSwitch lang={lang} />

          <Link
            href="/report"
            aria-label={t(lang, "nav.report")}
            className="ml-1 inline-flex h-10 w-10 shrink-0 items-center justify-center gap-1.5 rounded-control bg-accent text-sm font-medium text-white transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-lift active:translate-y-0 sm:w-auto sm:px-3.5"
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
