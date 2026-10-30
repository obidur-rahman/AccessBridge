"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { LANG_COOKIE, t } from "@/lib/i18n/core";
import type { Lang } from "@/lib/types";

const THEME_KEY = "ab_theme";

type Theme = "light" | "dark";

function hasLangCookie(): boolean {
  return document.cookie.split("; ").some((part) => part.startsWith(`${LANG_COOKIE}=`));
}

function hasStoredTheme(): boolean {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "light" || value === "dark";
  } catch {
    return false;
  }
}

/** The dialog stays away only when both answers are already on this device. */
function hasBothChoices(): boolean {
  return hasLangCookie() && hasStoredTheme();
}

const subscribe = () => () => {};
const readStoredChoice = hasBothChoices;
const readServerChoice = () => true;

/** The inline layout script has already applied a stored dark choice. */
function readTheme(): Theme {
  return typeof document !== "undefined" && document.documentElement.dataset.theme === "dark"
    ? "dark"
    : "light";
}

/**
 * Asks for a language and a theme once, before either choice is stored.
 * Nothing is sent to the server. The language uses the same cookie as the
 * header switch; the theme uses the same local value as the toggle.
 */
export function WelcomePrompt({ lang }: { lang: Lang }) {
  const router = useRouter();
  const stored = useSyncExternalStore(subscribe, readStoredChoice, readServerChoice);
  const [dismissed, setDismissed] = useState(false);
  const [chosenLang, setChosenLang] = useState<Lang>(lang);
  const [chosenTheme, setChosenTheme] = useState<Theme>(readTheme);
  const firstButton = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const open = !stored && !dismissed;

  useEffect(() => {
    if (!open) return;
    firstButton.current?.focus();

    const panel = dialogRef.current;
    if (!panel) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab" || !panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>("button");
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    panel.addEventListener("keydown", onKeyDown);
    return () => panel.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function applyTheme(next: Theme): void {
    setChosenTheme(next);
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // A blocked storage must not block the choice.
    }
  }

  function start(): void {
    document.cookie = `${LANG_COOKIE}=${chosenLang}; path=/; max-age=31536000; samesite=lax`;
    try {
      localStorage.setItem(THEME_KEY, chosenTheme);
    } catch {
      // A blocked storage must not block the choice.
    }
    setDismissed(true);
    if (chosenLang !== lang) router.refresh();
  }

  if (!open) return null;

  return (
    <div
      className="scrim fixed inset-0 z-50 overflow-y-auto px-4 py-6 backdrop-blur-[3px]"
      onKeyDown={(event) => {
        if (event.key === "Escape") setDismissed(true);
      }}
    >
      <div className="grid min-h-full place-items-center">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-title"
          aria-describedby="welcome-intro"
          className="soft-in w-full max-w-xl rounded-[1.15rem] border border-line bg-surface p-6 shadow-float sm:p-8"
        >
          <Image
            src="/logo.png"
            alt=""
            width={316}
            height={67}
            unoptimized
            className="logo-on-light h-7 w-auto"
          />
          <Image
            src="/logo-on-dark.png"
            alt=""
            width={316}
            height={67}
            unoptimized
            className="logo-on-dark h-7 w-auto"
          />

          <h2 id="welcome-title" className="mt-4 text-[1.55rem] leading-tight sm:text-[1.75rem]">
            {t(lang, "welcome.title")}
          </h2>
          <p id="welcome-intro" className="mt-2 max-w-[46ch] text-sm leading-relaxed text-ink-soft">
            {t(lang, "welcome.intro")}
          </p>

          <fieldset className="mt-6">
            <legend className="tag text-ink-faint">{t(lang, "welcome.language")}</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <button
                ref={firstButton}
                type="button"
                lang="en"
                aria-pressed={chosenLang === "en"}
                onClick={() => setChosenLang("en")}
                className="lang-option"
                data-active={chosenLang === "en"}
              >
                <span className="text-[1.05rem] font-bold text-ink">English</span>
                <span className="text-xs text-ink-faint">English interface</span>
              </button>
              <button
                type="button"
                lang="bn"
                aria-pressed={chosenLang === "bn"}
                onClick={() => setChosenLang("bn")}
                className="lang-option"
                data-active={chosenLang === "bn"}
              >
                <span className="text-[1.05rem] font-bold text-ink">বাংলা</span>
                <span className="text-xs text-ink-faint">বাংলা ইন্টারফেস</span>
              </button>
            </div>
          </fieldset>

          <fieldset className="mt-5">
            <legend className="tag text-ink-faint">{t(lang, "welcome.theme")}</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                aria-pressed={chosenTheme === "light"}
                onClick={() => applyTheme("light")}
                className="lang-option"
                data-active={chosenTheme === "light"}
              >
                <span className="flex items-center gap-2 text-[1.05rem] font-bold text-ink">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
                    <path
                      d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                  {t(lang, "welcome.light")}
                </span>
                <span className="text-xs text-ink-faint">Paper and daylight</span>
              </button>
              <button
                type="button"
                aria-pressed={chosenTheme === "dark"}
                onClick={() => applyTheme("dark")}
                className="lang-option"
                data-active={chosenTheme === "dark"}
              >
                <span className="flex items-center gap-2 text-[1.05rem] font-bold text-ink">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                    <path
                      d="M20 14.5A8.5 8.5 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t(lang, "welcome.dark")}
                </span>
                <span className="text-xs text-ink-faint">Low light</span>
              </button>
            </div>
          </fieldset>

          <button type="button" onClick={start} className="btn btn-primary mt-6 w-full">
            {t(lang, "welcome.start")}
          </button>
        </div>
      </div>
    </div>
  );
}
