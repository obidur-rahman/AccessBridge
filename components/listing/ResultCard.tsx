import Link from "next/link";
import { FEATURE_KEYS } from "@/lib/access-features";
import { formatDate, t } from "@/lib/i18n/core";
import { displayName, type SearchableListing } from "@/lib/search";
import type { Lang } from "@/lib/types";

export function ResultCard({
  listing,
  lang,
  selected = false,
  compact = false,
  onSelect,
}: {
  listing: SearchableListing;
  lang: Lang;
  selected?: boolean;
  /** A narrower card for the split view list. */
  compact?: boolean;
  /** Set only in the desktop split view; without it the card navigates. */
  onSelect?: (id: string) => void;
}) {
  const name = displayName(listing, lang);
  const checked = listing.last_checked ? formatDate(listing.last_checked, lang) : null;

  return (
    <li>
      <Link
        href={`/places/${listing.id}`}
        aria-current={selected ? "true" : undefined}
        onClick={
          onSelect
            ? (event) => {
                event.preventDefault();
                onSelect(listing.id);
              }
            : undefined
        }
        className={`card card-hover group block p-4 sm:p-5 ${
          compact ? "lg:p-3.5" : ""
        } ${selected ? "result-selected" : ""}`}
      >
        <p className="flex flex-wrap items-center gap-x-1.5 text-xs text-ink-faint">
          <span>{t(lang, `category.${listing.category}`)}</span>
          {listing.area_name ? (
            <>
              <span aria-hidden="true">·</span>
              <span>{listing.area_name}</span>
            </>
          ) : null}
        </p>

        <h2
          className={`mt-1 font-display font-medium leading-snug tracking-[-0.01em] transition-colors group-hover:text-accent-ink ${
            compact ? "text-[1.05rem]" : "text-[1.2rem] sm:text-[1.3rem]"
          }`}
        >
          {name}
        </h2>

        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
          {listing.checked_features.length > 0
            ? t(lang, "place.featuresChecked", {
                count: listing.checked_features.length,
                total: FEATURE_KEYS.length,
              })
            : t(lang, "place.noObservation")}
        </p>

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-2.5 text-xs">
          <span className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-ink-faint">{t(lang, "place.lastChecked")}</span>
            <span className="tabular text-ink-soft">{checked ?? "—"}</span>
          </span>
          <span
            aria-hidden="true"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line-strong text-ink-faint transition-[transform,background-color,color,border-color] duration-200 group-hover:translate-x-0.5 group-hover:border-accent group-hover:bg-accent group-hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path
                d="M7 17 17 7M9 7h8v8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </Link>
    </li>
  );
}
