# One-Page Live Gallery — Design

**Date:** 2026-06-20
**Status:** Approved
**Surface:** `apps/web` (Next.js docs/marketing site for `@connor-adams/designsystem`)

## Problem

The `/components` route is a text-link index: 43 component names grouped by category,
each linking to its own `/components/[slug]` detail page. Nothing renders until you
click into a page, so browsing the library means visiting 43 separate routes. This
feels nothing like the single cohesive Claude.ai artifact the design system was
prototyped against, where every component renders live on one scroll.

Two contributing problems were found:

1. **Phantom `.test` nav entries (fixed in this branch).** `apps/web/scripts/gen-data.mjs`
   discovered components via `readdirSync(dir).filter(x => x.endsWith('.tsx'))`, which
   scooped up the 43 `*.test.tsx` files added by merge #9. The generated `manifest.json`
   carried 86 entries (43 real + 43 `<name>.test`) and `usage.json` carried 43 empty
   `.test` keys — doubling the nav list with dead routes. Fixed by excluding
   `*.test.tsx` from discovery; `manifest.json`/`usage.json` regenerated to 43 each.
2. **No live overview surface.** Even clean, the index is name-only. This spec addresses it.

## Goal

Replace the `/components` text-link index with a single scrollable page that renders
every component live, with a sticky left sidebar (filter + category anchor nav). Detail
pages stay for depth (props table, usage notes).

## Scope

**In:**
- New one-page live gallery at `/components`.
- Sticky left sidebar: filter input + category-grouped component anchor links.
- Client-side case-insensitive name filter that live-hides non-matching components in
  both sidebar and gallery; categories with zero matches hide their heading.
- Per-component gallery block: anchor target, live preview, import snippet, `Details →`
  link to `/components/[slug]`.

**Out (YAGNI):**
- Props/usage tables inline in the gallery (kept on detail pages).
- Search beyond component-name match.
- Storybook wiring.
- Changes to the home page or the `[slug]` detail pages.

## Architecture

Reuse the existing idioms: inline styles keyed off CSS custom properties (the whole app
uses this), the complete `previews` registry (`src/previews/index.tsx`, 43/43 coverage),
the `CATEGORY_ORDER` constant, and the untouched `[slug]` detail route.

### Units

**`app/components/page.tsx`** — server component (unchanged role).
- Reads `manifest.json`.
- Renders `<Gallery entries={manifest} />`.
- No longer renders the text-link grid.

**`components/Gallery.tsx`** (`'use client'`) — the gallery shell.
- Owns filter state (`useState('')`).
- Computes the filtered, category-grouped entry list from `manifest` + `CATEGORY_ORDER`.
- Renders `<GallerySidebar>` and the scrolling gallery column.
- For each entry, looks up `previews[slug]`; renders it in a bordered card, with the
  import snippet and `Details →` link. Falls back to "Preview coming soon." when a preview
  is absent (matches existing `Preview.tsx` behavior).
- Two-column flex/grid: sidebar fixed-width sticky, gallery flexes.

**`components/GallerySidebar.tsx`** — sidebar nav.
- Props: `groups` (category → visible entries), `query`, `onQueryChange`.
- Renders the filter `<input>` and, per non-empty category, a heading + anchor links
  (`<a href="#slug">`).
- Sticky within the sidebar column; scrolls independently if tall.

### Data flow

`manifest.json` → `page.tsx` (server) → `Gallery` (client, holds `query`) →
filtered groups → `GallerySidebar` (nav) + gallery sections (live `previews[slug]`).

Filter is pure client state; no routing, no query params. Typing narrows both columns
in the same render.

### Anchors / sticky offset

Each gallery block root has `id={slug}` and `scrollMarginTop` (CSS `scroll-margin-top`)
≈ header height (56px) so
anchor jumps land below the sticky `SiteHeader`. Sidebar links are plain hash anchors.

## Error / edge handling

- **Missing preview:** render the existing "Preview coming soon." placeholder; never crash.
- **Empty filter result:** all categories hide; show a "No components match." line in the
  gallery column.
- **Unknown category in manifest:** ignored by `CATEGORY_ORDER` grouping (existing behavior).

## Testing / verification

`apps/web` has no test harness today; this spec does not add one (out of scope — the DS
package owns component tests). Verify manually:

1. `pnpm --filter web build` (or dev) succeeds; `gen-data` emits 43 entries, no `.test`.
2. `/components` renders all 43 live previews grouped by category.
3. Sidebar filter narrows both sidebar links and gallery blocks; zero-match categories
   disappear; empty result shows the no-match line.
4. Clicking a sidebar link jumps to the component with the heading clear of the header.
5. `Details →` reaches the correct `/components/[slug]` page; detail pages unchanged.

## Notes

- The `.test`-pollution fix to `gen-data.mjs` + regenerated `manifest.json`/`usage.json`
  is already staged on this branch and ships together with the gallery.
