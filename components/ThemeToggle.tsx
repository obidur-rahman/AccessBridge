"use client";

import { useSyncExternalStore } from "react";
import { t } from "@/lib/i18n/core";
import type { Lang } from "@/lib/types";

const STORAGE_KEY = "ab_theme";

type Theme = "light" | "dark";

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(onChange: () => void): () => void {
  // The inline script in the layout sets the attribute before paint, so the
  // toggle follows the document instead of keeping a second copy of the state.
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  window.addEventListener("storage", onChange);
  return () => {
    observer.disconnect();
    window.removeEventListener("storage", onChange);
  };
}

/** Light is the default. The choice is stored in this browser only. */
export function ThemeToggle({ lang }: { lang: Lang }) {
  const theme = useSyncExternalStore(subscribe, currentTheme, () => "light" as Theme);
  const label =
    theme === "dark" ? t(lang, "theme.switchToLight") : t(lang, "theme.switchToDark");

  function toggle(): void {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // A blocked storage must not block the toggle.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="icon-btn"
      aria-label={label}
      title={label}
      aria-pressed={theme === "dark"}
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" className="h-[1.05rem] w-[1.05rem]" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-[1.05rem] w-[1.05rem]" fill="none" aria-hidden="true">
          <path
            d="M20 14.5A8.5 8.5 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
