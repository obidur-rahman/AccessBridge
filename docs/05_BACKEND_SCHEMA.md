# 05 — Backend and Data Schema

**Database:** Supabase PostgreSQL  
**Authentication:** Supabase Auth for reviewers and admins

This is a logical schema. The team must approve the final SQL types and constraints before it creates migrations.

## 1. Data rules

1. Keep a listing separate from each accessibility observation.
2. Preserve old observations. Do not overwrite history silently.
3. A pending observation must not change public accessibility data.
4. Every published accessibility fact must have a source label and observation date.
5. Keep optional contact details and reviewer notes private.
6. Do not store a visitor's search filters, disability details, or precise device location.
7. Use Row Level Security on exposed tables.
8. Use server-side authorization for every protected action.

## 2. Logical tables

### 2.1 `listings`

One public place, service, benefit entry, transport point, or organisation.

| Field | Type | Required | Rule |
|---|---|---|---|
| `id` | UUID | Yes | Primary key |
| `name_en` | text | At least one name | English name when available |
| `name_bn` | text | At least one name | Bangla name when available |
| `category` | enum/text | Yes | `benefits`, `government`, `health`, `accessibility`, `transport`, `ngo` |
| `place_type` | text | No | Example: restaurant, clinic, office, bus stop, NGO office |
| `summary_en`, `summary_bn` | text | No | Short public summary |
| `address_en`, `address_bn` | text | No | Public address or landmark |
| `area_name` | text | No | Pilot area or ward label |
| `latitude`, `longitude` | numeric | No | Store only if the place pin is suitable for public display |
| `location_precision` | enum | No | `verified`, `approximate`, `unknown` |
| `phone_public`, `email_public`, `website_url` | text | No | Only public contact details |
| `source_type` | enum/text | Yes before publication | Official, organisation, reviewer, community, or other |
| `source_label` | text | Yes before publication | Public label for the listing information |
| `source_url` | text | No | Public source URL when available |
| `source_checked_at` | timestamptz | No | When the source was last checked |
| `ingestion_method` | enum/text | Yes | `manual_research`, `structured_import`, or `user_submission` |
| `import_batch_id` | text | No | Optional ID for tracing an imported batch |
| `opening_hours` | JSONB/text | No | Optional; validate structure if JSONB |
| `publication_status` | enum | Yes | `draft`, `published`, `archived` |
| `created_at`, `updated_at` | timestamptz | Yes | Set by database or server |
| `created_by` | UUID | No | Internal staff ID when applicable |

A physical place can have more than one category only if the team defines a clear rule. For the first release, one main category per listing is simpler. A restaurant can use `category = accessibility` and `place_type = restaurant`.

### 2.2 `accessibility_observations`

One observed set of accessibility facts for a listing. A new submission creates a new record. A reviewer accepts or rejects it; the system keeps earlier observations for history.

| Field | Type | Required | Rule |
|---|---|---|---|
| `id` | UUID | Yes | Primary key |
| `listing_id` | UUID | Yes | Foreign key to `listings.id` |
| `feature_states` | JSONB | Yes | Structured feature keys and states |
| `notes_public` | text | No | Short factual explanation approved for public display |
| `observed_at` | date | Yes | Date when the contributor observed the feature; allow an explicit unknown state if necessary |
| `source_type` | enum/text | Yes | `official_source`, `organisation_source`, `reviewer_observation`, `community_report`, `other` |
| `source_url` | text | No | Public link, when available |
| `source_label` | text | Yes | Human-readable label for display |
| `ingestion_method` | enum/text | Yes | `manual_research`, `structured_import`, or `user_submission` |
| `import_batch_id` | text | No | Optional ID for tracing an imported batch |
| `review_status` | enum | Yes | `pending`, `accepted`, `rejected`, `needs_more_info` |
| `reviewer_id` | UUID | No | Staff ID for the decision |
| `reviewed_at` | timestamptz | No | Set when reviewed |
| `review_reason` | text | No | Private reason or request for more information |
| `submitted_at` | timestamptz | Yes | Set on submission |
| `public_receipt_token` | text | No | Random token; do not use a sequential internal ID |

