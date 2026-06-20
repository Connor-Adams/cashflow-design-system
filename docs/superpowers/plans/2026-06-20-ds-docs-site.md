# DS Public Docs Site (apps/web) — Implementation Plan (Plan 4)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A branded, public Next.js docs site (`apps/web`) for `@connoradams/designsystem` — landing page plus per-component pages with a live React preview, an auto-generated props table, usage notes from each component's `prompt.md`, and a copy-paste import snippet. Vercel-ready.

**Architecture:** Next.js App Router app in the monorepo, consuming the built `@connoradams/designsystem` package (`workspace:*`) and its tokens stylesheet. A build-time data pipeline produces three artifacts: a **props JSON** (via `react-docgen-typescript` over the component `.tsx`, filtered to each component's own props), a **component manifest** (slug/name/category), and **usage notes** read from each `prompt.md`. Pages are statically generated (`generateStaticParams`). Live previews are client components (DS components use hooks); the docs `[slug]` page is a Server Component that composes the generated data + a client `<Preview>`. Storybook stays the exhaustive variant playground; this site is the polished public face with ONE representative preview per component.

**Tech Stack:** Next.js 15 (App Router), React 18, TypeScript 5.6, `react-docgen-typescript` (build-time props), `react-markdown` (usage notes), pnpm/turbo. Deploy: Vercel (zero-config Next; Connor sets the project root to `apps/web`).

**Vertical slice first:** Tasks 1–4 stand up the app shell + the full data pipeline + a working `/components/button` page (live preview + props + usage + snippet). That de-risks the unknowns (docgen output, workspace-package rendering in Next, RSC/client boundaries) before Tasks 5–8 scale to all 43 and add the index + landing pages.

## Global Constraints

- App lives at `apps/web`, package name `@connoradams/web`, `private: true`, `version: 0.0.0`.
- Consume the DS package via `@connoradams/designsystem` (`workspace:*`) — the BUILT package (turbo `^build` builds it first). Import the tokens stylesheet once in the root layout: `import '@connoradams/designsystem/styles.css'`.
- Next config: `transpilePackages: ['@connoradams/designsystem', '@connoradams/tokens']` and `output: 'export'` is NOT used (we want SSG via `generateStaticParams`, default output).
- Any component that renders a DS component (previews) must be a **client component** (`'use client'`) — DS components use React hooks.
- Brand: use the design tokens (CSS variables already loaded) for ALL site chrome — oxblood `--primary`, zinc greys, the hero gradient `--gradient-hero`. No raw hex in site code; reach through the token vars. The site should look like it's built WITH the design system.
- Props tables are generated, never hand-authored. Usage notes come from `prompt.md`, never duplicated.
- Node 22 / pnpm 10.29.3. No `any`, no `@ts-ignore` in site code.
- Slugs are kebab-case of the component name (`AccountCard` → `account-card`, `Button` → `button`).

---

### Task 1: Scaffold `apps/web` Next.js app

Stand up a minimal Next App Router app in the workspace that builds and renders a page using the DS package + tokens.

**Files:**
- Create: `apps/web/package.json`, `apps/web/next.config.mjs`, `apps/web/tsconfig.json`
- Create: `apps/web/src/app/layout.tsx`, `apps/web/src/app/page.tsx` (temporary placeholder)
- Create: `apps/web/.gitignore` (or rely on root — ensure `.next/` ignored)

**Interfaces:** Produces a buildable Next app consuming `@connoradams/designsystem` + `styles.css`; root layout loads the tokens globally.

- [ ] **Step 1: Create `apps/web/package.json`**

```json
{
  "name": "@connoradams/web",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "node scripts/gen-data.mjs && next build",
    "start": "next start -p 3001",
    "typecheck": "tsc --noEmit",
    "gen": "node scripts/gen-data.mjs"
  },
  "dependencies": {
    "@connoradams/designsystem": "workspace:*",
    "next": "^15.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-markdown": "^9.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "react-docgen-typescript": "^2.2.2",
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 2: Create `apps/web/next.config.mjs`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@connoradams/designsystem', '@connoradams/tokens'],
}
export default nextConfig
```

- [ ] **Step 3: Create `apps/web/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "noEmit": true,
    "plugins": [{ "name": "next" }],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "preserve",
    "incremental": true
  },
  "include": ["next-env.d.ts", "src", "scripts", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create a placeholder `scripts/gen-data.mjs`** (real pipeline in Task 2 — placeholder so `build` works now)

```js
// Build-time data generation (props, manifest, usage). Filled in Task 2.
console.log('gen-data: placeholder (no-op)')
```

- [ ] **Step 5: Create `apps/web/src/app/layout.tsx`** (loads tokens globally)

```tsx
import * as React from 'react'
import type { Metadata } from 'next'
import '@connoradams/designsystem/styles.css'

export const metadata: Metadata = {
  title: 'Connor Adams Design System',
  description: 'A portable React component library — tokens, components, and docs.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: 'var(--background)', color: 'var(--foreground)', fontFamily: 'var(--font-sans)' }}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 6: Create a temporary `apps/web/src/app/page.tsx`** (proves the package renders)

```tsx
import { Button } from '@connoradams/designsystem'

export default function Home() {
  return (
    <main style={{ padding: 48 }}>
      <h1>Connor Adams Design System</h1>
      <Button variant="primary">It renders</Button>
    </main>
  )
}
```

- [ ] **Step 7: Install, build the package, build the web app**

Run: `pnpm install && pnpm --filter @connoradams/designsystem build && pnpm --filter @connoradams/web build`
Expected: `pnpm install` links `@connoradams/web`; `next build` completes, statically generating `/`. The Button renders (server-rendered; Button is a client-capable component — if `next build` errors that Button uses `useState` in a Server Component, add `'use client'` to a thin wrapper or render Button inside a client component. Note the resolution in the report.)

- [ ] **Step 8: Ensure `.next/` is gitignored** (add to root `.gitignore` if absent) and **Commit**

```bash
git add -A
git commit -m "feat(web): scaffold Next.js docs app consuming the design system"
```

---

### Task 2: Build-time data pipeline (props + manifest + usage)

Replace the placeholder `gen-data.mjs` with the real pipeline: extract props via `react-docgen-typescript`, build the component manifest, and collect `prompt.md` usage — emitting JSON the pages consume.

**Files:**
- Modify: `apps/web/scripts/gen-data.mjs`
- Create (generated, committed): `apps/web/src/generated/props.json`, `apps/web/src/generated/manifest.json`, `apps/web/src/generated/usage.json`

**Interfaces:**
- Produces `manifest.json`: `Array<{ slug, name, category }>` for all 43 components.
- Produces `props.json`: `Record<componentName, Array<{ name, type, required, defaultValue, description }>>` (own-file props only).
- Produces `usage.json`: `Record<slug, string>` (raw markdown from each `prompt.md`, or `''` if absent).

- [ ] **Step 1: Write `apps/web/scripts/gen-data.mjs`**

```js
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { withCustomConfig } from 'react-docgen-typescript'

const UI_SRC = join(process.cwd(), '../../packages/ui/src')
const OUT = join(process.cwd(), 'src/generated')
const CATEGORIES = ['core', 'data', 'feedback', 'finance', 'forms', 'navigation', 'overlays']

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

// Discover components
const manifest = []
const filePaths = []
for (const category of CATEGORIES) {
  const dir = join(UI_SRC, category)
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.tsx'))) {
    const name = f.replace(/\.tsx$/, '')
    manifest.push({ slug: kebab(name), name, category })
    filePaths.push(join(dir, f))
  }
}

// Props via react-docgen-typescript — own-file props only (drop inherited HTML attrs)
const parser = withCustomConfig(join(process.cwd(), '../../tsconfig.base.json'), {
  savePropValueAsString: true,
  propFilter: (prop) => !prop.parent || !/node_modules/.test(prop.parent.fileName),
})
const docs = parser.parse(filePaths)
const props = {}
for (const d of docs) {
  props[d.displayName] = Object.values(d.props || {}).map((p) => ({
    name: p.name,
    type: p.type?.name ?? '',
    required: !!p.required,
    defaultValue: p.defaultValue?.value ?? null,
    description: p.description ?? '',
  }))
}

// Usage notes from prompt.md
const usage = {}
for (const { slug, name, category } of manifest) {
  const md = join(UI_SRC, category, `${name}.prompt.md`)
  usage[slug] = existsSync(md) ? readFileSync(md, 'utf8') : ''
}

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true })
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2))
writeFileSync(join(OUT, 'props.json'), JSON.stringify(props, null, 2))
writeFileSync(join(OUT, 'usage.json'), JSON.stringify(usage, null, 2))
console.log(`gen-data: ${manifest.length} components, ${docs.length} with props`)
```

- [ ] **Step 2: Run the generator**

Run: `pnpm --filter @connoradams/web gen`
Expected: prints `gen-data: 43 components, N with props`; writes the three JSON files under `apps/web/src/generated/`.

- [ ] **Step 3: Verify Button's extracted props are clean**

Run: `node -e "const p=require('./apps/web/src/generated/props.json'); console.log(JSON.stringify(p.Button)); const m=require('./apps/web/src/generated/manifest.json'); console.log('manifest', m.length)"`
Expected: `Button` props are exactly `variant` and `size` (NOT the hundreds of inherited `ButtonHTMLAttributes`), each with a `description` from the JSDoc; manifest length `43`. If inherited HTML attrs leak in, tighten the `propFilter` (drop props whose `parent.fileName` is outside the component file). If descriptions are empty, confirm the `.tsx` JSDoc survived — report findings.

- [ ] **Step 4: Commit** (generated JSON is committed so pages build deterministically)

```bash
git add -A
git commit -m "feat(web): build-time props/manifest/usage data pipeline"
```

---

### Task 3: Live preview registry (Button slice)

A client-side registry mapping slug → a representative live preview node. This task wires ONE entry (Button) to prove the client-rendering path; Task 5 fills the rest.

**Files:**
- Create: `apps/web/src/previews/index.tsx`

**Interfaces:** Produces `previews: Record<string, React.ReactNode>` (a client module, `'use client'`) consumed by the `[slug]` page's `<Preview>`.

- [ ] **Step 1: Create `apps/web/src/previews/index.tsx`**

```tsx
'use client'
import * as React from 'react'
import { Button } from '@connoradams/designsystem'

// slug → representative live preview. One curated render per component.
// (Storybook holds the exhaustive variant matrices; this is the docs-site showcase.)
export const previews: Record<string, React.ReactNode> = {
  button: (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="primary">Add transaction</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="destructive" size="sm">Delete</Button>
    </div>
  ),
}
```

- [ ] **Step 2: Typecheck the web app**

Run: `pnpm --filter @connoradams/designsystem build && pnpm --filter @connoradams/web typecheck`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(web): live preview registry (Button)"
```

---

### Task 4: `/components/[slug]` page (vertical slice complete)

The data-driven per-component page: live preview + props table + usage notes + import snippet. Static-generated for every slug in the manifest. Completing this proves the whole pipeline end-to-end on Button (and structurally for all 43).

**Files:**
- Create: `apps/web/src/app/components/[slug]/page.tsx`
- Create: `apps/web/src/components/Preview.tsx` (client wrapper that renders `previews[slug]`)
- Create: `apps/web/src/components/PropsTable.tsx`
- Create: `apps/web/src/components/UsageNotes.tsx` (renders markdown via `react-markdown`)

**Interfaces:** Consumes `manifest.json`, `props.json`, `usage.json`, and `previews`. Produces a static page at `/components/<slug>` for every manifest slug.

- [ ] **Step 1: Create `apps/web/src/components/Preview.tsx`** (client)

```tsx
'use client'
import * as React from 'react'
import { previews } from '../previews'

export function Preview({ slug }: { slug: string }) {
  const node = previews[slug]
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 32, background: 'var(--card)' }}>
      {node ?? <span style={{ color: 'var(--muted-foreground)' }}>Preview coming soon.</span>}
    </div>
  )
}
```

- [ ] **Step 2: Create `apps/web/src/components/PropsTable.tsx`**

```tsx
import * as React from 'react'

