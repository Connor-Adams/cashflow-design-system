# One-Page Live Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `/components` text-link index in `apps/web` with a single scrollable page that renders all 43 components live, with a sticky filter sidebar.

**Architecture:** A server `page.tsx` reads `manifest.json` and hands entries to a client `Gallery` component that owns filter state, groups entries by category, and renders each component's live preview from the existing `previews` registry. A presentational `GallerySidebar` renders the filter input + category anchor nav. Detail pages (`[slug]`) are untouched.

**Tech Stack:** Next.js (app router), React 18, TypeScript. Inline styles keyed off CSS custom properties (existing app idiom). pnpm workspaces + turbo.

## Global Constraints

- Package: `@connor-adams/web` (`apps/web`). Dev server port **3001**.
- **No test harness exists in `apps/web` and this plan does not add one** (per approved spec — the DS package owns component tests). Verification gates are **typecheck + production build + visual check on the dev server**, not unit tests.
- Styling: inline `style={{}}` objects using `var(--token)` CSS custom properties. Match existing files (`SiteHeader.tsx`, `components/page.tsx`). No CSS modules, no new deps.
- Component imports from the library: `@connor-adams/designsystem`. Preview registry: `../previews` (exports `previews: Record<string, React.ReactNode>`, keyed by slug, 43/43 coverage).
- Category order (verbatim): `core`, `data`, `feedback`, `finance`, `forms`, `navigation`, `overlays`.
- Sticky `SiteHeader` is 56px tall; anchor targets need `scrollMarginTop` ≈ 72 to clear it.
- Commits: no `Co-Authored-By` trailers.

---

### Task 1: GallerySidebar component

Presentational sidebar: filter input + category-grouped anchor links. Pure props, no state of its own.

**Files:**
- Create: `apps/web/src/components/GallerySidebar.tsx`

