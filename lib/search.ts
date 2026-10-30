import type { Category, Lang } from "@/lib/types";

/** The public fields the search page needs. No private data is included. */
export interface SearchableListing {
  id: string;
  name_en: string | null;
  name_bn: string | null;
  category: Category;
  place_type: string | null;
  summary_en: string | null;
  summary_bn: string | null;
  area_name: string | null;
  has_observation: boolean;
  last_checked: string | null;
  /** Feature keys with a real reviewed result (yes, no, or partial). */
  checked_features: string[];
}

export function displayName(listing: SearchableListing, lang: Lang): string {
  const preferred = lang === "bn" ? listing.name_bn : listing.name_en;
  return preferred ?? listing.name_en ?? listing.name_bn ?? "";
}

export function normaliseQuery(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

/** True when the query appears in a name, type, summary, or area. */
export function matchesQuery(
  listing: SearchableListing,
  query: string,
  lang: Lang,
): boolean {
  const needle = normaliseQuery(query);
  if (!needle) return true;

  return [
    listing.name_en,
    listing.name_bn,
    listing.place_type,
    listing.summary_en,
    listing.summary_bn,
    listing.area_name,
    displayName(listing, lang),
  ]
    .filter((value): value is string => Boolean(value))
    .some((value) => normaliseQuery(value).includes(needle));
}

export interface SearchFilters {
  query?: string;
  category?: Category | "all";
  area?: string | "all";
  lang?: Lang;
}

/**
 * Filter and order listings. Order is deterministic and is not an accessibility
 * ranking (docs/08 §4): records with an accepted observation come first, then
 * alphabetical by displayed name.
 */
export function filterListings(
  listings: SearchableListing[],
  { query = "", category = "all", area = "all", lang = "en" }: SearchFilters = {},
): SearchableListing[] {
  const filtered = listings.filter((listing) => {
    if (category !== "all" && listing.category !== category) return false;
    if (area !== "all" && listing.area_name !== area) return false;
    return matchesQuery(listing, query, lang);
  });

  return filtered.sort((a, b) => {
    if (a.has_observation !== b.has_observation) return a.has_observation ? -1 : 1;
    return displayName(a, lang).localeCompare(displayName(b, lang), lang);
  });
}

export function areasOf(listings: SearchableListing[]): string[] {
  const areas = new Set<string>();
  for (const listing of listings) {
    if (listing.area_name) areas.add(listing.area_name);
  }
  return [...areas].sort((a, b) => a.localeCompare(b));
}
