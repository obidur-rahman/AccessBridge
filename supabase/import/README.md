# Structured import

Use this when a batch of places has already been researched and needs to enter
the pilot without being typed in one by one. It never publishes anything.

## Rules

- Every imported listing is created as `draft` with
  `ingestion_method = 'structured_import'`.
- Every imported observation is created as `pending`, even when the source is
  official.
- A reviewer must accept each observation before it appears in the public
  directory. Accepting publishes the listing and labels the source from the
  observation's `source_type`.
- One row is one place with one observation. Add a second row for the same
  place only if it is genuinely a different place record.

## Columns

`listings.template.csv` shows the exact header. Required: `name_en`, `category`,
`source_type`, `source_label`, `observed_at`, and at least one feature column.

- `category`: `benefits`, `government`, `health`, `accessibility`, `transport`, `ngo`
- `source_type`: `official_source`, `organisation_source`, `reviewer_observation`, `community_report`, `other`
- `location_precision`: `verified`, `approximate`, `unknown` (defaults to `unknown`)
- Feature columns: `yes`, `no`, `partial`, `not_checked`, `not_applicable`, or blank
- `observed_at`: `YYYY-MM-DD`, not in the future
- `latitude` and `longitude`: both or neither
- `website_url` and `source_url`: `http(s)` only

Blank optional cells become `null`, never an inferred state. An empty feature
cell means "not part of this observation", not `not_checked`.

## Use

```bash
# Validate and print SQL for review
node scripts/import-listings.mjs supabase/import/my-batch.csv

# Validate and write the SQL to a file
node scripts/import-listings.mjs supabase/import/my-batch.csv --sql import.sql

# Validate and insert through the REST API
NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
  node scripts/import-listings.mjs supabase/import/my-batch.csv --apply
```

The script stops on the first invalid file and prints every problem with its
line number; nothing is written when validation fails. `--apply` needs the
service-role key because anonymous inserts may not create observations. Keep
that key on your machine only.
