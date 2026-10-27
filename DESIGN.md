# AccessBridge — Design system

## Concept card

```
Idea:        A drawing set for the city's public buildings: plain drafting
             paper where every access fact is annotated, measured, ticked
             and dated.
Metaphor:    The architect's drawing. Access is something you read off a
             plan before you enter a building, so the interface is built
             from plans, dimension lines, annotations and a title block.
Signature:   The coverage graphic is a dimension line: end ticks span all
             five key features, and the drawn segment is the part actually
             reviewed. It fills on paint while the arch beside it drifts.
Emotion:     Precise and quiet. You trust it because it looks measured.
Screenshot:  White sheet, hairline arch in drafting blue, dimension-line
             coverage card, small technical labels.
Motion verb: Draw in. Lines extend, annotations settle, panels lift.
```

## Why this direction

Three passes came before: warm paper with a serif display (generic editorial),
black-and-amber signage (loud, harsher than the subject), and a soft sage
wayfinding system (calm but anonymous). This pass takes the subject literally:
access information *is* a drawing of a building you have not entered yet. The
blueprint is a form nobody can move to another brand, because Chattogram's
public buildings are the thing being drawn.

## Palette

Light drafting paper. No background pattern, no gradients, no glow.

| Role | Hex | Use |
|---|---|---|
| canvas | `#f7f7f5` | Page ground: plain paper |
| surface | `#ffffff` | Panels, cards, header bar, footer |
| surface-muted | `#f1f2ef` | Nested panels, hover fills |
| surface-sunk | `#f4f5f2` | Input wells, skeletons |
| ink | `#16191c` | Headings and body text |
| ink-soft | `#4a5157` | Secondary copy |
| ink-faint | `#5e666d` | Labels and metadata (5.3:1 on canvas) |
| line | `#e4e6e1` | Hairlines and card borders |
| line-strong | `#c6cbc4` | Input borders, dimension ticks |
| accent | `#14539a` | The pen: primary action, links, measurement, focus |
| accent-hover | `#0f4178` | Hover state of the pen |
| accent-ink | `#10406f` | Type on accent-tinted chips |
| accent-soft | `#e3edfa` | Selected chips and tints |
| signal | `#b98a2f` | Demo data and stale observations only |
| signal-soft | `#f7efdc` | Taped notices: demo banner, map notice |

White on accent is 7.7:1. Evidence chips stay light on light: dark type on
pale tints with a hairline border, like labels pinned to a drawing. Every
small-text pair clears 4.5:1 on its own background.

| State | Text | Tape |
|---|---|---|
| Yes | `#2a6a5a` | `#e6f0ec` |
| No | `#a04a3c` | `#f8ebe8` |
| Partial / stale | `#7f6128` | `#f7efdd` |
| Not checked / not applicable | `#5e6660` | `#eef0ec` |

## Type

| Role | English | Bangla |
|---|---|---|
| Display | Instrument Sans 600, tracking `-0.025em`, leading `1.05–1.1` | Hind Siliguri 600, no tracking, leading `1.3` |
| Text, buttons, chips | Instrument Sans 400/500/600 | Hind Siliguri 400/500/600 |
| Label lettering (`.tag`, `.tabular`) | IBM Plex Mono 400/500, tracking `0.04em` | Hind Siliguri, no tracking |

Technical lettering is used the way a drawing uses it: small labels, counts
and dates only. Headings, body, buttons and chips are the normal typeface;
nothing is uppercased. Bengali never inherits Latin tracking or the mono
stack; `html[lang="bn"]` reassigns `--font-annotate` to Hind Siliguri.

## Sheet and rhythm

- The body is the sheet: plain `#f7f7f5` paper. No background grid, no
  gradient wash, no glow; the drawing does the talking.
- `max-w-6xl` (1152px) shell, 16/24px gutters. Reading columns cap at 58–62ch.
- Cards: 2px radius, 1px `line` border, no shadow at rest. Corners are square
  because drawings have corners. Controls are 4px radius, 44px tall minimum.
- A page header is paper with the arch drawn in hairline strokes; sections
  separate with space and hairline rules. Form pages (sign in, report,
  review) carry no arch at all: they are working surfaces.
- The footer closes with a **title block**: four bordered cells carrying
  project, pilot area, language and access, as every drawing sheet does.

## Motion

- `cubic-bezier(0.2, 0.6, 0.2, 1)`, 180–420ms. The movements that exist:
  panel lift (`translateY(-2px)` + hairline turns cyan), dimension-line fill
  (`scaleX 0 → 1`), a 420ms rise-and-fade on first paint, and the same rise
  replayed when the route changes, so one sheet settles into the next.
- Every primary target answers with the lift: buttons and the header action
  rise two pixels, chips, language segments and coverage rows rise one.
  Hover and keyboard focus produce the same lift; focus adds a 2px cyan ring
  with 2px offset. Footer utility links may answer with colour alone.
- **Idle state.** The drawn arch drifts fourteen pixels over twenty seconds,
  like the shadow of a doorway moving through the day. Transform only, one
  slow clock, paused off screen and off under reduced motion. The paper never
  moves; form pages hold no arch and stay still at rest.
- `prefers-reduced-motion: reduce` removes the fill, the entrance, the route
  transition, the arch drift and smooth scrolling. The sheet is complete
  and static at rest.

## The data graphic

The coverage card and the ledger on each place page are the only figures, and
both are real. The coverage card draws a **dimension line**: end ticks mark the
full span of five key features, the cyan segment is the reviewed part, and the
fraction sits at the end of the line. Screen readers get the sentence form,
"3 of 5 key features reviewed". On the place page every row is the actual
evidence: feature, state, source and date.

## Rules that come from the product

- A state is a word first. The dot repeats the word; it never replaces it.
- `Not checked` is never styled like `No`.
- Every public fact carries its source and date on the same line.
- Amber marks thresholds only — demo data and stale observations. It is never
  a background for body text, and cyan is never decorative.
- One primary action per screen. Links are underlined; buttons are filled or
  outlined, never both.
- Bangla and English share the same layout and the same measures; only the
  type, the line-height and the annotation stack change.
