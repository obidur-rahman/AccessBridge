import Link from "next/link";
import { t, toBengaliDigits } from "@/lib/i18n/core";
import { displayName, type SearchableListing } from "@/lib/search";
import type { Lang } from "@/lib/types";

/** The five features the coverage board tracks. */
export const BOARD_FEATURES = [
  "step_free_entrance",
  "ramp",
  "lift",
  "accessible_toilet",
  "accessible_parking",
] as const;

function figure(value: number, lang: Lang): string {
  return lang === "bn" ? toBengaliDigits(value) : String(value);
}

/**
 * How much of a place has actually been reviewed. The bar is the count, so the
 * graphic and the fraction always agree.
 */
export function CoverageBoard({
  listings,
  lang,
}: {
  listings: SearchableListing[];
  lang: Lang;
}) {
  const rows = listings.slice(0, 4);
  const total = BOARD_FEATURES.length;

  return (
    <section aria-labelledby="board-title" className="card card-pad min-w-0">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="board-title" className="text-base font-semibold">
          {t(lang, "home.boardTitle")}
        </h2>
        <span className="tag text-ink-faint">{t(lang, "home.boardTitleNote")}</span>
      </div>

      <ul className="mt-5 list-none space-y-4">
        {rows.map((listing) => {
          const known = BOARD_FEATURES.filter((key) =>
            listing.checked_features.includes(key),
          ).length;
          const percent = Math.round((known / total) * 100);
          const name = displayName(listing, lang);

          return (
            <li key={listing.id}>
              <Link
                href={`/places/${listing.id}`}
                className="group -mx-2 block rounded-lg px-2 py-1 transition-colors hover:bg-surface-muted"
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0 truncate text-sm font-medium text-ink group-hover:text-accent-ink">
                    {name}
                  </span>
                  <span
                    className={`tabular shrink-0 text-xs ${
                      known > 0 ? "text-ink-soft" : "text-ink-faint"
                    }`}
                  >
                    {`${figure(known, lang)}/${figure(total, lang)}`}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="coverage-track mt-2 block"
                >
                  <span
                    className="coverage-fill block"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: known > 0 ? undefined : "transparent",
                    }}
                  />
                </span>
                <span className="sr-only">
                  {known > 0
                    ? t(lang, "home.boardRow", {
                        known: figure(known, lang),
                        total: figure(total, lang),
                      })
                    : t(lang, "home.boardEmpty")}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-ink-faint">
        {t(lang, "home.boardNote")}
      </p>
    </section>
  );
}