**Interfaces:**
- Consumes: `ManifestEntry` type (defined in Task 2's `Gallery.tsx`). During this task that file does not exist yet, so define the type locally here and switch to the shared import in Task 2's integration. To keep Task 1 self-contained and compiling, declare the prop types inline as shown below (no import from `./Gallery`).
- Produces: `GallerySidebar` — `(props: { groups: Group[]; query: string; onQueryChange: (v: string) => void }) => JSX.Element`, where `Group = { category: string; items: { slug: string; name: string; category: string }[] }`.

- [ ] **Step 1: Create the component**

```tsx
// apps/web/src/components/GallerySidebar.tsx
'use client'

import * as React from 'react'

type Entry = { slug: string; name: string; category: string }
type Group = { category: string; items: Entry[] }

export function GallerySidebar({
  groups,
  query,
  onQueryChange,
}: {
  groups: Group[]
  query: string
  onQueryChange: (value: string) => void
}) {
  return (
    <aside
      style={{
        position: 'sticky',
        top: 72,
        alignSelf: 'flex-start',
        width: 220,
        flexShrink: 0,
        maxHeight: 'calc(100vh - 88px)',
        overflowY: 'auto',
      }}
    >
      <input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Filter components…"
        aria-label="Filter components"
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '8px 12px',
          marginBottom: 20,
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--background)',
          color: 'var(--foreground)',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-body-sm)',
        }}
      />

      {groups.map((group) => (
        <div key={group.category} style={{ marginBottom: 16 }}>
          <p
            style={{
              margin: '0 0 6px',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-body-sm)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--muted-foreground)',
            }}
          >
            {group.category.charAt(0).toUpperCase() + group.category.slice(1)}
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {group.items.map((item) => (
              <li key={item.slug}>
                <a
                  href={`#${item.slug}`}
                  style={{
                    display: 'block',
                    padding: '3px 0',
                    color: 'var(--muted-foreground)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--text-body-sm)',
                  }}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter @connor-adams/web typecheck`
Expected: PASS (no errors). The component is unused so far; TypeScript still compiles it.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/GallerySidebar.tsx
git commit -m "feat(web): add GallerySidebar (filter input + category anchor nav)"
```

---

### Task 2: Gallery component

Client shell that owns filter state, groups entries, renders the sidebar + live preview blocks.

**Files:**
- Create: `apps/web/src/components/Gallery.tsx`
- Modify: `apps/web/src/components/GallerySidebar.tsx` (swap the local `Entry`/`Group` types for the shared `ManifestEntry` import)

**Interfaces:**
- Consumes: `previews` from `../previews` (`Record<string, React.ReactNode>`); `GallerySidebar` from `./GallerySidebar`.
- Produces: `Gallery` — `(props: { entries: ManifestEntry[] }) => JSX.Element`; and exported type `ManifestEntry = { slug: string; name: string; category: string }`, consumed by Task 3's `page.tsx` and by `GallerySidebar`.

- [ ] **Step 1: Create the Gallery component**

```tsx
// apps/web/src/components/Gallery.tsx
'use client'

import * as React from 'react'
import Link from 'next/link'
import { previews } from '../previews'
import { GallerySidebar } from './GallerySidebar'

export type ManifestEntry = { slug: string; name: string; category: string }

const CATEGORY_ORDER = ['core', 'data', 'feedback', 'finance', 'forms', 'navigation', 'overlays'] as const

const HEADER_OFFSET = 72

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function Gallery({ entries }: { entries: ManifestEntry[] }) {
  const [query, setQuery] = React.useState('')
  const q = query.trim().toLowerCase()

  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: entries.filter((e) => e.category === category && e.name.toLowerCase().includes(q)),
  })).filter((group) => group.items.length > 0)

  const total = groups.reduce((n, group) => n + group.items.length, 0)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 32,
        maxWidth: 1200,
        margin: '0 auto',
        padding: '40px 24px',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <GallerySidebar groups={groups} query={query} onQueryChange={setQuery} />

      <main style={{ flex: 1, minWidth: 0 }}>
        {total === 0 ? (
          <p style={{ color: 'var(--muted-foreground)' }}>No components match.</p>
        ) : (
          groups.map((group) => (
            <section key={group.category} style={{ marginBottom: 56 }}>
              <h2
                style={{
                  margin: '0 0 24px',
                  fontSize: 'var(--text-body-sm)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--muted-foreground)',
                }}
              >
                {cap(group.category)}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {group.items.map((item) => (
                  <article key={item.slug} id={item.slug} style={{ scrollMarginTop: HEADER_OFFSET }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        justifyContent: 'space-between',
                        gap: 12,
                        marginBottom: 12,
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 'var(--text-body)',
                          fontWeight: 600,
                          color: 'var(--foreground)',
                        }}
                      >
                        {item.name}
                      </h3>
                      <Link
                        href={`/components/${item.slug}`}
                        style={{
                          color: 'var(--primary)',
                          textDecoration: 'none',
                          fontSize: 'var(--text-body-sm)',
                          fontWeight: 500,
                          flexShrink: 0,
                        }}
                      >
                        Details →
                      </Link>
                    </div>

                    <div
                      style={{
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 32,
                        background: 'var(--card)',
                      }}
                    >
                      {previews[item.slug] ?? (
                        <span style={{ color: 'var(--muted-foreground)' }}>Preview coming soon.</span>
                      )}
                    </div>

                    <pre
                      style={{
                        margin: '12px 0 0',
                        background: 'var(--muted)',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        overflowX: 'auto',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--text-body-sm)',
                        color: 'var(--foreground)',
                      }}
                    >
                      <code>{`import { ${item.name} } from '@connor-adams/designsystem'`}</code>
                    </pre>
                  </article>
                ))}
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Point GallerySidebar at the shared type**

Replace the two local type lines in `apps/web/src/components/GallerySidebar.tsx`:

```tsx
type Entry = { slug: string; name: string; category: string }
type Group = { category: string; items: Entry[] }
```

with an import of the shared type plus the `Group` alias:

```tsx
import type { ManifestEntry } from './Gallery'

type Group = { category: string; items: ManifestEntry[] }
```

(Place the `import type` line directly under the existing `import * as React from 'react'` line. Leave the rest of the file unchanged.)

- [ ] **Step 3: Typecheck**

Run: `pnpm --filter @connor-adams/web typecheck`
Expected: PASS. Confirms `previews` lookup, the `Group`/`ManifestEntry` types, and the sidebar↔gallery import all line up. (`import type` keeps it a compile-time-only edge — no runtime import cycle.)

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/Gallery.tsx apps/web/src/components/GallerySidebar.tsx
git commit -m "feat(web): add Gallery (live previews + filter + category sections)"
```

---

### Task 3: Wire the route + verify end-to-end

Swap the text-link index for the gallery and confirm the whole thing builds and renders.

**Files:**
- Modify: `apps/web/src/app/components/page.tsx` (replace entire file)

**Interfaces:**
- Consumes: `Gallery`, `ManifestEntry` from `../../components/Gallery`; `manifest.json` (43 entries, no `.test`).

- [ ] **Step 1: Replace the page with the gallery**

Replace the entire contents of `apps/web/src/app/components/page.tsx` with:

```tsx
import * as React from 'react'
import manifest from '../../generated/manifest.json'
import { Gallery, type ManifestEntry } from '../../components/Gallery'

export default function ComponentsPage() {
  return <Gallery entries={manifest as ManifestEntry[]} />
}
```

(This deletes the old `CATEGORY_ORDER`/`groupByCategory`/text-link grid in this file — that grouping now lives in `Gallery.tsx`.)

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter @connor-adams/web typecheck`
Expected: PASS.

- [ ] **Step 3: Production build (also re-runs gen-data)**

Run: `pnpm --filter @connor-adams/web build`
Expected: build succeeds; `gen-data` logs `gen-data: 43 components, ...`; Next.js statically generates `/components` and all 43 `/components/[slug]` routes with no errors.

- [ ] **Step 4: Visual verification on the dev server**

Run: `pnpm --filter @connor-adams/web dev` then open `http://localhost:3001/components`.
Confirm:
- All 43 components render live, grouped under the 7 category headings in order.
- The sidebar lists every component under its category; clicking a link jumps to that component with its heading clear of the sticky header.
- Typing in the filter (e.g. `card`) narrows both the sidebar and the gallery to matching components; categories with no match disappear.
- A non-matching query (e.g. `zzz`) shows "No components match."
- Each block's `Details →` link opens the correct `/components/[slug]` detail page, which looks unchanged.

Stop the dev server when done.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/components/page.tsx
git commit -m "feat(web): serve one-page live gallery at /components"
```

---

## Self-Review

**Spec coverage:**
- One-page live gallery at `/components` → Task 3 (page) + Task 2 (render).
- Sticky left sidebar, filter + category anchor nav → Task 1.
- Client-side name filter, hides non-matching + empty categories, no-match line → Task 2 (`groups` filter + `total === 0`).
- Per-component block: anchor, live preview, import snippet, `Details →` → Task 2.
- `scrollMarginTop` clears 56px header → Task 2 (`HEADER_OFFSET = 72`).
- Detail pages / home untouched → only `page.tsx` modified; `[slug]` and home not in any task.
- `.test` pollution fix → already committed on this branch (`b76eb8f`), referenced in Global Constraints.

**Placeholder scan:** none — every step has full code or an exact command + expected output.

**Type consistency:** `ManifestEntry = { slug; name; category }` defined and exported in `Gallery.tsx` (Task 2), imported by `page.tsx` (Task 3) and `GallerySidebar.tsx` (Task 2 Step 2). `Group = { category; items: ManifestEntry[] }` matches the object shape Gallery passes to the sidebar. `previews` typed `Record<string, React.ReactNode>`, looked up by `item.slug`. Consistent.
