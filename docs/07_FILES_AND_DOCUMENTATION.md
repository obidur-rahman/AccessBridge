# 07 — Repository Layout and Documentation

Use one repository for the web application and its database migrations. Keep files close to the feature they support. Do not create separate services for the MVP.

## 1. Suggested repository layout

```text
shubidha-map/
├── app/
│   ├── page.tsx                     # Home and search
│   ├── places/[id]/page.tsx         # Place details
│   ├── report/page.tsx              # Report form
│   ├── review/page.tsx              # Protected review dashboard
│   └── api/
│       ├── reports/route.ts         # Validated report submission
│       └── review/route.ts          # Protected review actions, if needed
├── components/
│   ├── search/
│   ├── listing/
│   ├── accessibility/
│   ├── report/
│   └── review/
├── lib/
│   ├── supabase/                   # Server and client setup
│   ├── validation/                 # Shared schemas and allowed values
│   ├── access-features.ts          # Controlled feature list
│   ├── source-labels.ts             # Source label definitions
│   └── search.ts                    # Client-side filter logic
├── public/
│   └── locales/                    # Translation files if required
├── supabase/
│   ├── migrations/                 # Version-controlled SQL migrations
│   └── seed.sql                    # Demo data only
├── tests/
│   ├── unit/
│   ├── database/
│   └── e2e/
├── docs/
│   ├── PRD.md
│   ├── DATA_POLICY.md
│   └── RUNBOOK.md
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

This is a proposal. Use a smaller layout if the codebase stays small. Do not commit `.env.local`, service-role keys, real private contact data, or private reviewer notes.

## 2. File responsibilities

- `app/page.tsx`: public search and filters.
- `app/places/[id]/page.tsx`: public place data and feature-level accessibility details.
- `app/report/page.tsx`: new-place and correction forms.
- `app/review/page.tsx`: staff-only report queue and decision controls.
- `lib/access-features.ts`: feature IDs and allowed state values used in forms and rendering.
- `lib/source-labels.ts`: approved public source labels.
- `lib/validation/`: schema validation for client hints and server enforcement.
- `lib/search.ts`: search and filter logic that runs in the browser.
- `supabase/migrations/`: database schema and policy changes.
- `tests/`: tests for state rules, privacy, permissions, and main journeys.

## 3. Environment variables

Document variable names in `.env.example`, not real values. Likely values include the Supabase project URL, public anon key, and protected server-only key only if needed. Follow the current Supabase and Next.js guidance for environment-variable prefixes. Do not expose a service-role key through a `NEXT_PUBLIC_` variable.

## 4. Code rules

- Keep the form state vocabulary consistent with the database.
- Use one shared type for accessibility feature states.
- Validate on the server even when the form validates in the browser.
- Use typed database responses where practical.
- Keep public data queries separate from staff queries.
- Keep source labels consistent. Do not create ad hoc labels in page components.
- Do not automatically merge suspected duplicates.
- Do not put a secret or a private report in client-side logs.
- Add a test when a status rule or permission changes.

## 5. Documentation to maintain

`docs/PRD.md` should summarise the approved scope. `docs/DATA_POLICY.md` should explain source labels, report review, public display, retention, and privacy. `docs/RUNBOOK.md` should explain deployment, staff account creation, database export, restore, and incident handling.

Update the documentation when the team changes a public status, source label, category, or retention rule.
