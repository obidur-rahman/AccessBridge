"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t } from "@/lib/i18n/core";
import type { Lang } from "@/lib/types";

type Tab = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

function Icon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={path}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The app's primary navigation on phones. */
export function AppTabBar({ lang, isReviewer }: { lang: Lang; isReviewer: boolean }) {
  const pathname = usePathname();

  const tabs: Tab[] = [
    {
      href: "/",
      label: t(lang, "nav.home"),
      icon: <Icon path="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z" />,
    },
    {
      href: "/directory",
      label: t(lang, "nav.directory"),
      icon: <Icon path="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm5.5 12.5L21 21" />,
    },
    {
      href: "/report",
      label: t(lang, "nav.reportShort"),
      icon: <Icon path="M12 5v14M5 12h14" />,
    },
    isReviewer
      ? {
          href: "/review",
          label: t(lang, "nav.reviewShort"),
          icon: <Icon path="M4 12.5 9 17.5 20 6.5" />,
        }
      : {
          href: "/login",
          label: t(lang, "nav.account"),
          icon: <Icon path="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" />,
        },
  ];

  return (
    <nav aria-label={t(lang, "nav.menu")} className="tabbar lg:hidden">
      <div className="grid grid-cols-4">
        {tabs.map((tab) => {
          const active =
            pathname === tab.href || (tab.href !== "/" && pathname.startsWith(`${tab.href}/`));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className="tab-item"
            >
              <span className="tab-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
