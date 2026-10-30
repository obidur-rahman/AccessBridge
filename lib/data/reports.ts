import { randomUUID } from "node:crypto";
import { normaliseFeatureStates } from "@/lib/access-features";
import type { Reviewer } from "@/lib/auth";
import {
  demoReports,
  findDemoListing,
  findDemoReport,
  pushDemoListing,
  pushDemoReport,
  recordDemoAudit,
} from "@/lib/data/demo";
import { isDemoMode } from "@/lib/demo-mode";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServer } from "@/lib/supabase/server";
import { SOURCE_LABELS, isSourceType } from "@/lib/source-labels";
import {
  CATEGORIES,
  type Category,
  type FeatureState,
  type Listing,
  type ReviewItem,
  type ReviewStatus,
  type SourceType,
} from "@/lib/types";
import type { ValidatedReport } from "@/lib/validation/report";

/** Public source labels used while a report is pending or after acceptance. */
export const SOURCE_LABEL_PENDING = "Community report, awaiting review";
export const SOURCE_LABEL_REVIEWED = "Community report, reviewed";

export type Decision = "accept" | "reject" | "need_info";

const DECISION_STATUS: Record<Decision, ReviewStatus> = {
  accept: "accepted",
  reject: "rejected",
  need_info: "needs_more_info",
};

export function isDecision(value: unknown): value is Decision {
  return value === "accept" || value === "reject" || value === "need_info";
}

function newReceipt(): string {
  return randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase();
}

function toCategory(value: unknown): Category | null {
  return typeof value === "string" && (CATEGORIES as string[]).includes(value)
    ? (value as Category)
    : null;
}

