# Web Component Browser Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `apps/web` into a single, branded, Storybook-style component browser — a persistent left menu, a unified in-shell home, and per-component detail pages that show labeled variants plus props/usage/import.

**Architecture:** Next.js App Router. The root `layout.tsx` becomes a persistent shell (TopBar + client Sidebar + server-rendered main outlet). Component variants are web-owned, curated in `previews/index.tsx` as `Record<slug, Variant[]>`. No new data pipeline — the existing `gen-data.mjs` outputs (`manifest.json`, `props.json`, `usage.json`) still drive everything.

**Tech Stack:** Next.js 15 (App Router, RSC), React 18, `@connor-adams/designsystem` (workspace dep), TypeScript. No CSS framework — inline styles + design-system CSS custom properties (tokens).

## Global Constraints

- Scope is `apps/web` ONLY. Do not touch `apps/storybook`, `packages/*`, `gen-data.mjs`, or the three `generated/*.json` files.
- No new npm dependencies.
- Styling uses design-system CSS variables (`var(--background)`, `var(--foreground)`, `var(--border)`, `var(--muted)`, `var(--muted-foreground)`, `var(--primary)`, `var(--primary-foreground)`, `var(--radius-md)`, `var(--font-sans)`, `var(--font-mono)`, `var(--text-body)`, `var(--text-body-sm)`, `var(--gradient-hero)`). Never hardcode hex colors.
- Theme switching is driven by the `data-theme` attribute on `<html>` (values `"light"` / `"dark"`), matching `apps/storybook` and the repo's `preview.html`.
- Category order is fixed: `core, data, feedback, finance, forms, navigation, overlays`.
- No test runner exists in `apps/web`. "Verify" steps use the production build (`pnpm turbo run build --filter=@connor-adams/web` from repo root) and grep/inspection of built output under `apps/web/.next` or a dev server, NOT unit tests.
- Build command (run from repo root `/Users/connoradams/Developer/Cashflow Design System`): `pnpm turbo run build --filter=@connor-adams/web`. Expected tail: `Tasks: 2 successful, 2 total`.
- Commit after every task. Branch: `feat/web-component-browser`. Never add `Co-Authored-By`.

---

## File Structure

**New**
- `apps/web/src/components/ThemeToggle.tsx` — client; toggles `data-theme`, persists to `localStorage`.
- `apps/web/src/components/TopBar.tsx` — server; wordmark + `ThemeToggle`.
- `apps/web/src/components/Sidebar.tsx` — client; filter input + grouped `<Link>` nav + active highlight.

**Modified**
- `apps/web/src/previews/index.tsx` — export `Variant` type; `previews: Record<string, Variant[]>`.
- `apps/web/src/components/Preview.tsx` — render a slug's variant stages.
- `apps/web/src/app/layout.tsx` — persistent shell.
- `apps/web/src/app/page.tsx` — in-shell Overview home.
- `apps/web/src/app/components/[slug]/page.tsx` — variant-stage detail view.

**Removed**
- `apps/web/src/components/Gallery.tsx`
- `apps/web/src/components/GallerySidebar.tsx`
- `apps/web/src/components/Showcase.tsx`
- `apps/web/src/app/components/page.tsx` (replaced by a redirect)

---

## Task 1: Variant model + Preview rendering

Restructure the curated previews into ordered, labeled variants and make `Preview` render them as stacked stages. This task leaves the detail page working with the new `Preview` API.

**Files:**
- Modify: `apps/web/src/previews/index.tsx`
- Modify: `apps/web/src/components/Preview.tsx`
- Modify: `apps/web/src/app/components/[slug]/page.tsx` (only the `<Preview>` usage stays valid — no layout change yet)

**Interfaces:**
- Produces: `export type Variant = { label: string; node: React.ReactNode }` and `export const previews: Record<string, Variant[]>` from `previews/index.tsx`.
- Produces: `<Preview slug={string} />` (unchanged signature) now renders every variant for that slug as a labeled stage, or a placeholder if the slug has no entry.
- Consumes: existing imports from `@connor-adams/designsystem` already present in `previews/index.tsx`.

