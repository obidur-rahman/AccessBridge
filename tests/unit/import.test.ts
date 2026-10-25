import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  CATEGORIES as IMPORT_CATEGORIES,
  COLUMNS,
  SOURCE_TYPES as IMPORT_SOURCE_TYPES,
  parseCsv,
  toSql,
  validateRows,
} from "../../scripts/import-listings.mjs";
import { CATEGORIES } from "@/lib/types";
import { SOURCE_TYPES } from "@/lib/source-labels";

const template = readFileSync(
  resolve(process.cwd(), "supabase/import/listings.template.csv"),
  "utf8",
);

function cell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function row(overrides: Record<string, string> = {}) {
  const base: Record<string, string> = {
    name_en: "Test Place",
    category: "health",
    source_type: "official_source",
    source_label: "Official source",
    observed_at: "2026-01-15",
    step_free_entrance: "yes",
    ...overrides,
  };
  return COLUMNS.map((column) => cell(base[column] ?? "")).join(",");
}

function csv(overrides: Record<string, string> = {}, header = COLUMNS) {
  return `${header.join(",")}\n${row(overrides)}\n`;
}

describe("import format", () => {
  it("keeps the script vocabulary in step with the app", () => {
    expect(IMPORT_CATEGORIES).toEqual(CATEGORIES);
    expect(IMPORT_SOURCE_TYPES).toEqual(SOURCE_TYPES);
  });

  it("accepts the shipped template", () => {
    const result = validateRows(template);
    expect(result.errors).toEqual([]);
    expect(result.records).toHaveLength(2);
  });

  it("parses quotes, commas, and doubled quotes", () => {
    const rows = parseCsv('a,b\n"x, y","he said ""hi"""\n');
    expect(rows).toEqual([
      ["a", "b"],
      ["x, y", 'he said "hi"'],
    ]);
  });

  it("treats blank feature cells as absent, not as not_checked", () => {
    const result = validateRows(csv({ ramp: "", step_free_entrance: "no" }));
    expect(result.errors).toEqual([]);
    expect(result.records[0].feature_states).toEqual({ step_free_entrance: "no" });
  });

  it("requires provenance and at least one state", () => {
    expect(validateRows(csv({ source_label: "" })).errors[0].message).toMatch(/source_label/);
    expect(validateRows(csv({ step_free_entrance: "" })).errors[0].message).toMatch(
      /At least one feature/,
    );
  });

  it("rejects unknown vocabulary and future dates", () => {
    expect(validateRows(csv({ category: "restaurant" })).errors[0].message).toMatch(/category/);
    expect(validateRows(csv({ source_type: "blog" })).errors[0].message).toMatch(/source_type/);
    expect(validateRows(csv({ observed_at: "2099-01-01" })).errors[0].message).toMatch(/future/);
    expect(validateRows(csv({ ramp: "maybe" })).errors[0].message).toMatch(/ramp/);
  });

  it("requires both coordinates together", () => {
    const result = validateRows(csv({ latitude: "22.3", longitude: "" }));
    expect(result.errors[0].message).toMatch(/latitude and longitude/);
  });

  it("rejects unknown columns", () => {
    const result = validateRows(csv({}, [...COLUMNS, "typo_column"]));
    expect(result.errors[0].message).toMatch(/Unknown column/);
  });

  it("writes drafts and pending observations only", () => {
    const { records } = validateRows(csv());
    const sql = toSql(records);
    expect(sql).toContain("'structured_import', 'draft'");
    expect(sql).toContain("'pending'");
    expect(sql).not.toContain("'published'");
    expect(sql).not.toContain("'accepted'");
  });

  it("escapes single quotes in generated SQL", () => {
    const { records } = validateRows(csv({ name_en: "O'Brien Centre" }));
    expect(toSql(records)).toContain("'O''Brien Centre'");
  });
});
