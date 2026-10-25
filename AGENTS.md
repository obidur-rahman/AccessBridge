# AGENTS.md — AccessBridge

Agent instructions for this repository. Read this file before you start work.

## 1. Project

**AccessBridge** is a free, mobile-friendly accessibility directory for a Chattogram pilot. Visitors search for a place, check feature-level accessibility details, and report an update. A reviewer approves reports before they change public information.

The repository is a specification pack only. There is no application code yet. Start every coding task by reading `docs/README.md`, then the document that covers the work:

| Task | Read first |
|---|---|
| Product scope, requirements | `docs/01_PRD.md` |
| Stack, security, privacy, hosting | `docs/02_TRD.md` |
| User journeys, report and review flow | `docs/03_APP_FLOW.md` |
| Interface, content, accessibility | `docs/04_DESIGN_BRIEF.md` |
| Tables, status rules, access control | `docs/05_BACKEND_SCHEMA.md` |
| Build order and release gates | `docs/06_IMPLEMENTATION_PLAN.md` |
| Repository layout, file duties | `docs/07_FILES_AND_DOCUMENTATION.md` |
| State logic, distance, deferrals | `docs/08_MATH_IMPLEMENTATION.md` |
| Decisions and open checks | `docs/SOURCE_AND_ASSUMPTIONS.md` |

**Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL, Auth, Row Level Security), Vercel. Optional Leaflet map with OpenStreetMap-compatible tiles, loaded only on request. Budget is $0 inside free-tier limits.

**Writing style:** ASD-STE100-style Simplified Technical English. Short sentences. Common words. Consistent terms.

## 2. Required skills

Load these with the `skill` tool when the trigger applies. Do not load every skill for every task.

| Skill | Load it when | Level or setting |
|---|---|---|
| `awwwards` | Any design or interface work: home and search, result cards, place page, report form, review dashboard, empty and error states, visual polish. | Apply its craft standard. See the design limits in section 4. |
| `humanize-writing` | Writing or editing any English prose: interface copy, error messages, empty states, documentation, release notes. | Always. No exceptions for user-facing text. |
| `ponytail` | Before adding a dependency, abstraction, state library, or service. During refactor, compaction, and optimisation passes. When a file or component grows beyond what the task needs. | `full` |
| `caveman` | Long sessions, repetitive tool output, status updates, and token pressure. | `full` by default. Use `lite` for a decision summary. Never `wenyan` variants. |
| `agent-browser` | End-to-end verification of a flow, and visual inspection when the task is design work. Only when a local dev server can run. | Use for function first, screenshots second. |
| `impeccable` | Building or refining a specific UI component, form, or state. | Pairs with `awwwards`; it handles the detail work. |
| `web-design-guidelines` | A review or audit pass over finished UI, before a release gate. | Run after the UI is built, not during. |
| `design-an-interface` | Only when the team wants to compare alternative shapes for a module or API. | Optional. Ask before running. |

### Skills to skip

Do not load these for this project: `apple-design` and `vercel-react-view-transitions` (motion-heavy; the brief limits animation), `awwwards` jury mode and `jury` (scoring, not building), `to-prd` (the spec pack already exists), `improve-codebase-architecture` (no codebase yet), `grilling`, `cavecrew`, `orca-cli`, `orchestration`, `lark-doc`, `latex-paper-en`, `ai-research-explore`, `find-skills`, `full-output-enforcement`, `no-ai-slop` (`humanize-writing` covers this), and the `ponytail-*` review and audit skills unless the user asks for one.

## 3. Precedence when skills conflict

Apply this order, highest first:

1. `docs/` requirements, especially privacy, accessibility, and review rules.
2. This file.
3. Default behaviour of each skill.

When two skills disagree, state the conflict in one sentence and follow the higher rule. Do not silently pick one.

## 4. Design limits on `awwwards`

`awwwards` sets the quality bar, not the visual language. It must not override the design brief:

- Target WCAG 2.2 AA. Do not claim conformance before an audit.
- Calm civic interface. No scroll hijacking, custom cursors, autoplay video, WebGL hero scenes, or hidden navigation.
- Do not use colour as the only status signal. Every status needs a text label.
- Respect reduced-motion. Animation is optional, never required to use the site.
- Low bandwidth first. No map on the home page. No large image or font payload on first load.
- Text must stay readable at 200% zoom and on narrow screens.
- Bangla and English must share the same layout and hierarchy.
- Do not let a design flourish stop a keyboard or screen-reader user from finishing the task.

Achieve the standard through typography, spacing, hierarchy, focus states, and restraint. If a choice trades accessibility for visual impact, accessibility wins.

## 5. Non-negotiable product rules

1. `Not checked` is not `No`. Never infer a negative state from a blank field.
2. A pending report never changes public data. Only accepted observations are public.
3. Never show one overall `Accessible` or `Not accessible` label for a venue.
4. Every published accessibility fact shows a source label and an observation date.
5. Never ask for a disability type, diagnosis, or access need.
6. Never send search terms, selected filters, access needs, or device location to the server. Calculate distance in the browser.
7. Do not show a numerical trust score in this release.
8. Keep optional contact details and reviewer notes private and separate from public content.
9. Enforce access in Row Level Security and server-side checks. Hiding a button is not access control.
10. Do not commit secrets. The service-role key never reaches the browser or a `NEXT_PUBLIC_` variable.
11. Stay inside free-tier limits. No AI service, job queue, background worker, SMS, email provider, or payments in this release.
12. Show the "contact the venue before travel" reminder on place pages.

## 6. Working rules

- Make the smallest change that meets the request. Do not add features the docs mark `LATER` or out of scope.
- Prefer editing an existing file. Do not create a new file for logic that fits an existing module.
- Use one shared type for feature states. Keep the vocabulary identical across form, database, and page.
- Validate on the server even when the browser validates.
- Keep public queries separate from staff queries.
- Add a test when a status rule, source label, or permission changes.
- Verify before you report done: run the typecheck and the tests that cover the change, then exercise the flow in `agent-browser` when a server can run.
- Report a check that failed or could not run. Never present it as a pass.
- Do not change a public status, source label, category, or retention rule without updating the related `docs/` file.

## 7. Communication

Use `caveman` compression for progress updates and mechanical explanations. Return to normal prose for a decision summary, a risk, or anything the user must review. Never compress code, database schemas, interface copy, or documentation text.

After a task, end with one message that covers: the outcome, what changed, what you verified, and any blocker.
