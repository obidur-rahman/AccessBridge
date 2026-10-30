# AccessBridge

AccessBridge is a free, mobile-friendly accessibility directory for a Chattogram pilot. A visitor searches for a place, checks feature-level accessibility details with a source and a date, and can report an update. A reviewer approves every report before it changes public information.

The specification pack lives in [`docs/`](docs/README.md). The design system is in [`DESIGN.md`](DESIGN.md), operations are in [`docs/RUNBOOK.md`](docs/RUNBOOK.md), and agent instructions are in [`AGENTS.md`](AGENTS.md).

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · Supabase (PostgreSQL, Auth, Row Level Security) · Vercel. The map is Leaflet with OpenStreetMap tiles and loads only when the visitor asks for it.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Environment values come from `.env.local`, which is never committed; `.env.example` documents the names.

## Demo mode and the database

Demo mode is **on by default, in every environment, including the deployment**. The app serves the labelled demo records in `lib/data/demo.ts`, keeps reports and reviewer decisions in memory, and offers **Continue as demo reviewer** on `/login`, so the pending → accepted flow can be followed end to end. Nothing held in memory survives a server restart.

The pilot Supabase project is connected in `.env.local`, but the schema is not applied yet, so the deployment stays on demo records until `NEXT_PUBLIC_DEMO_MODE=0` is set.

To switch to the real database:

1. Apply `supabase/migrations/20261025000000_init.sql` to the project.
2. Optionally load `supabase/seed.sql` for demo records. Never publish it.
3. Create a staff user in Supabase Auth, then insert a row in `profiles` with role `reviewer` or `admin`.
4. Set `NEXT_PUBLIC_DEMO_MODE=0` and restart.
5. Test the policies as anonymous, reviewer, and admin sessions.

Reports are inserted by the server endpoint with the publishable key. That works because the migration adds narrowly scoped anonymous insert policies: a submission can only arrive as `pending`, cannot name a reviewer, and cannot publish a listing. If you set `SUPABASE_SERVICE_ROLE_KEY`, the endpoint uses it instead.

Structured batches use the same rule: `scripts/import-listings.mjs` writes draft places and pending observations only, and a reviewer must accept each one. Format and commands are in [`supabase/import/README.md`](supabase/import/README.md).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm test` | Unit tests for state rules, freshness, validation, search, and imports, plus integration tests for submit → review → public |
| `npm run import:listings -- <file.csv>` | Validate a structured import and print SQL (add `--apply` to insert drafts) |

## Design rules that are not negotiable

- `Not checked` is never rendered as `No`, and `No` is never inferred from a blank field.
- A pending report never changes public data. Only accepted observations are public.
- Every published accessibility fact shows a source label and an observation date.
- One overall "accessible" verdict is never shown for a venue.
- No disability questions. Search terms, filters, and location stay in the browser.
- Access control lives in Row Level Security and server-side checks, not in hidden buttons.
- A state is a word first; colour only repeats it.

## Known limits before a pilot

- Bangla interface text needs a native-speaker review, and free-text observation notes appear in whichever language the contributor used, because the schema stores one `notes_public` value per observation.
- The OpenStreetMap tile usage policy and attribution need confirmation (`TO VERIFY` in `docs/02_TRD.md`).
- Supabase, Vercel, and tile-provider free-tier terms, backups, and data-retention rules are unchecked.
- The 180-day re-check period in `lib/freshness.ts` is a proposal awaiting approval.
- Rate limiting on report submission is per server instance only.
- Duplicate warnings, AI features, trust scores, and email or SMS receipts are out of scope for this release.
