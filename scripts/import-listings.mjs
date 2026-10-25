#!/usr/bin/env node
/**
 * Structured import for AccessBridge.
 *
 * Every imported place is written as a draft listing, and its observation is
 * written as pending. Nothing imported becomes public until a reviewer accepts
 * it, which is the same rule the database enforces.
 *
 *   node scripts/import-listings.mjs supabase/import/listings.csv
 *       Validate the file and print SQL for review.
 *   node scripts/import-listings.mjs supabase/import/listings.csv --sql import.sql
 *       Validate and write the SQL to a file.
 *   node scripts/import-listings.mjs supabase/import/listings.csv --apply
 *       Validate and insert through the Supabase REST API. Requires
 *       NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

export const CATEGORIES = [
  "benefits",
  "government",
  "health",
  "accessibility",
  "transport",
  "ngo",
];

export const SOURCE_TYPES = [
  "official_source",
  "organisation_source",
  "reviewer_observation",
  "community_report",
  "other",
];

export const STATES = ["yes", "no", "partial", "not_checked", "not_applicable"];

export const FEATURE_COLUMNS = [
  "step_free_entrance",
  "entrance_steps",
  "ramp",
  "lift",
  "toilet_available",
  "accessible_toilet",
  "internal_step_free_route",
  "accessible_parking",
  "accessible_seating",
  "other_access_note",
];

export const COLUMNS = [
  "name_en",
  "name_bn",
  "category",
  "place_type",
  "summary_en",
  "summary_bn",
  "address_en",
  "address_bn",
  "area_name",
  "website_url",
  "latitude",
  "longitude",
  "location_precision",
  "source_type",
  "source_label",
  "source_url",
  "observed_at",
  "notes_public",
  ...FEATURE_COLUMNS,
];

const LIMITS = {
  name: 120,
  address: 200,
  summary: 300,
  note: 500,
  url: 500,
  label: 120,
  placeType: 60,
  area: 80,
};

const PRECISIONS = ["verified", "approximate", "unknown"];

/** RFC 4180-style parser: quoted fields, doubled quotes, CRLF, UTF-8 BOM. */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  const input = text.replace(/^\uFEFF/, "");

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];

    if (quoted) {
      if (char === '"') {
        if (input[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (quoted) throw new Error("Unclosed quoted field");
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((cells) => cells.some((cell) => cell.trim() !== ""));
}

function clean(value) {
  return (value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function isIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Validate header + rows. Returns records or one error per offending line. */
export function validateRows(csvText) {
  const rows = parseCsv(csvText);
  const errors = [];

  if (rows.length === 0) {
    return { records: [], errors: [{ line: 1, message: "The file is empty." }] };
  }

  const header = rows[0].map((cell) => clean(cell));
  const duplicate = header.find((cell, index) => header.indexOf(cell) !== index);
  if (duplicate) {
    errors.push({ line: 1, message: `Duplicate column "${duplicate}".` });
  }
  const unknown = header.filter((cell) => !COLUMNS.includes(cell));
  if (unknown.length > 0) {
    errors.push({ line: 1, message: `Unknown column(s): ${unknown.join(", ")}.` });
  }

  const missing = COLUMNS.filter((column) => column !== "name_bn" && !header.includes(column));
  if (missing.length > 0) {
    errors.push({ line: 1, message: `Missing required column(s): ${missing.join(", ")}.` });
  }

  if (errors.length > 0) return { records: [], errors };

  const records = [];

  rows.slice(1).forEach((cells, rowIndex) => {
    const line = rowIndex + 2;
    const raw = {};
    header.forEach((column, columnIndex) => {
      raw[column] = clean(cells[columnIndex]);
    });

    const fail = (message) => errors.push({ line, message });

    for (const key of ["name_en", "category", "source_type", "source_label", "observed_at"]) {
      if (!raw[key]) fail(`${key} is required.`);
    }

    if (raw.name_en.length > LIMITS.name) fail(`name_en is longer than ${LIMITS.name} characters.`);
    if (!CATEGORIES.includes(raw.category) && raw.category) {
      fail(`category must be one of: ${CATEGORIES.join(", ")}.`);
    }
    if (!SOURCE_TYPES.includes(raw.source_type) && raw.source_type) {
      fail(`source_type must be one of: ${SOURCE_TYPES.join(", ")}.`);
    }
    if (!isIsoDate(raw.observed_at) && raw.observed_at) {
      fail("observed_at must be a real date in YYYY-MM-DD form.");
    }
    if (raw.observed_at && isIsoDate(raw.observed_at) && raw.observed_at > new Date().toISOString().slice(0, 10)) {
      fail("observed_at cannot be in the future.");
    }

    for (const key of ["address_en", "address_bn"]) {
      if (raw[key].length > LIMITS.address) fail(`${key} is longer than ${LIMITS.address} characters.`);
    }
    for (const key of ["summary_en", "summary_bn"]) {
      if (raw[key].length > LIMITS.summary) fail(`${key} is longer than ${LIMITS.summary} characters.`);
    }
    if (raw.notes_public.length > LIMITS.note) fail(`notes_public is longer than ${LIMITS.note} characters.`);
    if (raw.source_label.length > LIMITS.label) fail(`source_label is longer than ${LIMITS.label} characters.`);

    for (const key of ["website_url", "source_url"]) {
      if (raw[key] && (!isHttpUrl(raw[key]) || raw[key].length > LIMITS.url)) {
        fail(`${key} must be an http(s) URL of at most ${LIMITS.url} characters.`);
      }
    }

    const precision = raw.location_precision || "unknown";
    if (!PRECISIONS.includes(precision)) {
      fail(`location_precision must be one of: ${PRECISIONS.join(", ")}.`);
    }

    const hasLat = raw.latitude !== "";
    const hasLng = raw.longitude !== "";
    let latitude = null;
    let longitude = null;
    if (hasLat !== hasLng) {
      fail("latitude and longitude must both be set or both be empty.");
    } else if (hasLat && hasLng) {
      latitude = Number(raw.latitude);
      longitude = Number(raw.longitude);
      if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
        fail("latitude must be a number between -90 and 90.");
      }
      if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
        fail("longitude must be a number between -180 and 180.");
      }
    }

    const featureStates = {};
    for (const key of FEATURE_COLUMNS) {
      const value = raw[key];
      if (!value) continue;
      if (!STATES.includes(value)) {
        fail(`${key} must be one of: ${STATES.join(", ")}.`);
        continue;
      }
      featureStates[key] = value;
    }
    if (Object.keys(featureStates).length === 0) {
      fail("At least one feature column must contain a state.");
    }

    if (errors.some((error) => error.line === line)) return;

    records.push({
      name_en: raw.name_en,
      name_bn: raw.name_bn || null,
      category: raw.category,
      place_type: raw.place_type || null,
      summary_en: raw.summary_en || null,
      summary_bn: raw.summary_bn || null,
      address_en: raw.address_en || null,
      address_bn: raw.address_bn || null,
      area_name: raw.area_name || null,
      website_url: raw.website_url || null,
      latitude,
      longitude,
      location_precision: precision,
      source_type: raw.source_type,
      source_label: raw.source_label,
      source_url: raw.source_url || null,
      observed_at: raw.observed_at,
      notes_public: raw.notes_public || null,
      feature_states: featureStates,
    });
  });

  return { records, errors };
}

function sqlText(value) {
  if (value === null || value === undefined) return "null";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlNumber(value) {
  return value === null || value === undefined ? "null" : String(value);
}

/** One transaction. Listings are drafts and observations are pending. */
export function toSql(records) {
  const statements = records.map((record) => {
    const features = JSON.stringify(record.feature_states).replaceAll("'", "''");
    return `with new_listing as (
  insert into public.listings (
    name_en, name_bn, category, place_type, summary_en, summary_bn,
    address_en, address_bn, area_name, website_url, latitude, longitude,
    location_precision, source_label, source_checked_at, ingestion_method,
    publication_status
  ) values (
    ${sqlText(record.name_en)}, ${sqlText(record.name_bn)}, ${sqlText(record.category)},
    ${sqlText(record.place_type)}, ${sqlText(record.summary_en)}, ${sqlText(record.summary_bn)},
    ${sqlText(record.address_en)}, ${sqlText(record.address_bn)}, ${sqlText(record.area_name)},
    ${sqlText(record.website_url)}, ${sqlNumber(record.latitude)}, ${sqlNumber(record.longitude)},
    ${sqlText(record.location_precision)}, ${sqlText(record.source_label)}, now(),
    'structured_import', 'draft'
  )
  returning id
)
insert into public.accessibility_observations (
  listing_id, feature_states, notes_public, observed_at, source_type,
  source_url, source_label, ingestion_method, review_status
)
select id, '${features}'::jsonb, ${sqlText(record.notes_public)}, ${sqlText(record.observed_at)},
  ${sqlText(record.source_type)}, ${sqlText(record.source_url)}, ${sqlText(record.source_label)},
  'structured_import', 'pending'
from new_listing;`;
  });

  return `-- Generated by scripts/import-listings.mjs on ${new Date().toISOString()}
-- ${records.length} place(s). Every row is a draft and awaits review.
begin;

${statements.join("\n\n")}

commit;
`;
}

/** Insert through the REST API with the service-role key. */
export async function applyRecords(records, env = process.env) {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for --apply.");
  }

  const headers = {
    apikey: key,
    authorization: `Bearer ${key}`,
    "content-type": "application/json",
    prefer: "return=representation",
  };

  const results = [];

  for (const record of records) {
    const listingResponse = await fetch(`${url}/rest/v1/listings`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name_en: record.name_en,
        name_bn: record.name_bn,
        category: record.category,
        place_type: record.place_type,
        summary_en: record.summary_en,
        summary_bn: record.summary_bn,
        address_en: record.address_en,
        address_bn: record.address_bn,
        area_name: record.area_name,
        website_url: record.website_url,
        latitude: record.latitude,
        longitude: record.longitude,
        location_precision: record.location_precision,
        source_label: record.source_label,
        source_checked_at: new Date().toISOString(),
        ingestion_method: "structured_import",
        publication_status: "draft",
      }),
    });

    if (!listingResponse.ok) {
      throw new Error(`Listing insert failed: ${await listingResponse.text()}`);
    }

    const [listing] = await listingResponse.json();

    const observationResponse = await fetch(`${url}/rest/v1/accessibility_observations`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        listing_id: listing.id,
        feature_states: record.feature_states,
        notes_public: record.notes_public,
        observed_at: record.observed_at,
        source_type: record.source_type,
        source_url: record.source_url,
        source_label: record.source_label,
        ingestion_method: "structured_import",
        review_status: "pending",
      }),
    });

    if (!observationResponse.ok) {
      throw new Error(`Observation insert failed: ${await observationResponse.text()}`);
    }

    results.push(listing.id);
  }

  return results;
}

