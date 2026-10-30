"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { ThemeToggle } from "@/components/ThemeToggle";
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

  const current = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)) ? "page" : undefined;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="sheet pb-1.5 pt-1.5">
        <div className="appbar-inner pointer-events-auto flex h-11 items-center gap-2 rounded-[0.95rem] border border-line px-3 sm:h-12 sm:gap-2.5 sm:px-4">
          <Link
            href="/"
            aria-current={current("/")}
            aria-label={t(lang, "app.name")}
            className="group flex shrink-0 items-center"
          >
            <Image
              src="/logo.png"
              alt=""
              width={316}
              height={67}
              priority
              unoptimized
              className="logo-on-light h-[1.35rem] w-auto transition-opacity duration-200 group-hover:opacity-80 sm:h-6"
            />
            <Image
              src="/logo-on-dark.png"
              alt=""
              width={316}
              height={67}
              priority
              unoptimized
              className="logo-on-dark h-[1.35rem] w-auto transition-opacity duration-200 group-hover:opacity-80 sm:h-6"
            />
          </Link>

          <nav
            aria-label={t(lang, "nav.primary")}
            className="ml-1.5 hidden items-center gap-0.5 lg:flex"
          >
            <Link href="/directory" aria-current={current("/directory")} className="nav-pill">
              {t(lang, "nav.directory")}
            </Link>
            <Link href="/roadmap" aria-current={current("/roadmap")} className="nav-pill">
              {t(lang, "nav.roadmap")}
            </Link>

            {isReviewer ? (
              <>
                <Link href="/review" aria-current={current("/review")} className="nav-pill">
                  {t(lang, "nav.review")}
                </Link>
                {isAdmin ? (
                  <Link href="/admin" aria-current={current("/admin")} className="nav-pill">
                    {t(lang, "nav.admin")}
                  </Link>
                ) : null}
              </>
            ) : (
              <>
                <Link href="/login" aria-current={current("/login")} className="nav-pill">
                  {t(lang, "nav.signIn")}
                </Link>
                <Link
                  href="/signup"
                  aria-current={current("/signup")}
                  className="nav-pill hidden xl:inline-flex"
                >
                  {t(lang, "nav.signUp")}
                </Link>
              </>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
            <ThemeToggle lang={lang} />
            <LanguageSwitch lang={lang} />
            <span aria-hidden="true" className="mx-0.5 hidden h-5 w-px bg-line sm:block" />
            <Link
              href="/report"
              aria-label={t(lang, "nav.report")}
              aria-current={current("/report")}
              className="report-cta ml-0.5 inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-[0.625rem] px-3 text-sm font-bold text-white shadow-soft transition-[filter,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-lift active:translate-y-0 sm:ml-1 sm:h-10"
            >
              <span className="hidden sm:inline">{t(lang, "nav.report")}</span>
              <span aria-hidden="true" className="text-base leading-none">
                +
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
