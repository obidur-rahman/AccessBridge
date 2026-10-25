import type { CurrentFeature, Listing, ReviewItem } from "@/lib/types";

/**
 * DEMO DATA. Mirrors `supabase/seed.sql` so the interface can be developed and
 * tested before the Supabase project exists. Every record is labelled demo in
 * the interface. Never treat these values as real venue information.
 */

export const DEMO_LISTINGS: Listing[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    name_en: "Mezban Kitchen (demo)",
    name_bn: "মেজবান কিচেন (ডেমো)",
    category: "accessibility",
    place_type: "restaurant",
    summary_en: "Demo record for the accessibility pilot. Not a real restaurant.",
    summary_bn: "প্রবেশগম্যতা পাইলটের ডেমো রেকর্ড। বাস্তব রেস্তোরাঁ নয়।",
    address_en: "Demo address, Kotwali, Chattogram",
    address_bn: "ডেমো ঠিকানা, কোতোয়ালী, চট্টগ্রাম",
    area_name: "Kotwali",
    phone_public: null,
    email_public: null,
    website_url: null,
    latitude: 22.3375,
    longitude: 91.8326,
    location_precision: "approximate",
    source_label: "Reviewer observation, demo data",
    source_checked_at: "2026-10-12T00:00:00Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    name_en: "Chattogram Community Clinic (demo)",
    name_bn: "চট্টগ্রাম কমিউনিটি ক্লিনিক (ডেমো)",
    category: "health",
    place_type: "clinic",
    summary_en: "Demo record for the accessibility pilot. Not a real clinic.",
    summary_bn: "প্রবেশগম্যতা পাইলটের ডেমো রেকর্ড। বাস্তব ক্লিনিক নয়।",
    address_en: "Demo address, Panchlaish, Chattogram",
    address_bn: "ডেমো ঠিকানা, পাঁচলাইশ, চট্টগ্রাম",
    area_name: "Panchlaish",
    phone_public: null,
    email_public: null,
    website_url: null,
    latitude: 22.3592,
    longitude: 91.8334,
    location_precision: "approximate",
    source_label: "Organisation source, demo data",
    source_checked_at: "2026-09-28T00:00:00Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    name_en: "Passport Office Counter (demo)",
    name_bn: "পাসপোর্ট অফিস কাউন্টার (ডেমো)",
    category: "government",
    place_type: "office",
    summary_en: "Demo record for the accessibility pilot. Not a real office.",
    summary_bn: "প্রবেশগম্যতা পাইলটের ডেমো রেকর্ড। বাস্তব অফিস নয়।",
    address_en: "Demo address, Agrabad, Chattogram",
    address_bn: "ডেমো ঠিকানা, আগ্রাবাদ, চট্টগ্রাম",
    area_name: "Agrabad",
    phone_public: null,
    email_public: null,
    website_url: null,
    latitude: 22.3254,
    longitude: 91.809,
    location_precision: "approximate",
    source_label: "Official source, demo data",
    source_checked_at: "2026-08-30T00:00:00Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000004",
    name_en: "Sholoshahar Bus Stop (demo)",
    name_bn: "ষোলশহর বাস স্টপ (ডেমো)",
    category: "transport",
    place_type: "bus stop",
    summary_en: "Demo record with no accepted accessibility observation yet.",
    summary_bn: "স্বীকৃত প্রবেশগম্যতা পর্যবেক্ষণ এখনো নেই এমন ডেমো রেকর্ড।",
    address_en: "Demo address, Sholoshahar, Chattogram",
    address_bn: "ডেমো ঠিকানা, ষোলশহর, চট্টগ্রাম",
    area_name: "Sholoshahar",
    phone_public: null,
    email_public: null,
    website_url: null,
    latitude: null,
    longitude: null,
    location_precision: "unknown",
    source_label: "Source not available, demo data",
    source_checked_at: "2026-10-01T00:00:00Z",
  },
];