async function main() {
  const args = process.argv.slice(2);
  const file = args.find((arg) => !arg.startsWith("--"));
  const apply = args.includes("--apply");
  const sqlIndex = args.indexOf("--sql");
  const sqlPath = sqlIndex >= 0 ? args[sqlIndex + 1] : null;

  if (!file) {
    process.stderr.write(
      "Usage: node scripts/import-listings.mjs <file.csv> [--sql <out.sql>] [--apply]\n",
    );
    process.exit(1);
  }

  const { records, errors } = validateRows(readFileSync(resolve(file), "utf8"));

  if (errors.length > 0) {
    for (const error of errors) {
      process.stderr.write(`line ${error.line}: ${error.message}\n`);
    }
    process.stderr.write(`\n${errors.length} problem(s). Nothing was imported.\n`);
    process.exit(1);
  }

  if (records.length === 0) {
    process.stderr.write("No data rows found.\n");
    process.exit(1);
  }

  if (apply) {
    const ids = await applyRecords(records);
    process.stdout.write(`Inserted ${ids.length} draft place(s), each awaiting review.\n`);
    return;
  }

  const sql = toSql(records);

  if (sqlPath) {
    writeFileSync(resolve(sqlPath), sql, "utf8");
    process.stdout.write(`Wrote ${records.length} place(s) to ${sqlPath}. Review it, then run it in Supabase.\n`);
    return;
  }

  process.stdout.write(sql);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exit(1);
  });
}
