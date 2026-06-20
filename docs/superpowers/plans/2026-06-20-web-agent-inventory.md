# Web Agent Inventory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve a machine-readable component inventory (`/llms.txt` + `/components.json`) from `apps/web`, generated at build time from existing data so it never drifts.

**Architecture:** Extract a pure builder module that composes the existing in-memory `manifest`/`props`/`usage` data into a `components.json` object and an `llms.txt` string. Unit-test the builder in isolation. Wire it into `apps/web/scripts/gen-data.mjs` to write both files into `apps/web/public/`, served as static assets.

**Tech Stack:** Node ESM scripts, built-in `node:test` runner (no new deps), Next.js 15 static `public/` serving.

## Global Constraints

- Package name (literal, in output): `@connor-adams/designsystem`
- Categories (order, verbatim): `core, data, feedback, finance, forms, navigation, overlays`
- No new npm dependencies — tests use built-in `node:test` / `node:assert`.
- Base URL: `(process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '')` — empty → relative links.
- Both output files committed (not gitignored), matching `apps/web/src/generated/*.json`.
- Data shapes (from `gen-data.mjs`): `manifest` = `[{slug,name,category}]`; `props` = `{ [Name]: [{name,type,required,defaultValue,description}] }` (keyed by component **name**); `usage` = `{ [slug]: markdownString }` (keyed by **slug**).

---

### Task 1: Pure inventory builder + tests

**Files:**
- Create: `apps/web/scripts/lib/inventory.mjs`
- Test: `apps/web/scripts/lib/inventory.test.mjs`

**Interfaces:**
- Consumes: nothing (pure functions over plain data).
- Produces:
  - `summaryFromUsage(md: string) -> string` — first non-empty line, heading markers stripped; `''` if none.
  - `buildInventory({ manifest, props, usage, version, base, categories, packageName }) -> { json: object, llmsTxt: string }` where `json` is the full `components.json` object.

- [ ] **Step 1: Write the failing tests**

Create `apps/web/scripts/lib/inventory.test.mjs`:

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { summaryFromUsage, buildInventory } from './inventory.mjs'

test('summaryFromUsage: strips heading markers and picks first non-empty line', () => {
  assert.equal(summaryFromUsage('\n\n# Button\n\nMore text'), 'Button')
  assert.equal(summaryFromUsage('Plain first line\nsecond'), 'Plain first line')
  assert.equal(summaryFromUsage('   \n  ## Heading two  \n'), 'Heading two')
  assert.equal(summaryFromUsage(''), '')
  assert.equal(summaryFromUsage('   \n  '), '')
})

const FIXTURE = {
  manifest: [
    { slug: 'button', name: 'Button', category: 'core' },
    { slug: 'badge', name: 'Badge', category: 'core' },
    { slug: 'money-input', name: 'MoneyInput', category: 'forms' },
  ],
  props: {
    Button: [
      { name: 'variant', type: '"primary" | "ghost"', required: false, defaultValue: 'primary', description: 'Visual style' },
      { name: 'size', type: 'string', required: false, defaultValue: null, description: '' },
    ],
    // Badge intentionally has no props entry
    MoneyInput: [
      { name: 'value', type: 'number', required: true, defaultValue: null, description: '' },
    ],
  },
  usage: {
    button: '# Button\n\nClickable action trigger.',
    // badge intentionally missing
    'money-input': 'Currency-aware numeric field.',
  },
  version: '0.3.1',
  categories: ['core', 'data', 'feedback', 'finance', 'forms', 'navigation', 'overlays'],
  packageName: '@connor-adams/designsystem',
}

test('buildInventory json: one entry per manifest item, sorted by name within category', () => {
  const { json } = buildInventory({ ...FIXTURE, base: '' })
  assert.equal(json.package, '@connor-adams/designsystem')
  assert.equal(json.version, '0.3.1')
  assert.equal(json.components.length, 3)
  // core sorted by name: Badge before Button
  assert.deepEqual(
    json.components.filter((c) => c.category === 'core').map((c) => c.name),
    ['Badge', 'Button'],
  )
})

test('buildInventory json: docs url, summary fallback, props passthrough', () => {
  const { json } = buildInventory({ ...FIXTURE, base: 'https://ds.example.com' })
  const button = json.components.find((c) => c.name === 'Button')
  assert.equal(button.docs, 'https://ds.example.com/components/button')
  assert.equal(button.summary, 'Button')
  assert.equal(button.props.length, 2)
  const badge = json.components.find((c) => c.name === 'Badge')
  assert.equal(badge.summary, 'Badge component') // no usage → fallback
  assert.deepEqual(badge.props, []) // no props entry → empty array
})

