# DS Stories + Contract-Validate + CI — Implementation Plan (Plan 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every one of the 43 `@connoradams/designsystem` components a Storybook story (so the preview site shows the whole library), add a contract-validate script that asserts the library's invariants, and wire a GitHub Actions CI workflow that gates every PR on typecheck + build + validate + Storybook build.

**Architecture:** Stories live in `apps/storybook/src/<category>/<Name>.stories.tsx`, auto-discovered by the existing `../src/**/*.stories.@(ts|tsx)` glob. They import components from the built `@connoradams/designsystem` package (bare specifier). A Node script (`scripts/validate.mjs`, run via `pnpm validate`) asserts every component `.tsx` is barrel-exported and has a story, and reports skill-sidecar coverage. CI runs install → typecheck → build → validate on push/PR.

**Tech Stack:** Storybook 8 (react-vite), TypeScript 5.6, Node 22, pnpm 10, turborepo, GitHub Actions. No new runtime deps.

**Reference:** `apps/storybook/src/Button.stories.tsx` (existing, from Plan 1) is moved in Task 1 and is the canonical story shape.

## Global Constraints

These bind every story task. They are the story recipe.

**Story file (per component `packages/ui/src/<cat>/<Name>.tsx` → `apps/storybook/src/<cat>/<Name>.stories.tsx`):**
1. Import types from Storybook and the component from the package bare specifier:
   ```tsx
   import type { Meta, StoryObj } from '@storybook/react'
   import { Name } from '@connoradams/designsystem'
   ```
2. `title: '<Category>/<Name>'` with the category capitalized (`Core`, `Data`, `Feedback`, `Finance`, `Forms`, `Navigation`, `Overlays`) — matches the existing `'Core/Button'`.
3. Use the exact shape of the reference (`Button.stories.tsx`):
   ```tsx
   const meta: Meta<typeof Name> = {
     title: 'Category/Name',
     component: Name,
     args: { /* minimal realistic props that render the component */ },
     argTypes: { /* `control: 'select'` + `options:[...]` for each union prop (variant/size/tone/etc.) */ },
   }
   export default meta
   type Story = StoryObj<typeof Name>

   export const Default: Story = {}
   // + 1–3 variant/state stories where the component has an obvious axis
   ```
4. **Derive args/argTypes from the component's real Props** (read the `.tsx`): every union-typed prop (`variant`, `size`, `tone`, `kind`, etc.) gets an `argTypes` select listing its exact union members; required props get realistic values in `args`.
5. **Provide minimal inline fixtures** for data-driven components: `Combobox`/`NativeSelect`/`RadioGroup`/`ToggleGroup` need an `options`/`items` array; `Sparkline` needs `data: number[]`; `StatCard` needs label/value/delta; `Table` and compound components (`Card`) render their composition via a `render: () => (<Composition/>)` story; `Breadcrumb`/`Pagination` need items/page props; overlays (`Dialog`/`DropdownMenu`/`Tooltip`/`Toast`) need a trigger or `open`/`defaultOpen` set so the overlay is visible in the canvas.
6. Keep stories minimal and dependency-free — no extra libraries, no network, no app context. A story's job is to render the component with representative props.
7. One `.stories.tsx` per component file. Compound components (Card, Table, Skeleton) get ONE story file named after the primary export, composing the sub-components in `render`.

**Per-task gate:** after writing a category's stories, `pnpm --filter @connoradams/designsystem build` then `pnpm --filter @connoradams/storybook typecheck` exits 0 (stories compile and their props type-check against the package).

**Out of scope:** authoring missing `prompt.md`/`card.html` skill sidecars (validate only REPORTS their coverage), visual-regression snapshots, the Next.js docs site (Plan 4), `foundations`/`templates`/`ui_kits`.

---

### Task 1: Storybook typecheck script + category-dir convention

Add a `typecheck` script to the Storybook app and relocate the existing Button story into the per-category directory layout that all new stories follow.

**Files:**
- Modify: `apps/storybook/package.json` (add `typecheck` script)
- Move: `apps/storybook/src/Button.stories.tsx` → `apps/storybook/src/core/Button.stories.tsx`

