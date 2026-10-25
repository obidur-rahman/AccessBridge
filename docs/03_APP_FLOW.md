# 03 — Application Flow

## 1. Main visitor journey

```text
Open AccessBridge
       ↓
Search by place name or keyword
       ↓
Filter by category and area (optional)
       ↓
Open a place page
       ↓
Check access features, source labels, and dates
       ↓
Call the venue or plan the visit
       ↓
Submit a new observation or correction (optional)
```

No visitor account is required.

## 2. Place detail page

Show, in this order:

1. Place name and category.
2. Address or landmark and public contact details when available.
3. Accessibility feature list. For example: entrance, steps, ramp, lift, toilet access, internal route, parking, and seating.
4. State for each feature: `Yes`, `No`, `Partial`, or `Not checked`.
5. Source label and observation date for each checked feature.
6. A note that facilities may change and the visitor should contact the venue before travel.
7. A `Report an update` link.
8. An optional `Show map` control. Load the map only after the visitor activates it.

Do not use a single green tick to suggest that the whole venue is accessible.

## 3. Submit a report

The form should ask only for the information needed to review the observation:

1. Select an existing place or choose `Suggest a new place`.
2. Select the feature that needs an update, or choose multiple features if the form supports them.
3. Choose the observed state: `Yes`, `No`, `Partial`, or `Not checked` where appropriate.
4. Add the observation date. Default it to the current date, but allow correction.
5. Add a short factual note. Example: “The toilet door is too narrow for the wheelchair used during this visit.” Do not require the visitor to disclose a diagnosis.
6. Add a source URL or other evidence when available. A source link is optional for a direct observation.
7. Optional: give contact details for a reviewer follow-up. Explain who can see this information and how long the team keeps it.
8. Submit.

After submission, show a receipt code and the message: “Your report is waiting for review. It will not change the public accessibility details until a reviewer checks it.” Do not expose the internal report ID if it contains sensitive implementation information; use a separate public receipt token.

## 4. New place submission

Ask for the place name, category, address or landmark, optional map pin, and at least one supporting source or factual note. Explain that the team will check the entry before it appears in the directory. The form must not require the visitor's name or disability type.

## 5. Reviewer flow

```text
Reviewer signs in
       ↓
Open pending queue
       ↓
Review place, feature state, date, and source evidence
       ↓
Check existing record and possible duplicate
       ↓
Accept / Edit and accept / Reject / Request more information
       ↓
Write a reason and save
       ↓
Audit event is created
       ↓
Accepted data becomes public; other outcomes stay private
```

### Reviewer decision rules

- **Accept:** Evidence and details are clear enough to publish.
- **Edit and accept:** Correct wording or structure without changing the meaning of the observation. Record the edit.
- **Request more information:** Key details are missing. Keep the report pending.
- **Reject:** The report is irrelevant, abusive, duplicate, or cannot be used. Record a short reason.
- **Escalate:** The report presents a safety, privacy, legal, or serious dispute. Restrict access and ask the admin to review it.

A reviewer must not treat a source link alone as proof that the physical facility is accessible. The source must support the stated fact.

## 6. Admin flow

The admin can:

- Create, disable, or change reviewer accounts.
- Assign reports to reviewers.
- Resolve escalated reports.
- Review audit events and suspicious activity.
- Export data and perform the documented recovery process.

The admin should not edit historical observations without an audit event.

## 7. Public status labels

| Label | Meaning | Public display |
|---|---|---|
| `Not checked` | No accepted observation exists for this feature. | Show |
| `Reviewed` | A reviewer accepted the observation. | Show with source and date |
| `Needs re-check` | The last accepted observation is old or a later concern requires a new check. | Show with warning and date |
| `Pending review` | A report is waiting for a reviewer. | Do not show as a confirmed result in the MVP |
| `Rejected` | A reviewer did not accept the report. | Do not show to public visitors |

Do not replace a `Reviewed` state with `Not accessible` just because the data has aged. Use `Needs re-check` when the team applies a defined age rule.

## 8. Error and empty states

- No search matches: explain that no matching entry was found and offer a new-place suggestion.
- Feature has no data: show `Not checked`.
- Database unavailable: show a retry message. Do not show an old observation as current without a date.
- Submission failed: keep the form values on the device where possible and let the visitor retry.
- Submission accepted: show the receipt code and review explanation.
- Map unavailable: show the written address or landmark as the alternative.
