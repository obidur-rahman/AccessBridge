# AccessBridge — Design System

## Revision (29 Oct 2026)

**Final direction: a calm civic app.** The field-notebook pass (paper margin rules, folios,
numbered stations, stamped frames) is retired. The app now uses a compact shell, rounded
cards, one accent colour and an ambient light wash. It is an app, not a brochure: no page
numbers, no numbered sections, no oversized gutters, no marketing steps.

## Concept card

```
Idea:        A small civic tool that answers one question fast: can I use this place?
Metaphor:    A calm front desk: soft daylight, a clear search, short records on cards.
Signature:   Type a place on the home screen and matching records appear in place, filtered
             in the browser. No page change, no query sent to the server.
Emotion:     Quick, quiet, trustworthy.
Motion verb: settle: results rise and cards lift, nothing flies or bounces.
```

## Palette

| Role | Hex | Use |
|---|---|---|
| canvas | `#f4f2ec` | app background, warm paper |
| surface | `#fffefb` | cards, fields, sheets |
| surface-muted | `#edebe4` | quiet fills, segmented controls |
| surface-sunk | `#f8f6f1` | inset rows inside cards |
| ink | `#161a16` | text and the brand mark |
| ink-soft | `#4e554e` | body copy, secondary facts |
| ink-faint | `#626a61` | labels, dates, hints |
| line | `#e3dfd5` | card borders and dividers |
| line-strong | `#c9c4b8` | field borders and outlines |
| accent | `#17405f` | actions, links, focus, active tabs |
| accent-hover | `#0f2f47` | hover and pressed actions |
| accent-soft | `#e4edf3` | washes and selected chips |
| accent-2 | `#0d6b5b` | report action gradient, current-page dot, teal wash |
| accent-2-ink | `#085044` | teal figures and links |
| accent-2-soft | `#dcefe8` | teal washes and step markers |
| warm | `#94560f` | third figure tone and small warm accents |
| warm-soft | `#f7e8d0` | warm step marker |
| focus | `#17405f` | focus ring, `#8ec5e2` in dark |
| signal | `#7a5008` | demo labels and recheck notes |
| yes | `#116b45` | accepted observation |
| no | `#a9342a` | observed barrier |
| partial | `#7d560c` | partly usable |
| unknown | `#5a6364` | not checked, not applicable |

Status colours appear only inside a status chip. Each chip carries a symbol and a word, so
colour is never the only signal.

Dark theme keeps the same five status hues at lighter tones on dark washes. It is a
preference, not a media query: light is the default until the visitor asks for dark.

## Type

- **Display:** Newsreader 400/500/600. Serif headings give the tool a voice without weight.
- **Body and UI:** Atkinson Hyperlegible 400/700. Chosen for low-vision legibility.
- **Metadata:** DM Mono 400. Dates, counts and tiny labels only. No uppercase.
- **Bangla:** Hind Siliguri 400/500/600/700 for every role, same sizes and hierarchy.
- Hero `clamp(2.2rem, 5vw, 3.6rem)`, page titles `clamp(1.9rem, 4.4vw, 2.7rem)`, body 16px,
  small 12 to 14px, annotations 12px.

## Layout and shape

- **Shell:** content up to 84rem with 1 / 1.25 / 1.5rem gutters. No margin columns, no folios.
- **App bar:** fixed over the page, 44px on phones and 48px above. Brand left; directory,
  staff entry and language right; one accent action for reporting. No "How it works" link.
  Only the pill paints a surface, so nothing sits between the page and the bar.
- **Bottom tabs (phones):** Home, Directory, Report, and Review or Account. Fixed, 56px,
  safe-area aware, hidden at 1024px and above.
- **Cards:** 14px radius, 1px hairline, 1px shadow. Controls 10px radius, status and filter
  chips fully rounded. No pills used as decoration.
- **Spacing:** 8px rhythm; page sections 28 to 44px apart. Cards sit in 2 or 4 column grids
  on desktop, one column on phones. The bar floats: `main` reserves 80px on phones and 88px
  above 640px so every page head clears it. The home hero, sign in, sign up and 404 screens
  pull up under the bar so their light wash reaches the top edge, and pad their own content
  clear of it.

