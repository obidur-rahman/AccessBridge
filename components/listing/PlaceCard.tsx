import Link from "next/link";
import { FEATURE_KEYS } from "@/lib/access-features";
import { formatDate, t } from "@/lib/i18n/core";
import { displayName, type SearchableListing } from "@/lib/search";
import type { Lang } from "@/lib/types";

export function PlaceCard({ listing, lang }: { listing: SearchableListing; lang: Lang }) {
  const name = displayName(listing, lang);
  const checked = listing.last_checked ? formatDate(listing.last_checked, lang) : null;

  return (
    <Link href={`/places/${listing.id}`} className="card card-hover group flex flex-col p-4">
      <div className="flex items-start justify-between gap-2">
        <span className="tag line-clamp-2 min-h-[2.6em] leading-[1.3] text-ink-faint">
          {t(lang, `category.${listing.category}`)}
        </span>
        <span
          aria-hidden="true"
          className="text-ink-faint transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:text-accent"
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

      <h3 className="mt-2 font-display text-[1.15rem] font-medium leading-snug tracking-[-0.01em] transition-colors group-hover:text-accent-ink">
        {name}
      </h3>
      {listing.area_name ? (
        <p className="mt-0.5 text-xs text-ink-faint">{listing.area_name}</p>
      ) : null}

      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        {listing.checked_features.length > 0
          ? t(lang, "place.featuresChecked", {
              count: listing.checked_features.length,
              total: FEATURE_KEYS.length,
            })
          : t(lang, "place.noObservation")}
      </p>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-2.5 text-xs">
        <span className="text-ink-faint">{t(lang, "place.lastChecked")}</span>
        <span className="tabular text-ink-soft">{checked ?? "—"}</span>
      </div>
    </Link>
  );
}
