"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LANG_COOKIE, t } from "@/lib/i18n/core";
import type { Lang } from "@/lib/types";

const OPTIONS: { value: Lang; labelKey: "nav.english" | "nav.bangla" }[] = [
  { value: "en", labelKey: "nav.english" },
  { value: "bn", labelKey: "nav.bangla" },
];

/** Store the selected interface language. No search or location data is written. */
function persistLang(lang: Lang): void {
  document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
}

export function LanguageSwitch({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function select(next: Lang) {
    if (next === lang) return;
    persistLang(next);
    startTransition(() => router.refresh());
  }

  return (
    <div
      className="flex items-center gap-0.5 rounded-control border border-line bg-surface-muted p-1"
      role="group"
      aria-label={t(lang, "nav.language")}
      aria-busy={isPending}
    >
      {OPTIONS.map((option) => {
        const active = option.value === lang;
        return (
          <button
            key={option.value}
            type="button"
            lang={option.value}
            aria-pressed={active}
            onClick={() => select(option.value)}
            aria-label={t(lang, option.labelKey)}
            className={`min-h-8 rounded-[2px] px-1.5 py-1 text-[0.8125rem] font-medium transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-px sm:px-2.5 ${
              active
                ? "bg-surface text-ink shadow-soft"
                : "text-ink-faint hover:bg-surface hover:text-ink hover:shadow-soft"
            }`}
          >
            <span className="sm:hidden">{option.value === "en" ? "EN" : "বাংলা"}</span>
            <span className="hidden sm:inline">{t(lang, option.labelKey)}</span>
            {active ? <span className="sr-only"> (selected)</span> : null}
          </button>
        );
      })}
    </div>
  );
}