## Motion

- One easing family: `cubic-bezier(0.22, 1, 0.36, 1)`. Hovers 160 to 220ms, page entry 420ms.
- Staggered rise: lists and card grids use `.stagger`, 45ms steps, mount only. The theme icon
  turns 18 degrees on hover, the current nav dot scales in, chips compress on press.
- Cards lift 2px and take a soft shadow on hover; arrows travel 3px; primary buttons press
  in 1px.
- **Ambient light:** two slow, blurred washes (cool blue, warm sand) drift behind the top of
  the home, auth and 404 screens. 22 to 26s, alternate, `prefers-reduced-motion` removes it.
- Instant search results and the area filter drop in (`.pop-in`, 220ms). The split-view
  place panel slides in from the list (`.slide-in`, 300ms). Footer links grow a rule on
  hover (`.foot-link`). No scroll hijacking, no parallax, no autoplay media.
- The app is otherwise still at rest.

## Theme, brand and app bar

- **Light is the default.** The toggle writes `data-theme="dark"` on the root and stores the
  choice in this browser only. An inline script applies a stored dark choice before paint.
- **Dark tokens:** canvas `#101519`, surface `#171d22`, ink `#f0eee7`, accent `#2a6e96`,
  accent-2 `#1c8574`, focus `#8ec5e2`. The warm paper tone becomes slate; teal and warm stay,
  so the app never turns monochrome.
- **Brand:** `logo.png` keeps the transparent plate. The ink wordmark is used on light, and
  `logo-light.png` swaps the ink for paper on dark while the red figure stays. No white tile.
- **App bar:** a floating pill, 44px on phones and 48px above, rounded at 15px, with a
  translucent surface, blur and lift shadow. Only the pill paints a surface; the page scrolls
  behind it with no band, so the top of the page is not a strip of page colour.
- **Logo assets:** served directly with `unoptimized`. The Next image pipeline re-encodes the
  transparent PNG and paints a dark plate behind the wordmark on high-DPI screens. Desktop links are pills; the current page fills with `accent-soft`
  and takes a teal dot. The right cluster holds the theme toggle, the language switch and the
  gradient report action.
- **First visit:** a dialog asks for both Bangla or English and light or dark, previewing the
  theme as it is chosen. The answers use the language cookie and the theme storage.
- **Directory:** from 1024px the list narrows to the left and the chosen place opens on the
  right, with the row filled in `accent-soft` and `aria-current`. Below that, a row is a normal
  link to the place page.
- **Roadmap:** the full plan from `docs/06_IMPLEMENTATION_PLAN.md`, across the whole page.
  Phases are grouped by status, in the order live now, next, later, not planned. Each group
  has a heading, a coloured dot and a hairline rule, then its phase cards: title, summary
  and bullet list. Nothing repeats and nothing is numbered; the plan is one read from top to
  bottom, with no controls to click.

## Surfaces

| Screen | App role |
|---|---|
| Home | Hero title, instant search with category chips, real counts, four recent cards, compact trust card, report card |
| Directory | Search field, scrollable category chips, area filter, and a desktop split view: result list left, open place right |
| Roadmap | Phase strip, two column phase board with status pills and bullet lists, one report action |
| Place | Title and chips, facts card, feature list on one card, mobile report action, map on request |
| Report | Four short cards, boxed fields, receipt card with a copyable code |
| Review | Queue of intake cards, detail with feature list, sticky decision card |
| Admin | Report cards, audit list, staff card |
| Auth / 404 | Single centered card under the ambient light |

## Rules kept from the product brief

- No overall accessible verdict. Each feature keeps its own word, source and date.
- `Not checked` is never shown as `No`.
- Pending reports never change public data.
- Search, filters and location logic stay in the browser.
- Demo labels stay visible; the venue reminder stays on place pages.
- Map loads only on request, with the provider notice.
- WCAG 2.2 AA target: visible focus, 24px+ targets, no colour-only status, reduced motion.
