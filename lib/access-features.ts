import type { FeatureState } from "@/lib/types";

/** Controlled feature list. Forms, rendering, and the database use these keys. */
export const FEATURE_KEYS = [
  "step_free_entrance",
  "entrance_steps",
  "ramp",
  "lift",
  "toilet_available",
  "accessible_toilet",
  "internal_step_free_route",
  "accessible_parking",
  "accessible_seating",
  "other_access_note",
] as const;

export type FeatureKey = (typeof FEATURE_KEYS)[number];

export const FEATURE_STATES: FeatureState[] = [
  "yes",
  "no",
  "partial",
  "not_checked",
  "not_applicable",
];

/** States a visitor or reviewer may actively choose. */
export const SELECTABLE_STATES: FeatureState[] = [
  "yes",
  "no",
  "partial",
  "not_checked",
  "not_applicable",
];

export function isFeatureKey(value: unknown): value is FeatureKey {
  return typeof value === "string" && (FEATURE_KEYS as readonly string[]).includes(value);
}

export function isFeatureState(value: unknown): value is FeatureState {
  return typeof value === "string" && (FEATURE_STATES as readonly string[]).includes(value);
}

export function featureLabelKey(key: FeatureKey): string {
  return `feature.${key}`;
}

/** Human-readable label, used in reviewer summaries and audit reasons. */
export function featureLabel(key: string, lang: "en" | "bn" = "en"): string {
  const labels: Record<string, { en: string; bn: string }> = {
    step_free_entrance: { en: "Step-free entrance", bn: "সিঁড়ি ছাড়া প্রবেশ" },
    entrance_steps: { en: "Steps at the entrance", bn: "প্রবেশপথে সিঁড়ি" },
    ramp: { en: "Ramp", bn: "র‍্যাম্প" },
    lift: { en: "Lift", bn: "লিফট" },
    toilet_available: { en: "Toilet available", bn: "টয়লেট আছে" },
    accessible_toilet: { en: "Accessible toilet", bn: "প্রবেশগম্য টয়লেট" },
    internal_step_free_route: {
      en: "Step-free route inside",
      bn: "ভেতরে সিঁড়ি ছাড়া পথ",
    },
    accessible_parking: { en: "Accessible parking", bn: "প্রবেশগম্য পার্কিং" },
    accessible_seating: { en: "Accessible seating", bn: "প্রবেশগম্য আসন" },
    other_access_note: { en: "Other access note", bn: "অন্যান্য প্রবেশ তথ্য" },
  };
  return labels[key]?.[lang] ?? key;
}

/**
 * Keep only known feature keys with known states. Unknown keys are returned
 * separately so the server can reject them instead of storing them silently.
 */
export function normaliseFeatureStates(input: unknown): {
  states: Partial<Record<FeatureKey, FeatureState>>;
  unknownKeys: string[];
} {
  const states: Partial<Record<FeatureKey, FeatureState>> = {};
  const unknownKeys: string[] = [];

  if (!input || typeof input !== "object") {
    return { states, unknownKeys };
  }

  for (const [rawKey, rawValue] of Object.entries(input as Record<string, unknown>)) {
    if (!isFeatureKey(rawKey)) {
      unknownKeys.push(rawKey);
      continue;
    }
    if (!isFeatureState(rawValue)) {
      unknownKeys.push(rawKey);
      continue;
    }
    states[rawKey] = rawValue;
  }

  return { states, unknownKeys };
}

/** Feature rows that carry an accepted observation, in display order. */
export function orderedFeatures<T extends { feature_key: string }>(rows: T[]): T[] {
  const order = new Map<string, number>(FEATURE_KEYS.map((key, index) => [key, index]));
  return [...rows].sort(
    (a, b) => (order.get(a.feature_key) ?? 999) - (order.get(b.feature_key) ?? 999),
  );
}

/**
 * A correction is urgent when it removes a facility the public page shows as
 * available today: state `yes` now, reported `no`. The queue stays oldest
 * first; this only adds the reviewer flag (implementation plan, section 6).
 */
export function urgentCorrections(
  current: Partial<Record<string, FeatureState>>,
  submitted: Partial<Record<string, FeatureState>>,
): FeatureKey[] {
  return FEATURE_KEYS.filter(
    (key) => current[key] === "yes" && submitted[key] === "no",
  );
}