**Interfaces:** Produces `pnpm --filter @connoradams/storybook typecheck` (= `tsc --noEmit`) as the per-task gate for all story tasks; establishes `apps/storybook/src/<cat>/` as the story location.

- [ ] **Step 1: Add the `typecheck` script** to `apps/storybook/package.json` scripts (the app already has `apps/storybook/tsconfig.json` with `noEmit: true` from Plan 1):

```json
"typecheck": "tsc --noEmit"
```

- [ ] **Step 2: Move the Button story into the category dir**

```bash
mkdir -p apps/storybook/src/core
git mv apps/storybook/src/Button.stories.tsx apps/storybook/src/core/Button.stories.tsx
```
(If the sandbox blocks `git mv`: `mv` + `git add -A`.)

- [ ] **Step 3: Build the library, then typecheck Storybook**

Run: `pnpm --filter @connoradams/designsystem build && pnpm --filter @connoradams/storybook typecheck`
Expected: both exit 0. (Confirms the moved story still resolves and the new typecheck script works.)

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore(storybook): add typecheck script and category story layout"
```

---

### Task 2: Stories — `core` (11) + `feedback` (3)

Write stories for all 11 core components (Button already done — leave it) and 3 feedback components. These are mostly presentational; derive variant/size stories from each component's union props.

**Components:** core — Accordion, Avatar, Badge, Card (compound: compose in `render`), Kbd, Link, Progress, Separator, Spinner, Text (Button already has a story). feedback — Alert, EmptyState, Skeleton (compose Skeleton + SkeletonText).

**Files:** Create `apps/storybook/src/core/<Name>.stories.tsx` (10 new) and `apps/storybook/src/feedback/<Name>.stories.tsx` (3).

- [ ] **Step 1: Write the 13 story files** per the Global Constraints recipe, reading each component's Props for accurate args/argTypes. Badge → variant select (`default/secondary/destructive/outline/success/count`); Alert → variant (`info/success/warning/danger`); Text → variant/tone/weight selects; Card → `render` composing CardHeader/CardTitle/CardDescription/CardContent; Progress → a `value` arg; Skeleton → render Skeleton + SkeletonText.

- [ ] **Step 2: Build lib + typecheck Storybook**

Run: `pnpm --filter @connoradams/designsystem build && pnpm --filter @connoradams/storybook typecheck`
Expected: exit 0.

- [ ] **Step 3: Commit** — `git add -A && git commit -m "feat(storybook): stories for core and feedback components"`

---

### Task 3: Stories — `data` (4) + `finance` (8)

Data-heavy components needing inline fixtures.

**Components:** data — LetterAvatar, StatCard, Table (compound, `render` a small table), Tabs (items fixture). finance — AccountCard, AmountText, BudgetMeter, CategoryPill, ImportDropzone, MoneyInput, PeriodSelector, Sparkline.

**Files:** Create `apps/storybook/src/data/<Name>.stories.tsx` (4) and `apps/storybook/src/finance/<Name>.stories.tsx` (8).

- [ ] **Step 1: Write the 12 story files.** Fixtures: Table → `render` with TableHeader/Row/Head/Body/Cell and ~3 rows; Tabs → `items` array of `{value,label}`; Sparkline → `data: [3,7,4,9,6,11,8]`; StatCard → label/value/delta/kind; AmountText → a `value` number; BudgetMeter → spent/limit; PeriodSelector → default; MoneyInput → default; ImportDropzone → default; AccountCard/CategoryPill → representative props read from their `.tsx`.

- [ ] **Step 2: Build lib + typecheck Storybook** → exit 0.

- [ ] **Step 3: Commit** — `git add -A && git commit -m "feat(storybook): stories for data and finance components"`

---

### Task 4: Stories — `forms` (11)

Interactive/controlled inputs. Stories render them uncontrolled (with `defaultValue`/`defaultChecked`) or with a no-op handler so they display in the canvas.

**Components:** Checkbox, Combobox, Input, Label, NativeSelect, RadioGroup, Slider, Stepper, Switch, Textarea, ToggleGroup.

**Files:** Create `apps/storybook/src/forms/<Name>.stories.tsx` (11).

- [ ] **Step 1: Write the 11 story files.** Fixtures: Combobox → `options: [{value,label,hint?}...]`; NativeSelect → `options`; RadioGroup → `options`; ToggleGroup → `items`; Slider/Stepper → default + a `defaultValue`; Checkbox/Switch → Default + Checked (`defaultChecked`); Input/Textarea → a `placeholder`; Label → wrapping text. Use the component's own controlled/uncontrolled API (read the `.tsx`) — prefer uncontrolled `defaultValue`/`defaultX` so no React state wiring is needed in the story.

- [ ] **Step 2: Build lib + typecheck Storybook** → exit 0.

- [ ] **Step 3: Commit** — `git add -A && git commit -m "feat(storybook): stories for forms components"`

---

### Task 5: Stories — `navigation` (2) + `overlays` (4)

Overlays must be visible in the canvas — set `defaultOpen`/`open` or provide a trigger per the component's API.

**Components:** navigation — Breadcrumb (items fixture), Pagination (page/total props). overlays — Dialog, DropdownMenu, Toast, Tooltip.

**Files:** Create `apps/storybook/src/navigation/<Name>.stories.tsx` (2) and `apps/storybook/src/overlays/<Name>.stories.tsx` (4).

- [ ] **Step 1: Write the 6 story files.** Read each overlay's `.tsx` to find how it opens: if it takes a `trigger`/children + internal state, render it with a trigger and note it opens on interaction; if it accepts `open`/`defaultOpen`, set it so the overlay shows. Toast → render with its visible variant. Breadcrumb → `items: [{label,href}...]`; Pagination → `page`/`total`/`onPageChange` no-op.

- [ ] **Step 2: Build lib + typecheck Storybook** → exit 0.

- [ ] **Step 3: Commit** — `git add -A && git commit -m "feat(storybook): stories for navigation and overlays components"`

---

### Task 6: Contract-validate script

A Node ESM script asserting the library's structural invariants, wired as `pnpm validate` and a turbo task.

**Files:**
- Create: `scripts/validate.mjs`
- Modify: `package.json` (root — add `validate` script)
- Modify: `turbo.json` (add a `validate` task)

**Interfaces:** Produces `pnpm validate` exiting 0 when every component is barrel-exported and storied; non-zero otherwise. Reports skill-sidecar coverage as non-fatal info.

- [ ] **Step 1: Write `scripts/validate.mjs`**

```js
// Validate @connoradams/designsystem structural contract.
// FATAL: every component .tsx must be (a) exported from the barrel and (b) have a Storybook story.
// INFO (non-fatal): skill-sidecar (.prompt.md / .card.html) coverage.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const UI_SRC = 'packages/ui/src'
const STORY_SRC = 'apps/storybook/src'
const CATEGORIES = ['core', 'data', 'feedback', 'finance', 'forms', 'navigation', 'overlays']