- [ ] **Step 1: Read the current previews to migrate**

Read `apps/web/src/previews/index.tsx`. It currently exports `previews: Record<string, React.ReactNode>` — one composite node per slug, plus controlled wrapper components (`TabsPreview`, `PeriodSelectorPreview`, `PaginationPreview`).

- [ ] **Step 2: Add the `Variant` type and convert the export**

At the top of the `previews` export region, add:

```tsx
export type Variant = { label: string; node: React.ReactNode }
```

Change the export signature to `export const previews: Record<string, Variant[]> = {`.

Convert each existing entry from `slug: <node>` to `slug: [{ label: '…', node: <node> }, …]`. **Migration rule:** wrap each existing composite as a single variant labeled `'Example'`. Where a composite already shows a clearly-named set, split it into finer labeled variants. Worked examples:

```tsx
// was: button: <…> (if it existed) — author explicit variants:
button: [
  { label: 'Variants', node: (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  )},
  { label: 'Sizes', node: (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  )},
  { label: 'Disabled', node: <Button disabled>Disabled</Button> },
],

// existing avatar composite → keep as one labeled variant:
avatar: [
  { label: 'Sizes & status', node: (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar name="Connor Adams" size="sm" />
      <Avatar name="Connor Adams" size="md" status="online" />
      <Avatar name="Connor Adams" size="lg" ring status="away" />
    </div>
  )},
],

// existing badge composite → one labeled variant:
badge: [
  { label: 'Variants', node: (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Paid</Badge>
      <Badge variant="destructive">Overdue</Badge>
      <Badge variant="outline">Pending</Badge>
    </div>
  )},
],
```

Controlled wrappers become a variant node: `tabs: [{ label: 'Interactive', node: <TabsPreview /> }]`, `'period-selector': [{ label: 'Interactive', node: <PeriodSelectorPreview /> }]`, `pagination: [{ label: 'Interactive', node: <PaginationPreview /> }]`.

Convert **every** existing slug this way. Do not drop any slug that currently has a preview.

- [ ] **Step 3: Rewrite `Preview.tsx` to render variant stages**

Replace `apps/web/src/components/Preview.tsx` with:

```tsx
'use client'
import * as React from 'react'
import { previews } from '../previews'

export function Preview({ slug }: { slug: string }) {
  const variants = previews[slug]

  if (!variants || variants.length === 0) {
    return (
      <div
        style={{
          border: '1px dashed var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: 24,
          color: 'var(--muted-foreground)',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-body-sm)',
        }}
      >
        No live preview yet for this component.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {variants.map((v) => (
        <div key={v.label}>
          <p
            style={{
              margin: '0 0 8px',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-body-sm)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--primary)',
            }}
          >
            {v.label}
          </p>
          <div
            style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: 24,
              background: 'var(--card, var(--background))',
            }}
          >
            {v.node}
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Confirm the detail page still consumes `<Preview slug={slug} />`**

Open `apps/web/src/app/components/[slug]/page.tsx`. It already renders `<Preview slug={slug} />` inside a section. No change needed in this task. (If the import path differs, leave it.)

- [ ] **Step 5: Verify build**

Run (from repo root): `pnpm turbo run build --filter=@connor-adams/web`
Expected: `Tasks: 2 successful, 2 total`, and `Generating static pages` completes for all `/components/[slug]` routes (43+).

- [ ] **Step 6: Verify a multi-variant page rendered**

Run: `/usr/bin/grep -ic "Variants\|Sizes\|No live preview" "apps/web/.next/server/app/components/button.html"` (use any slug you authored multiple variants for).
Expected: count ≥ 1 (the uppercase variant labels are in the static HTML).

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/previews/index.tsx apps/web/src/components/Preview.tsx
git commit -m "feat(web): curated labeled variants per component"
```

---

## Task 2: ThemeToggle + TopBar

**Files:**
- Create: `apps/web/src/components/ThemeToggle.tsx`
- Create: `apps/web/src/components/TopBar.tsx`

