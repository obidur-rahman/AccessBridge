import Link from "next/link";
import { StateBadge } from "@/components/accessibility/StateBadge";
import { featureLabel } from "@/lib/access-features";
import { formatDate, t } from "@/lib/i18n/core";
import { displayName, type SearchableListing } from "@/lib/search";
import type { Lang } from "@/lib/types";

export function ResultCard({
  listing,
  lang,
  index,
}: {
  listing: SearchableListing;
  lang: Lang;
  index: number;
}) {
  const name = displayName(listing, lang);
  const checkedDate = listing.last_checked ? formatDate(listing.last_checked, lang) : null;

  return (
    <li>
      <Link
        href={`/places/${listing.id}`}
        className="lift group block bg-surface px-4 py-5 sm:grid sm:grid-cols-[minmax(12rem,0.85fr)_minmax(0,1.4fr)_auto] sm:items-start sm:gap-6 sm:px-6 sm:py-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="tag flex items-center gap-2 text-ink-faint">
              <span className="tabular">{String(index).padStart(2, "0")}</span>
              <span aria-hidden="true" className="h-px w-3 bg-line-strong" />
              <span>{t(lang, `category.${listing.category}`)}</span>
            </p>
            <h3 className="mt-2 text-[1.25rem] font-semibold leading-snug tracking-[-0.02em] sm:text-[1.4rem]">
              {name}
            </h3>
          </div>

          <span
            aria-hidden="true"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-control border border-line text-ink-faint transition-[transform,background-color,color,border-color] duration-200 group-hover:translate-x-1 group-hover:border-accent group-hover:bg-accent group-hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        <div className="mt-3 flex min-w-0 flex-col gap-1 sm:mt-0">
          {listing.area_name ? <p className="text-sm text-ink-soft">{listing.area_name}</p> : null}
          {listing.highlights.length > 0 ? (
            <dl className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:mt-1">
              {listing.highlights.map((highlight) => (
                <div key={highlight.feature_key} className="flex items-center gap-2">
                  <dt className="text-[0.8125rem] text-ink-soft">
                    {featureLabel(highlight.feature_key, lang)}
                  </dt>
                  <dd>
                    <StateBadge state={highlight.state} lang={lang} />
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-sm text-ink-faint">{t(lang, "place.noObservation")}</p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 border-t border-line pt-3 text-xs text-ink-faint sm:mt-0 sm:border-0 sm:pt-0 sm:text-right">
          <span className="min-w-0">{checkedDate ? t(lang, "place.lastChecked") : t(lang, "place.noObservation")}</span>
          {checkedDate ? <span className="tabular shrink-0 text-ink-soft">{checkedDate}</span> : null}
        </div>

      </Link>
    </li>
  );
}
