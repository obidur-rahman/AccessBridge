# Runbook

Operational notes for the AccessBridge pilot. Everything here is written for a
single maintainer with access to the Supabase project and the deployment.

## 1. Environment

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | build + server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | build + server | Publishable key; safe to ship |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | Bypasses RLS for report submission and imports. Never expose to the browser |
| `NEXT_PUBLIC_DEMO_MODE` | build | `0` reads and writes Supabase; unset or any other value keeps the labelled demo data |
| `NEXT_PUBLIC_SITE_URL` | build | Canonical URL for metadata, sitemap, robots |

Demo mode is on unless `NEXT_PUBLIC_DEMO_MODE=0`: it serves the labelled demo
records and an in-memory reviewer even when Supabase is configured. The pilot
deployment sets `0` and runs on the database once the migration is applied;
demo records are never mixed into a database dataset. Keep `.env.local` out of
git.

### Demo mode on more than one server instance

Demo reports, decisions, staff entries and audit events live in the memory of
the Node process that handled the request. One long-running server (`next start`
on a single machine) keeps them until it restarts. A serverless host such as
Vercel can serve `POST /api/reports` and `GET /review` from different instances,
so a report accepted by one instance is missing from the queue rendered by
another. The browser is not the cause; the store is simply per process.

A durable review queue therefore needs the database: apply the migration,
create a staff user, set `NEXT_PUBLIC_DEMO_MODE=0`, and redeploy. Keep demo mode
for showing the interface, not for collecting reports.

## 2. First database setup

1. Create the project, then open **SQL Editor** and run
   `supabase/migrations/20261025000000_init.sql`. It is written to be run once
   on an empty project.
2. Optional: run `supabase/seed.sql` for the demo records. Never seed a
   production project that will hold real data.
3. Create each staff user in **Authentication → Users**, then insert their role:

   ```sql
   insert into public.profiles (id, role)
   values ('<auth-user-uuid>', 'reviewer');
   ```

   `reviewer` can decide reports; `admin` can also manage roles.
4. Set `NEXT_PUBLIC_DEMO_MODE=0` in the deployment environment and redeploy.
5. Verify: the home page shows no demo banner, `/login` offers no demo button,
   `/review` is unreachable while signed out, and an anonymous insert into
   `accessibility_observations` is refused by RLS.

Applying SQL directly with `psql` also works if the connection host is
reachable:

```bash
psql "postgresql://postgres:<password>@db.<ref>.supabase.co:5432/postgres" \
  -v ON_ERROR_STOP=1 -f supabase/migrations/20261025000000_init.sql
```

Some networks reach Supabase only through the IPv4 pooler
(`aws-0-<region>.pooler.supabase.com:6543`, user `postgres.<ref>`). Use the
connection string from **Project Settings → Database** rather than editing one
by hand.

## 3. Reviewer accounts

- Create the auth user first, then the `profiles` row. An auth user with no
  profile cannot review anything.
- To suspend someone, set `profiles.active = false`; the server checks it on
  every request.
- Reviewers cannot change their own role. Role changes are an admin action and
  should be recorded with an `audit_log` row where practical.
- Every decision writes `observation_accept`, `observation_accept_edited`,
  `observation_reject`, or `observation_need_info` to `audit_log`.

## 4. Structured import

```bash
node scripts/import-listings.mjs supabase/import/my-batch.csv --sql import.sql
node scripts/import-listings.mjs supabase/import/my-batch.csv --apply
```

- Validate first; the script prints every problem with a line number and writes
  nothing when any row fails.
- SQL output is one transaction and creates drafts and pending observations
  only. Review it before running it in the SQL editor.
- `--apply` needs `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
  and inserts through the REST API. Run it from a trusted machine.
- Imported places stay invisible until a reviewer accepts their observation.
  Accepting sets the source label from the observation's `source_type`, so an
  official record is not published as a community report.
- The format is documented in `supabase/import/README.md`.

## 5. Backup, restore, retention

- Confirm the project's backup plan in the Supabase dashboard before the
  pilot; free-tier retention differs from paid projects. **TO VERIFY.**
- Manual logical backup:

  ```bash
  pg_dump "$DATABASE_URL" --format=custom --no-owner --file=accessbridge.dump
  ```

  Store the file encrypted and never commit it.
- Restore rehearsal: `pg_restore --clean --if-exists --no-owner -d "$DATABASE_URL" accessbridge.dump`.
  Run this against a scratch project, not production.
- Report retention: the pilot period is not yet approved. Until it is, keep
  rejected and needs-more-information reports, and delete private contact
  details once a report has been decided and no follow-up is open:

  ```sql
  update public.accessibility_observations
  set contact_private = null
  where review_status in ('accepted', 'rejected')
    and reviewed_at < now() - interval '30 days'
    and contact_private is not null;
  ```

  Record the decision on retention in `docs/01_PRD.md` when the owner approves
  a period, then schedule this statement.

## 6. Pilot measures

Run these in the SQL editor; no analytics script is loaded on the site.

```sql
-- Places with at least one reviewed observation
select count(distinct o.listing_id) as places_with_reviewed_details
from public.accessibility_observations o
where o.review_status = 'accepted';

-- Accepted, rejected, awaiting review
select review_status, count(*) from public.accessibility_observations group by 1;

-- Median time from submission to decision, in hours
select round(percentile_cont(0.5) within group (
  order by extract(epoch from (reviewed_at - submitted_at)) / 3600
)::numeric, 1) as median_hours
from public.accessibility_observations
where reviewed_at is not null;

-- Share of public observations with a source label and a date
select
  count(*) filter (where source_label is not null and observed_at is not null)::float
    / nullif(count(*), 0) as sourced_share
from public.accessibility_observations
where review_status = 'accepted';
```

Usability-test completion and accessibility issues are recorded outside the
database, in the pilot notes.

## 7. Incidents

| Symptom | Check |
|---|---|
| Home shows the demo banner in production | Expected until the database is ready: set `NEXT_PUBLIC_DEMO_MODE=0` and redeploy |
| Reports fail with `not_configured` | Server env missing in the deployment platform |
| Reports fail with `insert_failed` | Migration not applied, RLS policy changed, or `SUPABASE_SERVICE_ROLE_KEY` belongs to another project |
| Reviewer sees an empty queue but reports were submitted | Reports are pending in another project, or `profiles.active` is false |
| Map tiles blank | Tile request blocked; written addresses still work by design |
| Key suspected leaked | Rotate the publishable and service-role keys in Supabase, update the deployment env, redeploy |

Rate limiting on `/api/reports` is in-memory and per server instance; it slows
casual abuse but is not a distributed defence. If submission abuse appears,
disable the endpoint at the edge and review the queue.

## 8. Map

The map loads only after a visitor selects **Show map**, and the notice states
that the provider receives a request. Tiles come from `tile.openstreetmap.org`
with "© OpenStreetMap contributors" attribution. Confirm the tile usage policy
and free-tier terms before the pilot; switch the tile URL and attribution in
`components/map/MapView.tsx` if a different provider is chosen.
