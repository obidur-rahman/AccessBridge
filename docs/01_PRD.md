# 01 — Product Requirements Document

**Product:** AccessBridge  
**Pilot:** Chattogram city, Bangladesh  
**Release:** Compact MVP  
**Status:** Requirements draft based on user decisions

## 1. Product summary

AccessBridge is a free, mobile-friendly website. It helps people check accessibility information about places and services before they visit. A visitor can search for a restaurant, clinic, government office, transport point, NGO, or other useful place. The visitor can see details such as step-free entry, ramps, lifts, and toilet access.

A visitor can submit a report after a visit. For example, the visitor can report that a restaurant's toilet is not accessible. A reviewer checks the report. The reviewer can accept it, reject it, or request more information. An accepted report updates the public accessibility information. The page shows the source label and the date of the observation.

Visitors do not need an account. Reviewers and admins must sign in.

## 2. Core user need

A person needs to know whether a place has the facilities they need before they travel there. An old or vague label such as “accessible” is not enough. The site must show specific features, the latest observation date, and how the information was obtained.

The product must make uncertainty clear. “Not checked” must not mean “not available”. A visitor report must not look like a verified fact before review.

## 3. Product goals

1. Help visitors check practical accessibility details before a visit.
2. Let visitors report a new observation or a correction without an account.
3. Keep published information traceable to a source and date.
4. Let reviewers process reports with a simple queue and an audit log.
5. Make the main tasks usable with a keyboard, screen reader, and large text.
6. Run a small pilot in Chattogram before wider expansion.

## 4. Users

| User | Main task | Account |
|---|---|---|
| Person with a disability | Search and check access details | No |
| Family member or caregiver | Check a place before a visit | No |
| Community member | Submit an observation or correction | No |
| Reviewer | Check reports and update public records | Yes |
| Admin | Manage reviewer access and resolve escalated cases | Yes |

## 5. Content categories

**DECISION:** The MVP uses these six categories:

- Benefits
- Government services
- Health services
- Accessibility and public places
- Transport
- NGOs and community organisations

These categories are labels for the directory. They do not create six separate applications. The central feature is accessibility information for each relevant place or service. A benefit or service entry may have access details for the office, service counter, or application route when that information is available.

## 6. MVP scope

### 6.1 Required

- Search by name and keyword in Bangla or English.
- Filter by category and area.
- Show a simple result list. A map is optional on the details page and must load only after a visitor requests it.
- Show the place name, category, address or landmark, contact details when available, source label, report status, and last checked date.
- Show structured access features where applicable. Start with step-free entrance, steps at the entrance, ramp, lift, accessible toilet, toilet availability, internal movement, accessible parking, and seating. The team may adjust the field list after user testing.
- Use `Yes`, `No`, `Partial`, and `Not checked` values where they fit. Do not infer `No` from a blank field.
- Let a visitor submit a new place or a report about an existing place without an account.
- Let a visitor report outdated information or request a correction.
- Let a visitor optionally provide a source link or short explanation. A photo upload is not required in the first release.
- Send submissions to the reviewer queue. Do not let a submission change public details before review.
- Let a reviewer accept, edit, reject, or ask for more information. Record the decision and the reason.
- Show source and status labels. Label official sources, organisation sources, reviewer observations, and community reports clearly.
- Keep the interface light and usable on mobile devices and slow connections.
- Support Bangla and English for main interface labels. Keep a clear label when a listing translation is missing.

### 6.2 Not in the MVP

- Benefit eligibility calculator or application submission.
- Document planner or “best benefits” recommendation.
- Chatbot or AI search.
- AI extraction or automatic translation of source documents.
- Photo-based accessibility detection.
- Public numerical trust score.
- Smart review queue optimisation.
- User accounts for organisations.
- Ratings of overall service quality or staff.
- Payments, SMS, push notifications, or native mobile apps.
- National coverage or an exhaustive list of all facilities.

## 7. Accessibility information and report rules

A listing must separate three things:

1. **Place information:** name, category, address, contact, and optional coordinates.
2. **Accessibility observations:** feature, observed state, date, source, and any short explanation.
3. **Review state:** pending, accepted, rejected, or needs more information.

A place can have different accessibility results for different features. For example, the entrance may be step-free while the toilet is not accessible. Never reduce all features to one unsupported `Accessible` or `Not accessible` label.