**Interfaces:**
- Produces: `export function ThemeToggle(): JSX.Element` (client) — button that flips `document.documentElement.dataset.theme` between `'light'`/`'dark'` and writes `localStorage['theme']`.
- Produces: `export function TopBar(): JSX.Element` (server) — sticky header with wordmark + `<ThemeToggle/>`.

- [ ] **Step 1: Create `ThemeToggle.tsx`**

```tsx
'use client'
import * as React from 'react'

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('dark')

  React.useEffect(() => {
    const stored = (localStorage.getItem('theme') as 'light' | 'dark' | null)
    const initial = stored ?? (document.documentElement.dataset.theme as 'light' | 'dark') ?? 'dark'
    setTheme(initial)
    document.documentElement.dataset.theme = initial
  }, [])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    localStorage.setItem('theme', next)
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle color theme"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        background: 'var(--secondary, transparent)',
        color: 'var(--foreground)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-body-sm)',
        cursor: 'pointer',
      }}
    >
      {theme === 'dark' ? '◐ Light' : '◑ Dark'}
    </button>
  )
}
```

- [ ] **Step 2: Create `TopBar.tsx`**

```tsx
import * as React from 'react'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

export function TopBar() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 22px',
        borderBottom: '1px solid var(--border)',
        background: 'color-mix(in oklch, var(--background) 90%, transparent)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          textDecoration: 'none',
          color: 'var(--foreground)',
        }}
      >
        <span
          aria-hidden
          style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--gradient-hero)' }}
        />
        <strong style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body-sm)' }}>
          Connor Adams · Design System
        </strong>
      </Link>
      <span style={{ flex: 1 }} />
      <ThemeToggle />
    </header>
  )
}
```

- [ ] **Step 3: Verify build**

Run: `pnpm turbo run build --filter=@connor-adams/web`
Expected: `Tasks: 2 successful, 2 total`. (TopBar is not yet mounted; this only confirms the files compile.)

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/ThemeToggle.tsx apps/web/src/components/TopBar.tsx
git commit -m "feat(web): TopBar with theme toggle"
```

---

## Task 3: Sidebar

**Files:**
- Create: `apps/web/src/components/Sidebar.tsx`

**Interfaces:**
- Consumes: `manifest.json` (array of `{ slug, name, category }`).
- Produces: `export function Sidebar(): JSX.Element` (client) — filter input + category groups of `<Link href="/components/{slug}">` with active highlight via `usePathname()`.

- [ ] **Step 1: Create `Sidebar.tsx`**

```tsx
'use client'
import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import manifest from '../generated/manifest.json'

type Entry = { slug: string; name: string; category: string }
const CATEGORY_ORDER = ['core', 'data', 'feedback', 'finance', 'forms', 'navigation', 'overlays']

