import { beforeEach, describe, expect, it } from "vitest";
import {
  assignDemoReport,
  createDemoStaff,
  demoReports,
  escalateDemoReport,
  getDemoAdminSnapshot,
  pushDemoReport,
  resetDemoData,
  resolveDemoEscalation,
  updateDemoStaff,
} from "@/lib/data/demo";
import type { ReviewItem } from "@/lib/types";

function report(id: string, review_status: ReviewItem["review_status"] = "pending"): ReviewItem {
  return {
    id,
    listing_id: "listing-1",
    listing_name: "Demo place",
    listing_category: "accessibility",
    listing_address: null,
    is_new_place: false,
    feature_states: { ramp: "yes" },
    notes_public: null,
    observed_at: "2026-10-01",
    source_type: "community_report",
    source_url: null,
    review_status,
    review_reason: null,
    submitted_at: "2026-10-01T10:00:00.000Z",
    public_receipt_token: `receipt-${id}`,
    contact_private: null,
  };
}

beforeEach(() => resetDemoData());

describe("demo admin desk", () => {
  it("starts with demo staff and does not expose mutable store objects", () => {
    const snapshot = getDemoAdminSnapshot();
    expect(snapshot.staff.map((member) => member.role)).toEqual(["admin", "reviewer", "reviewer"]);
    snapshot.staff[1].active = false;
    expect(getDemoAdminSnapshot().staff[1].active).toBe(true);
  });

  it("adds and updates demo staff while retaining an active admin", () => {
    const member = createDemoStaff("  Prototype reviewer  ", "reviewer");
    expect(member.display_name).toBe("Prototype reviewer");
    expect(updateDemoStaff(member.id, { active: false })?.active).toBe(false);

    const admin = getDemoAdminSnapshot().staff[0];
    expect(updateDemoStaff(admin.id, { active: false })).toBeNull();
    expect(updateDemoStaff("demo-reviewer", { role: "reviewer" })).toBeNull();

    const snapshot = getDemoAdminSnapshot();
    expect(snapshot.staff.some((entry) => entry.id === member.id && !entry.active)).toBe(true);
  });

  it("only assigns open reports to active reviewers", () => {
    pushDemoReport(report("assignment"));
    const reviewers = getDemoAdminSnapshot().staff.filter((member) => member.role === "reviewer");
    expect(assignDemoReport("assignment", reviewers[0].id)).toBe(true);
    expect(demoReports()[0].assigned_to_name).toBe(reviewers[0].display_name);

    const inactive = updateDemoStaff(reviewers[0].id, { active: false });
    expect(inactive?.active).toBe(false);
    expect(assignDemoReport("assignment", reviewers[0].id)).toBe(false);
    expect(assignDemoReport("missing", null)).toBe(false);
  });

  it("escalates open reports, requires a resolution, and records audit history", () => {
    pushDemoReport(report("escalation"));
    expect(escalateDemoReport("escalation", " Safety concern ")).toBe(true);
    expect(demoReports()[0].escalation_reason).toBe("Safety concern");
    expect(escalateDemoReport("escalation", "again")).toBe(false);
    expect(resolveDemoEscalation("escalation", "  ")).toBe(false);
    expect(resolveDemoEscalation("escalation", "Admin reviewed the issue.")).toBe(true);
    expect(demoReports()[0].escalated).toBe(false);
    expect(demoReports()[0].escalation_resolution).toBe("Admin reviewed the issue.");

    const actions = getDemoAdminSnapshot().audit.map((event) => event.action);
    expect(actions).toEqual(["escalation_resolved", "report_escalated"]);
  });

  it("does not escalate a decided report", () => {
    pushDemoReport(report("decided", "rejected"));
    expect(escalateDemoReport("decided", "Needs attention")).toBe(false);
  });
});
