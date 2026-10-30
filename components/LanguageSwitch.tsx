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
      className="flex items-center rounded-full bg-surface-muted p-0.5"
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
            className={`min-h-9 rounded-full px-2 text-[0.75rem] transition-[background-color,color,box-shadow] duration-200 sm:px-2.5 ${
              active
                ? "bg-surface text-accent-ink shadow-soft"
                : "text-ink-faint hover:text-ink"
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
