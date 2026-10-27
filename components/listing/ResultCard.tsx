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
        className="lift group block rounded-card border border-line bg-surface p-4 sm:p-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="tag flex items-center gap-2 text-ink-faint">
              <span className="tabular">{String(index).padStart(2, "0")}</span>
              <span aria-hidden="true" className="h-px w-3 bg-line-strong" />
              <span>
                {t(lang, `category.${listing.category}`)}
                {listing.area_name ? ` · ${listing.area_name}` : ""}
              </span>
            </p>
            <h3 className="mt-1.5 text-[1.2rem] font-semibold leading-snug tracking-[-0.015em] sm:text-[1.3rem]">
              {name}
            </h3>
          </div>

          <span
            aria-hidden="true"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-control border border-line text-ink-faint transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        {listing.highlights.length > 0 ? (
          <dl className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
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
        ) : null}

        <p className="mt-4 border-t border-line pt-3 text-xs text-ink-faint">
          {checkedDate ? (
            <>
              {t(lang, "place.lastChecked")} ·{" "}
              <span className="tabular text-ink-soft">{checkedDate}</span>
            </>
          ) : (
            t(lang, "place.noObservation")
          )}
        </p>
      </Link>
    </li>
  );
}
