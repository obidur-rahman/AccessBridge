# Shubidha Map — Specification Pack

**Product:** Shubidha Map  
**Pilot:** Chattogram city, Bangladesh  
**Version:** Compact accessibility-first MVP, 25 October 2026  
**Writing style:** ASD-STE100-style Simplified Technical English

## Purpose

Shubidha Map helps people check accessibility information before they visit a place or use a service. The main use case is a person who visits a restaurant, finds that its toilet is not accessible, and submits a dated report. After review, other visitors can search for the restaurant and see its accessibility information, source label, and last checked date.

The first release must stay small. It must deliver reliable venue information and a safe way to update it. It must not become a broad benefits application portal.

## Files

| File | Purpose |
|---|---|
| `01_PRD.md` | Product goals, user needs, scope, requirements, and acceptance checks |
| `02_TRD.md` | Technology, system design, security, privacy, and hosting |
| `03_APP_FLOW.md` | Visitor, contributor, reviewer, and admin journeys |
| `04_DESIGN_BRIEF.md` | Interface, content, and accessibility rules |
| `05_BACKEND_SCHEMA.md` | Tables, fields, status rules, and access controls |
| `06_IMPLEMENTATION_PLAN.md` | Build order, work packages, tests, and release gates |
| `07_FILES_AND_DOCUMENTATION.md` | Suggested repository structure and file responsibilities |
| `08_MATH_IMPLEMENTATION.md` | Small set of calculations and deferred algorithms |
| `SOURCE_AND_ASSUMPTIONS.md` | Approved decisions, source basis, proposals, and open checks |

## Status labels in this pack

- **DECISION** means the user confirmed the requirement.
- **SOURCE** means the item comes from the original Shubidha Map plan.
- **PROPOSAL** means this pack defines a practical rule that still needs team approval.
- **TO VERIFY** means the team must check the item before release.
- **MVP** means the first pilot must include the item.
- **LATER** means the item is not part of the first release.

## Rules for the first release

1. Focus on accessibility details for real places and services.
2. Keep the six agreed content categories: benefits, government, health, accessibility, transport, and NGOs.
3. Use manual research and structured imports for initial data. Give each imported record source details and send it through the same validation and review rules.
4. Label the source and review status of every public fact.
5. Do not change published accessibility details until a reviewer approves the report.
6. Do not treat missing data as proof that a facility is absent.
7. Do not show a numerical trust score in the first release.
8. Do not collect a visitor's disability type or precise location on the server.
9. Keep AI, eligibility tools, document planning, smart queues, and advanced map features outside the MVP.

## First review

Before the team codes the product, confirm the report fields with people with disabilities and local disability organisations. Test the first form with people who have different access needs. Then approve the source labels, status rules, retention policy, and sample data.
