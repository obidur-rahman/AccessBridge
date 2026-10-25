# Source and Assumptions Register

**Source plan:** `Pasted markdown.md` and the related Shubidha Map plan PDF, October 2026.  
**Specification date:** 25 October 2026

## 1. Confirmed user decisions

The following decisions are approved for this requirements discussion:

1. **Scope:** Keep the product small and compact. The central use case is a person checking accessibility at a place, reporting an access barrier, and helping other visitors see reviewed accessibility information.
2. **Content categories:** Benefits, government services, health, accessibility, transport, and NGOs.
3. **Source policy:** Label all public source information and distinguish source types.
4. **Initial data:** Use a hybrid process: manual research and structured imports.
5. **Listing updates:** A reviewer must check updates before they change published information.
6. **Technology:** Use Next.js with TypeScript, Supabase PostgreSQL, Supabase Auth, and Vercel hosting.
7. **Budget:** Target $0 for the pilot and stay within free-tier limits and provider terms.

## 2. Source plan items retained

- The pilot starts in Chattogram city.
- Public browsing does not require an account.
- People can suggest information or report incorrect or outdated information.
- A human reviewer checks a submission before the system treats it as verified.
- Bangla and English are required for the main interface.
- Privacy is important. Search filters and a visitor's selected needs should remain on the device.
- Accessibility details can include ramps, lifts, accessible toilets, and other venue features.
- Haversine distance and Jaccard similarity are documented for possible use.
- The source plan's trust score, knapsack review queue, and document planner are retained here as deferred ideas, not MVP requirements.

## 3. Interpretation for the compact MVP

The restaurant-toilet example is the main product model. The directory can contain the six approved categories, but all categories must use the same simple listing and source rules. Accessibility observations are the primary differentiator. The MVP does not need a separate workflow for benefit eligibility, document preparation, or benefit application.

A report must not directly change public information because the user explicitly chose review before updates. The public page uses the latest accepted observation. Pending reports remain visible to the reviewer only in the MVP.

## 4. Proposals made in this pack

- Use feature-level states: `yes`, `no`, `partial`, `not_checked`, and `not_applicable`.
- Show source label and observation date for each published access observation.
- Use a simple age label such as `Needs re-check`, rather than a public numerical trust score.
- Use oldest-first review order, with a small reviewer-controlled priority override.
- Keep the map optional and load it only on request.
- Use the latest accepted observation as the public result while retaining history.
- Use a 180-day re-check period as an initial proposal only. The team must approve or change it before release.
- Use a small controlled CSV template or import script for the imported part of the hybrid data collection process. Do not build a user-facing bulk-import feature for the MVP.
- Use one main category for each listing in the first release.

## 5. Deferred or excluded source features

The following source-plan features are outside the compact MVP: AI search, AI source extraction, automatic translation, image-based accessibility checks, benefit eligibility helper, document planner, visit planner, public numerical trust score, knapsack review queue, multi-pin map, organisational accounts, coverage analysis, notifications, and native mobile apps.

## 6. Open checks before release

- Confirm the accessibility feature list with people with disabilities.
- Confirm whether the pilot needs a map. Verify tile-service terms and attribution if one is used.
- Approve the age threshold for `Needs re-check`.
- Define retention periods for optional contact details, rejected reports, and spam.
- Confirm the public source labels and rules for direct observations without a source URL.
- Confirm the legal and safety process for serious complaints.
- Test Bangla labels and screen-reader behaviour with local users.
- Check current Supabase, Vercel, and map-provider free-tier limits and use terms.
- Define how imported records will be validated and how duplicates will be handled.

## 7. Accuracy and claim limits

Do not claim that Shubidha Map is the first accessibility directory. Do not claim that the pilot covers all venues in Chattogram. Do not claim that a public observation is current indefinitely. Show the observation date, source label, and limits.

The writing follows ASD-STE100-style principles, such as short sentences and consistent terms. This is not a formal ASD-STE100 compliance certification.