function toText(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function toFeatureStates(value: unknown): Partial<Record<string, FeatureState>> {
  if (!value || typeof value !== "object") return {};
  const result: Partial<Record<string, FeatureState>> = {};
  for (const [key, state] of Object.entries(value as Record<string, unknown>)) {
    if (
      state === "yes" ||
      state === "no" ||
      state === "partial" ||
      state === "not_checked" ||
      state === "not_applicable"
    ) {
      result[key] = state;
    }
  }
  return result;
}

function embeddedListing(row: Record<string, unknown>) {
  const raw = row.listings;
  if (Array.isArray(raw)) return (raw[0] ?? {}) as Record<string, unknown>;
  return (raw ?? {}) as Record<string, unknown>;
}

function toReviewItem(row: Record<string, unknown>): ReviewItem {
  const listing = embeddedListing(row);
  const publicationStatus = listing.publication_status;
  const sourceType: SourceType = isSourceType(row.source_type)
    ? row.source_type
    : "other";

  return {
    id: String(row.id),
    listing_id: toText(row.listing_id),
    listing_name: toText(listing.name_en) ?? toText(listing.name_bn),
    listing_category: toCategory(listing.category),
    listing_address: toText(listing.address_en) ?? toText(listing.address_bn),
    is_new_place: publicationStatus === "draft",
    feature_states: toFeatureStates(row.feature_states),
    notes_public: toText(row.notes_public),
    observed_at: String(row.observed_at ?? "").slice(0, 10),
    source_type: sourceType,
    source_url: toText(row.source_url),
    review_status: (row.review_status as ReviewStatus) ?? "pending",
    review_reason: toText(row.review_reason),
    submitted_at: String(row.submitted_at ?? ""),
    public_receipt_token: toText(row.public_receipt_token),
    contact_private: toText(row.contact_private),
  };
}

export type SubmitResult =
  | { ok: true; receipt: string }
  | { ok: false; error: "not_configured" | "insert_failed" };

/**
 * Store an anonymous report as pending. This never changes public data.
 * Accepts only a value that already passed `validateReport`.
 */
export async function submitReport(value: ValidatedReport): Promise<SubmitResult> {
  const receipt = newReceipt();

  if (isDemoMode()) {
    // Demo mode mirrors the database: a proposed place is stored as a draft
    // listing and only becomes public when a reviewer accepts the report.
    let listingId = value.listing_id;
    let listing = listingId ? (findDemoListing(listingId) ?? null) : null;

    if (!listingId && value.proposed_place) {
      const draft: Listing = {
        id: randomUUID(),
        name_en: value.proposed_place.name,
        name_bn: null,
        category: value.proposed_place.category,
        place_type: null,
        summary_en: null,
        summary_bn: null,
        address_en: value.proposed_place.address,
        address_bn: null,
        area_name: null,
        phone_public: null,
        email_public: null,
        website_url: null,
        latitude: null,
        longitude: null,
        location_precision: "unknown",
        source_label: SOURCE_LABEL_PENDING,
        source_checked_at: new Date().toISOString(),
        publication_status: "draft",
      };
      pushDemoListing(draft);
      listingId = draft.id;
      listing = draft;
    }

    pushDemoReport({
      id: randomUUID(),
      listing_id: listingId,
      listing_name: listing
        ? (listing.name_en ?? listing.name_bn)
        : (value.proposed_place?.name ?? null),
      listing_category: listing ? listing.category : (value.proposed_place?.category ?? null),
      listing_address: listing
        ? (listing.address_en ?? listing.address_bn)
        : (value.proposed_place?.address ?? null),
      is_new_place: listing ? (listing.publication_status ?? "published") === "draft" : true,
      feature_states: value.feature_states,
      notes_public: value.notes_public,
      observed_at: value.observed_at,
      source_type: "community_report",
      source_url: value.source_url,
      review_status: "pending",
      review_reason: null,
      submitted_at: new Date().toISOString(),
      public_receipt_token: receipt,
      contact_private: value.contact_private,
    });

    return { ok: true, receipt };
  }

  // The service-role client is used when the key exists. Without it, the
  // publishable key is used and the constrained anonymous insert policies apply.
  const admin = createSupabaseAdmin();
  const supabase = admin ?? (await createSupabaseServer());
  if (!supabase) {
    return { ok: false, error: "not_configured" };
  }

  // Client-generated IDs keep the insert independent of read permission, which
  // the publishable key does not have for draft rows.
  const listingId = value.listing_id ?? randomUUID();

  if (!value.listing_id) {
    if (!value.proposed_place) {
      return { ok: false, error: "insert_failed" };
    }

    const { error: listingError } = await supabase.from("listings").insert({
      id: listingId,
      name_en: value.proposed_place.name,
      category: value.proposed_place.category,
      address_en: value.proposed_place.address,
      source_label: SOURCE_LABEL_PENDING,
      source_checked_at: new Date().toISOString(),
      ingestion_method: "user_submission",
      publication_status: "draft",
    });

    if (listingError) {
      return { ok: false, error: "insert_failed" };
    }
  }

  const { error } = await supabase.from("accessibility_observations").insert({
    id: randomUUID(),
    listing_id: listingId,
    feature_states: value.feature_states,
    notes_public: value.notes_public,
    observed_at: value.observed_at,
    source_type: value.source_type,
    source_url: value.source_url,
    source_label: SOURCE_LABEL_PENDING,
    ingestion_method: "user_submission",
    review_status: "pending",
    contact_private: value.contact_private,
    public_receipt_token: receipt,
  });

  if (error) {
    return { ok: false, error: "insert_failed" };
  }

  return { ok: true, receipt };
}

export type QueueResult =
  | { ok: true; items: ReviewItem[] }
  | { ok: false; error: "not_configured" | "read_failed" };

/** Pending reports, oldest first. Staff only. */
export async function listReviewQueue(reviewer: Reviewer): Promise<QueueResult> {
  if (reviewer.demo) {
    const items = demoReports()
      .filter(
        (report) =>
          report.review_status === "pending" || report.review_status === "needs_more_info",
      )
      .sort((a, b) => a.submitted_at.localeCompare(b.submitted_at));
    return { ok: true, items };
  }

  const supabase = await createSupabaseServer();
  if (!supabase) return { ok: false, error: "not_configured" };

  const { data, error } = await supabase
    .from("accessibility_observations")
    .select(
      "id, listing_id, feature_states, notes_public, observed_at, source_type, source_url, review_status, review_reason, submitted_at, public_receipt_token, contact_private, listings(name_en, name_bn, category, address_en, address_bn, publication_status)",
    )
    .in("review_status", ["pending", "needs_more_info"])
    .order("submitted_at", { ascending: true });

  if (error) return { ok: false, error: "read_failed" };

  return {
    ok: true,
    items: ((data ?? []) as Record<string, unknown>[]).map(toReviewItem),
  };
}

export type ItemResult =
  | { ok: true; item: ReviewItem }
  | { ok: true; item: null }
  | { ok: false; error: "not_configured" | "read_failed" };

export async function getReviewItem(
  id: string,
  reviewer: Reviewer,
): Promise<ItemResult> {
  if (reviewer.demo) {
    return { ok: true, item: findDemoReport(id) ?? null };
  }

  const supabase = await createSupabaseServer();
  if (!supabase) return { ok: false, error: "not_configured" };

  const { data, error } = await supabase
    .from("accessibility_observations")
    .select(
      "id, listing_id, feature_states, notes_public, observed_at, source_type, source_url, review_status, review_reason, submitted_at, public_receipt_token, contact_private, listings(name_en, name_bn, category, address_en, address_bn, publication_status)",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) return { ok: false, error: "read_failed" };
  if (!data) return { ok: true, item: null };

  return { ok: true, item: toReviewItem(data as Record<string, unknown>) };
}

export type DecisionResult = { ok: true } | { ok: false; error: string };

/**
 * Record a reviewer decision. The action, the reason, and an audit event are
 * written together. Accepting a report is what makes its observation public.
 */
export async function decideReport({
  id,
  reviewer,
  decision,
  reason,
  edits = {},
}: {
  id: string;
  reviewer: Reviewer;
  decision: Decision;
  reason: string;
  /** Untrusted corrected states to publish with an acceptance. Ignored for other decisions. */
  edits?: unknown;
}): Promise<DecisionResult> {
  const cleanReason = reason.trim().slice(0, 500);
  if ((decision === "reject" || decision === "need_info") && !cleanReason) {
    return { ok: false, error: "reason_required" };
  }

  const { states: cleanEdits, unknownKeys } = normaliseFeatureStates(edits);
  if (unknownKeys.length > 0) {
    return { ok: false, error: "invalid_edits" };
  }

  const hasEdits = decision === "accept" && Object.keys(cleanEdits).length > 0;
  const nextStatus = DECISION_STATUS[decision];

  if (reviewer.demo) {
    const report = findDemoReport(id);
    if (!report) return { ok: false, error: "not_found" };

    if (hasEdits) {
      report.feature_states = { ...report.feature_states, ...cleanEdits };
    }
    report.review_status = nextStatus;
    report.review_reason = cleanReason || null;

    if (decision === "accept" && report.listing_id) {
      const listing = findDemoListing(report.listing_id);
      if (listing && listing.publication_status === "draft") {
        listing.publication_status = "published";
        listing.source_label = SOURCE_LABEL_REVIEWED;
        listing.source_checked_at = new Date().toISOString();
      }
    }

    recordDemoAudit({
      actor_id: reviewer.id,
      action: hasEdits ? "observation_accept_edited" : `observation_${decision}`,
      entity_type: "report",
      entity_id: id,
      reason: cleanReason || null,
    });
    return { ok: true };
  }

  const supabase = await createSupabaseServer();
  if (!supabase) return { ok: false, error: "not_configured" };

  const update: Record<string, unknown> = {
    review_status: nextStatus,
    reviewer_id: reviewer.id,
    reviewed_at: new Date().toISOString(),
    review_reason: cleanReason || null,
  };

  if (decision === "accept") {
    // The label must follow the observation's own source, so an imported
    // official record is not published as a reviewed community report.
    const { data: current, error: readError } = await supabase
      .from("accessibility_observations")
      .select("source_type, feature_states")
      .eq("id", id)
      .maybeSingle();

    if (readError || !current) {
      return { ok: false, error: "update_failed" };
    }

    const acceptedSource: SourceType = isSourceType(current.source_type)
      ? current.source_type
      : "community_report";
    update.source_label = SOURCE_LABELS[acceptedSource].en;

    if (hasEdits) {
      update.feature_states = {
        ...((current.feature_states ?? {}) as Record<string, FeatureState>),
        ...cleanEdits,
      };
    }
  }

  const { data: updated, error } = await supabase
    .from("accessibility_observations")
    .update(update)
    .eq("id", id)
    .select("id, listing_id, feature_states, source_type, source_label")
    .maybeSingle();

  if (error || !updated) {
    return { ok: false, error: "update_failed" };
  }

  // Publishing a place proposed by a report. The observation is accepted first,
  // so the public page always has at least one sourced result.
  if (decision === "accept") {
    await supabase
      .from("listings")
      .update({
        publication_status: "published",
        source_label: SOURCE_LABEL_REVIEWED,
        source_checked_at: new Date().toISOString(),
      })
      .eq("id", updated.listing_id)
      .eq("publication_status", "draft");
  }

  const { error: auditError } = await supabase.from("audit_log").insert({
    actor_id: reviewer.id,
    action: hasEdits ? "observation_accept_edited" : `observation_${decision}`,
    entity_type: "observation",
    entity_id: id,
    reason: cleanReason || null,
  });

  if (auditError) {
    return { ok: false, error: "audit_failed" };
  }

  return { ok: true };
}
