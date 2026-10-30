import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const sql = readFileSync("supabase/seed.sql", "utf8");

/** Split the seed into `insert into public.<table> (...cols) values (...);` parts. */
function statements(text) {
  const found = [];
  const pattern = /insert into public\.(\w+) \(([\s\S]*?)\) values([\s\S]*?);/g;
  let match;
  while ((match = pattern.exec(text))) {
    found.push({
      table: match[1],
      columns: match[2].split(",").map((name) => name.trim()),
      body: match[3],
    });
  }
  return found;
}

/** Read the value tuples, honouring quoted strings and null. */
function valueRows(body) {
  const result = [];
  let index = 0;

  while (index < body.length) {
    if (body[index] !== "(") {
      index += 1;
      continue;
    }

    index += 1;
    const values = [];
    let current = "";
    let quoted = false;
    let inString = false;

    while (index < body.length) {
      const char = body[index];

      if (inString) {
        if (char === "'") {
          if (body[index + 1] === "'") {
            current += "'";
            index += 2;
            continue;
          }
          inString = false;
          index += 1;
          continue;
        }
        current += char;
        index += 1;
        continue;
      }

      if (char === "'") {
        inString = true;
        quoted = true;
        index += 1;
        continue;
      }

      if (char === ",") {
        values.push(convert(current, quoted));
        current = "";
        quoted = false;
        index += 1;
        continue;
      }

      if (char === ")") {
        values.push(convert(current, quoted));
        index += 1;
        break;
      }

      current += char;
      index += 1;
    }

    result.push(values);
  }

  return result;
}

function convert(raw, quoted) {
  const text = raw.trim();
  if (quoted) {
    const withoutCast = text.endsWith("::jsonb") ? text.slice(0, -"::jsonb".length) : text;
    return withoutCast;
  }
  if (text === "null" || text === "") return null;
  if (text === "true") return true;
  if (text === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(text)) return Number(text);
  return text;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

for (const statement of statements(sql)) {
  const rows = valueRows(statement.body).map((values) =>
    Object.fromEntries(statement.columns.map((column, i) => [column, values[i] ?? null])),
  );

  if (statement.table === "accessibility_observations") {
    for (const row of rows) {
      row.feature_states = JSON.parse(row.feature_states);
    }
  }

  const { error } = await supabase.from(statement.table).upsert(rows, { onConflict: "id" });
  console.log(statement.table, rows.length, error ? `ERROR ${error.message}` : "ok");
}

const listings = await supabase.from("listings").select("id", { count: "exact", head: true });
const observations = await supabase
  .from("accessibility_observations")
  .select("id", { count: "exact", head: true });
const sample = await supabase
  .from("public_listings")
  .select("name_en")
  .order("name_en")
  .limit(3);

console.log(
  JSON.stringify({
    listings: listings.count,
    observations: observations.count,
    sample: (sample.data ?? []).map((row) => row.name_en),
  }),
);