export interface PropRow { name: string; type: string; required: boolean; defaultValue: string | null; description: string }

export function PropsTable({ rows }: { rows: PropRow[] }) {
  if (!rows.length) return <p style={{ color: 'var(--muted-foreground)' }}>No documented props.</p>
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body-sm)' }}>
      <thead>
        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
          <th style={{ padding: '8px 12px' }}>Prop</th>
          <th style={{ padding: '8px 12px' }}>Type</th>
          <th style={{ padding: '8px 12px' }}>Default</th>
          <th style={{ padding: '8px 12px' }}>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name} style={{ borderBottom: '1px solid color-mix(in oklch, var(--border) 50%, transparent)' }}>
            <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)' }}>{r.name}{r.required ? '*' : ''}</td>
            <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)' }}>{r.type}</td>
            <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)' }}>{r.defaultValue ?? '—'}</td>
            <td style={{ padding: '8px 12px' }}>{r.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

- [ ] **Step 3: Create `apps/web/src/components/UsageNotes.tsx`**

```tsx
import * as React from 'react'
import Markdown from 'react-markdown'

export function UsageNotes({ markdown }: { markdown: string }) {
  if (!markdown.trim()) return null
  return <div style={{ lineHeight: 1.6 }}><Markdown>{markdown}</Markdown></div>
}
```

- [ ] **Step 4: Create `apps/web/src/app/components/[slug]/page.tsx`**

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
    <main style={{ maxWidth: 880, margin: '0 auto', padding: '48px 24px' }}>
      <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-body-sm)', textTransform: 'uppercase', letterSpacing: 1 }}>{entry.category}</p>
      <h1 style={{ marginTop: 4 }}>{entry.name}</h1>

      <section style={{ marginTop: 24 }}>
        <Preview slug={slug} />
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Import</h2>
        <pre style={{ background: 'var(--muted)', padding: 16, borderRadius: 'var(--radius-md)', overflowX: 'auto', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-sm)' }}>
          <code>{`import { ${entry.name} } from '@connoradams/designsystem'`}</code>
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
    </main>
  )
}
```

- [ ] **Step 5: Build the site and confirm the Button page generates**

Run: `pnpm --filter @connoradams/designsystem build && pnpm --filter @connoradams/web build`
Expected: `next build` statically generates `/components/button` (and all 43 slugs). No errors. (If RSC complains the `[slug]` page imports a client module transitively — `Preview` is `'use client'`, so it's fine; the page itself is a server component importing JSON + the client `Preview`.)

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(web): per-component docs page (preview + props + usage + import)"
```