Suggested `feature_states` keys:

- `step_free_entrance`
- `entrance_steps`
- `ramp`
- `lift`
- `toilet_available`
- `accessible_toilet`
- `internal_step_free_route`
- `accessible_parking`
- `accessible_seating`
- `other_access_note`

Use only these state values unless a feature needs a special structure: `yes`, `no`, `partial`, `not_checked`, `not_applicable`. Do not use an empty field to mean `no`.

### 2.3 `profiles`

A protected extension of Supabase Auth users.

| Field | Type | Required | Rule |
|---|---|---|---|
| `user_id` | UUID | Yes | References the auth user |
| `role` | enum | Yes | `reviewer` or `admin` |
| `active` | boolean | Yes | Disabled staff cannot act |
| `created_at` | timestamptz | Yes | Audit field |

Do not let users set their own role. Only an admin can change roles.

### 2.4 `audit_log`

One record for each important staff action.

| Field | Type | Required | Rule |
|---|---|---|---|
| `id` | UUID | Yes | Primary key |
| `actor_id` | UUID | Yes | Authenticated staff ID |
| `action` | text | Yes | Example: accept observation, reject report, edit listing |
| `entity_type` | text | Yes | Listing, observation, profile |
| `entity_id` | UUID | Yes | Affected record |
| `reason` | text | No | Required for rejection or sensitive correction |
| `created_at` | timestamptz | Yes | Server-set time |

Audit records must not include unnecessary personal data or raw complaint contents.

## 3. Public read model

Create a safe query or view that returns only:

- Published listing fields and the approved listing source label.
- The latest accepted observation for each relevant feature or accepted observation set.
- The source label and source URL for each observation where available.
- Observation date and review status.
- Public contact details that the team approved for display.

Do not return pending submissions, private source notes, `review_reason`, optional contact details, profile data, or audit details.

## 4. Submission and publication rules

1. Manual research and structured imports create draft records with source provenance. An import must not publish records directly.
2. Anonymous submissions enter `pending` state.
3. A reviewer checks the content and evidence.
4. On acceptance, set `review_status = accepted`, record the reviewer and time, and add an audit event.
5. The public read model can then use the accepted observation.
6. On rejection, store a private reason and audit event. Do not show the rejected content publicly.
7. On `needs_more_info`, retain the pending record and do not change public data.
8. A new accepted observation supersedes the current public result for the same feature, but earlier observations remain available in history.
9. When a review changes a public result, show the new observation date and source label.

## 5. Row Level Security policy outline

| Data | Anonymous visitor | Reviewer | Admin |
|---|---|---|---|
| Published listing view | Read | Read | Read |
| Accepted public observations | Read | Read | Read |
| New report submission | Create only through constrained flow | Create | Create |
| Pending reports | No read access | Read and process | Read and process |
| Private source notes | No access | Assigned or allowed review access | Read |
| Optional contact | No access | Only if needed for review | Read |
| Audit log | No access | Limited read if required | Read |
| Staff profiles and roles | No access | Read own basic role only | Manage |

This is a policy outline, not deployable SQL. Implement and test the policies before launch. Do not rely only on the interface to protect data.

## 6. Indexes and constraints

- Index `listings.publication_status`, `category`, and `area_name`.
- Add a suitable name search index only after choosing the search method.
- Index `accessibility_observations.listing_id`, `review_status`, and `observed_at`.
- Validate category values, observation states, source types, and review states.
- Limit text lengths and JSONB payload sizes.
- Use a unique public receipt token where one is generated.

## 7. Retention and backup

**PROPOSAL:** Keep accepted observations for audit and comparison. Delete optional contact data after the follow-up window approved by the team. Define a retention period for rejected, spam, and abandoned reports before launch. Export the database regularly and test a restore. Do not assume the free hosting plan provides automatic backups.
