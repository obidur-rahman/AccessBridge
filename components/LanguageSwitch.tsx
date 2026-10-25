"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { persistLang } from "@/lib/i18n/client";
import { t } from "@/lib/i18n/core";
import type { Lang } from "@/lib/types";

const OPTIONS: { value: Lang; labelKey: "nav.english" | "nav.bangla" }[] = [
  { value: "en", labelKey: "nav.english" },
  { value: "bn", labelKey: "nav.bangla" },
];

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
      className="flex items-center gap-0.5 rounded-full bg-surface-muted p-1"
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
            className={`min-h-8 rounded-full px-2.5 py-1 text-[0.8125rem] font-medium transition-colors ${
              active
                ? "bg-surface text-ink shadow-soft"
                : "text-ink-faint hover:text-ink"
            }`}
          >
            {t(lang, option.labelKey)}
            {active ? <span className="sr-only"> — selected</span> : null}
          </button>
        );
      })}
    </div>
  );
}
