"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { FEATURE_KEYS } from "@/lib/access-features";
import { t } from "@/lib/i18n/core";
import { displayName, filterListings, type SearchableListing } from "@/lib/search";
import { CATEGORIES, type Category, type Lang } from "@/lib/types";

const MAX_RESULTS = 5;

/**
 * Search on the home screen. Filtering happens in the browser; the term is
 * never sent to the server.
 */
export function QuickFind({
  listings,
  lang,
}: {
  listings: SearchableListing[];
  lang: Lang;
}) {
  const uid = useId();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");

  const results = useMemo(
    () => filterListings(listings, { query, category, area: "all", lang }),
    [listings, query, category, lang],
  );

  const active = query.trim() !== "" || category !== "all";
  const shown = results.slice(0, MAX_RESULTS);
  const countLabel =
    results.length === 1
      ? t(lang, "home.resultsCountOne")
      : t(lang, "home.resultsCount", { count: results.length });

  return (
    <div className="relative">
      <div className="card search-shell p-1.5">
        <div className="flex items-center gap-2 rounded-[0.625rem] px-2">
          <span aria-hidden="true" className="text-ink-faint">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          <label htmlFor={`${uid}-input`} className="sr-only">
            {t(lang, "home.searchLabel")}
          </label>
          <input
            id={`${uid}-input`}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t(lang, "home.searchPlaceholder")}
            aria-describedby={`${uid}-help`}
            autoComplete="off"
            className="h-12 w-full min-w-0 rounded-[0.5rem] bg-transparent text-base text-ink placeholder:text-ink-faint focus-visible:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={t(lang, "home.reset")}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-faint transition-colors hover:bg-surface-muted hover:text-ink"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          ) : null}
        </div>

        <div
          className="mt-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible"
          role="group"
          aria-label={t(lang, "home.category")}
        >
          {(["all", ...CATEGORIES] as const).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
              className="chip"
            >
              {item === "all" ? t(lang, "home.allCategories") : t(lang, `category.${item}`)}
            </button>
          ))}
        </div>
      </div>

      <p id={`${uid}-help`} className="sr-only">
        {t(lang, "home.searchHelp")}
      </p>
      <p role="status" aria-live="polite" className="sr-only">
        {active ? countLabel : ""}
      </p>

      {active ? (
        <div className="pop-in mt-2 overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-lift">
          {shown.length > 0 ? (
            <ul className="divide-y divide-line">
              {shown.map((listing) => {
                const name = displayName(listing, lang);
                return (
                  <li key={listing.id}>
                    <Link
                      href={`/places/${listing.id}`}
                      className="group flex items-center gap-3 px-3.5 py-3 transition-colors hover:bg-surface-sunk"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-ink group-hover:text-accent-ink">
                          {name}
                        </span>
                        <span className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-ink-faint">
                          <span>{t(lang, `category.${listing.category}`)}</span>
                          {listing.area_name ? (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{listing.area_name}</span>
                            </>
                          ) : null}
                        </span>
                      </span>

                      <span className="hidden shrink-0 text-xs text-ink-faint sm:block">
                        {listing.checked_features.length > 0
                          ? t(lang, "place.featuresChecked", {
                              count: listing.checked_features.length,
                              total: FEATURE_KEYS.length,
                            })
                          : t(lang, "place.noObservation")}
                      </span>

                      <span aria-hidden="true" className="shrink-0 text-ink-faint">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                          <path
                            d="M5 12h14M13 6l6 6-6 6"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-3.5 py-4 text-sm text-ink-soft">{t(lang, "home.noResults")}</p>
          )}

          {results.length > MAX_RESULTS ? (
            <Link
              href="/directory"
              className="flex items-center justify-between border-t border-line px-3.5 py-2.5 text-xs font-bold text-accent-ink hover:bg-surface-sunk"
            >
              {t(lang, "home.openDirectory")}
              <span aria-hidden="true">→</span>
            </Link>
          ) : null}
        </div>
      ) : (
        <p className="mt-2 text-xs leading-relaxed text-ink-faint">{t(lang, "home.searchHelp")}</p>
      )}
    </div>
  );
}