export function Sidebar() {
  const [query, setQuery] = React.useState('')
  const pathname = usePathname()
  const entries = manifest as Entry[]

  const filtered = entries.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()))
  const groups = CATEGORY_ORDER
    .map((category) => ({ category, items: filtered.filter((e) => e.category === category) }))
    .filter((g) => g.items.length > 0)

  return (
    <aside
      style={{
        position: 'sticky',
        top: 64,
        alignSelf: 'flex-start',
        width: 220,
        flexShrink: 0,
        maxHeight: 'calc(100vh - 64px)',
        overflowY: 'auto',
        padding: '20px 16px',
        borderRight: '1px solid var(--border)',
        boxSizing: 'border-box',
      }}
    >
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter components…"
        aria-label="Filter components"
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '8px 12px',
          marginBottom: 18,
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--background)',
          color: 'var(--foreground)',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-body-sm)',
        }}
      />

      {groups.length === 0 && (
        <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-sans)' }}>
          No components match.
        </p>
      )}

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
            {group.items.map((item) => {
              const href = `/components/${item.slug}`
              const active = pathname === href
              return (
                <li key={item.slug}>
                  <Link
                    href={href}
                    style={{
                      display: 'block',
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-body-sm)',
                      color: active ? 'var(--foreground)' : 'var(--muted-foreground)',
                      background: active ? 'var(--muted)' : 'transparent',
                      boxShadow: active ? 'inset 2px 0 0 var(--primary)' : 'none',
                    }}
                  >
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </aside>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `pnpm turbo run build --filter=@connor-adams/web`
Expected: `Tasks: 2 successful, 2 total`. (Sidebar not yet mounted.)

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/Sidebar.tsx
git commit -m "feat(web): persistent filterable Sidebar with active highlight"
```

---

## Task 4: Shell layout + remove gallery

Mount the shell and remove the superseded gallery pieces in one task — adding the shell sidebar requires removing the gallery's own sidebar/index to avoid duplicate navigation.

**Files:**
- Modify: `apps/web/src/app/layout.tsx`
- Delete: `apps/web/src/components/Gallery.tsx`, `apps/web/src/components/GallerySidebar.tsx`, `apps/web/src/components/Showcase.tsx`, `apps/web/src/app/components/page.tsx`
- Create: `apps/web/src/app/components/page.tsx` (redirect — replaces the deleted index)

**Interfaces:**
- Consumes: `TopBar` (Task 2), `Sidebar` (Task 3).
- Produces: shell layout wrapping all routes; `/components` redirects to `/`.

- [ ] **Step 1: Replace `layout.tsx` with the shell**

```tsx
import * as React from 'react'
import type { Metadata } from 'next'
import '@connor-adams/designsystem/styles.css'
import { TopBar } from '../components/TopBar'
import { Sidebar } from '../components/Sidebar'

export const metadata: Metadata = {
  title: 'Connor Adams Design System',
  description: 'A portable React component library — tokens, components, and docs.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body style={{ margin: 0, background: 'var(--background)', color: 'var(--foreground)', fontFamily: 'var(--font-sans)' }}>
        <TopBar />
        <div style={{ display: 'flex', alignItems: 'flex-start', maxWidth: 1200, margin: '0 auto' }}>
          <Sidebar />
          <main style={{ flex: 1, minWidth: 0, padding: '32px 32px 64px' }}>{children}</main>
        </div>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Delete the superseded components**

```bash
git rm apps/web/src/components/Gallery.tsx apps/web/src/components/GallerySidebar.tsx apps/web/src/components/Showcase.tsx apps/web/src/app/components/page.tsx
```

- [ ] **Step 3: Recreate `components/page.tsx` as a redirect**

```tsx
import { redirect } from 'next/navigation'

export default function ComponentsIndex() {
  redirect('/')
}
```

- [ ] **Step 4: Verify no dangling imports**

Run: `/usr/bin/grep -rl "Gallery\|GallerySidebar\|Showcase" apps/web/src` 
Expected: no output (exit non-zero). If any file matches, it still imports a deleted component — fix it (the only legitimate consumer was `app/page.tsx`, rebuilt in Task 5; if Task 5 isn't done yet, temporarily strip the `Showcase`/gallery import from `page.tsx`).

- [ ] **Step 5: Verify build**

Run: `pnpm turbo run build --filter=@connor-adams/web`
Expected: `Tasks: 2 successful, 2 total`.

- [ ] **Step 6: Verify shell + redirect**

Run a dev server in the background and check:
```bash
cd apps/web && (PORT=4321 npx next dev -p 4321 &) ; sleep 8
/usr/bin/curl -s -o /tmp/sh.html -w "home:%{http_code}\n" http://localhost:4321/
/usr/bin/curl -s -o /tmp/sd.html -w "detail:%{http_code}\n" http://localhost:4321/components/button
/usr/bin/grep -ic "Filter components" /tmp/sd.html   # sidebar present on a DETAIL page → ≥1
```
Expected: both 200; the grep returns ≥1 (the sidebar — the original regression — now renders on a component detail page). Kill the dev server when done: `for pid in $(/usr/sbin/lsof -ti tcp:4321); do kill "$pid"; done`.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/app/layout.tsx apps/web/src/app/components/page.tsx
git commit -m "feat(web): persistent shell layout; remove one-page gallery"
```

---

## Task 5: Component detail view

Rebuild the detail page for the shell: drop the centered `max-width:880` wrapper (the shell owns layout now) and present variants → props → usage → import.

**Files:**
- Modify: `apps/web/src/app/components/[slug]/page.tsx`

**Interfaces:**
- Consumes: `Preview` (Task 1), `PropsTable`, `UsageNotes`, `manifest.json`, `props.json`, `usage.json`.

- [ ] **Step 1: Replace `[slug]/page.tsx`**

```tsx
import * as React from 'react'
import { notFound } from 'next/navigation'
import manifest from '../../../generated/manifest.json'
import propsData from '../../../generated/props.json'
import usageData from '../../../generated/usage.json'
import { Preview } from '../../../components/Preview'
import { PropsTable, type PropRow } from '../../../components/PropsTable'
import { UsageNotes } from '../../../components/UsageNotes'

export function generateStaticParams() {
  return (manifest as Array<{ slug: string }>).map((m) => ({ slug: m.slug }))
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = (manifest as Array<{ slug: string; name: string; category: string }>).find((m) => m.slug === slug)
  if (!entry) notFound()
  const rows = ((propsData as Record<string, PropRow[]>)[entry.name]) ?? []
  const usage = (usageData as Record<string, string>)[slug] ?? ''

  return (
    <article style={{ maxWidth: 860 }}>
      <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-body-sm)', textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>
        {entry.category}
      </p>
      <h1 style={{ margin: '4px 0 24px' }}>{entry.name}</h1>

      <Preview slug={slug} />

      <section style={{ marginTop: 40 }}>
        <h2>Import</h2>
        <pre style={{ background: 'var(--muted)', padding: 16, borderRadius: 'var(--radius-md)', overflowX: 'auto', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-sm)' }}>
          <code>{`import { ${entry.name} } from '@connor-adams/designsystem'`}</code>
        </pre>
      </section>

      {usage.trim() && (
        <section style={{ marginTop: 40 }}>
          <h2>Usage</h2>
          <UsageNotes markdown={usage} />
        </section>
      )}

      <section style={{ marginTop: 40 }}>
        <h2>Props</h2>
        <PropsTable rows={rows} />
      </section>
    </article>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `pnpm turbo run build --filter=@connor-adams/web`
Expected: `Tasks: 2 successful, 2 total`; all `/components/[slug]` static pages generate.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/components/[slug]/page.tsx
git commit -m "feat(web): variant-stage component detail view"
```

---

## Task 6: Overview home

**Files:**
- Modify: `apps/web/src/app/page.tsx`

**Interfaces:**
- Consumes: `manifest.json` (for counts + category jump-in).

- [ ] **Step 1: Replace `page.tsx`**

```tsx
import * as React from 'react'
import Link from 'next/link'
import manifest from '../generated/manifest.json'

type Entry = { slug: string; name: string; category: string }
const CATEGORY_ORDER = ['core', 'data', 'feedback', 'finance', 'forms', 'navigation', 'overlays']

export default function Home() {
  const entries = manifest as Entry[]
  const categories = CATEGORY_ORDER.filter((c) => entries.some((e) => e.category === c))

  const stats = [
    { n: entries.length, t: 'Components' },
    { n: categories.length, t: 'Categories' },
    { n: 2, t: 'Themes' },
  ]

  return (
    <div style={{ maxWidth: 820 }}>
      <h1
        style={{
          fontSize: 'clamp(2rem, 4vw, 2.75rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          backgroundImage: 'var(--gradient-hero)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: '0 0 12px',
        }}
      >
        Design System
      </h1>
      <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-body)', maxWidth: 560, lineHeight: 1.6, margin: '0 0 28px' }}>
        A portable React design system — {entries.length} typed components, design tokens, one import.
        Pick a component from the left to see it with its variants, props, and usage.
      </p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        {stats.map((s) => (
          <div key={s.t} style={{ flex: '1 1 120px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--foreground)' }}>{s.n}</div>
            <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.t}</div>
          </div>
        ))}
      </div>

      <pre style={{ background: 'var(--muted)', padding: 16, borderRadius: 'var(--radius-md)', overflowX: 'auto', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-sm)', margin: '0 0 32px' }}>
        <code>npm i @connor-adams/designsystem</code>
      </pre>

      <p style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-foreground)', margin: '0 0 12px' }}>
        Categories
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
        {categories.map((c) => {
          const first = entries.find((e) => e.category === c)!
          return (
            <Link
              key={c}
              href={`/components/${first.slug}`}
              style={{
                display: 'block',
                padding: '14px 16px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                color: 'var(--foreground)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{c}</div>
              <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--muted-foreground)' }}>
                {entries.filter((e) => e.category === c).length} components
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `pnpm turbo run build --filter=@connor-adams/web`
Expected: `Tasks: 2 successful, 2 total`; route `/` is static (`○`).

- [ ] **Step 3: Verify home content**

Run: `/usr/bin/grep -ic "Categories\|npm i @connor-adams" "apps/web/.next/server/app/index.html"`
Expected: ≥1.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/page.tsx
git commit -m "feat(web): in-shell overview home"
```

---

## Task 7: Full build, push, deploy verify

**Files:** none (integration).

- [ ] **Step 1: Clean full build**

Run: `pnpm turbo run build --filter=@connor-adams/web`
Expected: `Tasks: 2 successful, 2 total`; static pages for `/`, `/components/[slug]` (43+), and `/components` (redirect) all succeed.

- [ ] **Step 2: Confirm removed files are gone**

Run: `/usr/bin/ls apps/web/src/components/Gallery.tsx apps/web/src/components/GallerySidebar.tsx apps/web/src/components/Showcase.tsx 2>&1`
Expected: "No such file or directory" for all three.

- [ ] **Step 3: Push and open PR**

```bash
git push -u origin feat/web-component-browser
gh pr create --title "feat(web): unified component browser (persistent sidebar + variants)" --body "Implements docs/superpowers/specs/2026-06-20-web-component-browser-redesign.md. Persistent left menu on every route, in-shell overview home, per-component variant stages, theme toggle. Removes the one-page gallery. apps/web only."
```

- [ ] **Step 4: Enable auto-merge**

```bash
gh pr merge --auto --merge
```

- [ ] **Step 5: Verify Vercel preview/production**

After the Vercel deploy completes (auto on push/merge), confirm the regression is fixed — sidebar present on a component detail route in production:
```bash
/usr/bin/curl -s -o /tmp/prod.html https://cashflow-web-ten.vercel.app/components/button
/usr/bin/grep -ic "Filter components" /tmp/prod.html
```
Expected: ≥1 (the sidebar renders on a detail page in production).

---

## Self-Review

**Spec coverage:**
- Persistent shell → Task 4. Sidebar (filter/groups/active) → Task 3. Variant model (web-owned `Record<slug, Variant[]>`) → Task 1. Detail view (variants/props/usage/import) → Tasks 1+5. Overview home (option B) → Task 6. Theme toggle (`data-theme`) → Task 2. `/components` redirect + removals → Task 4. Rollout → Task 7. All spec sections mapped.
- Edge cases from spec: slug not in manifest → `notFound()` (Task 5); slug without preview → placeholder (Task 1 Preview); empty/no-match filter → "No components match" (Task 3); no usage → section omitted (Task 5). Covered.

**Placeholder scan:** No "TBD"/"add error handling"/"similar to Task N". Task 1 Step 2 instructs converting every slug with a worked migration rule + examples rather than re-listing all 43 (the existing file is the source) — this is a mechanical transform, not a placeholder.

**Type consistency:** `Variant = { label: string; node: React.ReactNode }` defined Task 1, consumed by `Preview` (Task 1) and indirectly by Task 5. `Sidebar`/`Home` both use the `{ slug, name, category }` manifest shape and the same `CATEGORY_ORDER`. `Preview` signature `{ slug: string }` unchanged across Tasks 1 and 5. Consistent.
