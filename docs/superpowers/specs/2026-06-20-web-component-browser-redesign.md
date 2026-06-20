# Web docs → unified component browser

**Date:** 2026-06-20
**Scope:** `apps/web` only. Storybook (`apps/storybook`) untouched.

## Problem

The web docs site has no persistent navigation. The left sidebar exists only on the
`/components` one-page gallery; the home page (`/`) is a standalone marketing hero and
each component's own page (`/components/[slug]`) is a centered, sidebar-less layout. Clicking
a component drops you out of any menu. There is no Storybook-style "pick a component from a
persistent menu, see it rendered with its variants" experience.

## Goal

Rebuild `apps/web` into a single, branded, Storybook-style component browser:

- A **persistent left menu** of all components (grouped, filterable) that never unmounts.
- Clicking a component shows **that component with its labeled variants**, plus props, usage,
  and import — in the main panel, sidebar still present.
- A **unified shell**: the home view lives inside the same shell (no separate landing mode).
- General visual polish, including a working light/dark theme toggle.

## Non-goals (YAGNI for v1)

- ⌘K command palette / global search overlay (the sidebar filter covers v1).
- Interactive prop controls / knobs (that is Storybook's job).
- Reusing Storybook CSF stories as the variant source — variants are **web-owned** and curated.
- Any change to Storybook, `gen-data.mjs`'s extraction logic, or the design-system package.

## Architecture

### Shell (`app/layout.tsx`)

The root layout becomes the persistent shell, rendered on every route:

```
<body>
  <TopBar/>          // logo/wordmark · theme toggle
  <div class=row>
    <Sidebar/>       // client component: filter + grouped nav + active highlight
    <main>{children}</main>
  </div>
</body>
```

- `Sidebar` is a **client component** (holds filter text state, reads `usePathname()` for the
  active item). It reads the committed `manifest.json` for the component list.
- Page content (`children`) stays **server-rendered** (static). Only the sidebar is client.
- The shell owns max-width, the sidebar/main split, and scroll behavior (sidebar scrolls
  independently; main scrolls in the document).

### Routes

| Route | Renders |
|---|---|
| `/` | **Overview** — welcome heading, live stats (component count / category count / theme count), `npm i` snippet, category jump-in grid. Inside the shell. |
| `/components/[slug]` | **Component detail** (rebuilt). One static page per manifest entry (`generateStaticParams`). |
| `/components` | **Redirect to `/`** (the index/gallery is removed; the sidebar replaces it). |

### Variant model (web-owned)

Restructure `apps/web/src/previews/index.tsx`:

```ts
export type Variant = { label: string; node: React.ReactNode }
export const previews: Record<string, Variant[]>
```

- Each slug maps to an **ordered list of labeled variants**. The current single composite
  previews are split into labeled stages — e.g. `badge`'s five-in-a-row composite becomes
  `[{label:'Variants', node:<…all five…>}]` or finer-grained stages where it reads better;
  `button` → `Default`, `Variants`, `Sizes`, `Disabled`.
- Curated by the implementer (approved). Controlled-component previews keep their existing
  named-function wrappers (e.g. `TabsPreview`, `PaginationPreview`) and appear as a variant's
  `node`.
- A component with no entry in `previews` renders a graceful "no preview yet" placeholder in
  its detail page rather than crashing.

### Component detail view (`components/[slug]/page.tsx`)

Server component. Order:

1. Category crumb (uppercase) → component name (`h1`) → one-line lead.
2. **Variant stages**: for each `Variant`, a small uppercase label + a bordered, themed
   "stage" box containing `variant.node`. Stacked vertically. (Client island — the variant
   nodes use design-system components with hooks, mounted via the existing `Preview` client
   boundary pattern, now iterating over the variant list.)
3. **Props** — existing `PropsTable`, fed by `props.json`.
4. **Usage** — existing `UsageNotes`, only when `usage.json` has content for the slug.
5. **Import** — `import { Name } from '@connor-adams/designsystem'` snippet.

### Sidebar (`components/Sidebar.tsx`, evolves `GallerySidebar`)

- Filter `<input>` (case-insensitive substring over component names).
- Category groups in the existing order (`core, data, feedback, finance, forms, navigation,
  overlays`), each a heading + list.
- Items are Next `<Link href="/components/{slug}">` (drop the `#anchor` model).
- Active item (matches current pathname) gets a highlighted style (accent left-border + bg).
- Sticky, independently scrollable.

### Overview home (`app/page.tsx`)

Replaces the marketing hero. Inside the shell:

- Gradient wordmark + one-line description.
- Stat row: component count (from manifest length), category count, theme count — small cards.
- `npm i @connor-adams/designsystem` code snippet.
- Category grid: one card per category linking to its first component (jump-in).

### Theme toggle

- Wire a `TopBar` toggle to the token layer's light/dark theming (the tokens package exposes
  both themes via `data-theme`/`prefers-color-scheme`). Toggle sets `data-theme` on `<html>`
  and persists to `localStorage`. Client component; no flash-of-wrong-theme mitigation beyond
  reading `localStorage` on mount is required for v1 (acceptable).

## Files

**New**
- `apps/web/src/components/Sidebar.tsx`
- `apps/web/src/components/TopBar.tsx`
- `apps/web/src/components/ThemeToggle.tsx`

**Changed**
- `apps/web/src/app/layout.tsx` — shell (TopBar + Sidebar + main).
- `apps/web/src/app/page.tsx` — Overview home.
- `apps/web/src/app/components/[slug]/page.tsx` — variant-stage detail view.
- `apps/web/src/previews/index.tsx` — `Record<slug, Variant[]>`.
- `apps/web/src/components/Preview.tsx` — render a variant list (or per-variant mount).

**Removed**
- `apps/web/src/components/Gallery.tsx`
- `apps/web/src/components/GallerySidebar.tsx` (superseded by `Sidebar.tsx`)
- `apps/web/src/components/Showcase.tsx`
- `apps/web/src/app/components/page.tsx` (replaced by redirect to `/`)

**Unchanged**
- `apps/web/scripts/gen-data.mjs`, the three `generated/*.json`, `PropsTable.tsx`,
  `UsageNotes.tsx`, `vercel.json`, the design-system + tokens packages, all of `apps/storybook`.

## Data flow

`gen-data.mjs` (build-time, unchanged) → `manifest.json` (sidebar + static params + overview
stats), `props.json` (props tables), `usage.json` (usage notes). The hand-authored
`previews/index.tsx` supplies live variant renders keyed by slug. No runtime data fetching.

## Error / edge handling

- Slug not in manifest → `notFound()` (existing behavior).
- Slug in manifest but absent from `previews` → "no preview yet" placeholder; props/usage/import
  still render.
- Empty filter → full list. Filter with no matches → "No components match" line.
- Component with no usage notes → Usage section omitted (existing behavior).

## Testing / verification

- `pnpm turbo run build --filter=@connor-adams/web` succeeds; static export covers `/`,
  `/components/[slug]` × 43, and the `/components` redirect.
- Manual: every sidebar link routes and highlights; sidebar persists across navigation;
  theme toggle flips light/dark and persists across reloads; a component lacking a preview
  shows the placeholder, not a crash.
- Deployed preview on Vercel (auto-deploy on push) renders the shell on a component detail
  route (the regression that started this).

## Rollout

Feature branch `feat/web-component-browser` → PR → auto-merge (merge commit) → Vercel
auto-deploys `main` to `cashflow-web-ten.vercel.app`.
