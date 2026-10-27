"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { t } from "@/lib/i18n/core";
import type { Lang } from "@/lib/types";

export function SiteHeader({ lang, isReviewer }: { lang: Lang; isReviewer: boolean }) {
  const pathname = usePathname();
  const onHome = pathname === "/";

  const current = (href: string) => (pathname === href ? "page" : undefined);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="flex w-full items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
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
            className="h-8 w-8 shrink-0 rounded-control shadow-soft"
          />
          <span className="text-[1.0625rem] font-semibold tracking-[-0.02em] sm:text-[1.125rem]">
            {t(lang, "app.name")}
          </span>
        </Link>

        <nav aria-label={t(lang, "nav.home")} className="flex items-center gap-0.5 sm:gap-1">
          <Link
            href="/#directory"
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
            <Link
              href="/review"
              aria-current={current("/review")}
              className="nav-link rounded-control px-3 py-2 text-sm font-medium text-ink-soft hover:text-ink"
            >
              {t(lang, "nav.review")}
            </Link>
          ) : (
            <Link
              href="/login"
              aria-current={current("/login")}
              className="nav-link hidden rounded-control px-3 py-2 text-sm font-medium text-ink-soft hover:text-ink md:inline-flex"
            >
              {t(lang, "nav.signIn")}
            </Link>
          )}

          <LanguageSwitch lang={lang} />

          <Link
            href="/report"
            aria-label={t(lang, "nav.report")}
            aria-current={current("/report")}
            className="ml-1 inline-flex h-10 w-10 shrink-0 items-center justify-center gap-1.5 rounded-control bg-accent text-sm font-medium text-white transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-lift active:translate-y-0 sm:w-auto sm:px-3.5"
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
