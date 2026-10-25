import { beforeEach, describe, expect, it } from "vitest";
import type { Reviewer } from "@/lib/auth";
import { resetDemoData } from "@/lib/data/demo";
import { getDirectory, getPlace } from "@/lib/data/places";
import { decideReport, listReviewQueue, submitReport } from "@/lib/data/reports";
import { todayIso } from "@/lib/i18n/core";
import type { FeatureState, PlaceDetail } from "@/lib/types";
import { validateReport } from "@/lib/validation/report";

process.env.NEXT_PUBLIC_DEMO_MODE = "1";

const OFFICE = "00000000-0000-4000-8000-000000000003";
const CLINIC = "00000000-0000-4000-8000-000000000002";

const reviewer: Reviewer = {
  id: "11111111-1111-4111-8111-111111111111",
  role: "reviewer",
  demo: true,
  email: null,
};

function validated(input: Record<string, unknown>) {
  const result = validateReport(input, todayIso());
  if (!result.ok) {
    throw new Error(`Fixture did not validate: ${JSON.stringify(result.errors)}`);
  }
  return result.value;
}

async function place(id: string): Promise<PlaceDetail> {
  const result = await getPlace(id);
  if (!result.ok || !result.place) throw new Error(`Place ${id} was not found`);
  return result.place;
}

function stateOf(detail: PlaceDetail, key: string): FeatureState | undefined {
  return detail.features.find((feature) => feature.feature_key === key)?.state;
}

async function pendingItem(receipt: string) {
  const queue = await listReviewQueue(reviewer);
  if (!queue.ok) throw new Error("Queue failed");
  const item = queue.items.find((entry) => entry.public_receipt_token === receipt);
  if (!item) throw new Error("Report was not in the queue");
  return item;
}

async function submit(features: Record<string, FeatureState>, extra: Record<string, unknown> = {}) {
  const result = await submitReport(
    validated({
      listingId: OFFICE,
      featureStates: features,
      observedAt: todayIso(),
      ...extra,
    }),
  );
  if (!result.ok) throw new Error(`Submit failed: ${result.error}`);
  return result.receipt;
}

beforeEach(() => {
  resetDemoData();
});

describe("report → review → public", () => {
  it("keeps a pending report out of the public data until it is accepted", async () => {
    const receipt = await submit({ accessible_toilet: "no" });
    const item = await pendingItem(receipt);

    expect(stateOf(await place(OFFICE), "accessible_toilet")).toBe("not_checked");

    const decision = await decideReport({
      id: item.id,
      reviewer,
      decision: "accept",
      reason: "",
    });
    expect(decision).toEqual({ ok: true });

    const accepted = await place(OFFICE);
    expect(stateOf(accepted, "accessible_toilet")).toBe("no");
    const feature = accepted.features.find((entry) => entry.feature_key === "accessible_toilet");
    expect(feature?.source_label).toBe("Community report, reviewed");
    expect(feature?.observed_at).toBe(todayIso());
  });

  it("publishes a proposed place only when its report is accepted", async () => {
    const result = await submitReport(
      validated({
        listingId: "new",
        newPlaceName: "Integration Test Library",
        newPlaceCategory: "accessibility",
        newPlaceAddress: "Test Road, Chattogram",
        featureStates: { ramp: "yes" },
        observedAt: todayIso(),
      }),
    );
    if (!result.ok) throw new Error("Submit failed");

    const item = await pendingItem(result.receipt);
    expect(item.is_new_place).toBe(true);
    const listingId = item.listing_id;
    if (!listingId) throw new Error("Draft listing id missing");

    const before = await getDirectory();
    expect(before.ok && before.listings.some((listing) => listing.id === listingId)).toBe(false);

    const hidden = await getPlace(listingId);
    if (!hidden.ok) throw new Error("Place lookup failed");
    expect(hidden.place).toBeNull();

    const decision = await decideReport({
      id: item.id,
      reviewer,
      decision: "accept",
      reason: "",
    });
    expect(decision).toEqual({ ok: true });

    const after = await getDirectory();
    expect(after.ok && after.listings.find((listing) => listing.id === listingId)?.name_en).toBe(
      "Integration Test Library",
    );

    const published = await place(listingId);
    expect(stateOf(published, "ramp")).toBe("yes");
  });

  it("publishes corrected states and leaves the rest as submitted", async () => {
    const receipt = await submit({ step_free_entrance: "yes", ramp: "no" });
    const item = await pendingItem(receipt);

    await decideReport({
      id: item.id,
      reviewer,
      decision: "accept",
      reason: "Corrected after a second visit.",
      edits: { step_free_entrance: "partial" },
    });

    const published = await place(OFFICE);
    expect(stateOf(published, "step_free_entrance")).toBe("partial");
    expect(stateOf(published, "ramp")).toBe("no");
  });

  it("rejects unknown feature keys in corrections", async () => {
    const receipt = await submit({ ramp: "yes" });
    const item = await pendingItem(receipt);

    const decision = await decideReport({
      id: item.id,
      reviewer,
      decision: "accept",
      reason: "",
      edits: { not_a_feature: "yes" },
    });

    expect(decision).toEqual({ ok: false, error: "invalid_edits" });
    expect((await place(OFFICE)).features.some((entry) => entry.feature_key === "not_a_feature")).toBe(
      false,
    );
  });

  it("requires a reason to reject or request more information", async () => {
    const receipt = await submit({ ramp: "no" });
    const item = await pendingItem(receipt);

    expect(
      await decideReport({ id: item.id, reviewer, decision: "reject", reason: "  " }),
    ).toEqual({ ok: false, error: "reason_required" });

    expect(
      await decideReport({
        id: item.id,
        reviewer,
        decision: "reject",
        reason: "Report describes a different entrance.",
      }),
    ).toEqual({ ok: true });

    expect(stateOf(await place(OFFICE), "ramp")).toBe("partial");
    const queue = await listReviewQueue(reviewer);
    expect(queue.ok && queue.items.find((entry) => entry.id === item.id)).toBeFalsy();
  });

  it("does not touch public data when a different listing is reported", async () => {
    const before = stateOf(await place(CLINIC), "accessible_toilet");

    const receipt = await submit({ accessible_toilet: "partial" });
    const item = await pendingItem(receipt);
    await decideReport({ id: item.id, reviewer, decision: "accept", reason: "" });

    expect(stateOf(await place(CLINIC), "accessible_toilet")).toBe(before);
  });
});
