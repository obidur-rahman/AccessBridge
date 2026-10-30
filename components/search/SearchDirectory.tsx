"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";
import { PlacePanel } from "@/components/directory/PlacePanel";
import { ResultCard } from "@/components/listing/ResultCard";
import { t } from "@/lib/i18n/core";
import { areasOf, filterListings, type SearchableListing } from "@/lib/search";
import { CATEGORIES, type Category, type Lang } from "@/lib/types";

/** True at 1024px and above, where the list and the place share the screen. */
function useSplitView(): boolean {
  const [split, setSplit] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setSplit(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return split;
}

export function SearchDirectory({
  listings,
  lang,
}: {
  listings: SearchableListing[];
  lang: Lang;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [area, setArea] = useState<string>("all");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const split = useSplitView();
  const requested = useSearchParams().get("place");

  const uid = useId();
  const areas = useMemo(() => areasOf(listings), [listings]);
  const results = useMemo(
    () => filterListings(listings, { query, category, area, lang }),
    [listings, query, category, area, lang],
  );

  // A shared link can name the open place. Only the id is read, never the search
  // terms or filters.
  const selectedId =
    picked ??
    (requested && listings.some((listing) => listing.id === requested) ? requested : null);

  function select(id: string): void {
    setPicked(id);
    // Only the place id is written to the address, never the search terms.
    const url = new URL(window.location.href);
    url.searchParams.set("place", id);
    window.history.replaceState(null, "", url);
  }

  const filtersActive = query !== "" || category !== "all" || area !== "all";
  const countLabel =
    results.length === 1
      ? t(lang, "home.resultsCountOne")
      : t(lang, "home.resultsCount", { count: results.length });

  return (
    <section id="directory" aria-label={t(lang, "home.resultsTitle")} className="scroll-mt-24">
      <div className="card search-shell p-2">
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
          className="mt-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-expanded={showMoreFilters}
            aria-controls={`${uid}-more`}
            onClick={() => setShowMoreFilters((open) => !open)}
            className="chip"
          >
            {t(lang, "home.area")}
            <span aria-hidden="true" className="ml-1">
              {showMoreFilters ? "−" : "+"}
            </span>
          </button>
          <p role="status" aria-live="polite" className="text-xs text-ink-faint">
            {countLabel}
          </p>
        </div>

        {filtersActive ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
              setArea("all");
            }}
            className="text-xs text-ink-soft underline decoration-line-strong underline-offset-4 hover:text-ink"
          >
            {t(lang, "home.reset")}
          </button>
        ) : null}
      </div>

      {showMoreFilters ? (
        <div id={`${uid}-more`} className="pop-in mt-3 max-w-xs">
          <label htmlFor={`${uid}-area`} className="tag mb-1.5 block text-ink-faint">
            {t(lang, "home.area")}
          </label>
          <select
            id={`${uid}-area`}
            value={area}
            onChange={(event) => setArea(event.target.value)}
            className="field"
          >
            <option value="all">{t(lang, "home.allAreas")}</option>
            {areas.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <p id={`${uid}-help`} className="sr-only">
        {t(lang, "home.searchHelp")}
      </p>

      <div
        className={
          split && selectedId
            ? "mt-4 grid items-start gap-4 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)]"
            : "mt-4"
        }
      >
        <div className="min-w-0">
          {results.length === 0 ? (
            <div className="card p-5">
              <p className="font-display text-xl">{t(lang, "home.noResults")}</p>
              <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-ink-soft">
                {t(lang, "home.noResultsHelp")}
              </p>
              <Link href="/report" className="btn btn-secondary mt-4">
                {t(lang, "home.suggestPlace")}
              </Link>
            </div>
          ) : (
            <>
              <ol className="stagger grid list-none gap-2.5">
                {results.map((listing) => (
                  <ResultCard
                    key={listing.id}
                    listing={listing}
                    lang={lang}
                    selected={split && listing.id === selectedId}
                    compact={split && selectedId !== null}
                    onSelect={split ? select : undefined}
                  />
                ))}
              </ol>
              <p className="mt-5 max-w-prose text-xs leading-relaxed text-ink-faint">
                {t(lang, "home.sortNote")}
              </p>
            </>
          )}
        </div>

        {split && selectedId ? (
          <div className="slide-in min-w-0 lg:sticky lg:top-[4.5rem]">
            <PlacePanel key={selectedId} id={selectedId} lang={lang} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
