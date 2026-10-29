"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { ResultCard } from "@/components/listing/ResultCard";
import { t } from "@/lib/i18n/core";
import { areasOf, filterListings, type SearchableListing } from "@/lib/search";
import { CATEGORIES, type Category, type Lang } from "@/lib/types";

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

  const uid = useId();
  const areas = useMemo(() => areasOf(listings), [listings]);
  const results = useMemo(
    () => filterListings(listings, { query, category, area, lang }),
    [listings, query, category, area, lang],
  );

  const filtersActive = query !== "" || category !== "all" || area !== "all";
  const countLabel =
    results.length === 1
      ? t(lang, "home.resultsCountOne")
      : t(lang, "home.resultsCount", { count: results.length });

  return (
    <section id="directory" aria-label={t(lang, "home.resultsTitle")} className="scroll-mt-24">
      <div className="section-head">
        <div>
          <p role="status" aria-live="polite" className="tabular text-sm text-ink-faint">
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
            className="text-sm text-ink-faint underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink"
          >
            {t(lang, "home.reset")}
          </button>
        ) : null}
      </div>

      <div className="mt-5">
        <label htmlFor={`${uid}-input`} className="sr-only">
          {t(lang, "home.searchLabel")}
        </label>
        <div className="relative">
          <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint">
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none">
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          <input
            id={`${uid}-input`}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t(lang, "home.searchPlaceholder")}
            aria-describedby={`${uid}-help`}
            autoComplete="off"
            className="field h-14 rounded-control pl-11 pr-4 text-base shadow-soft sm:text-[1.0625rem]"
          />
        </div>
        <p id={`${uid}-help`} className="mt-2 px-1 text-xs text-ink-faint">
          {t(lang, "home.searchHelp")}
        </p>
      </div>

      <fieldset className="mt-6">
        <legend className="sr-only">{t(lang, "home.category")}</legend>
        <div className="flex flex-wrap gap-2">
          {(["all", ...CATEGORIES] as const).map((item) => {
            const active = category === item;
            return (
              <label
                key={item}
                className={`flex min-h-11 cursor-pointer items-center rounded-control border px-3.5 py-2 text-sm transition-[background-color,border-color,color,transform,box-shadow] duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
                  active
                    ? "border-accent bg-accent text-white"
                    : "border-line-strong bg-surface text-ink-soft hover:-translate-y-px hover:border-ink-faint hover:text-ink"
                }`}
              >
                <input
                  type="radio"
                  name={`${uid}-category`}
                  value={item}
                  checked={active}
                  onChange={() => setCategory(item)}
                  className="sr-only"
                />
                {item === "all" ? t(lang, "home.allCategories") : t(lang, `category.${item}`)}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-4">
        <button
          type="button"
          aria-expanded={showMoreFilters}
          aria-controls={`${uid}-more`}
          onClick={() => setShowMoreFilters((open) => !open)}            className="inline-flex min-h-11 items-center gap-1.5 rounded-control px-2 text-sm text-ink-soft underline decoration-line-strong underline-offset-4 transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-px hover:bg-surface-muted hover:text-ink hover:shadow-soft"

        >
          {showMoreFilters ? t(lang, "home.fewerFilters") : t(lang, "home.moreFilters")}
          <span aria-hidden="true" className="text-ink-faint">
            {showMoreFilters ? "−" : "+"}
          </span>
        </button>
      </div>

      {showMoreFilters ? (
        <div id={`${uid}-more`} className="mt-3 max-w-xs">
          <label htmlFor={`${uid}-area`} className="tag mb-2 block text-ink-faint">
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

      <div className="mt-8">
        {results.length === 0 ? (
          <div className="card card-pad">
            <p className="text-xl font-semibold">{t(lang, "home.noResults")}</p>
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-soft">
              {t(lang, "home.noResultsHelp")}
            </p>
            <Link href="/report" className="btn btn-secondary mt-5">
              {t(lang, "home.suggestPlace")}
            </Link>
          </div>
        ) : (
          <>
            <ol className="mt-5 list-none divide-y divide-line border-y border-line">
              {results.map((listing, index) => (
                <ResultCard key={listing.id} listing={listing} lang={lang} index={index + 1} />
              ))}
            </ol>
            <p className="mt-5 max-w-prose text-xs leading-relaxed text-ink-faint">
              {t(lang, "home.sortNote")}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
