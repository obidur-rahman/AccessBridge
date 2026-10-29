"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { LANG_COOKIE, t } from "@/lib/i18n/core";
import type { Lang } from "@/lib/types";

function hasLangCookie(): boolean {
  return document.cookie.split("; ").some((part) => part.startsWith(`${LANG_COOKIE}=`));
}

const subscribe = () => () => {};
const readStoredChoice = () => hasLangCookie();
const readServerChoice = () => true;

/**
 * Asks for the preferred language once, before a choice is stored. Nothing is
 * sent to the server; the answer stays in the same language cookie the header
 * switch uses. The cookie is read as an external store, so the server render
 * never shows the dialog and hydration stays consistent.
 */
export function LanguagePrompt({ lang }: { lang: Lang }) {
  const router = useRouter();
  const stored = useSyncExternalStore(subscribe, readStoredChoice, readServerChoice);
  const [dismissed, setDismissed] = useState(false);
  const firstButton = useRef<HTMLButtonElement>(null);

  const open = !stored && !dismissed;

  useEffect(() => {
    if (open) firstButton.current?.focus();
  }, [open]);

  function choose(next: Lang): void {
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    setDismissed(true);
    if (next !== lang) router.refresh();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/45 px-4"
      onKeyDown={(event) => {
        if (event.key === "Escape") setDismissed(true);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lang-prompt-title"
        className="w-full max-w-md border border-line bg-surface p-6 shadow-lift sm:p-7"
      >
        <h2 id="lang-prompt-title" className="text-[1.35rem] font-semibold leading-snug">
          <span lang="en">{t(lang, "lang.promptEn")}</span>
          <span className="mt-1 block text-ink-faint" lang="bn">
            {t(lang, "lang.promptBn")}
          </span>
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{t(lang, "lang.promptHelp")}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            ref={firstButton}
            type="button"
            lang="en"
            onClick={() => choose("en")}
            className="btn btn-primary w-full"
          >
            {t(lang, "nav.english")}
          </button>
          <button
            type="button"
            lang="bn"
            onClick={() => choose("bn")}
            className="btn btn-secondary w-full"
          >
            {t(lang, "nav.bangla")}
          </button>
        </div>
      </div>
    </div>
  );
}