---

### Task 5: Fill the preview registry for all 43 components

Add a representative live preview for every remaining component to `previews/index.tsx`, using the same fixture patterns as the Storybook stories (one good render each; not the full variant matrix).

**Files:**
- Modify: `apps/web/src/previews/index.tsx`

**Interfaces:** Every manifest slug has an entry in `previews`.

- [ ] **Step 1: Add a preview entry for each of the other 42 components**, importing them from `@connoradams/designsystem` and rendering one representative example with realistic props/fixtures (mirror the Storybook stories' Default/fixtures — e.g. Combobox with an `options` array, Table composing rows, Sparkline with `data`, overlays with their visible/open state). Keep each preview compact. Read each component's Props (or its story) for correct props.

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter @connoradams/designsystem build && pnpm --filter @connoradams/web typecheck`
Expected: exit 0.

- [ ] **Step 3: Verify every slug has a preview**

Run: `node -e "const m=require('./apps/web/src/generated/manifest.json'); const src=require('fs').readFileSync('./apps/web/src/previews/index.tsx','utf8'); const missing=m.filter(c=>!new RegExp('\\\\b'+c.slug+'\\\\s*:').test(src)).map(c=>c.slug); console.log(missing.length?('MISSING: '+missing.join(',')):'all 43 have previews')"`
Expected: `all 43 have previews`.

- [ ] **Step 4: Build to confirm all previews render in SSG**

Run: `pnpm --filter @connoradams/web build`
Expected: `next build` succeeds; all 43 `/components/<slug>` pages generated.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat(web): live previews for all 43 components"`

---

### Task 6: `/components` index + site nav

A browsable index grouping all components by category, plus shared site navigation/header used across pages.

**Files:**
- Create: `apps/web/src/app/components/page.tsx`
- Create: `apps/web/src/components/SiteHeader.tsx`
- Modify: `apps/web/src/app/layout.tsx` (render `<SiteHeader/>` above `children`)

**Interfaces:** `<SiteHeader/>` (links: home, components, GitHub). `/components` lists all 43 grouped by category, each linking to its `[slug]` page.

- [ ] **Step 1: Create `apps/web/src/components/SiteHeader.tsx`** — a branded header (logo/wordmark, nav links to `/`, `/components`, the GitHub repo) styled with token vars.

- [ ] **Step 2: Create `apps/web/src/app/components/page.tsx`** — read `manifest.json`, group by the 7 categories, render each category as a section with a grid of links (`<a href={`/components/${slug}`}>`) showing the component name. Style with tokens.

- [ ] **Step 3: Render `<SiteHeader/>` in the root layout** above `{children}`.

- [ ] **Step 4: Build** — `pnpm --filter @connoradams/web build` → `/components` and all pages generate, exit 0.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat(web): components index and site header"`

---

### Task 7: Landing page

Replace the placeholder home with a branded landing: hero (wordmark, tagline, the hero gradient), a short value prop, a showcase strip of a few live components, and CTAs (Browse components, GitHub, Storybook).

**Files:**
- Modify: `apps/web/src/app/page.tsx`
- (optional) Create: `apps/web/src/components/Hero.tsx`

**Interfaces:** The `/` route renders the landing; uses real DS components in the showcase (client component if interactive).

- [ ] **Step 1: Build the landing page** — hero using `--gradient-hero` and brand type tokens; a one-paragraph value prop ("A portable React design system — typed components, design tokens, one import"); a showcase row rendering a few real components (Button, Badge, a Card, etc. — via a client showcase component); CTA buttons linking to `/components`, the GitHub repo, and noting Storybook for the variant playground. All styled through token vars.

- [ ] **Step 2: Build** — `pnpm --filter @connoradams/web build` → `/` generates, exit 0.

- [ ] **Step 3: Commit** — `git add -A && git commit -m "feat(web): branded landing page"`

---

### Task 8: Vercel config + whole-site verification

Make the app Vercel-deployable and verify the full build green; ensure the new app is covered by turbo/CI.

**Files:**
- Create: `apps/web/vercel.json` (optional, minimal) OR document the Vercel project setting
- Verify: root `turbo.json` `build` already covers `apps/web` (it has a `build` script → turbo runs it)

- [ ] **Step 1: Confirm turbo picks up the web build**

Run: `pnpm build`
Expected: turbo runs `@connoradams/web#build` (the `gen-data.mjs` + `next build`) alongside the library and Storybook builds; all tasks successful. (`@connoradams/designsystem#build` runs first via `^build`.)

- [ ] **Step 2: Confirm the web app typechecks in the workspace**

Run: `pnpm typecheck`
Expected: turbo runs the web app's `typecheck` too; exit 0.

- [ ] **Step 3: Confirm `pnpm validate` still passes** (the contract script is unaffected by the new app)

Run: `pnpm validate`
Expected: `✓ Contract OK`, 43 components.

- [ ] **Step 4: Add a deploy note** — create `apps/web/README.md` documenting: deploy on Vercel with **Root Directory = `apps/web`**, build command `pnpm build` (or Vercel's monorepo detection), output `.next`. No secret env needed. (A `vercel.json` is optional since Vercel auto-detects Next; only add one if pinning the build command.)

- [ ] **Step 5: Final build sanity** — `pnpm --filter @connoradams/web build` and confirm the static route list includes `/`, `/components`, and `/components/[slug]` (43 pages).

- [ ] **Step 6: Commit** — `git add -A && git commit -m "docs(web): vercel deploy notes; verify full workspace build"`

---

## Self-Review

**Spec coverage:** Full docs site (landing Task 7, index Task 6, per-component pages Task 4) with live React previews (Tasks 3+5), generated props tables (Task 2), and `prompt.md` usage notes (Tasks 2+4). Vercel-ready (Task 8). Vertical slice (Tasks 1–4) de-risks before scaling. ✅

**Placeholder scan:** Tasks 1–4 contain complete file contents. Tasks 5–7 describe per-component/visual content that is derived from each component's real Props + the existing Storybook fixtures (the source is the spec, as in Plans 2–3) and brand tokens — not hand-waved logic. The data pipeline, page, and table code are fully specified. No "TBD". ✅

**Type/interface consistency:** `PropRow` is defined once (`PropsTable.tsx`) and reused by the `[slug]` page. The generated JSON shapes (`manifest`/`props`/`usage`) are specified in Task 2's Interfaces and consumed exactly in Task 4. `previews` is `Record<string, React.ReactNode>` in Task 3, consumed by `Preview` in Task 4 and filled in Task 5. Slug derivation (`kebab`) is defined once in the generator and used for routing. ✅

**Known risks:**
1. **react-docgen-typescript prop leakage** — components whose Props `extend React.*HTMLAttributes` could leak inherited attrs; the `propFilter` drops `node_modules`-sourced props. Task 2 Step 3 explicitly verifies Button shows only `variant`/`size`. If a component's own props are declared via `extends` of a LOCAL type, they're kept (correct).
2. **RSC/client boundary** — DS components use hooks, so previews are `'use client'`; the `[slug]` page is a Server Component importing JSON + the client `Preview`. If `next build` flags a hook-in-server error, the fix is to ensure the rendering path is inside a `'use client'` module (it is, via `Preview`/`previews`).
3. **Next 15 `params` is a Promise** — handled (`await params`); if the pinned Next minor differs, adjust per its API.
4. **Workspace package resolution in Next** — `transpilePackages` covers it; the package is built first via turbo `^build`.