const barrel = readFileSync(join(UI_SRC, 'index.ts'), 'utf8')

const errors = []
let total = 0, withPrompt = 0, withCard = 0

for (const cat of CATEGORIES) {
  const dir = join(UI_SRC, cat)
  if (!existsSync(dir)) { errors.push(`missing category dir: ${dir}`); continue }
  const components = readdirSync(dir).filter((f) => f.endsWith('.tsx')).map((f) => f.replace(/\.tsx$/, ''))
  for (const name of components) {
    total++
    // (a) barrel export — the file is referenced by its relative module path
    if (!barrel.includes(`./${cat}/${name}'`)) errors.push(`not exported from barrel: ${cat}/${name}`)
    // (b) story exists
    if (!existsSync(join(STORY_SRC, cat, `${name}.stories.tsx`))) errors.push(`missing story: ${cat}/${name}.stories.tsx`)
    // sidecar coverage (info)
    if (existsSync(join(dir, `${name}.prompt.md`))) withPrompt++
    if (existsSync(join(dir, `${name}.card.html`))) withCard++
  }
}

console.log(`Components: ${total}`)
console.log(`Skill-sidecar coverage: prompt.md ${withPrompt}/${total}, card.html ${withCard}/${total}`)
if (errors.length) {
  console.error(`\nContract violations (${errors.length}):`)
  for (const e of errors) console.error(`  ✗ ${e}`)
  process.exit(1)
}
console.log('\n✓ Contract OK: every component is barrel-exported and storied.')
```

- [ ] **Step 2: Add the root `validate` script** to `package.json`:

```json
"validate": "node scripts/validate.mjs"
```

- [ ] **Step 3: Add a `validate` task** to `turbo.json` `tasks` (no outputs, depends on nothing — it reads source):

```json
"validate": { "cache": false }
```

- [ ] **Step 4: Run it**

Run: `pnpm validate`
Expected: prints component count + sidecar coverage, then `✓ Contract OK` and exits 0. (All 43 components are barrel-exported from Plan 2 and storied from Tasks 1–5.) If it reports a missing story or export, fix the gap (add the missing story / barrel line) before proceeding.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: contract-validate script (barrel + story coverage)"`

