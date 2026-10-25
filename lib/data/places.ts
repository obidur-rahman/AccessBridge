import { isFeatureState } from "@/lib/access-features";
import { DEMO_LISTINGS, demoFeaturesFor, demoReports } from "@/lib/data/demo";
import { SOURCE_LABEL_REVIEWED } from "@/lib/data/reports";
import { isDemoMode } from "@/lib/demo-mode";
import { displayName, type SearchableListing } from "@/lib/search";
import { isSourceType } from "@/lib/source-labels";
import { createSupabaseServer } from "@/lib/supabase/server";
import {
  CATEGORIES,
  type Category,
  type CurrentFeature,
  type FeatureState,
  type Listing,
  type PlaceDetail,
} from "@/lib/types";

export type DirectoryResult =
  | { ok: true; listings: SearchableListing[]; isDemo: boolean }
  | { ok: false };

export type PlaceResult =
  | { ok: true; place: PlaceDetail; isDemo: boolean }
  | { ok: true; place: null }
  | { ok: false };

function toCategory(value: unknown): Category {
  return typeof value === "string" && (CATEGORIES as string[]).includes(value)
    ? (value as Category)
    : "accessibility";
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toText(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function toListing(row: Record<string, unknown>): Listing {
  const precision = row.location_precision;
  return {
    id: String(row.id),
    name_en: toText(row.name_en),
    name_bn: toText(row.name_bn),
    category: toCategory(row.category),
    place_type: toText(row.place_type),
    summary_en: toText(row.summary_en),
    summary_bn: toText(row.summary_bn),
    address_en: toText(row.address_en),
    address_bn: toText(row.address_bn),
    area_name: toText(row.area_name),
    phone_public: toText(row.phone_public),
    email_public: toText(row.email_public),
    website_url: toText(row.website_url),
    latitude: toNumber(row.latitude),
    longitude: toNumber(row.longitude),
    location_precision:
      precision === "verified" || precision === "approximate" ? precision : "unknown",
    source_label: toText(row.source_label),
    source_checked_at: toText(row.source_checked_at),
  };
}

function toFeature(row: Record<string, unknown>): CurrentFeature | null {
  const state = row.state;
  const sourceType = row.source_type;
  if (!isFeatureState(state)) return null;

  return {
    feature_key: String(row.feature_key),
    state,
    observed_at: String(row.observed_at ?? "").slice(0, 10),
    source_type: isSourceType(sourceType) ? sourceType : "other",
    source_label: toText(row.source_label),
    source_url: toText(row.source_url),
    notes_public: toText(row.notes_public),
    submitted_at: String(row.submitted_at ?? ""),
  };
}

/** The two features shown on a result card, when they have a real result. */
const HIGHLIGHT_KEYS = ["step_free_entrance", "accessible_toilet"];

function toHighlights(features: CurrentFeature[]) {
  return features
    .filter((feature) => HIGHLIGHT_KEYS.includes(feature.feature_key))
    .map((feature) => ({ feature_key: feature.feature_key, state: feature.state }));
}

/** A feature counts as known when a reviewer accepted a yes, no, or partial. */
function toCheckedFeatures(features: CurrentFeature[]): string[] {
  return features
    .filter(
      (feature) =>
        feature.state === "yes" || feature.state === "no" || feature.state === "partial",
    )
    .map((feature) => feature.feature_key);
}

/**
 * Demo only: an accepted report replaces the seeded demo feature, so the
 * pending → accepted → public path can be followed without a database. In the
 * real schema the public views do this work.
 */
function demoFeatures(listingId: string): CurrentFeature[] {
  const features = [...demoFeaturesFor(listingId)];
  const positions = new Map(features.map((feature, index) => [feature.feature_key, index]));

  for (const report of demoReports()) {
    if (report.listing_id !== listingId || report.review_status !== "accepted") continue;

    for (const [key, state] of Object.entries(report.feature_states)) {
      if (!state) continue;

      const row: CurrentFeature = {
        feature_key: key,
        state,
        observed_at: report.observed_at,
        source_type: "community_report",
        source_label: SOURCE_LABEL_REVIEWED,
        source_url: report.source_url,
        notes_public: report.notes_public,
        submitted_at: report.submitted_at,
      };

      const position = positions.get(key);
      if (position === undefined) {
        positions.set(key, features.length);
        features.push(row);
      } else {
        features[position] = row;
      }
    }
  }

  return features;
}

function demoDirectory(): SearchableListing[] {
  return DEMO_LISTINGS.filter(
    (listing) => (listing.publication_status ?? "published") === "published",
  ).map((listing) => {
    const features = demoFeatures(listing.id);
    return {
      id: listing.id,
      name_en: listing.name_en,
      name_bn: listing.name_bn,
      category: listing.category,
      place_type: listing.place_type,
      summary_en: listing.summary_en,
      summary_bn: listing.summary_bn,
      area_name: listing.area_name,
      has_observation: features.length > 0,
      last_checked: features.reduce<string | null>(
        (latest, feature) =>
          !latest || feature.observed_at > latest ? feature.observed_at : latest,
        null,
      ),
      highlights: toHighlights(features),
      checked_features: toCheckedFeatures(features),
    };
  });
}

/** Everything the search page needs: published places only. */
export async function getDirectory(): Promise<DirectoryResult> {
  if (isDemoMode()) {
    return { ok: true, listings: demoDirectory(), isDemo: true };
  }

  const supabase = await createSupabaseServer();
  if (!supabase) {
    return { ok: true, listings: demoDirectory(), isDemo: true };
  }

  const [listingsResponse, featuresResponse] = await Promise.all([
    supabase.from("public_listings").select("*"),
    supabase.from("public_current_features").select("listing_id, feature_key, state, observed_at"),
  ]);

  if (listingsResponse.error || featuresResponse.error) {
    return { ok: false };
  }

  const lastChecked = new Map<string, string>();
  const highlights = new Map<string, { feature_key: string; state: FeatureState }[]>();
  const checked = new Map<string, string[]>();

  for (const row of (featuresResponse.data ?? []) as Record<string, unknown>[]) {
    const listingId = String(row.listing_id);
    const observedAt = String(row.observed_at ?? "").slice(0, 10);
    const current = lastChecked.get(listingId);
    if (observedAt && (!current || observedAt > current)) {
      lastChecked.set(listingId, observedAt);
    }

    const featureKey = String(row.feature_key);
    if (isFeatureState(row.state)) {
      if (row.state === "yes" || row.state === "no" || row.state === "partial") {
        const known = checked.get(listingId) ?? [];
        known.push(featureKey);
        checked.set(listingId, known);
      }

      if (HIGHLIGHT_KEYS.includes(featureKey)) {
        const list = highlights.get(listingId) ?? [];
        list.push({ feature_key: featureKey, state: row.state });
        highlights.set(listingId, list);
      }
    }
  }

  const listings = ((listingsResponse.data ?? []) as Record<string, unknown>[]).map((row) => {
    const listing = toListing(row);
    return {
      id: listing.id,
      name_en: listing.name_en,
      name_bn: listing.name_bn,
      category: listing.category,
      place_type: listing.place_type,
      summary_en: listing.summary_en,
      summary_bn: listing.summary_bn,
      area_name: listing.area_name,
      has_observation: lastChecked.has(listing.id),
      last_checked: lastChecked.get(listing.id) ?? null,
      highlights: highlights.get(listing.id) ?? [],
      checked_features: checked.get(listing.id) ?? [],
    } satisfies SearchableListing;
  });

  return { ok: true, listings, isDemo: false };
}

/** One place with its current accepted feature observations. */
export async function getPlace(id: string): Promise<PlaceResult> {
  const supabase = await createSupabaseServer();

  if (isDemoMode() || !supabase) {
    const listing = DEMO_LISTINGS.find((item) => item.id === id);
    if (!listing || (listing.publication_status ?? "published") !== "published") {
      return { ok: true, place: null };
    }
    return {
      ok: true,
      isDemo: true,
      place: { listing, features: demoFeatures(id), isDemo: true },
    };
  }

  const [listingResponse, featuresResponse] = await Promise.all([
    supabase.from("public_listings").select("*").eq("id", id).maybeSingle(),
    supabase.from("public_current_features").select("*").eq("listing_id", id),
  ]);

  if (listingResponse.error || featuresResponse.error) {
    return { ok: false };
  }

  if (!listingResponse.data) {
    return { ok: true, place: null };
  }

  const features = ((featuresResponse.data ?? []) as Record<string, unknown>[])
    .map(toFeature)
    .filter((feature): feature is CurrentFeature => feature !== null);

  return {
    ok: true,
    isDemo: false,
    place: {
      listing: toListing(listingResponse.data as Record<string, unknown>),
      features,
      isDemo: false,
    },
  };
}

/** Place options for the report form. Published places only. */
export async function getReportPlaceOptions(): Promise<
  { id: string; label: string }[]
> {
  const directory = await getDirectory();
  if (!directory.ok) return [];
  return directory.listings.map((listing) => ({
    id: listing.id,
    label: displayName(listing, "en"),
  }));
}
