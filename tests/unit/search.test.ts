import { describe, expect, it } from "vitest";
import {
  areasOf,
  displayName,
  filterListings,
  matchesQuery,
  normaliseQuery,
  type SearchableListing,
} from "@/lib/search";

const listings: SearchableListing[] = [
  {
    id: "b",
    name_en: "Clinic One",
    name_bn: "ক্লিনিক এক",
    category: "health",
    place_type: "clinic",
    summary_en: "Community clinic",
    summary_bn: "কমিউনিটি ক্লিনিক",
    area_name: "Panchlaish",
    has_observation: true,
    last_checked: "2026-10-01",
    checked_features: [],
  },
  {
    id: "a",
    name_en: "Alpha Cafe",
    name_bn: "আলফা ক্যাফে",
    category: "accessibility",
    place_type: "restaurant",
    summary_en: "A cafe",
    summary_bn: "একটি ক্যাফে",
    area_name: "Kotwali",
    has_observation: true,
    last_checked: "2026-10-10",
    checked_features: [],
  },
  {
    id: "c",
    name_en: "Bus Stop",
    name_bn: "বাস স্টপ",
    category: "transport",
    place_type: "bus stop",
    summary_en: null,
    summary_bn: null,
    area_name: "Agrabad",
    has_observation: false,
    last_checked: null,
    checked_features: [],
  },
];

describe("search", () => {
  it("normalises whitespace and case", () => {
    expect(normaliseQuery("  Alpha   Cafe ")).toBe("alpha cafe");
  });

  it("matches an English name and a Bangla keyword", () => {
    expect(matchesQuery(listings[1], "alpha", "en")).toBe(true);
    expect(matchesQuery(listings[1], "ক্যাফে", "bn")).toBe(true);
  });

  it("returns everything for an empty query", () => {
    expect(filterListings(listings, { query: "" })).toHaveLength(3);
  });

  it("filters by category and area together", () => {
    expect(filterListings(listings, { category: "health" })).toHaveLength(1);
    expect(filterListings(listings, { area: "Kotwali" })).toHaveLength(1);
    expect(filterListings(listings, { category: "health", area: "Kotwali" })).toHaveLength(0);
  });

  it("orders checked records first, then by displayed name", () => {
    const order = filterListings(listings, { lang: "en" }).map((item) => item.id);
    expect(order).toEqual(["a", "b", "c"]);
  });

  it("uses the Bangla name for ordering and display when Bangla is selected", () => {
    expect(displayName(listings[2], "bn")).toBe("বাস স্টপ");
    expect(displayName(listings[2], "en")).toBe("Bus Stop");
  });

  it("falls back to the other language when one name is missing", () => {
    const single = { ...listings[0], name_en: null };
    expect(displayName(single, "en")).toBe("ক্লিনিক এক");
  });

  it("lists areas once, sorted", () => {
    expect(areasOf(listings)).toEqual(["Agrabad", "Kotwali", "Panchlaish"]);
  });

  it("does not mutate the input array", () => {
    const copy = [...listings];
    filterListings(listings, { query: "a" });
    expect(listings).toEqual(copy);
  });
});
