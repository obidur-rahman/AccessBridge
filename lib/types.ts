// Shared domain types. The vocabulary here must match the database exactly.

export type Lang = "en" | "bn";

export type Category =
  | "benefits"
  | "government"
  | "health"
  | "accessibility"
  | "transport"
  | "ngo";

export const CATEGORIES: Category[] = [
  "benefits",
  "government",
  "health",
  "accessibility",
  "transport",
  "ngo",
];

/**
 * Feature states. `not_checked` is not a negative result and must never be
 * rendered as `no`, and `no` must never be inferred from a blank field.
 */
export type FeatureState =
  | "yes"
  | "no"
  | "partial"
  | "not_checked"
  | "not_applicable";

export type SourceType =
  | "official_source"
  | "organisation_source"
  | "reviewer_observation"
  | "community_report"
  | "other";

export type ReviewStatus = "pending" | "accepted" | "rejected" | "needs_more_info";

export type PublicationStatus = "draft" | "published" | "archived";

export type IngestionMethod =
  | "manual_research"
  | "structured_import"
  | "user_submission";

export interface Listing {
  id: string;
  name_en: string | null;
  name_bn: string | null;
  category: Category;
  place_type: string | null;
  summary_en: string | null;
  summary_bn: string | null;
  address_en: string | null;
  address_bn: string | null;
  area_name: string | null;
  phone_public: string | null;
  email_public: string | null;
  website_url: string | null;
  latitude: number | null;
  longitude: number | null;
  location_precision: "verified" | "approximate" | "unknown";
  source_label: string | null;
  source_checked_at: string | null;
  /** Missing on seeded demo rows, which are all published. */
  publication_status?: PublicationStatus;
}

/** A single accepted observation for one feature, as shown to the public. */
export interface CurrentFeature {
  feature_key: string;
  state: FeatureState;
  observed_at: string;
  source_type: SourceType;
  source_label: string | null;
  source_url: string | null;
  notes_public: string | null;
  submitted_at: string;
}

export interface PlaceDetail {
  listing: Listing;
  features: CurrentFeature[];
  isDemo: boolean;
}

/** A pending or decided report, visible to reviewers only. */
export interface ReviewItem {
  id: string;
  listing_id: string | null;
  listing_name: string | null;
  listing_category: Category | null;
  listing_address: string | null;
  /** True when the report proposes a place that is not published yet. */
  is_new_place: boolean;
  feature_states: Partial<Record<string, FeatureState>>;
  notes_public: string | null;
  observed_at: string;
  source_type: SourceType;
  source_url: string | null;
  review_status: ReviewStatus;
  review_reason: string | null;
  submitted_at: string;
  public_receipt_token: string | null;
  /** Reviewer-only. Never part of a public response. */
  contact_private: string | null;
}
