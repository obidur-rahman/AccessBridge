import { randomUUID } from "node:crypto";
import { FEATURE_KEYS } from "@/lib/access-features";
import type {
  CurrentFeature,
  DemoAuditEvent,
  DemoStaffMember,
  DemoStaffRole,
  Listing,
  ReviewItem,
} from "@/lib/types";

/**
 * DEMO DATA. Mirrors `supabase/seed.sql` so the interface can be developed and
 * tested before the Supabase project exists. Every record is labelled demo in
 * the interface. Never treat these values as real venue information.
 */

function demoId(n: number): string {
  return `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
}

/** One demo listing with the shared demo scaffolding filled in. */
function mkListing(input: {
  n: number;
  name_en: string;
  name_bn: string;
  category: Listing["category"];
  place_type: string;
  area_name: string;
  area_bn: string;
  summary_en: string;
  summary_bn: string;
  lat?: number | null;
  lng?: number | null;
  location_precision?: Listing["location_precision"];
  source_label: string;
  source_checked_at: string;
}): Listing {
  return {
    id: demoId(input.n),
    name_en: input.name_en,
    name_bn: input.name_bn,
    category: input.category,
    place_type: input.place_type,
    summary_en: input.summary_en,
    summary_bn: input.summary_bn,
    address_en: `Demo address, ${input.area_name}, Chattogram`,
    address_bn: `ডেমো ঠিকানা, ${input.area_bn}, চট্টগ্রাম`,
    area_name: input.area_name,
    phone_public: null,
    email_public: null,
    website_url: null,
    latitude: input.lat ?? null,
    longitude: input.lng ?? null,
    location_precision: input.location_precision ?? (input.lat ? "approximate" : "unknown"),
    source_label: input.source_label,
    source_checked_at: input.source_checked_at,
  };
}

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
  mkListing({
    n: 5,
    name_en: "Agrabad General Hospital (demo)",
    name_bn: "আগ্রাবাদ জেনারেল হাসপাতাল (ডেমো)",
    category: "health",
    place_type: "hospital",
    area_name: "Agrabad",
    area_bn: "আগ্রাবাদ",
    summary_en: "Demo hospital entry. Every access detail here is invented for the pilot.",
    summary_bn: "ডেমো হাসপাতাল এন্ট্রি। এখানকার প্রতিটি প্রবেশগম্যতার তথ্য পাইলটের জন্য কাল্পনিক।",
    lat: 22.3259,
    lng: 91.8097,
    source_label: "Reviewer observation, demo data",
    source_checked_at: "2026-10-05T00:00:00Z",
  }),
  mkListing({
    n: 6,
    name_en: "District Social Welfare Office (demo)",
    name_bn: "জেলা সমাজকল্যাণ অফিস (ডেমো)",
    category: "benefits",
    place_type: "government office",
    area_name: "Kotwali",
    area_bn: "কোতোয়ালী",
    summary_en: "Demo benefits desk. Only the entrance and toilet were checked.",
    summary_bn: "ডেমো সেবা অফিস। শুধু প্রবেশপথ ও টয়লেট যাচাই করা হয়েছে।",
    lat: 22.3391,
    lng: 91.8315,
    source_label: "Official source, demo data",
    source_checked_at: "2026-09-18T00:00:00Z",
  }),
  mkListing({
    n: 7,
    name_en: "Bahaddarhat Bus Terminal (demo)",
    name_bn: "বহদ্দারহাট বাস টার্মিনাল (ডেমো)",
    category: "transport",
    place_type: "bus terminal",
    area_name: "Bahaddarhat",
    area_bn: "বহদ্দারহাট",
    summary_en: "Demo terminal with a step at the gate and no accessible toilet.",
    summary_bn: "ডেমো টার্মিনাল। গেটে সিঁড়ি আছে, প্রবেশগম্য টয়লেট নেই।",
    lat: 22.3672,
    lng: 91.8041,
    source_label: "Reviewer observation, demo data",
    source_checked_at: "2026-09-05T00:00:00Z",
  }),
  mkListing({
    n: 8,
    name_en: "Halishahar Stadium (demo)",
    name_bn: "হালিশাহর স্টেডিয়াম (ডেমো)",
    category: "accessibility",
    place_type: "stadium",
    area_name: "Halishahar",
    area_bn: "হালিশাহর",
    summary_en: "Demo stadium entry with a full set of checked features.",
    summary_bn: "ডেমো স্টেডিয়াম এন্ট্রি। সব সুবিধা যাচাই করা অবস্থায় আছে।",
    lat: 22.3472,
    lng: 91.8067,
    source_label: "Organisation source, demo data",
    source_checked_at: "2026-10-12T00:00:00Z",
  }),
  mkListing({
    n: 9,
    name_en: "Oxygen Bazar (demo)",
    name_bn: "অক্সিজেন বাজার (ডেমো)",
    category: "accessibility",
    place_type: "market",
    area_name: "Oxygen",
    area_bn: "অক্সিজেন",
    summary_en: "Demo market stalls. Crowded aisles, one step-free lane at the rear.",
    summary_bn: "ডেমো বাজার। গলি ভিড়তুল্য, পেছনের পথটি সিঁড়ি ছাড়া।",
    lat: 22.3639,
    lng: 91.8174,
    source_label: "Community report, reviewed, demo data",
    source_checked_at: "2026-09-28T00:00:00Z",
  }),
  mkListing({
    n: 10,
    name_en: "Muradpur Flyover Bus Stop (demo)",
    name_bn: "মুরাদপুর ওভারব্রিজ বাস স্টপ (ডেমো)",
    category: "transport",
    place_type: "bus stop",
    area_name: "Muradpur",
    area_bn: "মুরাদপুর",
    summary_en: "Demo record with no accepted accessibility observation yet.",
    summary_bn: "স্বীকৃত প্রবেশগম্যতা পর্যবেক্ষণ এখনো নেই এমন ডেমো রেকর্ড।",
    lat: 22.3548,
    lng: 91.8129,
    source_label: "Source not available, demo data",
    source_checked_at: "2026-10-14T00:00:00Z",
  }),
  mkListing({
    n: 11,
    name_en: "New Market Eye Hospital (demo)",
    name_bn: "নিউমার্কেট চক্ষু হাসপাতাল (ডেমো)",
    category: "health",
    place_type: "clinic",
    area_name: "New Market",
    area_bn: "নিউ মার্কেট",
    summary_en: "Demo clinic entry in a busy lane. The rear entrance is step-free.",
    summary_bn: "ভিড় ভরা গলিতে ডেমো ক্লিনিক। পেছনের প্রবেশপথ সিঁড়ি ছাড়া।",
    lat: 22.3416,
    lng: 91.8273,
    source_label: "Organisation source, demo data",
    source_checked_at: "2026-08-22T00:00:00Z",
  }),
  mkListing({
    n: 12,
    name_en: "Laladighi Police Service Counter (demo)",
    name_bn: "লালাদিঘি পুলিশ সেবা কাউন্টার (ডেমো)",
    category: "government",
    place_type: "service counter",
    area_name: "Kotwali",
    area_bn: "কোতোয়ালী",
    summary_en: "Demo service counter. Two features checked, the rest are open.",
    summary_bn: "ডেমো সেবা কাউন্টার। দুটি সুবিধা যাচাই করা, বাকিগুলো খোলা।",
    lat: 22.3367,
    lng: 91.8299,
    source_label: "Official source, demo data",
    source_checked_at: "2026-10-01T00:00:00Z",
  }),
  mkListing({
    n: 13,
    name_en: "Panchlaish Public Library (demo)",
    name_bn: "পাঁচলাইশ সর্বজনীন গ্রন্থাগার (ডেমো)",
    category: "accessibility",
    place_type: "library",
    area_name: "Panchlaish",
    area_bn: "পাঁচলাইশ",
    summary_en: "Demo library entry with a ramp, a lift and checked seating.",
    summary_bn: "ডেমো গ্রন্থাগার। র‍্যাম্প, লিফট ও আসন যাচাই করা আছে।",
    lat: 22.3578,
    lng: 91.8341,
    source_label: "Reviewer observation, demo data",
    source_checked_at: "2026-09-20T00:00:00Z",
  }),
  mkListing({
    n: 14,
    name_en: "Chattogram Disability Rights Forum (demo)",
    name_bn: "চট্টগ্রাম প্রতিবন্ধক অধিকার ফোরাম (ডেমো)",
    category: "ngo",
    place_type: "community organisation",
    area_name: "Panchlaish",
    area_bn: "পাঁচলাইশ",
    summary_en: "Demo community office. Volunteers keep the access notes current.",
    summary_bn: "ডেমো কমিউনিটি অফিস। স্বেচ্ছাসেবীরা প্রবেশ তথ্য হালনাগাদ রাখেন।",
    lat: 22.3605,
    lng: 91.8318,
    source_label: "Organisation source, demo data",
    source_checked_at: "2026-10-08T00:00:00Z",
  }),
  mkListing({
    n: 15,
    name_en: "Agrabad Employment Exchange (demo)",
    name_bn: "আগ্রাবাদ কর্মসংস্থান অফিস (ডেমো)",
    category: "benefits",
    place_type: "government office",
    area_name: "Agrabad",
    area_bn: "আগ্রাবাদ",
    summary_en: "Demo record with no accepted accessibility observation yet.",
    summary_bn: "স্বীকৃত প্রবেশগম্যতা পর্যবেক্ষণ এখনো নেই এমন ডেমো রেকর্ড।",
    lat: 22.3288,
    lng: 91.8131,
    source_label: "Source not available, demo data",
    source_checked_at: "2026-10-10T00:00:00Z",
  }),
  mkListing({
    n: 16,
    name_en: "Khulshi Community Centre (demo)",
    name_bn: "খুলশী কমিউনিটি সেন্টার (ডেমো)",
    category: "ngo",
    place_type: "community centre",
    area_name: "Khulshi",
    area_bn: "খুলশী",
    summary_en: "Demo community hall. The survey team has not visited yet.",
    summary_bn: "ডেমো কমিউনিটি হল। জরিপ দল এখনো ঘরেনি।",
    lat: null,
    lng: null,
    source_label: "Source not available, demo data",
    source_checked_at: "2026-10-15T00:00:00Z",
  }),
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

/** Build a full ten-feature set: named states, everything else not_checked. */
function featureSet(
  observed_at: string,
  source_type: CurrentFeature["source_type"],
  source_label: string,
  states: Partial<Record<(typeof FEATURE_KEYS)[number], CurrentFeature["state"]>>,
  notes: Record<string, string> = {},
): CurrentFeature[] {
  return FEATURE_KEYS.map((key) => ({
    feature_key: key,
    state: states[key] ?? "not_checked",
    observed_at,
    source_type,
    source_label: `${source_label}, demo data`,
    source_url: null,
    notes_public: notes[key] ?? null,
    submitted_at: `${observed_at}T10:00:00Z`,
  }));
}

const FULL = {
  step_free_entrance: "yes",
  entrance_steps: "not_applicable",
  ramp: "yes",
  lift: "yes",
  toilet_available: "yes",
  accessible_toilet: "yes",
  internal_step_free_route: "yes",
  accessible_parking: "partial",
  accessible_seating: "yes",
} as const;

const MIXED = {
  step_free_entrance: "yes",
  entrance_steps: "no",
  ramp: "partial",
  toilet_available: "yes",
  accessible_toilet: "partial",
  internal_step_free_route: "partial",
  accessible_seating: "yes",
} as const;

const POOR = {
  step_free_entrance: "no",
  entrance_steps: "yes",
  ramp: "no",
  toilet_available: "yes",
  accessible_toilet: "no",
  internal_step_free_route: "no",
  accessible_seating: "partial",
} as const;

const LIGHT = {
  step_free_entrance: "yes",
  toilet_available: "yes",
} as const;

const FEATURE_SETS: Record<string, CurrentFeature[]> = {
  [demoId(1)]: DEMO_FEATURES,
  [demoId(4)]: [],
  [demoId(5)]: featureSet("2026-10-05", "reviewer_observation", "Reviewer observation", MIXED),
  [demoId(6)]: featureSet("2026-09-18", "official_source", "Official source", LIGHT),
  [demoId(7)]: featureSet("2026-09-05", "reviewer_observation", "Reviewer observation", POOR, {
    step_free_entrance: "The approach has two steps at the gate.",
    accessible_toilet: "The toilet is not wheelchair accessible.",
  }),
  [demoId(8)]: featureSet("2026-10-12", "organisation_source", "Organisation source", FULL),
  [demoId(9)]: featureSet("2026-09-28", "community_report", "Community report, reviewed", MIXED, {
    internal_step_free_route: "Crowded aisles; the rear lane is the step-free one.",
  }),
  [demoId(10)]: [],
  [demoId(11)]: featureSet("2026-08-22", "organisation_source", "Organisation source", MIXED),
  [demoId(12)]: featureSet("2026-10-01", "official_source", "Official source", LIGHT),
  [demoId(13)]: featureSet("2026-09-20", "reviewer_observation", "Reviewer observation", FULL),
  [demoId(14)]: featureSet("2026-10-08", "organisation_source", "Organisation source", MIXED),
  [demoId(15)]: [],
  [demoId(16)]: [],
};

/** Feature rows keyed by listing id. */
export function demoFeaturesFor(listingId: string): CurrentFeature[] {
  // The two hand-written sets are declared below this point, so look them up
  // at call time instead of freezing them into the map at module load.
  if (listingId === demoId(2)) return DEMO_CLINIC_FEATURES;
  if (listingId === demoId(3)) return DEMO_OFFICE_FEATURES;
  return FEATURE_SETS[listingId] ?? [];
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
 * In-memory store for demo mode. Kept on globalThis so a dev-server reload
 * does not lose pending reports, and so route handlers and server components
 * (which Next.js compiles as separate module layers) share one copy. Nothing
 * is persisted; restarting the server clears every demo change.
 */
const DEMO_STORE = Symbol.for("accessbridge.demoReports");

type DemoStore = {
  listings: Listing[];
  reports: ReviewItem[];
  staff: DemoStaffMember[];
  audit: DemoAuditEvent[];
};

/** A writable copy of the seeded listings, so no store mutation touches the seed. */
function initialListings(): Listing[] {
  return DEMO_LISTINGS.map((listing) => ({ ...listing }));
}

function initialStaff(): DemoStaffMember[] {
  return [
    { id: "demo-reviewer", display_name: "Demo admin", role: "admin", active: true },
    { id: "demo-reviewer-a", display_name: "Demo reviewer A", role: "reviewer", active: true },
    { id: "demo-reviewer-b", display_name: "Demo reviewer B", role: "reviewer", active: true },
  ];
}

function store(): DemoStore {
  const holder = globalThis as unknown as Record<symbol, DemoStore | undefined>;
  if (!holder[DEMO_STORE]) {
    holder[DEMO_STORE] = {
      listings: initialListings(),
      reports: [],
      staff: initialStaff(),
      audit: [],
    };
  }
  const value = holder[DEMO_STORE] as DemoStore;
  value.listings ??= initialListings();
  value.staff ??= initialStaff();
  value.audit ??= [];
  return value;
}

/** Every demo listing, including drafts proposed by a pending report. */
export function demoListings(): Listing[] {
  return store().listings;
}

export function findDemoListing(id: string): Listing | undefined {
  return store().listings.find((listing) => listing.id === id);
}

export function pushDemoListing(listing: Listing): void {
  store().listings.push(listing);
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

export function getDemoStaff(): DemoStaffMember[] {
  return store().staff.map((member) => ({ ...member }));
}

export function getDemoAudit(): DemoAuditEvent[] {
  return [...store().audit]
    .reverse()
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function getDemoAdminSnapshot() {
  return {
    reports: store().reports.map((report) => ({
      ...report,
      feature_states: { ...report.feature_states },
    })),
    staff: getDemoStaff(),
    audit: getDemoAudit(),
  };
}

export function createDemoStaff(
  displayName: string,
  role: DemoStaffRole,
  actorId = "demo-reviewer",
): DemoStaffMember {
  if (!displayName.trim() || (role !== "reviewer" && role !== "admin")) {
    throw new Error("A display name and valid staff role are required.");
  }
  const member = {
    id: randomUUID(),
    display_name: displayName.trim().slice(0, 80),
    role,
    active: true,
  };
  store().staff.push(member);
  recordDemoAudit({
    actor_id: actorId,
    action: "staff_created",
    entity_type: "staff",
    entity_id: member.id,
    reason: `${member.display_name} · ${member.role}`,
  });
  return { ...member };
}

export function updateDemoStaff(
  id: string,
  update: { role?: DemoStaffRole; active?: boolean },
  actorId = "demo-reviewer",
): DemoStaffMember | null {
  const member = store().staff.find((item) => item.id === id);
  if (!member || member.id === "demo-reviewer") return null;
  if (update.role && update.role !== "reviewer" && update.role !== "admin") return null;

  const nextRole = update.role ?? member.role;
  const nextActive = update.active ?? member.active;
  const hasAnotherAdmin = store().staff.some(
    (item) => item.id !== id && item.role === "admin" && item.active,
  );
  if (!hasAnotherAdmin && (nextRole !== "admin" || !nextActive)) return null;

  member.role = nextRole;
  member.active = nextActive;
  recordDemoAudit({
    actor_id: actorId,
    action: "staff_updated",
    entity_type: "staff",
    entity_id: id,
    reason: `${member.display_name} · ${member.role} · ${member.active ? "active" : "inactive"}`,
  });
  return { ...member };
}

export function assignDemoReport(
  id: string,
  assignedTo: string | null,
  actorId = "demo-reviewer",
): boolean {
  const report = findDemoReport(id);
  if (
    !report ||
    (report.review_status !== "pending" && report.review_status !== "needs_more_info")
  ) return false;
  if (assignedTo) {
    const member = store().staff.find((item) => item.id === assignedTo);
    if (!member || !member.active || member.role !== "reviewer") return false;
  }
  report.assigned_to = assignedTo;
  report.assigned_to_name = assignedTo
    ? store().staff.find((member) => member.id === assignedTo)?.display_name ?? null
    : null;
  recordDemoAudit({
    actor_id: actorId,
    action: assignedTo ? "report_assigned" : "report_unassigned",
    entity_type: "report",
    entity_id: id,
    reason: report.assigned_to_name,
  });
  return true;
}

export function escalateDemoReport(
  id: string,
  reason: string,
  actorId = "demo-reviewer",
): boolean {
  const report = findDemoReport(id);
  if (
    !report ||
    report.escalated ||
    !reason.trim() ||
    (report.review_status !== "pending" && report.review_status !== "needs_more_info")
  ) return false;
  report.escalated = true;

  report.escalation_reason = reason.trim().slice(0, 500);
  report.escalation_resolution = null;
  report.escalation_resolved_at = null;
  recordDemoAudit({
    actor_id: actorId,
    action: "report_escalated",
    entity_type: "report",
    entity_id: id,
    reason,
  });
  return true;
}

export function resolveDemoEscalation(
  id: string,
  resolution: string,
  actorId = "demo-reviewer",
): boolean {
  const report = findDemoReport(id);
  if (!report?.escalated || !resolution.trim()) return false;
  report.escalated = false;
  report.escalation_resolution = resolution.trim().slice(0, 500);
  report.escalation_resolved_at = new Date().toISOString();
  recordDemoAudit({
    actor_id: actorId,
    action: "escalation_resolved",
    entity_type: "report",
    entity_id: id,
    reason: resolution,
  });
  return true;
}

export function recordDemoAudit(input: {
  actor_id: string;
  action: string;
  entity_type: DemoAuditEvent["entity_type"];
  entity_id: string;
  reason?: string | null;
}): void {
  const actor = store().staff.find((member) => member.id === input.actor_id);
  store().audit.push({
    id: randomUUID(),
    actor_id: input.actor_id,
    actor_name: actor?.display_name ?? "Demo admin",
    action: input.action,
    entity_type: input.entity_type,
    entity_id: input.entity_id,
    reason: input.reason?.trim().slice(0, 500) || null,
    created_at: new Date().toISOString(),
  });
}

/** Test helper: restore seeded demo data and drop every in-memory change. */
export function resetDemoData(): void {
  const state = store();
  state.listings = initialListings();
  state.reports.length = 0;
  state.staff = initialStaff();
  state.audit.length = 0;
}
