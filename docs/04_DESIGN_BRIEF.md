# 04 — Design Brief

## 1. Design goal

Design a calm, practical service that helps a visitor answer one question: “Can I use this place with my access needs?” Do not make the site look like a complex government portal or a social network.

## 2. Main page structure

### Home and search

- Shubidha Map name and language switch.
- One clear search field.
- Small category filters.
- Area filter.
- A list of matching places.
- A simple link to report an accessibility update.

Do not show every filter on the first screen. Put less-used filters behind a clear `More filters` control if needed.

### Result card

Show the place name, category, area, one or two key access facts, and the last observation date. Use words and icons together. Do not use colour alone to communicate state.

### Place page

Show a feature checklist with one feature per row. Example:

| Feature | State | Evidence |
|---|---|---|
| Step-free entrance | Yes | Reviewer observation, 12 Oct 2026 |
| Ramp | Not checked | No accepted observation |
| Accessible toilet | No | Community report, reviewed 15 Oct 2026 |

The content above is an example only. Do not use these values as real Chattogram data.

Keep access information more prominent than a decorative map. Add a clear date and a reminder to confirm details with the venue.

## 3. Content style

- Use short sentences and common words.
- State what the observation describes. Avoid broad labels such as `fully accessible` unless the project defines and tests clear criteria.
- Keep `Not checked`, `No`, and `Partial` distinct.
- Never blame a person for reporting a barrier.
- Do not assume that every disabled person has the same access needs.
- Make it clear that reports can be outdated.
- Use the same terms across the form, result card, and database.

## 4. Accessibility requirements

- Target WCAG 2.2 AA as the design goal. Verify the relevant criteria during testing; do not claim conformance before an audit.
- Support keyboard navigation for all controls.
- Give all input fields visible labels and clear error messages.
- Use semantic headings, landmarks, buttons, and links.
- Provide text alternatives for icons.
- Do not use colour as the only status signal.
- Keep text readable at 200% zoom and on a narrow mobile screen.
- Respect reduced-motion settings. Avoid necessary motion or animation.
- Use large touch targets where possible.
- Make the report form usable with a screen reader.
- Test with people with disabilities, including people who use a screen reader or keyboard-only navigation.

## 5. Low-bandwidth and map rules

- Do not load a map on the home page.
- Load a map only after the visitor selects `Show map`.
- Always show written address or landmark information.
- Do not require a map to search or understand access details.
- Keep images optional and small. The MVP does not need public user-uploaded photos.
- Show a clear loading and error state for the map.

## 6. Privacy cues

- Do not ask for a diagnosis or disability type.
- Explain why optional contact details may help a reviewer.
- State that contact details are private and are not part of the public listing.
- Before a third-party map loads, explain that the map provider may receive a request from the browser.
- Do not use hidden tracking or advertising identifiers.

## 7. Visual direction

Use a clean, civic design with high readability and clear hierarchy. Use restrained colours and clear status badges. Use text labels beside icons. Keep the interface consistent between Bangla and English. Do not use a dashboard-like grid as the public home page.

**PROPOSAL:** Use a neutral background, dark text, one calm accent colour, and a separate high-contrast mode. Select exact colours after a contrast test.

## 8. Usability tasks

Ask test participants to:

1. Find a restaurant and check whether its toilet is accessible.
2. Tell the difference between `No` and `Not checked`.
3. Find the source and date for a feature.
4. Submit a report that a toilet is not accessible.
5. Correct an error before they submit the form.

Record task success, confusion, and accessibility barriers. Do not ask participants to perform physical tasks that put them at risk.
