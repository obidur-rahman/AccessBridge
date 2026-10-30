import type { Lang } from "@/lib/types";

export type RoadmapStatus = "now" | "next" | "later" | "not";

export interface RoadmapPhase {
  id: string;
  status: RoadmapStatus;
  title: Record<Lang, string>;
  summary: Record<Lang, string>;
  items: Record<Lang, string>[];
}

/**
 * The published plan for the pilot. It follows `docs/06_IMPLEMENTATION_PLAN.md`;
 * update that document and this list together.
 */
export const ROADMAP: RoadmapPhase[] = [
  {
    id: "pilot",
    status: "now",
    title: { en: "Pilot directory", bn: "পাইলট তালিকা" },
    summary: {
      en: "Search, feature-by-feature detail, and a reviewed report for every place.",
      bn: "প্রতিটি স্থানের জন্য অনুসন্ধান, সুবিধাভিত্তিক তথ্য এবং পর্যালোচিত রিপোর্ট।",
    },
    items: [
      {
        en: "Directory and place pages in Bangla and English",
        bn: "বাংলা ও ইংরেজিতে তালিকা ও স্থানের পৃষ্ঠা",
      },
      {
        en: "Report form with a review queue and an audit trail",
        bn: "পর্যালোচনা তালিকা ও অডিট রেকর্ডসহ রিপোর্ট ফর্ম",
      },
      {
        en: "Light and dark themes, stored in this browser",
        bn: "হালকা ও গাঢ় থিম, এই ব্রাউজারে সংরক্ষিত",
      },
      {
        en: "Single-place map on request, with a provider notice",
        bn: "অনুরোধে একক স্থানের মানচিত্র, প্রদানকারীর নোটিসসহ",
      },
    ],
  },
  {
    id: "accounts",
    status: "next",
    title: { en: "Real staff accounts", bn: "প্রকৃত স্টাফ অ্যাকাউন্ট" },
    summary: {
      en: "Move the demo staff desk onto the live database and remove in-memory state.",
      bn: "ডেমো স্টাফ ডেস্কটি বাস্তব ডেটাবেসে সরানো এবং মেমোরির অবস্থা বাদ দেওয়া।",
    },
    items: [
      {
        en: "Staff sign-in with database roles and row-level security",
        bn: "ডেটাবেস ভূমিকা ও সারি-স্তরের সুরক্ষাসহ স্টাফ প্রবেশ",
      },
      {
        en: "Report assignment, escalation, and a permanent audit log",
        bn: "রিপোর্ট বণ্টন, এস্কেলেশন এবং স্থায়ী অডিট লগ",
      },
      {
        en: "Saved places for visitors, kept on the device",
        bn: "দর্শকদের জন্য সংরক্ষিত স্থান, ডিভাইসে রাখা",
      },
    ],
  },
  {
    id: "data",
    status: "next",
    title: { en: "More records, kept fresh", bn: "আরও রেকর্ড, হালনাগাদ রাখা" },
    summary: {
      en: "Grow coverage without losing the source and date behind every fact.",
      bn: "প্রতিটি তথ্যের সূত্র ও তারিখ না হারিয়ে পরিধি বাড়ানো।",
    },
    items: [
      {
        en: "Structured imports for partner organisations",
        bn: "অংশীদার সংস্থার জন্য কাঠামোবদ্ধ আমদানি",
      },
      {
        en: "Duplicate warnings and a re-check reminder for old records",
        bn: "পুরোনো রেকর্ডের জন্য ডুপ্লিকেট সতর্কতা ও পুনরায় যাচাইয়ের মনে করানো",
      },
      {
        en: "Photo evidence on a reviewed observation",
        bn: "পর্যালোচিত পর্যবেক্ষণে ছবির প্রমাণ",
      },
    ],
  },
  {
    id: "reach",
    status: "later",
    title: { en: "Wider reach", bn: "আরও বিস্তার" },
    summary: {
      en: "Take the same feature-level model to more of Bangladesh.",
      bn: "একই সুবিধাভিত্তিক মডেল বাংলাদেশের আরও জায়গায় নেওয়া।",
    },
    items: [
      {
        en: "More cities, one area at a time",
        bn: "আরও শহর, একবারে একটি এলাকা",
      },
      {
        en: "Low-bandwidth mode that keeps written details first",
        bn: "কম-ব্যান্ডউইথ মোড, লিখিত তথ্য আগে রাখে",
      },
      {
        en: "Installable phone app with offline reads",
        bn: "অফলাইনে পড়ার সুবিধাসহ ইনস্টলযোগ্য ফোন অ্যাপ",
      },
    ],
  },
  {
    id: "not",
    status: "not",
    title: { en: "Deliberately out of scope", bn: "ইচ্ছাকৃতভাবে পরিধির বাইরে" },
    summary: {
      en: "Some features would mislead visitors or cost money the pilot does not have.",
      bn: "কিছু সুবিধা দর্শককে বিভ্রান্ত করবে বা পাইলটের অপ্রাপ্য খরচ বাড়াবে।",
    },
    items: [
      {
        en: "One overall accessible or not accessible score",
        bn: "প্রবেশগম্য বা অপ্রবেশগম্য এমন একটি সামগ্রিক স্কোর",
      },
      {
        en: "Numerical trust scores for places or reviewers",
        bn: "স্থান বা পর্যালোচকের সংখ্যাগত বিশ্বাসযোগ্যতা স্কোর",
      },
      {
        en: "Questions about a visitor's disability or access need",
        bn: "দর্শকের প্রতিবন্ধকতা বা প্রয়োজন সম্পর্কে প্রশ্ন",
      },
      {
        en: "Ads, paid placement, and tracking scripts",
        bn: "বিজ্ঞাপন, অর্থপ্রদত্ত স্থান এবং ট্র্যাকিং স্ক্রিপ্ট",
      },
    ],
  },
];