export const DEMO_FEATURES: CurrentFeature[] = [
  {
    feature_key: "step_free_entrance",
    state: "yes",
    observed_at: "2026-10-12",
    source_type: "reviewer_observation",
    source_label: "Reviewer observation, demo data",
    source_url: null,
    notes_public: null,
    submitted_at: "2026-10-12T18:00:00Z",
  },
  {
    feature_key: "entrance_steps",
    state: "no",
    observed_at: "2026-10-12",
    source_type: "reviewer_observation",
    source_label: "Reviewer observation, demo data",
    source_url: null,
    notes_public: null,
    submitted_at: "2026-10-12T18:00:00Z",
  },
  {
    feature_key: "ramp",
    state: "yes",
    observed_at: "2026-10-12",
    source_type: "reviewer_observation",
    source_label: "Reviewer observation, demo data",
    source_url: null,
    notes_public: null,
    submitted_at: "2026-10-12T18:00:00Z",
  },
  {
    feature_key: "lift",
    state: "not_applicable",
    observed_at: "2026-10-12",
    source_type: "reviewer_observation",
    source_label: "Reviewer observation, demo data",
    source_url: null,
    notes_public: null,
    submitted_at: "2026-10-12T18:00:00Z",
  },
  {
    feature_key: "toilet_available",
    state: "yes",
    observed_at: "2026-10-12",
    source_type: "reviewer_observation",
    source_label: "Reviewer observation, demo data",
    source_url: null,
    notes_public: null,
    submitted_at: "2026-10-12T18:00:00Z",
  },
  {
    feature_key: "accessible_toilet",
    state: "no",
    observed_at: "2026-10-12",
    source_type: "community_report",
    source_label: "Community report, reviewed, demo data",
    source_url: null,
    notes_public: "The toilet door is too narrow for a standard wheelchair.",
    submitted_at: "2026-10-12T18:00:00Z",
  },
  {
    feature_key: "internal_step_free_route",
    state: "partial",
    observed_at: "2026-10-12",
    source_type: "reviewer_observation",
    source_label: "Reviewer observation, demo data",
    source_url: null,
    notes_public: "The dining area is step-free. The back seating area has one step.",
    submitted_at: "2026-10-12T18:00:00Z",
  },
  {
    feature_key: "accessible_parking",
    state: "not_checked",
    observed_at: "2026-10-12",
    source_type: "reviewer_observation",
    source_label: "Reviewer observation, demo data",
    source_url: null,
    notes_public: null,
    submitted_at: "2026-10-12T18:00:00Z",
  },
  {
    feature_key: "accessible_seating",
    state: "yes",
    observed_at: "2026-10-12",
    source_type: "reviewer_observation",
    source_label: "Reviewer observation, demo data",
    source_url: null,
    notes_public: null,
    submitted_at: "2026-10-12T18:00:00Z",
  },
  {
    feature_key: "other_access_note",
    state: "not_checked",
    observed_at: "2026-10-12",
    source_type: "reviewer_observation",
    source_label: "Reviewer observation, demo data",
    source_url: null,
    notes_public: null,
    submitted_at: "2026-10-12T18:00:00Z",
  },
];

/** Feature rows keyed by listing id. */
export function demoFeaturesFor(listingId: string): CurrentFeature[] {
  if (listingId === "00000000-0000-4000-8000-000000000001") return DEMO_FEATURES;

  if (listingId === "00000000-0000-4000-8000-000000000002") {
    return DEMO_CLINIC_FEATURES;
  }

  if (listingId === "00000000-0000-4000-8000-000000000003") {
    return DEMO_OFFICE_FEATURES;
  }

  return [];
}

const clinicBase = {
  observed_at: "2026-09-28",
  source_type: "organisation_source" as const,
  source_label: "Organisation source, demo data",
  source_url: null,
  submitted_at: "2026-09-28T10:00:00Z",
};

