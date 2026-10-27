import { describe, expect, it } from "vitest";
import {
  FEATURE_KEYS,
  isFeatureKey,
  isFeatureState,
  normaliseFeatureStates,
  orderedFeatures,
  urgentCorrections,
} from "@/lib/access-features";

describe("feature vocabulary", () => {
  it("accepts the documented keys only", () => {
    expect(isFeatureKey("accessible_toilet")).toBe(true);
    expect(isFeatureKey("pool")).toBe(false);
    expect(FEATURE_KEYS).toHaveLength(10);
  });

  it("keeps not_checked distinct from no", () => {
    const { states } = normaliseFeatureStates({
      accessible_toilet: "not_checked",
      ramp: "no",
    });

    expect(states.accessible_toilet).toBe("not_checked");
    expect(states.ramp).toBe("no");
    expect(states.accessible_toilet).not.toBe(states.ramp);
  });

  it("reports unknown keys instead of storing them", () => {
    const { states, unknownKeys } = normaliseFeatureStates({
      accessible_toilet: "yes",
      swimming_pool: "yes",
      ramp: "maybe",
    });

    expect(states).toEqual({ accessible_toilet: "yes" });
    expect(unknownKeys).toEqual(["swimming_pool", "ramp"]);
  });

  it("does not invent states from missing values", () => {
    expect(isFeatureState(undefined)).toBe(false);
    expect(isFeatureState("")).toBe(false);
    expect(normaliseFeatureStates(null).states).toEqual({});
  });

  it("orders features for display regardless of input order", () => {
    const ordered = orderedFeatures([
      { feature_key: "accessible_toilet" },
      { feature_key: "step_free_entrance" },
      { feature_key: "ramp" },
    ]).map((row) => row.feature_key);

    expect(ordered).toEqual(["step_free_entrance", "ramp", "accessible_toilet"]);
  });

  it("flags only a facility that is available today and reported gone", () => {
    expect(
      urgentCorrections(
        { accessible_toilet: "yes", ramp: "yes", lift: "yes" },
        { accessible_toilet: "no", ramp: "partial", lift: "not_checked" },
      ),
    ).toEqual(["accessible_toilet"]);
  });

  it("never treats not_checked or a new facility as urgent", () => {
    expect(
      urgentCorrections(
        { ramp: "not_checked", lift: "no" },
        { ramp: "no", lift: "no" },
      ),
    ).toEqual([]);
  });
});
