import { cookies } from "next/headers";
import { LANG_COOKIE, isLang } from "@/lib/i18n/core";
import type { Lang } from "@/lib/types";

/** Read the selected interface language from the cookie. Defaults to English. */
export async function getLang(): Promise<Lang> {
  const store = await cookies();
  const value = store.get(LANG_COOKIE)?.value;
  return isLang(value) ? value : "en";
}
