# AccessBridge — Design System

## Brief (Phase 0)

- **Subject:** AccessBridge, a bilingual (bn/en) public directory of per-feature accessibility
  observations for Chattogram, Bangladesh. Community reports pass one reviewer desk before
  anything public changes.
- **Audience:** disabled people and caregivers checking a venue before they travel; reviewers
  working a queue.
- **Job:** answer "can I use this place?" in three seconds with evidence, and make contributing
  one observation feel safe and quick.
- **Constraints:** light mode only, proper webapp (not a showreel), AA contrast, works on a
  390 px phone, Bengali parity, demo data must stay labelled.

## Concepts (Phase 1)

1. **The reading bench (material: measurement instruments).** Every access feature is a reading
   taken with an instrument: a needle, a tick scale, a date stamp. The site is a bench of
   calibrated panels. *Anchor:* AccessBridge's core rule — each feature carries its own result,
   source and date, never one score for the place. O4 / F5 / Fe4 / P3.
2. **Enamel signboards of Chattogram (place & culture).** The site is a hand-painted enamel
   signboard: heavy color fields, Bengali display lettering, rickshaw-shaw energy. O4 / F3 /
   Fe3 / P2 — webapp fit is shaky, and heavy local color fights the light-mode brief.
3. **The docket (process).** Every report is a docket sheet that slides across one reviewer
   desk: in-tray, stamp, out-tray. O3 / F5 / Fe5 / P2 — strongest feasibility, but it covers
   only the review half of the product.

**Pick: 1, the reading bench.** It is the only concept whose anchor is the product's own rule
(a reading per feature, no verdicts), and it covers both halves: the public panels read like
instruments, and the reviewer desk is the bench everything passes over. Runner-up 3 lends its
one detail: the receipt code stamps itself onto a slip after submit.

### Concept card

```
Idea:        Every access feature is a calibrated reading — needle, ticks, date, source —
             on a light instrument bench. No score for the whole place, ever.
Metaphor:    A metrology bench: panels, dials, tick rails, stamped slips.
Signature:   Needles sweep from rest and settle with one small overshoot when a reading
             scrolls into view; at rest every needle drifts a degree and comes back.
Emotion:     Precise and calm — "this was measured, here is by whom and when."
Motion verb: settle like a needle (one damped sweep, then still).
Screenshot:  The full-width instrument strip under the hero: four readings, edge to edge.
```

## Art direction system (Phase 2)

### Palette (6 roles + data bands)

| Role | Hex | Source |
|---|---|---|
| ground (paper) | `#f5f6f4` | bench paper, cool-white not cream |
| surface (panel face) | `#ffffff` | instrument faceplate |
| ink | `#0e1319` | blue-black drafting ink |
| muted | `#56606b` | stamped secondary ink (AA on ground) |
| line | `#d9dcd8` | hairline = ink at ~13% |
| accent | `#14539a` | signal blue (existing brand; the needle) |
| curtain | `#0e1319` | page-transition veil, used once |

Data bands (state colors) are data, not decoration, and only ever appear inside a reading:
`yes #1f7a5c`, `partial #9a6b14`, `no #b3372f`, `not-checked #6b7580`.

### Type

- **Display + UI:** Archivo (Google, variable) — a civic grotesk with signage bones; weights
  500/600/700. Display tracking −0.03em, leading 0.92. Not Inter, not Instrument Serif.
- **Data + labels:** IBM Plex Mono 400/500 for readings, ticks, dates, receipt codes.
- **Bangla:** Hind Siliguri 400/500/600 (unchanged, the standard).
- Fluid scale `clamp()`; body 16–17px at 1.55; small UI 12–14px, tabular numerals everywhere
  numbers are compared.

### Grid, rhythm, shape

- Full-bleed: every section runs edge to edge with 1/1.5/2rem gutters; only prose keeps a
  measure (46 to 58ch). Stat strips and step rows are gap-px hairline grids on line color.
- Navbar: wordmark is home; Directory and How it works anchor the page; reviewer link,
  language toggle, then the report CTA. Links draw their underline; the header wears a
  tick-rail edge.
- **One radius rule:** drawings have corners — 4px controls, 6px cards. No pills except
  state badges and the language toggle.
- **Motion:** one easing family (cubic-bezier(0.22, 1, 0.36, 1) for settles,
  0.2s for hovers). Reveals wipe along a tick rail; buttons lean −1px and flood; arrows travel;
  nav links draw their underline. No GSAP/Lenis: this is a webapp — native scroll,
  IntersectionObserver reveals, CSS needle drift, all disabled under reduced motion.
- **Idle, recorded:** the bench is deliberately still under a resting pointer. Needles drift
  1.5° over 4s as a small pulse of life, but the page does not perform while you read.
  Stillness is the decision for a utility webapp, written down here on purpose.
- **Idle state:** needles drift ±0.4° over 6s while the pointer is still (bench is alive).

### Signature moment

The **index gauge** in the hero and the per-feature dial rows: needle sweeps from a parked
position and settles on the reading as the row enters view. One overshoot, then still.

### Explainer figure

Cut by decision: an isometric figure was built and removed in review. The three-step
process story lives as a full-width hairline band instead; the gauges carry the craft.

### Genericness test

"If a generic model designed this site, would it land here?" — replaced: soft SaaS cards →
ticked instrument strips; centered gradient hero → asymmetric bench composition with a real
gauge; Inter → Archivo; evenly spaced feature columns → ruled ledger rows with readings;
generic "How it works 01/02/03" cards → one full-width hairline band; centered 72rem
column → edge-to-edge sections with real measures on prose only.

### Copy rules (humanize pass)

Sentence case, no em dashes in visible text, no filler verbs (seamless, empower, elevate,
cutting-edge), no repeated sentences across sections, numbers only when true, contractions
where a person would use them. Both languages get the same pass.