test('buildInventory json: relative docs url when base empty', () => {
  const { json } = buildInventory({ ...FIXTURE, base: '' })
  assert.equal(json.components.find((c) => c.name === 'Button').docs, '/components/button')
})

test('buildInventory llmsTxt: header counts, category sections, bullet + props format', () => {
  const { llmsTxt } = buildInventory({ ...FIXTURE, base: '' })
  assert.match(llmsTxt, /^# Cashflow Design System/)
  // 3 components across 2 non-empty categories (core, forms)
  assert.match(llmsTxt, /3 components across 2 categories/)
  assert.match(llmsTxt, /Full inventory with prop schemas: \/components\.json/)
  assert.match(llmsTxt, /\n## Core\n/)
  assert.match(llmsTxt, /\n## Forms\n/)
  assert.ok(!/## Data/.test(llmsTxt), 'empty categories omitted')
  assert.match(llmsTxt, /- \[Button\]\(\/components\/button\): Clickable action trigger\. Props: variant, size\./)
  // Badge: no props → no trailing "Props:" segment
  assert.match(llmsTxt, /- \[Badge\]\(\/components\/badge\): Badge component\.\n/)
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd apps/web && node --test scripts/lib/inventory.test.mjs`
Expected: FAIL — `Cannot find module './inventory.mjs'`.

- [ ] **Step 3: Write the builder**

Create `apps/web/scripts/lib/inventory.mjs`:

```js
// Pure builders for the agent-facing inventory artifacts (llms.txt + components.json).
// No filesystem or docgen access — operates on plain data so it is unit-testable.

export function summaryFromUsage(md) {
  for (const line of (md ?? '').split('\n')) {
    const trimmed = line.trim()
    if (trimmed) return trimmed.replace(/^#+\s*/, '').trim()
  }
  return ''
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

export function buildInventory({ manifest, props, usage, version, base, categories, packageName }) {
  const components = []
  for (const cat of categories) {
    const inCat = manifest
      .filter((m) => m.category === cat)
      .sort((a, b) => a.name.localeCompare(b.name))
    for (const m of inCat) {
      components.push({
        slug: m.slug,
        name: m.name,
        category: cat,
        docs: `${base}/components/${m.slug}`,
        summary: summaryFromUsage(usage[m.slug]) || `${m.name} component`,
        props: props[m.name] ?? [],
      })
    }
  }

  const json = {
    package: packageName,
    version,
    import: `import { <Name> } from '${packageName}'`,
    categories,
    components,
  }

  const usedCats = categories.filter((c) => components.some((x) => x.category === c))
  let llmsTxt = `# Cashflow Design System\n\n`
  llmsTxt += `> React component library (${packageName}). ${components.length} components across ${usedCats.length} categories. All components are imported from the package root.\n\n`
  llmsTxt += `Full inventory with prop schemas: ${base}/components.json\n`
  for (const cat of usedCats) {
    llmsTxt += `\n## ${cap(cat)}\n`
    for (const m of components.filter((x) => x.category === cat)) {
      const names = (m.props ?? []).slice(0, 6).map((p) => p.name)
      const propStr = names.length ? ` Props: ${names.join(', ')}.` : ''
      const summary = m.summary.replace(/\.$/, '')
      llmsTxt += `- [${m.name}](${m.docs}): ${summary}.${propStr}\n`
    }
  }

  return { json, llmsTxt }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd apps/web && node --test scripts/lib/inventory.test.mjs`
Expected: PASS — all 5 tests.

- [ ] **Step 5: Commit**

```bash
git add apps/web/scripts/lib/inventory.mjs apps/web/scripts/lib/inventory.test.mjs
git commit -m "feat(web): pure builder for agent inventory artifacts"
```

---

### Task 2: Wire builder into gen-data, emit public files

**Files:**
- Modify: `apps/web/scripts/gen-data.mjs:1-65`
- Test: manual — run generator against the real component tree, inspect outputs.

**Interfaces:**
- Consumes: `buildInventory` from Task 1; existing `manifest`, `props`, `usage`, `CATEGORIES`, `UI_SRC` in `gen-data.mjs`.
- Produces: `apps/web/public/components.json`, `apps/web/public/llms.txt`.

- [ ] **Step 1: Add the import**

At the top of `apps/web/scripts/gen-data.mjs`, after the existing imports (line 3), add:

```js
import { buildInventory } from './lib/inventory.mjs'
```

- [ ] **Step 2: Emit the inventory artifacts**

In `apps/web/scripts/gen-data.mjs`, replace the existing tail (the block from `if (!existsSync(OUT))` through the final `console.log`, lines 61-65) with:

```js
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true })
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2))
writeFileSync(join(OUT, 'props.json'), JSON.stringify(props, null, 2))
writeFileSync(join(OUT, 'usage.json'), JSON.stringify(usage, null, 2))

// Agent-facing inventory artifacts served as static public assets.
const { version } = JSON.parse(readFileSync(join(UI_SRC, '..', 'package.json'), 'utf8'))
const base = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '')
const { json, llmsTxt } = buildInventory({
  manifest,
  props,
  usage,
  version,
  base,
  categories: CATEGORIES,
  packageName: '@connor-adams/designsystem',
})

const PUB = join(process.cwd(), 'public')
if (!existsSync(PUB)) mkdirSync(PUB, { recursive: true })
writeFileSync(join(PUB, 'components.json'), JSON.stringify(json, null, 2))
writeFileSync(join(PUB, 'llms.txt'), llmsTxt)

if (json.components.length !== manifest.length) {
  throw new Error(`inventory mismatch: components.json has ${json.components.length}, manifest has ${manifest.length}`)
}
if (!llmsTxt.trim()) throw new Error('llms.txt is empty')

console.log(
  `gen-data: ${manifest.length} components, ${docs.length} with props` +
    ` -> public/llms.txt + public/components.json (${json.components.length})`,
)
```

- [ ] **Step 3: Run the generator against the real tree**

Run: `cd apps/web && pnpm gen`
Expected: stdout ends with `... -> public/llms.txt + public/components.json (44)` (count matches manifest; no thrown error).

- [ ] **Step 4: Verify the output files**

Run: `cd apps/web && node -e "const j=require('./public/components.json'); console.log(j.package, j.version, j.components.length); console.log(j.components[0])" && head -20 public/llms.txt`
Expected:
- First line prints `@connor-adams/designsystem 0.3.1 44`.
- First component object has `slug`, `name`, `category`, `docs` (`/components/<slug>` since `NEXT_PUBLIC_SITE_URL` unset), `summary`, `props`.
- `llms.txt` head shows the `# Cashflow Design System` title, the `>` summary blockquote, the `components.json` link line, then a `## Core` section with `- [Name](...)` bullets.

- [ ] **Step 5: Re-run unit tests (regression guard)**

Run: `cd apps/web && node --test scripts/lib/inventory.test.mjs`
Expected: PASS — all 5 tests still green.

- [ ] **Step 6: Commit**

```bash
git add apps/web/scripts/gen-data.mjs apps/web/public/components.json apps/web/public/llms.txt
git commit -m "feat(web): serve /llms.txt and /components.json agent inventory"
```

---

## Self-Review

**Spec coverage:**
- External agent via web URL → static files in `public/`, served at `/llms.txt` + `/components.json` — Task 2. ✓
- Both formats → `llms.txt` + `components.json` from one builder — Task 1. ✓
- Generated from existing build data, no drift → composes `manifest`/`props`/`usage` in `gen-data.mjs` — Task 2. ✓
- `version` from `packages/ui/package.json` — Task 2 Step 2. ✓
- `summary` = first non-empty usage line, fallback `"<Name> component"` — `summaryFromUsage` + fallback, Task 1. ✓
- Base URL env + relative fallback — Task 2 Step 2 + tests for both, Task 1. ✓
- Category grouping, empty categories skipped in `llms.txt` — `usedCats`, Task 1 + test. ✓
- `.test.tsx` exclusion inherited — reuses existing `manifest`, no new scan. ✓
- Committed not gitignored — `git add public/*` in Task 2 Step 6. ✓
- Build-fails-on-mismatch verification — count assertion + empty check, Task 2 Step 2. ✓
- Icons out of scope — not implemented. ✓

**Placeholder scan:** none — all steps carry real code/commands. (`<Name>` in the `import` field is intentional literal output, asserted nowhere as dynamic.)

**Type consistency:** `summaryFromUsage` and `buildInventory` signatures identical across Task 1 definition, tests, and Task 2 call site. `props` keyed by name, `usage` keyed by slug — matches `gen-data.mjs` and the fixture.
