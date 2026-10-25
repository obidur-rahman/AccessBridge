import { LANG_COOKIE } from "@/lib/i18n/core";
import type { Lang } from "@/lib/types";

/** Store the selected interface language. No search or location data is written. */
export function persistLang(lang: Lang): void {
  if (typeof document === "undefined") return;
  document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
}
