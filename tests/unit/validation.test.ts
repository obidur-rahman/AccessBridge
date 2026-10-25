import { describe, expect, it } from "vitest";
import { validateReport } from "@/lib/validation/report";

const TODAY = "2026-10-25";

function baseInput(overrides: Record<string, unknown> = {}) {
  return {
    listingId: "00000000-0000-4000-8000-000000000001",
    featureStates: { accessible_toilet: "no" },
    observedAt: "2026-10-20",
    note: "The toilet door is too narrow for a wheelchair.",
    sourceUrl: "",
    contact: "",
    ...overrides,
  };
}

describe("validateReport", () => {
  it("accepts a minimal valid report", () => {
    const result = validateReport(baseInput(), TODAY);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.listing_id).toBe("00000000-0000-4000-8000-000000000001");
    expect(result.value.feature_states).toEqual({ accessible_toilet: "no" });
    expect(result.value.observed_at).toBe("2026-10-20");
    expect(result.value.contact_private).toBeNull();
  });

  it("always labels a public submission as a community report", () => {
    const result = validateReport(
      baseInput({ sourceType: "official_source" }),
      TODAY,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.source_type).toBe("community_report");
  });

  it("rejects a report with no meaningful feature state", () => {
    const result = validateReport(
      baseInput({ featureStates: { accessible_toilet: "not_checked" } }),
      TODAY,
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.featureStates).toBe("required");
  });

  it("rejects unknown feature keys", () => {
    const result = validateReport(
      baseInput({ featureStates: { accessible_toilet: "no", pool: "yes" } }),
      TODAY,
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.featureStates).toBe("unknown");
  });

  it("rejects a future observation date", () => {
    const result = validateReport(baseInput({ observedAt: "2026-12-01" }), TODAY);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.observedAt).toBe("future");
  });

  it("rejects a malformed date", () => {
    const result = validateReport(baseInput({ observedAt: "20-10-2026" }), TODAY);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.observedAt).toBe("invalid");
  });

  it("rejects a non-http source link", () => {
    const result = validateReport(
      baseInput({ sourceUrl: "javascript:alert(1)" }),
      TODAY,
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.sourceUrl).toBe("invalid");
  });

  it("requires a name and category for a proposed new place", () => {
    const result = validateReport(
      baseInput({ listingId: "new", newPlaceName: "", newPlaceCategory: "health" }),
      TODAY,
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.newPlaceName).toBe("required");
  });

  it("builds a proposed place when the category is valid", () => {
    const result = validateReport(
      baseInput({
        listingId: "new",
        newPlaceName: "Example Cafe",
        newPlaceCategory: "accessibility",
        newPlaceAddress: "Demo Road",
      }),
      TODAY,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.listing_id).toBeNull();
    expect(result.value.proposed_place).toEqual({
      name: "Example Cafe",
      category: "accessibility",
      address: "Demo Road",
    });
  });

  it("trims and limits long text", () => {
    const result = validateReport(
      baseInput({ note: `  ${"a".repeat(600)}  ` }),
      TODAY,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.notes_public?.length).toBe(500);
  });

  it("removes control characters from submitted text", () => {
    const result = validateReport(baseInput({ note: "ramp\u0000 broken\u0007" }), TODAY);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.notes_public).toBe("ramp broken");
  });

  it("rejects a body that is not an object", () => {
    expect(validateReport(null, TODAY).ok).toBe(false);
    expect(validateReport("text", TODAY).ok).toBe(false);
  });
});