const DEMO_CLINIC_FEATURES: CurrentFeature[] = [
  { feature_key: "step_free_entrance", state: "yes", notes_public: null, ...clinicBase },
  { feature_key: "entrance_steps", state: "not_applicable", notes_public: null, ...clinicBase },
  { feature_key: "ramp", state: "yes", notes_public: null, ...clinicBase },
  { feature_key: "lift", state: "yes", notes_public: "The lift reaches the first floor.", ...clinicBase },
  { feature_key: "toilet_available", state: "yes", notes_public: null, ...clinicBase },
  {
    feature_key: "accessible_toilet",
    state: "partial",
    notes_public: "Fits a wheelchair, but there is no grab bar on the left side.",
    ...clinicBase,
  },
  { feature_key: "internal_step_free_route", state: "yes", notes_public: null, ...clinicBase },
  { feature_key: "accessible_parking", state: "no", notes_public: null, ...clinicBase },
  { feature_key: "accessible_seating", state: "yes", notes_public: null, ...clinicBase },
  { feature_key: "other_access_note", state: "not_checked", notes_public: null, ...clinicBase },
];

const officeBase = {
  observed_at: "2026-03-02",
  source_type: "official_source" as const,
  source_label: "Official source, demo data",
  source_url: null,
  submitted_at: "2026-03-02T09:15:00Z",
};

// This record is older than the 180-day freshness period on purpose, so the
// "Needs re-check" label is visible in the demo.
const DEMO_OFFICE_FEATURES: CurrentFeature[] = [
  { feature_key: "step_free_entrance", state: "no", notes_public: null, ...officeBase },
  { feature_key: "entrance_steps", state: "yes", notes_public: null, ...officeBase },
  {
    feature_key: "ramp",
    state: "partial",
    notes_public:
      "A removable ramp is available at the side entrance when requested from the guard desk.",
    ...officeBase,
  },
  { feature_key: "toilet_available", state: "not_checked", notes_public: null, ...officeBase },
  { feature_key: "accessible_toilet", state: "not_checked", notes_public: null, ...officeBase },
  { feature_key: "lift", state: "not_checked", notes_public: null, ...officeBase },
  { feature_key: "internal_step_free_route", state: "not_checked", notes_public: null, ...officeBase },
  { feature_key: "accessible_parking", state: "not_checked", notes_public: null, ...officeBase },
  { feature_key: "accessible_seating", state: "not_checked", notes_public: null, ...officeBase },
  { feature_key: "other_access_note", state: "not_checked", notes_public: null, ...officeBase },
];

/**
 * In-memory report store for demo mode. Kept on globalThis so a dev-server
 * reload does not lose pending reports. Nothing is persisted; restarting the
 * server clears every demo report.
 */
const DEMO_STORE = Symbol.for("accessbridge.demoReports");

type DemoStore = { reports: ReviewItem[] };

function store(): DemoStore {
  const holder = globalThis as unknown as Record<symbol, DemoStore | undefined>;
  if (!holder[DEMO_STORE]) {
    holder[DEMO_STORE] = { reports: [] };
  }
  return holder[DEMO_STORE] as DemoStore;
}

export function demoReports(): ReviewItem[] {
  return store().reports;
}

export function pushDemoReport(report: ReviewItem): void {
  store().reports.push(report);
}

export function findDemoReport(id: string): ReviewItem | undefined {
  return store().reports.find((report) => report.id === id);
}

const SEEDED_LISTING_IDS = new Set(DEMO_LISTINGS.map((listing) => listing.id));

/** Test helper: restore the seeded demo data and drop every in-memory report. */
export function resetDemoData(): void {
  store().reports.length = 0;
  for (let index = DEMO_LISTINGS.length - 1; index >= 0; index -= 1) {
    if (!SEEDED_LISTING_IDS.has(DEMO_LISTINGS[index].id)) {
      DEMO_LISTINGS.splice(index, 1);
    }
  }
}
