import { describe, expect, it } from "vitest";
import { FRESHNESS_DAYS, daysBetween, observationAge } from "@/lib/freshness";

describe("observation freshness", () => {
  it("uses a single 180-day constant", () => {
    expect(FRESHNESS_DAYS).toBe(180);
  });

  it("counts whole days between date-only values", () => {
    expect(daysBetween("2026-10-01", "2026-10-25")).toBe(24);
    expect(daysBetween("2026-10-25", "2026-10-25")).toBe(0);
  });

  it("keeps an observation inside the window current", () => {
    expect(observationAge("2026-05-01", "2026-10-25")).toBe("current");
  });

  it("marks the exact boundary as still current", () => {
    // 2026-04-28 + 180 days = 2026-10-25
    expect(daysBetween("2026-04-28", "2026-10-25")).toBe(180);
    expect(observationAge("2026-04-28", "2026-10-25")).toBe("current");
  });

  it("marks an observation one day past the window for re-check", () => {
    expect(observationAge("2026-04-27", "2026-10-25")).toBe("needs_recheck");
  });

  it("treats a future date as current rather than an error", () => {
    expect(observationAge("2027-01-01", "2026-10-25")).toBe("current");
  });

  it("accepts a timestamp as well as a date", () => {
    expect(daysBetween("2026-10-01T18:00:00Z", "2026-10-25")).toBe(24);
  });
});
