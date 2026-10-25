import { DICTIONARIES, type TranslationKey } from "@/lib/i18n/dictionary";
import type { Lang } from "@/lib/types";

export type { TranslationKey };

export const LANGS: Lang[] = ["en", "bn"];

export const LANG_COOKIE = "ab_lang";

export function isLang(value: unknown): value is Lang {
  return value === "en" || value === "bn";
}

/**
 * Translate a key. Placeholders use `{{name}}` syntax.
 * Falls back to English, then to the key itself, so a missing translation shows
 * a readable label instead of an empty string.
 */
export function t(
  lang: Lang,
  key: TranslationKey,
  vars?: Record<string, string | number>,
): string {
  const dictionary = DICTIONARIES[lang] ?? DICTIONARIES.en;
  let text: string = (dictionary as Record<string, string>)[key] ?? DICTIONARIES.en[key] ?? key;

  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{{${name}}}`, String(value));
    }
  }

  return text;
}

const EN_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const BN_MONTHS = [
  "জানু",
  "ফেব",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্ট",
  "অক্টো",
  "নভে",
  "ডিসে",
];

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBengaliDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (digit) => BN_DIGITS[Number(digit)]);
}

/**
 * Format an ISO date or timestamp without relying on the runtime timezone or
 * ICU data. Server and client therefore render identical text.
 */
export function formatDate(iso: string | null | undefined, lang: Lang): string {
  if (!iso) return "";
  const raw = iso.slice(0, 10);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (!match) return raw;

  const [, year, month, day] = match;
  const monthIndex = Number(month) - 1;
  const dayNumber = Number(day);

  if (lang === "bn") {
    const monthName = BN_MONTHS[monthIndex] ?? month;
    return `${toBengaliDigits(dayNumber)} ${monthName} ${toBengaliDigits(year)}`;
  }

  return `${dayNumber} ${EN_MONTHS[monthIndex] ?? month} ${year}`;
}

/** Today's date as `YYYY-MM-DD` in the visitor's local timezone. */
export function todayIso(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}