---

### Task 7: CI workflow

GitHub Actions gating every PR and push to `main` on the full check suite.

**Files:**
- Create: `.github/workflows/ci.yml`

**Interfaces:** Produces a CI job that fails the PR if typecheck, build, validate, or Storybook build fails.

- [ ] **Step 1: Write `.github/workflows/ci.yml`**

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10.29.3
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm build
      - run: pnpm validate
```

(Note: `pnpm typecheck` is the root `turbo run typecheck` task — its `dependsOn: ["^build"]` builds the library's `dist/` BEFORE the Storybook app's typecheck, which imports the package's generated types; running `pnpm -r typecheck` instead would fail because Storybook would typecheck against an unbuilt package. `pnpm build` runs the turbo `build` task across the workspace, which builds the library AND `storybook build` — so Storybook build is covered.)

- [ ] **Step 2: Validate the workflow YAML locally**

Run: `node -e "const y=require('fs').readFileSync('.github/workflows/ci.yml','utf8'); if(!y.includes('pnpm install --frozen-lockfile')||!y.includes('pnpm validate')) throw new Error('workflow missing steps'); console.log('workflow OK')"`
Expected: prints `workflow OK`. (A real run happens when the PR opens.)

- [ ] **Step 3: Commit** — `git add -A && git commit -m "ci: typecheck, build, validate, storybook on PR"`

---

### Task 8: Whole-suite verification

Confirm every component is storied, the full suite is green, and CI will pass.

- [ ] **Step 1: Every component has a story**

Run: `pnpm validate`
Expected: `✓ Contract OK`, 43 components, exit 0.

- [ ] **Step 2: Workspace typecheck (UI + Storybook)**

Run: `pnpm typecheck`
Expected: turbo runs both packages' typecheck (building the library first via `^build`); exit 0.

- [ ] **Step 3: Full build incl. Storybook**

Run: `pnpm build`
Expected: turbo reports all tasks successful (library ESM+DTS, `storybook build` writes `storybook-static/`).

- [ ] **Step 4: Story count sanity**

Run: `find apps/storybook/src -name '*.stories.tsx' | wc -l`
Expected: `43` (one per component).

- [ ] **Step 5: Commit** (only if a fix was needed in Steps 1–4; else skip)

```bash
git add -A
git commit -m "fix: resolve stories/validate verification findings"
```

---

## Self-Review

**Spec coverage:** Stories for all 42 unstoried components (core 10 + feedback 3 + data 4 + finance 8 + forms 11 + navigation 2 + overlays 4 = 42; Button pre-existing = 43 total) across Tasks 1–5. Contract-validate (Task 6) enforces barrel + story coverage and reports sidecars. CI (Task 7) gates the suite. Task 8 verifies. ✅

**Placeholder scan:** The validate script and CI YAML are complete and runnable. Stories use a concrete recipe + the committed `Button.stories.tsx` reference + per-component fixture guidance; per-component story content is derived from each component's real Props (the source is the spec), consistent with Plan 2's approach. No "TBD". ✅

**Type/interface consistency:** Per-task gate is uniform (`build` lib → `typecheck` storybook). The validate script's barrel check (`./${cat}/${name}'`) matches the exact export-line format Plan 2 produced (verified: `export { X } from './cat/X'`). Story `title` convention matches existing `'Core/Button'`. ✅

**Known risk:** an overlay whose open-state API can't be triggered declaratively in a story (needs interaction) still renders its trigger — acceptable; the story compiles and the component is visible/clickable. The `typecheck` gate catches prop mistakes; the final `storybook build` (Task 8 Step 3) is the second gate.
