# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Visitors with access needs, family members, and caregivers checking a place before travel. Community members can submit observations without an account. Reviewers and demo admins handle reports.

## Product Purpose

AccessBridge is a bilingual directory prototype for Chattogram. It shows accessibility information feature by feature, with a source and observation date. Visitors can search listings and report an update. Reviewers decide whether a report changes public information.

## Positioning

AccessBridge shows separate, dated access observations instead of one overall accessibility verdict for a place.

## Operating Context

The prototype includes public search and place pages, an optional map, a report flow, a reviewer queue, and an admin demo desk. Admin tools manage demo staff, assign reports, escalate and resolve issues, and show an audit history.

## Capabilities and Constraints

- Main interface supports Bangla and English.
- Demo mode stays enabled. Listings and reports are invented for development and must remain labelled as demo data.
- Demo reports, staff changes, assignments, escalations, and audit events are stored in memory. They reset when the server restarts.
- No real data, live account management, or production permission guarantees are required for this prototype.
- `Not checked` is not `No`. Pending reports do not change public information. Never show one overall accessible/not accessible verdict.
- Search, filters, and any device location stay in the browser.
- Do not collect a visitor's disability type or diagnosis.
- The redesign must be responsive and keep the English and Bangla versions in the same hierarchy.
- Keep the web app useful and distinctive. Avoid decorative effects that distract, generic corporate dashboard styling, and a design so minimal that it loses character.

## Evidence on Hand

The repository includes demo listings, the report-to-review prototype, English and Bangla interface strings, and the product specification in `docs/`. Demo venue records are fictional. No real venue data or user research evidence is included.

## Product Principles

- Show what was checked, by whom or what source, and when.
- Keep uncertain information visibly uncertain.
- Make the main visitor and reviewer tasks clear and usable.
- Label demo information so it cannot be mistaken for real venue data.

## Accessibility & Inclusion

Target WCAG 2.2 AA. Support keyboard use, screen readers, text zoom, reduced motion, and narrow mobile screens. Do not claim conformance without an audit.