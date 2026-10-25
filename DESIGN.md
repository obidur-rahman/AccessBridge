# AccessBridge — Design system

## Concept card

```
Idea:        A quiet, well-signed public building: soft daylight, clear doors,
             information set at a calm reading pace.
Metaphor:    The arch — a doorway drawn as two faint concentric arcs behind the
             hero. Access is the subject, so the interface is built from openings
             rather than barriers.
Signature:   The coverage bar fills from the left as each place's reviewed
             features are counted, while the card it sits in lifts by two pixels
             on hover and focus. Soft, tactile, and always carrying real data.
Emotion:     Reassuring and precise. Nothing shouts; nothing is hidden.
Screenshot:  The off-white hero with an arched wash, the coverage card, and
             rounded directory cards on warm paper.
```

The world supplies the forms: rounded surfaces, thin low-contrast borders,
generous space, a single sage accent used for action and confirmation, and
tinted state pills that read as calm labels rather than warnings.

## Why this direction

Two earlier passes were rejected: warm paper with a serif display (editorial and
generic), then a high-contrast signage system in black and amber (loud, and
harsher than the subject). Both answered "make it distinct" with contrast.

This pass answers with care. Accessibility information is read by people who are
already navigating a difficult city; the page should lower the temperature.
Softness here is not vagueness — hierarchy comes from type scale, space, and one
accent, and every state still carries its word, source and date.

## Palette

| Role | Hex | Use |
|---|---|---|
| canvas | `#f7f7f4` | Page ground |
| surface | `#ffffff` | Cards, fields, header bar |
| surface-muted | `#f1f2ee` | Nested panels, quiet fills |
| surface-sunk | `#ebeee8` | Coverage tracks, skeletons |
| ink | `#181a19` | Headings and body text |
| ink-soft | `#4e5451` | Secondary copy |
| ink-faint | `#636964` | Metadata, 5.2:1 on canvas |
| line | `#e5e6e1` | Hairlines and card borders |
| line-strong | `#ccd1c9` | Input borders |
| accent | `#2c6e5e` | Primary action, links, fills, focus |
| accent-soft | `#e6f0ec` | Selected states, tinted labels |
| signal | `#b98a2f` | Demo data and stale observations only |

State pills (the word carries the state; the dot repeats it):

| State | Text | Tint |
|---|---|---|
| Yes | `#2a6a5a` | `#e6f0ec` |
| No | `#a04a3c` | `#f8ebe8` |
| Partial / stale | `#7f6128` | `#f7efdd` |
| Not checked / not applicable | `#5e6660` | `#eef0ec` |

Pairs were checked with a contrast script: every small-text pair clears 4.5:1 on
its own background, and `ink` on `canvas` is 16.3:1. White on `accent` is 6.0:1.

## Type

| Role | English | Bangla |
|---|---|---|
| Display | Instrument Sans 600, tracking `-0.025em`, leading `1.05–1.1` | Hind Siliguri 600, no tracking, leading `1.3` |
| Text | Instrument Sans 400/500/600 | Hind Siliguri 400/500/600 |
| Metadata (`.tag`) | 12px, 500, `0.02em`, sentence case | 13px, 500, no tracking |

Bengali never inherits Latin tracking; conjuncts collide. Both families are
loaded through `next/font` with `display: swap`. Numbers in the coverage board,
dates and counts use `font-variant-numeric: tabular-nums`.

## Surfaces and rhythm

- `max-w-6xl` (1152px) shell, 16/24px gutters. Reading columns cap at 58–62ch.
- Cards: 16px radius, 1px `line` border, no shadow at rest. `shadow-soft` only
  for the header, the search field, the coverage card and the login panel.
- Sections are separated by space and hairline rules, not borders or bands.
- A page header is the canvas with a radial accent wash and faint arch rings;
  there are no dark slabs anywhere in the interface.
- Controls are 44px tall minimum; inputs and the search field share one shape.

## Motion

- `cubic-bezier(0.2, 0.6, 0.2, 1)`, 180–420ms. Only three movements exist:
  card lift (`translateY(-2px)` + shadow), coverage fill (`scaleX 0 → 1`),
  and a 420ms rise-and-fade on first paint of a hero or receipt.
- Hover and keyboard focus produce the same lift; focus adds a 2px accent ring
  with 2px offset.
- `prefers-reduced-motion: reduce` removes the fill animation, the entrance and
  smooth scrolling. The page is complete and static at rest.

## The data graphic

The coverage card in the hero and the ledger on each place page are the only
illustrations, and both are real. The card shows four places, each with a bar
whose length is `checkedKeyFeatures / 5` and the same fraction in text. Screen
readers get the sentence form, "3 of 5 key features reviewed". On the place page
every row is the actual evidence: feature, state, source and date.

## Rules that come from the product

- A state is a word first. The dot repeats the word; it never replaces it.
- `Not checked` is never styled like `No`.
- Every public fact carries its source and date on the same line.
- Amber marks thresholds only — demo data and stale observations. It is never a
  background for body text.
- One primary action per screen. Links are underlined; buttons are filled or
  outlined, never both.
- Bangla and English share the same layout and the same measures; only the type
  and the line-height change.
