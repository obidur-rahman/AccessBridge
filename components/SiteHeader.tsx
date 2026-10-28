"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { t } from "@/lib/i18n/core";
import type { Lang } from "@/lib/types";

export function SiteHeader({
  lang,
  isReviewer,
  isAdmin,
}: {
  lang: Lang;
  isReviewer: boolean;
  isAdmin: boolean;
}) {
  const pathname = usePathname();
  const onHome = pathname === "/";

  const current = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)) ? "page" : undefined;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <div className="flex w-full items-center justify-between gap-1 px-3 py-2.5 sm:gap-3 sm:px-6 sm:py-3 lg:px-8">
        <Link
          href="/"
          aria-current={onHome ? "page" : undefined}
          className="flex items-center gap-2.5 rounded-control py-1 transition-transform duration-200 hover:-translate-y-px"
        >
          {/* The wordmark is the home link, so the nav carries the other destinations. */}
          <Image
            src="/logo.png"
            alt=""
            width={32}
            height={32}
            priority
            className="hidden h-8 w-8 shrink-0 rounded-control shadow-soft min-[360px]:block"
          />
          <span className="text-[1.0625rem] font-semibold tracking-[-0.02em] sm:text-[1.125rem]">
            {t(lang, "app.name")}
          </span>
        </Link>

        <nav aria-label={t(lang, "nav.home")} className="flex items-center gap-0.5 sm:gap-1">
          <Link
            href="/directory"
            aria-current={current("/directory")}
            className="nav-link hidden rounded-control px-3 py-2 text-sm font-medium text-ink-soft hover:text-ink sm:inline-flex"
          >
            {t(lang, "nav.directory")}
          </Link>
          <Link
            href="/#how"
            className="nav-link hidden rounded-control px-3 py-2 text-sm font-medium text-ink-soft hover:text-ink sm:inline-flex"
          >
            {t(lang, "nav.how")}
          </Link>

          {isReviewer ? (
            <>
              <Link
                href="/review"
                aria-current={current("/review")}
                className="nav-link hidden rounded-control px-3 py-2 text-sm font-medium text-ink-soft hover:text-ink sm:inline-flex"
              >
                {t(lang, "nav.review")}
              </Link>
              {isAdmin ? (
                <Link
                  href="/admin"
                  aria-current={current("/admin")}
                  className="nav-link hidden rounded-control px-3 py-2 text-sm font-medium text-ink-soft hover:text-ink sm:inline-flex"
                >
                  {t(lang, "nav.admin")}
                </Link>
              ) : null}
            </>
          ) : (
            <Link
              href="/login"
              aria-current={current("/login")}
              className="nav-link hidden rounded-control px-3 py-2 text-sm font-medium text-ink-soft hover:text-ink sm:inline-flex"
            >
              {t(lang, "nav.signIn")}
            </Link>
          )}

          <details className="relative sm:hidden">
            <summary className="flex min-h-10 cursor-pointer list-none items-center gap-1 rounded-control border border-line px-2.5 text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
              {t(lang, "nav.menu")}
              <svg aria-hidden="true" viewBox="0 0 16 16" className="menu-chevron h-3.5 w-3.5 text-ink-faint" fill="none"><path d="m3.5 6 4.5 4 4.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </summary>
            <div className="absolute right-0 top-full z-50 mt-2 grid min-w-52 gap-1 border border-line bg-surface p-2 shadow-lift">
              <Link href="/directory" className="min-h-11 rounded-control px-3 py-2 text-sm hover:bg-surface-muted" onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}>{t(lang, "nav.directory")}</Link>
              <Link href="/#how" className="min-h-11 rounded-control px-3 py-2 text-sm hover:bg-surface-muted" onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}>{t(lang, "nav.how")}</Link>
              {isReviewer ? <Link href="/review" className="min-h-11 rounded-control px-3 py-2 text-sm hover:bg-surface-muted" onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}>{t(lang, "nav.review")}</Link> : <Link href="/login" className="min-h-11 rounded-control px-3 py-2 text-sm hover:bg-surface-muted" onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}>{t(lang, "nav.signIn")}</Link>}
              {isAdmin ? <Link href="/admin" className="min-h-11 rounded-control px-3 py-2 text-sm hover:bg-surface-muted" onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}>{t(lang, "nav.admin")}</Link> : null}
            </div>
          </details>

          <LanguageSwitch lang={lang} />

          <Link
            href="/report"
            aria-label={t(lang, "nav.report")}
            aria-current={current("/report")}
            className="ml-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center gap-1.5 rounded-control bg-accent text-sm font-medium text-white transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-lift active:translate-y-0 sm:ml-1 sm:w-auto sm:px-3.5"
          >
            <span className="hidden sm:inline">{t(lang, "nav.report")}</span>
            <span aria-hidden="true" className="text-base leading-none sm:text-[0.95em]">
              +
            </span>
          </Link>
        </nav>
      </div>

      {/* The header's own measuring edge. */}
      <div aria-hidden="true" className="tick-rail h-1.5 opacity-70" />
    </header>
  );
}
