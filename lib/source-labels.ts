import type { SourceType } from "@/lib/types";

export const SOURCE_TYPES: SourceType[] = [
  "official_source",
  "organisation_source",
  "reviewer_observation",
  "community_report",
  "other",
];

export function isSourceType(value: unknown): value is SourceType {
  return typeof value === "string" && (SOURCE_TYPES as readonly string[]).includes(value);
}

/**
 * Approved public source labels. Page components must use these labels and
 * must not invent their own wording.
 */
export const SOURCE_LABELS: Record<SourceType, { en: string; bn: string }> = {
  official_source: {
    en: "Official source",
    bn: "সরকারি সূত্র",
  },
  organisation_source: {
    en: "Organisation source",
    bn: "প্রতিষ্ঠানের সূত্র",
  },
  reviewer_observation: {
    en: "Reviewer observation",
    bn: "পর্যালোচকের পর্যবেক্ষণ",
  },
  community_report: {
    en: "Community report, reviewed",
    bn: "কমিউনিটি রিপোর্ট, পর্যালোচিত",
  },
  other: {
    en: "Source not available",
    bn: "সূত্র পাওয়া যায়নি",
  },
};

export function sourceLabel(type: SourceType, lang: "en" | "bn" = "en"): string {
  return SOURCE_LABELS[type]?.[lang] ?? SOURCE_LABELS.other[lang];
}
