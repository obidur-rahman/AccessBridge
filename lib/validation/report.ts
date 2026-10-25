import { normaliseFeatureStates, type FeatureKey } from "@/lib/access-features";
import type { Category, FeatureState, SourceType } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";

export const LIMITS = {
  placeName: 120,
  address: 200,
  note: 500,
  url: 500,
  contact: 200,
  id: 64,
} as const;

export interface ValidatedReport {
  listing_id: string | null;
  proposed_place: {
    name: string;
    category: Category;
    address: string | null;
  } | null;
  feature_states: Partial<Record<FeatureKey, FeatureState>>;
  notes_public: string | null;
  observed_at: string;
  source_type: SourceType;
  source_url: string | null;
  contact_private: string | null;
}

export type ValidationResult =
  | { ok: true; value: ValidatedReport }
  | { ok: false; errors: Record<string, string> };

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Remove control characters and collapse whitespace. */
function clean(value: unknown, max: number): string {
  return asString(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim()
    .slice(0, max);
}

function isCategory(value: unknown): value is Category {
  return typeof value === "string" && (CATEGORIES as string[]).includes(value);
}

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function validHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Validate an untrusted submission.
 *
 * The source type is always `community_report` for a public submission: a
 * contributor cannot label their own report as an official source.
 */
export function validateReport(raw: unknown, todayIso: string): ValidationResult {
  const errors: Record<string, string> = {};

  if (!raw || typeof raw !== "object") {
    return { ok: false, errors: { form: "invalid" } };
  }

  const input = raw as Record<string, unknown>;

  const rawListingId = clean(input.listingId, LIMITS.id);
  const isNewPlace = !rawListingId || rawListingId === "new";
  let listingId: string | null = rawListingId || null;

  if (isNewPlace) {
    listingId = null;
  } else if (!/^[A-Za-z0-9_-]+$/.test(rawListingId)) {
    errors.listingId = "invalid";
  }

  let proposedPlace: ValidatedReport["proposed_place"] = null;
  if (!listingId) {
    const name = clean(input.newPlaceName, LIMITS.placeName);
    const address = clean(input.newPlaceAddress, LIMITS.address);
    const category = input.newPlaceCategory;

    if (!name) errors.newPlaceName = "required";
    if (!isCategory(category)) errors.newPlaceCategory = "required";

    if (name && isCategory(category)) {
      proposedPlace = {
        name,
        category,
        address: address || null,
      };
    }
  }

  const { states, unknownKeys } = normaliseFeatureStates(input.featureStates);
  if (unknownKeys.length > 0) {
    errors.featureStates = "unknown";
  }

  const meaningful = Object.values(states).filter(
    (state) => state && state !== "not_checked",
  );
  if (meaningful.length === 0) {
    errors.featureStates = "required";
  }

  const observedAt = clean(input.observedAt, 10);
  if (!isIsoDate(observedAt)) {
    errors.observedAt = "invalid";
  } else if (observedAt > todayIso) {
    errors.observedAt = "future";
  } else {
    const oldest = new Date(`${todayIso}T00:00:00Z`);
    oldest.setUTCFullYear(oldest.getUTCFullYear() - 10);
    if (observedAt < oldest.toISOString().slice(0, 10)) {
      errors.observedAt = "too_old";
    }
  }

  const notes = clean(input.note, LIMITS.note);
  const rawSourceUrl = clean(input.sourceUrl, LIMITS.url);
  if (rawSourceUrl && !validHttpUrl(rawSourceUrl)) {
    errors.sourceUrl = "invalid";
  }

  const contact = clean(input.contact, LIMITS.contact);

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      listing_id: listingId,
      proposed_place: proposedPlace,
      feature_states: states,
      notes_public: notes || null,
      observed_at: observedAt,
      source_type: "community_report",
      source_url: rawSourceUrl || null,
      contact_private: contact || null,
    },
  };
}
