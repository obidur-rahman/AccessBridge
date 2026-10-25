# 06 — Implementation Plan

## 1. Delivery goal

Build one useful pilot flow first: search for a place, check feature-level accessibility information, submit a report, review it, and publish the accepted observation. Avoid work that does not support this flow.

## 2. Phase plan

### Phase 0 — Confirm the rules

- Confirm the initial accessibility feature list with people with disabilities.
- Approve the six content categories and one main category per listing.
- Approve source labels and review rules.
- Define the report retention period and optional-contact deletion rule.
- Confirm free-tier terms for Supabase, Vercel, and any map tile provider.
- Choose whether the pilot needs a map. Search and written addresses must work without it.

**Exit check:** The team approves the first form fields and status vocabulary.

### Phase 1 — Data and staff access

- Create the Next.js project with TypeScript and Tailwind CSS.
- Create the Supabase project and version-controlled SQL migrations.
- Create `listings`, `accessibility_observations`, `profiles`, and `audit_log` tables. Add `sources` if source data needs a separate table.
- Configure Supabase Auth for reviewer and admin accounts.
- Configure Row Level Security. Test anonymous read, anonymous submission, reviewer action, and admin action.
- Prepare a small CSV import template for structured data and a controlled import script or documented import process.
- Add initial records from both manual research and structured imports. Every record must retain its source label and ingestion method. Imported records remain drafts until validated and approved.
- Add a small set of clearly labelled demo records for development only.

**Exit check:** Anonymous users cannot read pending reports or staff-only fields. Initial imported records have source provenance and cannot bypass review.

### Phase 2 — Public directory

- Build the home page and search field.
- Add category and area filters.
- Add result cards and place detail pages.
- Show accessibility features with separate states.
- Show each source label and observation date.
- Add an explicit `Not checked` state.
- Add a contact-before-travel reminder.
- Add Bangla and English interface labels.

**Exit check:** A test participant can find a place and understand one feature's state, source, and date.

### Phase 3 — Report form and review dashboard

- Build a form for a new place or an accessibility update.
- Validate all submitted data on the server.
- Create a pending record and public receipt token.
- Build the reviewer queue and detail view.
- Add accept, edit-and-accept, reject, and request-more-information actions.
- Write an audit event for every decision.
- Make accepted observations available to the public read model.

**Exit check:** A report cannot change public information before reviewer approval.

### Phase 4 — Quality and pilot

- Test keyboard use, screen-reader labels, contrast, 200% zoom, and mobile layouts.
- Test slow network and database failure states.
- Test privacy: filters and precise device location must not be sent to the server.
- Test RLS with anonymous, reviewer, and admin identities.
- Ask people with disabilities to complete the main usability tasks.
- Fix critical problems before inviting broader use.
- Publish a clear note about pilot coverage and data limits.

**Exit check:** All acceptance checks in `01_PRD.md` pass or have a documented blocker approved by the project owner.

## 3. Work priority

| Priority | Work | Reason |
|---|---|---|
| P0 | Listing model, feature states, source labels, review workflow | Core product value and reliability |
| P0 | Public search and detail page | Core visitor task |
| P0 | RLS, auth, report validation, audit log | Protect pending and staff data |
| P1 | Bangla text, accessibility tests, low-bandwidth tuning | Required for a useful pilot |
| P1 | Optional single-place map | Helpful, but must not block written access information |
| P2 | Duplicate warnings | Useful after the first data set grows |
| P2 | Nearby sorting | Add only if verified coordinates are available |
| Later | AI search, numerical trust score, smart queue, benefits planner, multi-pin map | Not needed to prove the main use case |

## 4. Test plan

### Data and status tests

- Empty feature data shows `Not checked`.
- `No` differs from `Not checked`.
- `Partial` renders as text and not only colour.
- A pending report does not affect the public page.
- An accepted report updates the correct feature.
- A rejected report remains private.
- Older observations remain in history.
- The source label and observation date appear for every public fact.

### Permission tests

- Anonymous visitors can read only public data.
- Anonymous visitors cannot read other reports or optional contact details.
- Reviewers cannot change their role.
- Only a reviewer or admin can accept or reject a report.
- Only an admin can manage staff roles.
- Every review decision creates an audit event.

### User experience tests

- Find a restaurant by name.
- Filter to a category and area.
- Check the toilet state and its date.
- Submit a correction without disclosing a disability.
- Understand the pending confirmation.
- Use the site with keyboard-only navigation and large text.

## 5. Release checklist

- [ ] Database migrations are in version control.
- [ ] RLS is enabled and tested.
- [ ] No secrets are committed or exposed to the browser.
- [ ] Reviewer accounts are created manually.
- [ ] Public records have source labels and dates.
- [ ] Seed data is real and permission-cleared, or clearly marked as demo data.
- [ ] Search fields and filters do not appear in URLs or logs.
- [ ] Backup export and restore steps are documented.
- [ ] Free-tier limits and terms are checked.
- [ ] Map attribution and privacy notice are correct if a map is used.
- [ ] The team has tested with people with disabilities.
- [ ] Known data gaps and pilot limits are visible to users.

## 6. Keep the project small

Do not add a new framework or service for a feature that can be done inside the current app. Do not add AI until the team has enough reviewed data and a specific user need. Do not build a complex review queue. For the MVP, sort pending reports by age and flag urgent accessibility corrections for reviewer attention.
