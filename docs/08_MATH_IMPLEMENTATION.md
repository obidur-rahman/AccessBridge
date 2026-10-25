# 08 — Math and Decision Logic

## 1. Aim

The MVP does not need a numerical trust score or an optimisation model. It needs clear feature states, dates, source labels, deterministic search, and a simple review order. Prefer rules that visitors and reviewers can understand.

## 2. Feature state logic — MVP

Each feature uses one of these states:

- `yes`: the observation says the feature is present or usable.
- `no`: the observation says the feature is absent or not usable for the stated purpose.
- `partial`: the feature exists but has a stated limitation.
- `not_checked`: no accepted observation gives a result.
- `not_applicable`: the feature does not apply to this type of place.

These values are not numeric scores. Do not change `not_checked` to `no` by default. Show the date and source with each accepted observation.

## 3. Observation freshness — MVP rule

A dated observation can become old. Use a simple status rule rather than a public trust score:

- If an accepted observation is within the approved review period, display its state and date.
- If the observation is older than that period, keep the state and date but add `Needs re-check`.
- If a credible new concern is accepted for review, let the reviewer mark the existing result `Needs re-check` until a new observation is accepted.
- Do not remove the older observation. Keep it in the history.

**PROPOSAL:** Start by testing a 180-day freshness period for general accessibility observations. The team must approve the final value after discussion with disabled users and reviewers. Some features may need a shorter period.

## 4. Search and sorting — MVP

Use exact or partial text matches for name and keywords. Apply the category and area filters in the browser. Keep the rules predictable.

Default result order:

1. Matching published records first.
2. Records with an accepted, current observation before records with no checked observation, only if the user does not choose another sort.
3. Alphabetical place name as a stable tie-breaker.

Do not claim that this ranking proves a venue is more accessible. A venue with one checked feature may still lack another feature the visitor needs. Make the feature details visible.

## 5. Distance calculation — optional MVP feature

Do not request device location automatically. If the team adds “near me”, ask permission in the browser and calculate the distance locally. Do not send the exact coordinates to the server.

The Haversine formula calculates straight-line distance between two latitude/longitude points:

\[
 a=\sin^2\left(\frac{\Delta\phi}{2}\right)+\cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)
\]

\[
 d=2R\operatorname{atan2}(\sqrt{a},\sqrt{1-a})
\]

Where:

- `φ1`, `φ2` are latitudes in radians.
- `λ1`, `λ2` are longitudes in radians.
- `Δφ = φ2 − φ1` and `Δλ = λ2 − λ1`.
- `R = 6,371 km` is the approximate mean Earth radius.
- `d` is the straight-line distance, not travel time or route distance.

Test the implementation with identical coordinates (distance 0), known city coordinate pairs, and missing coordinates. Do not display distance when the visitor's location or a listing pin is unavailable or imprecise.

## 6. Duplicate warnings — later

The source plan proposes Jaccard similarity for name matching:

\[
J(A,B)=\frac{|A\cap B|}{|A\cup B|}
\]

Here, `A` and `B` are sets of words from two names. The source proposes a warning threshold of `J ≥ 0.8`. This can miss duplicates with spelling differences and can flag unrelated names with common words.

Do not make duplicate detection a release blocker. For a later version:

1. Normalise case, whitespace, punctuation, and common Bangla/English variants.
2. Compare name and address or area, not name alone.
3. Test the threshold on a labelled set of real record pairs.
4. Show a warning to the reviewer. Never merge records automatically.

## 7. Trust score — deferred

The source plan proposes:

\[
T=\frac{a}{a+b}\times e^{-0.1m}
\]

Where `a` begins at 1, `b` begins at 1, and `m` is the age of the last check in months. A validated confirmation increases `a`; a validated issue increases `b`; a successful re-check resets the age term.

Do not implement this score in the MVP. A single number can hide the difference between evidence quality, feature-level facts, and data age. The formula can also remain low after an old issue is corrected if the update rules are not defined carefully. The MVP uses a clear review state, source label, feature state, and date instead.

If the team tests this formula later, define exactly which events change `a` and `b`, define reviewer re-check behaviour, test known examples, and do not display the score to the public until the team proves that users understand it.

## 8. Review queue — simple MVP rule

Sort pending reports by:

1. Reports that could affect a visitor's immediate access decision, as identified by a reviewer or approved rule.
2. Oldest submission first.
3. Stable submission time as a tie-breaker.

Do not infer medical risk or urgency from the report text automatically. Let a reviewer correct the priority and record the reason. This simple queue avoids an unproven optimisation model.

The source plan also proposes a 0/1 knapsack model:

\[
\max \sum_i V_i x_i, \quad V_i=P_i(1-T_i), \quad \sum_i t_i x_i\le H, \quad x_i\in\{0,1\}
\]

This model is **not part of the MVP**. It requires reliable estimates of people affected, trust, review time, and available hours. Those estimates do not exist yet for this compact pilot.

## 9. Document planner — out of scope

A document checklist or benefit-eligibility planner does not support the main restaurant-accessibility use case. Do not implement set cover or another document-selection algorithm in the MVP. Revisit it only if the project later expands into benefit application support and has verified document rules.

## 10. Accuracy reporting — MVP checks

Do not report a statistical confidence score for the whole directory. The team can report simple pilot counts, such as:

- Number of published listings.
- Number of listings with at least one accepted accessibility observation.
- Number of observations with a source label and date.
- Number of reports accepted, rejected, or waiting for review.
- Median time from submission to reviewer decision.

State the sample size and pilot area. These counts describe the collected data. They do not prove that all venues are represented or that every observation is correct.

## 11. Tests

- `not_checked` never renders as `no`.
- The freshness rule keeps the old date visible when it adds `Needs re-check`.
- Search and filters do not change the public data or send visitor choices to the server.
- Haversine distance is zero for identical coordinates and is not shown when coordinates are missing.
- Duplicate warnings, if added, only suggest a review and never perform a merge.
- The review queue does not discard an unselected report.
- Pilot counts match a direct count of the database records.
