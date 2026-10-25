# 02 — Technical Requirements Document

**Product:** Shubidha Map  
**Stack direction:** Next.js, TypeScript, Tailwind CSS, Supabase, and Vercel  
**Budget:** $0 for the pilot, within free-tier limits and provider terms

## 1. Architecture

Use a small web application with a public directory and a protected review area.

```text
Visitor browser
  ├─ Public search and place pages
  ├─ Local filtering and optional local distance calculation
  └─ Report form
          │
          ▼
Next.js application on Vercel
  ├─ Public read interface
  ├─ Server-validated submission endpoint
  └─ Protected reviewer actions
          │
          ▼
Supabase
  ├─ PostgreSQL data
  ├─ Supabase Auth for reviewers and admins
  └─ Row Level Security and access policies
```

Use only the services required for this flow. Do not add an AI service, a separate job queue, or a background worker to the MVP.

## 2. Technology decisions

| Area | Direction | Reason |
|---|---|---|
| Web framework | Next.js App Router with TypeScript | Public pages and protected routes in one project |
| UI | Tailwind CSS | Small, consistent design system |
| Database | Supabase PostgreSQL | Relational records, review history, and SQL controls |
| Reviewer authentication | Supabase Auth | Login for reviewer and admin roles |
| Hosting | Vercel | Simple deployment for the Next.js project |
| Map | Optional Leaflet with OpenStreetMap-compatible tiles | Avoid a paid map dependency for the pilot; confirm tile terms before release |
| Language | Bangla and English UI text | Match the pilot audience |

**DECISION:** Use Supabase PostgreSQL with Supabase Auth and Vercel hosting.  
**TO VERIFY:** Check the active free-tier limits, project pausing rules, commercial-use terms, map tile policy, and privacy notice before launch. The $0 target does not guarantee uptime or unlimited use.

## 3. Public data flow

1. Read only published listings and accepted accessibility observations for public pages.
2. Keep the public response limited to fields that visitors need.
3. Download the small pilot dataset and perform filters in the browser where practical.
4. Do not send selected categories, disability-related needs, search terms, or device location to the server for ranking.
5. Submit reports through a server-validated endpoint. The server must validate the submitted fields and apply rate limits.
6. Store a new report as pending. Do not change published data until a reviewer approves it.

Do not put private reviewer notes or optional contact details in the public response.

## 4. Authentication and roles

- Public visitors do not sign in.
- Reviewer and admin accounts are created by an admin. Do not provide open public sign-up for staff accounts.
- Store the role in a protected database record. Do not trust a role value sent by the browser.
- Enforce permissions in database policies and server-side actions. Hiding a button is not access control.
- A reviewer can process reports and edit public listing fields.
- An admin can manage staff access and handle escalated reports.
- A reviewer must not approve their own pending report when the report is a direct conflict or needs independent review. The admin may assign it to another reviewer.

## 5. Supabase security requirements

- Enable Row Level Security (RLS) on all tables exposed through Supabase APIs.
- Allow public read access only to published, public-safe data.
- Deny anonymous users access to pending reports, reviewer notes, audit logs, staff records, and private contact details.
- Allow public submissions only through a constrained endpoint or a narrowly scoped insert policy.
- Do not include the Supabase service-role key in client code. Use it only in a protected server context if it is required.
- Validate length, type, allowed values, and content size on the server.
- Apply rate limits or another free abuse control to report forms.
- Store an audit event for each accept, reject, edit, or staff-role change.
- Escape untrusted text when it is rendered. Do not render raw submitted HTML.
- Test policies using anonymous, reviewer, and admin accounts before release.

## 6. Privacy

- Do not ask for disability type during search or reporting.
- Do not store a visitor's search filters or precise location.
- Do not put those values in query strings, analytics events, or server logs.
- Keep optional contact information separate from report content and restrict access to admins or assigned reviewers.
- Delete optional contact information after follow-up, according to the approved retention rule.
- Keep complaints private. The public page must never show private complaint messages.
- If a map provider receives a request, show a clear notice before loading the map. Use no map request before the visitor asks for it.
- Do not add third-party tracking cookies to the MVP.

## 7. Data and status rules

- A listing can be a physical place, service, benefit entry, transport point, or organisation.
- Accessibility observations are stored separately from general listing details.
- Each observation includes feature state, observation date, source label, and review state.
- Unknown and not checked are valid states. Blank data is not proof that a facility is absent.
- Only accepted reports can affect current public accessibility details.
- Keep older accepted observations for traceability. Do not overwrite history without a new audit event.
- Show a “contact the venue before travel” note. The data may become outdated after a review.

## 8. Performance and reliability

- Keep the initial page light. Do not load a map, large image gallery, or AI bundle by default.
- Paginate or limit the public dataset if it grows beyond a size that works well on common phones.
- Use database indexes for listing name, category, area, publication state, and report state as needed.
- Handle unavailable database responses with a plain error message. Do not show stale data as current without a visible date.
- Keep a manual data export and document how to restore it. A free-tier project may not include every backup feature.
- Do not promise a service availability target until the team has reviewed the free-tier terms and tested the deployment.

## 9. Test requirements

- Unit tests for status transitions and input validation.
- Database tests for RLS and role permissions.
- End-to-end tests for search, place details, submit report, review report, reject report, and public update.
- Privacy tests for URL parameters, logs, and client-to-server requests.
- Accessibility tests for keyboard use, screen-reader names, contrast, text zoom, and forms.
- A small-device and slow-network test.

## 10. Deployment checklist

1. Create the Supabase project and apply version-controlled migrations.
2. Set environment variables in Vercel. Never commit secrets.
3. Create reviewer accounts manually.
4. Test RLS using anonymous and staff accounts.
5. Seed only source-labelled demonstration data that the team is allowed to publish.
6. Test a full report-to-review flow in the production-like environment.
7. Confirm free-tier limits, domain, map policy, data retention, and restore method.
8. Publish a short privacy notice and an accessibility-data disclaimer.