A public accessibility detail must show the latest accepted observation. If no accepted observation exists, show `Not checked` or `No checked information yet`. Do not publish a pending claim as a confirmed facility state. The team may later test a separate public label for unverified reports, but this is outside the first release.

## 8. Source labels

Every public fact must have a source label. Use these labels or equivalent plain language:

- `Official source` — official notice, website, or responsible office.
- `Organisation source` — information from the venue or organisation.
- `Reviewer observation` — a reviewer checked the feature.
- `Community report, reviewed` — a community observation that a reviewer accepted.
- `Source not available` — use only when the team approves publication with this limitation. Do not mark the fact as Verified.

Also show the observation or last-checked date. A source link is useful when available, but not every physical access fact has a URL. In those cases, record who or what was checked, the method, and the date in reviewer-only notes. Do not show private contact details.

## 9. Functional requirements

| ID | Requirement | Priority |
|---|---|---|
| PR-01 | A visitor can browse without an account. | MVP |
| PR-02 | A visitor can search by name or keyword in Bangla or English. | MVP |
| PR-03 | A visitor can filter by category and area. | MVP |
| PR-04 | A result shows its category and report status. | MVP |
| PR-05 | A place page shows feature-level accessibility states and dates. | MVP |
| PR-06 | A place page labels sources for public facts. | MVP |
| PR-07 | A visitor can submit a new place or accessibility report. | MVP |
| PR-08 | A visitor can suggest a correction without an account. | MVP |
| PR-09 | A pending submission cannot change published data. | MVP |
| PR-10 | A reviewer can accept, edit, reject, or request more information. | MVP |
| PR-11 | The system records reviewer decisions in an audit log. | MVP |
| PR-12 | The system shows `Not checked` when there is no accepted observation. | MVP |
| PR-13 | The site supports keyboard navigation and screen-reader labels for the main tasks. | MVP |
| PR-14 | The site supports Bangla and English interface labels. | MVP |
| PR-15 | Public search filters and device location, if added, remain in the browser. | MVP |
| PR-16 | A duplicate warning can help a reviewer, but it cannot merge records automatically. | Later unless time permits |
| PR-17 | A map loads only after the visitor asks to see it. | MVP if the map is included |
| PR-18 | Initial records can be added by manual research and structured import; imported records keep source details and pass validation before publication. | MVP |

## 10. Privacy and safety requirements

- Do not ask a visitor to state a disability to use the service.
- Do not store search terms, selected filters, or device location as a user profile.
- Do not place disability-related search values in a URL.
- Do not require a name, phone number, or email for a report. Any optional contact field must be separate from the public record.
- Do not publish private complaint text or personal details.
- Do not show the name of a person who submitted a report unless the person gives explicit permission and the team has a clear reason to do so. The MVP should not show it.
- Do not claim a place is accessible because one feature is present.
- Show a reminder to contact the venue before travel because conditions can change.

## 11. Acceptance checks

The MVP is ready for a pilot when:

1. A visitor can search and filter listings without an account.
2. A place page shows each recorded accessibility feature as a separate result.
3. A missing value appears as `Not checked`, not `No`.
4. Every published access observation shows a source label and date.
5. A visitor can report that a toilet or another feature is not accessible.
6. The report remains pending until a reviewer acts on it.
7. An accepted report updates the public data and keeps the old report in history.
8. A reviewer can reject a report with a reason.
9. Reviewer actions appear in the audit log.
10. The main flows work on a mobile viewport, with keyboard navigation and screen-reader labels.
11. A privacy test confirms that search filters and device location do not go to the server.
12. A usability test includes people with disabilities and records their feedback.
13. A structured import can add draft records, but it cannot bypass source checks or reviewer approval.

## 12. Pilot success measures

Track simple, useful measures:

- Number of places with at least one reviewed accessibility observation.
- Number of reports accepted, rejected, and awaiting review.
- Median time from report submission to decision.
- Share of published accessibility observations with a source label and date.
- Task completion in usability tests, such as finding out whether a restaurant has an accessible toilet.
- Accessibility issues found in testing and the number resolved.

Do not claim that the directory represents all places in Chattogram. Publish the pilot coverage and its limits.
