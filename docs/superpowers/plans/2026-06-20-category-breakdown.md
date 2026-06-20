# CategoryBreakdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `CategoryBreakdown` finance primitive — a card with a ranked horizontal-bar breakdown of money by category — composed entirely from existing design-system primitives.

**Architecture:** Root is `core/Card` (ref + className + `data-slot` forwarded through it). Header row = `Text` (title) + `Text` (muted subtitle) on the left, optional `Sparkline` on the right. Each data row is a 3-column grid: `CategoryPill | Progress (gradient bar) | AmountText`. Static layout/focus/hover live in `CategoryBreakdown.css`; only dynamic values (bar `value`, gradient `tone`) are inline. The bar is `Progress` with a gradient string passed as `tone` (rendered straight into `background`) — no new bar component.

**Tech Stack:** React 18 + TypeScript, `React.forwardRef`, CSS custom properties only, vitest + @testing-library/react (jsdom), Storybook, tsup.

## Global Constraints

- `forwardRef` is mandatory; root forwards to the `Card` div (`HTMLDivElement`).
- Style only through CSS custom properties (`var(--token)`) — no hard-coded hex, no CSS-in-JS lib, no new npm deps. lucide-style icons come from CategoryPill's built-ins; never import an icon library.
- Interactive states (`:hover`, `:focus-visible`, `:active`) live in `CategoryBreakdown.css`, never JS. No `useState` hover. Any focusable element gets `:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px }` (WCAG 2.4.7).
- Base class `ca-category-breakdown`; merge consumer `className`; set `data-slot="category-breakdown"`; spread `...props`.
- Bar gradient is exactly `linear-gradient(90deg, var(--gradient-hero-from), var(--gradient-hero-to))` (90deg, intentional divergence from the flat 135deg `--gradient-hero` token — documented in the spec).
- Defaults: `currency='CAD'`, `locale='en-CA'`, `trendTone='negative'`.
- Group `finance` ships **per-component** `<Name>.prompt.md` + `<Name>.card.html` (do not extend a grouped file).
- Contract gate (`scripts/validate.mjs`) is FATAL without both the barrel export and the Storybook story.
- Never hand-edit `_ds_bundle.js`, `_ds_manifest.json`, `apps/web/src/generated/*`, `dist/`.

---

## File Structure

- Create `packages/ui/src/finance/CategoryBreakdown.tsx` — component + inline types.
- Create `packages/ui/src/finance/CategoryBreakdown.css` — layout grid, row button reset, hover/focus.
- Create `packages/ui/src/finance/CategoryBreakdown.test.tsx` — vitest + RTL.
- Create `apps/storybook/src/finance/CategoryBreakdown.stories.tsx` — stories.
- Create `packages/ui/src/finance/CategoryBreakdown.prompt.md` — usage sidecar.
- Create `packages/ui/src/finance/CategoryBreakdown.card.html` — gallery card (copy `AccountCard.card.html`).
- Modify `packages/ui/src/index.ts` — barrel export next to the other `finance/*` entries.
- Create `.changeset/category-breakdown.md` — `minor` bump.

## Prerequisite

- [ ] **Step 0: Install deps (fresh worktree)**

Run: `pnpm install`
Expected: completes; `node_modules` present (else typecheck dies with "Cannot find module 'react'").

---

### Task 1: Core component — Card root, header, static rows

**Files:**
- Create: `packages/ui/src/finance/CategoryBreakdown.tsx`
- Create: `packages/ui/src/finance/CategoryBreakdown.css`
- Modify: `packages/ui/src/index.ts` (barrel)
- Create: `apps/storybook/src/finance/CategoryBreakdown.stories.tsx`
- Test: `packages/ui/src/finance/CategoryBreakdown.test.tsx`

**Interfaces:**
- Consumes: `Card` from `../core/Card`, `Text` from `../core/Text`, `CategoryPill` from `./CategoryPill`, `Progress` from `../core/Progress`, `AmountText` from `./AmountText`.
- Produces:
  ```ts
  export interface CategoryBreakdownRow {
    category?: string
    label?: React.ReactNode
    amount: number
    color?: string
  }
  export interface CategoryBreakdownProps extends React.HTMLAttributes<HTMLDivElement> {
    rows: CategoryBreakdownRow[]
    title?: React.ReactNode
    subtitle?: React.ReactNode
    trend?: number[]
    trendTone?: 'positive' | 'negative' | 'neutral' | 'primary'
    max?: number
    currency?: string
    locale?: string
    onSelect?: (category: string, row: CategoryBreakdownRow) => void
  }
  export const CategoryBreakdown: React.ForwardRefExoticComponent<...>
  ```

- [ ] **Step 1: Write the failing test**

Create `packages/ui/src/finance/CategoryBreakdown.test.tsx`:

```tsx
import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { CategoryBreakdown } from './CategoryBreakdown'

const ROWS = [
  { category: 'groceries', amount: -842 },
  { category: 'dining', amount: -586 },
  { category: 'transport', amount: -418 },
]

describe('CategoryBreakdown', () => {
  it('applies the ca-category-breakdown base class', () => {
    render(<CategoryBreakdown rows={ROWS} data-testid="cb" />)
    expect(screen.getByTestId('cb')).toHaveClass('ca-category-breakdown')
  })

  it('merges a consumer className with the base class', () => {
    render(<CategoryBreakdown rows={ROWS} className="w-full" data-testid="cb" />)
    const el = screen.getByTestId('cb')
    expect(el).toHaveClass('ca-category-breakdown')
    expect(el).toHaveClass('w-full')
  })

  it('sets data-slot="category-breakdown"', () => {
    render(<CategoryBreakdown rows={ROWS} data-testid="cb" />)
    expect(screen.getByTestId('cb')).toHaveAttribute('data-slot', 'category-breakdown')
  })

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<CategoryBreakdown rows={ROWS} ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
  })

  it('renders title and subtitle', () => {
    render(<CategoryBreakdown rows={ROWS} title="Net spend by category" subtitle="This month" />)
    expect(screen.getByText('Net spend by category')).toBeInTheDocument()
    expect(screen.getByText('This month')).toBeInTheDocument()
  })

  it('renders one pill and one amount per row', () => {
    const { container } = render(<CategoryBreakdown rows={ROWS} />)
    expect(screen.getByText('Groceries')).toBeInTheDocument()
    expect(screen.getByText('Dining')).toBeInTheDocument()
    expect(screen.getByText('Transport')).toBeInTheDocument()
    // AmountText slots (mono, signed, oxblood) — one per row. Match on digits,
    // not the exact currency symbol (ICU varies $ vs CA$ by Node build).
    const amounts = container.querySelectorAll('[data-slot="amount"]')
    expect(amounts).toHaveLength(3)
    expect(amounts[0]!.textContent).toMatch(/842/)
  })

  it('renders the header but no rows when rows is empty', () => {
    render(<CategoryBreakdown rows={[]} title="Empty" data-testid="cb" />)
    expect(screen.getByText('Empty')).toBeInTheDocument()
    expect(screen.queryByText('Groceries')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @connor-adams/designsystem test -- CategoryBreakdown`
Expected: FAIL — "Cannot find module './CategoryBreakdown'".

- [ ] **Step 3: Write the component**

Create `packages/ui/src/finance/CategoryBreakdown.tsx`:

```tsx
import * as React from 'react'
import './CategoryBreakdown.css'
import { Card } from '../core/Card'
import { Text } from '../core/Text'
import { CategoryPill } from './CategoryPill'
import { Progress } from '../core/Progress'
import { AmountText } from './AmountText'

/**
 * Ranked horizontal-bar breakdown of money by transaction category — the
 * "net spend by category" tile. Composed entirely from DS primitives: Card
 * shell, optional Sparkline trend, and per-row CategoryPill + Progress bar +
 * AmountText. Bars scale to the largest absolute amount; pass `onSelect` to
 * make rows selectable. Works for spend or income (sign is inferred per row).
 */
export interface CategoryBreakdownRow {
  category?: string
  label?: React.ReactNode
  amount: number
  color?: string
}

export interface CategoryBreakdownProps extends React.HTMLAttributes<HTMLDivElement> {
  rows: CategoryBreakdownRow[]
  title?: React.ReactNode
  subtitle?: React.ReactNode
  trend?: number[]
  trendTone?: 'positive' | 'negative' | 'neutral' | 'primary'
  max?: number
  currency?: string
  locale?: string
  onSelect?: (category: string, row: CategoryBreakdownRow) => void
}

const BAR_GRADIENT = 'linear-gradient(90deg, var(--gradient-hero-from), var(--gradient-hero-to))'

function labelText(row: CategoryBreakdownRow): string {
  if (typeof row.label === 'string') return row.label
  if (row.category) return row.category.charAt(0).toUpperCase() + row.category.slice(1)
  return 'Uncategorized'
}

export const CategoryBreakdown = React.forwardRef<HTMLDivElement, CategoryBreakdownProps>(
  function CategoryBreakdown(
    {
      rows,
      title,
      subtitle,
      trend,
      trendTone = 'negative',
      max,
      currency = 'CAD',
      locale = 'en-CA',
      onSelect,
      className,
      ...props
    },
    ref,
  ): React.JSX.Element {
    const denom = max ?? Math.max(0, ...rows.map((r) => Math.abs(r.amount)))

    return (
      <Card
        ref={ref}
        data-slot="category-breakdown"
        className={className ? `ca-category-breakdown ${className}` : 'ca-category-breakdown'}
        {...props}
      >
        {(title || subtitle || trend) && (
          <div className="ca-category-breakdown__header">
            <div className="ca-category-breakdown__heading">
              {title && <Text variant="headline-sm">{title}</Text>}
              {subtitle && <Text variant="body" tone="muted">{subtitle}</Text>}
            </div>
            {/* Sparkline added in Task 3 */}
          </div>
        )}

        {rows.length > 0 && (
          <div className="ca-category-breakdown__rows">
            {rows.map((row, i) => {
              const pct = denom > 0 ? (Math.abs(row.amount) / denom) * 100 : 0
              return (
                <div className="ca-category-breakdown__row" key={i}>
                  <CategoryPill category={row.category ?? 'default'} label={row.label} color={row.color} />
                  <Progress value={pct} tone={BAR_GRADIENT} size="lg" aria-hidden />
                  <AmountText value={row.amount} currency={currency} locale={locale} className="ca-category-breakdown__amount" />
                </div>
              )
            })}
          </div>
        )}
      </Card>
    )
  },
)
```

Note: `denom` uses `Math.max(0, ...abs)` so an empty `rows` array yields `0` (no `-Infinity`), and the `pct` guard handles `denom === 0`. `labelText` is unused until Task 4 — it is added now so the helper exists; if your linter flags it, leave it (Task 4 consumes it) or add it in Task 4 instead.

- [ ] **Step 4: Write the layout CSS**

Create `packages/ui/src/finance/CategoryBreakdown.css`:

```css
/* CategoryBreakdown — ranked category bars inside a Card. Layout + the
   selectable-row button reset/hover/focus live here; bar width and gradient
   tone are dynamic and stay inline in the .tsx. */

.ca-category-breakdown__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.ca-category-breakdown__heading {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.ca-category-breakdown__rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ca-category-breakdown__row {
  display: grid;
  grid-template-columns: 150px 1fr auto;
  align-items: center;
  gap: 16px;
}

.ca-category-breakdown__amount {
  justify-self: end;
  white-space: nowrap;
}

/* Selectable variant — whole row is a button (added in Task 4). */
button.ca-category-breakdown__row {
  width: 100%;
  text-align: inherit;
  font: inherit;
  color: inherit;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: var(--radius-md);
  padding: 6px 8px;
  margin: -6px -8px;
}
button.ca-category-breakdown__row:hover {
  background: color-mix(in oklch, var(--muted) 60%, transparent);
}
button.ca-category-breakdown__row:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

- [ ] **Step 5: Add the barrel export**

Modify `packages/ui/src/index.ts` — add next to the other `finance/*` entries (e.g. after the `AmountText` lines):

```ts
export { CategoryBreakdown } from './finance/CategoryBreakdown'
export type { CategoryBreakdownProps, CategoryBreakdownRow } from './finance/CategoryBreakdown'
```

- [ ] **Step 6: Add the Storybook story**

Create `apps/storybook/src/finance/CategoryBreakdown.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { CategoryBreakdown } from '@connor-adams/designsystem'

const meta: Meta<typeof CategoryBreakdown> = {
  title: 'Finance/CategoryBreakdown',
  component: CategoryBreakdown,
  args: {
    title: 'Net spend by category',
    subtitle: 'This month · transfers excluded',
    trend: [12, 9, 14, 11, 18, 16, 22],
    rows: [
      { category: 'groceries', amount: -842 },
      { category: 'dining', amount: -586 },
      { category: 'transport', amount: -418 },
      { category: 'subscriptions', amount: -214 },
      { category: 'utilities', amount: -176 },
    ],
  },
}
export default meta

type Story = StoryObj<typeof CategoryBreakdown>

export const Default: Story = {}

export const NoSparkline: Story = {
  args: { trend: undefined },
}

export const Selectable: Story = {
  args: { onSelect: (category) => console.log('selected', category) },
}
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `pnpm --filter @connor-adams/designsystem test -- CategoryBreakdown`
Expected: PASS (all Task 1 tests green).

- [ ] **Step 8: Commit**

```bash
git add packages/ui/src/finance/CategoryBreakdown.tsx packages/ui/src/finance/CategoryBreakdown.css packages/ui/src/finance/CategoryBreakdown.test.tsx packages/ui/src/index.ts apps/storybook/src/finance/CategoryBreakdown.stories.tsx
git commit -m "feat(finance): CategoryBreakdown core — card, header, ranked rows"
```

---

### Task 2: Proportional bar scaling

**Files:**
- Modify: `packages/ui/src/finance/CategoryBreakdown.tsx` (already implements scaling from Task 1 — this task locks it with tests)
- Test: `packages/ui/src/finance/CategoryBreakdown.test.tsx`

**Interfaces:**
- Consumes: `Progress` renders `role="progressbar"` with `aria-valuenow={Math.round(pct)}` on its inner track — the test hook for bar width.
- Produces: nothing new.

- [ ] **Step 1: Write the failing test**

Append to `packages/ui/src/finance/CategoryBreakdown.test.tsx`:

```tsx
describe('CategoryBreakdown bar scaling', () => {
  it('renders the largest row at 100% and scales the rest', () => {
    render(
      <CategoryBreakdown
        rows={[
          { category: 'groceries', amount: -800 },
          { category: 'dining', amount: -400 },
        ]}
      />,
    )
    const bars = screen.getAllByRole('progressbar')
    expect(bars[0]).toHaveAttribute('aria-valuenow', '100')
    expect(bars[1]).toHaveAttribute('aria-valuenow', '50')
  })

  it('honors an explicit max as the bar denominator', () => {
    render(<CategoryBreakdown rows={[{ category: 'groceries', amount: -500 }]} max={1000} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50')
  })

  it('renders bars at 0% when all amounts are zero (no divide-by-zero)', () => {
    render(<CategoryBreakdown rows={[{ category: 'groceries', amount: 0 }]} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  })
})
```

- [ ] **Step 2: Run test to verify it passes**

Run: `pnpm --filter @connor-adams/designsystem test -- CategoryBreakdown`
Expected: PASS — Task 1's `denom`/`pct` logic already satisfies these. If any fail, fix the scaling in `CategoryBreakdown.tsx` (denom = `max ?? Math.max(0, ...abs)`, `pct = denom > 0 ? abs/denom*100 : 0`) until green.

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/finance/CategoryBreakdown.test.tsx packages/ui/src/finance/CategoryBreakdown.tsx
git commit -m "test(finance): lock CategoryBreakdown bar scaling"
```

---

### Task 3: Optional header Sparkline

**Files:**
- Modify: `packages/ui/src/finance/CategoryBreakdown.tsx`
- Test: `packages/ui/src/finance/CategoryBreakdown.test.tsx`

**Interfaces:**
- Consumes: `Sparkline` from `./Sparkline` — `<Sparkline data={number[]} tone={...} />`, renders an `<svg data-slot="sparkline">`.
- Produces: nothing new (uses existing `trend` / `trendTone` props).

- [ ] **Step 1: Write the failing test**

Append to `packages/ui/src/finance/CategoryBreakdown.test.tsx`:

```tsx
describe('CategoryBreakdown trend sparkline', () => {
  it('renders a sparkline when trend is provided', () => {
    const { container } = render(
      <CategoryBreakdown rows={[{ category: 'groceries', amount: -800 }]} trend={[1, 2, 3, 4]} />,
    )
    expect(container.querySelector('[data-slot="sparkline"]')).toBeInTheDocument()
  })

  it('renders no sparkline when trend is omitted', () => {
    const { container } = render(
      <CategoryBreakdown rows={[{ category: 'groceries', amount: -800 }]} />,
    )
    expect(container.querySelector('[data-slot="sparkline"]')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @connor-adams/designsystem test -- CategoryBreakdown`
Expected: FAIL — first test finds no sparkline (not yet rendered).

- [ ] **Step 3: Add the Sparkline import and render**

In `packages/ui/src/finance/CategoryBreakdown.tsx`, add the import:

```tsx
import { Sparkline } from './Sparkline'
```

Replace the `{/* Sparkline added in Task 3 */}` comment in the header with:

```tsx
{trend && trend.length > 1 && (
  <Sparkline data={trend} tone={trendTone} width={108} height={36} className="ca-category-breakdown__trend" />
)}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @connor-adams/designsystem test -- CategoryBreakdown`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/ui/src/finance/CategoryBreakdown.tsx packages/ui/src/finance/CategoryBreakdown.test.tsx
git commit -m "feat(finance): optional header sparkline on CategoryBreakdown"
```

---

### Task 4: Selectable rows

**Files:**
- Modify: `packages/ui/src/finance/CategoryBreakdown.tsx`
- Test: `packages/ui/src/finance/CategoryBreakdown.test.tsx`

**Interfaces:**
- Consumes: `onSelect?: (category: string, row: CategoryBreakdownRow) => void` (declared in Task 1), `labelText` helper (declared in Task 1).
- Produces: nothing new.

- [ ] **Step 1: Write the failing test**

Append to `packages/ui/src/finance/CategoryBreakdown.test.tsx` (add `fireEvent` to the existing `@testing-library/react` import):

```tsx
import { fireEvent } from '@testing-library/react'

describe('CategoryBreakdown selectable rows', () => {
  it('renders rows as non-button divs when onSelect is absent', () => {
    render(<CategoryBreakdown rows={[{ category: 'groceries', amount: -800 }]} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders each row as a button and fires onSelect with the category', () => {
    const onSelect = vi.fn()
    render(
      <CategoryBreakdown
        rows={[
          { category: 'groceries', amount: -800 },
          { category: 'dining', amount: -400 },
        ]}
        onSelect={onSelect}
      />,
    )
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
    fireEvent.click(buttons[0]!)
    expect(onSelect).toHaveBeenCalledWith('groceries', { category: 'groceries', amount: -800 })
  })

  it('gives each selectable row an accessible label', () => {
    render(
      <CategoryBreakdown rows={[{ category: 'groceries', amount: -842 }]} onSelect={() => {}} />,
    )
    expect(screen.getByRole('button', { name: /groceries/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @connor-adams/designsystem test -- CategoryBreakdown`
Expected: FAIL — rows are always `div`s; no buttons found.

- [ ] **Step 3: Make rows render as a button when onSelect is set**

In `packages/ui/src/finance/CategoryBreakdown.tsx`, replace the row `<div>` in the `rows.map(...)` body with a tag switch:

```tsx
{rows.map((row, i) => {
  const pct = denom > 0 ? (Math.abs(row.amount) / denom) * 100 : 0
  const inner = (
    <>
      <CategoryPill category={row.category ?? 'default'} label={row.label} color={row.color} />
      <Progress value={pct} tone={BAR_GRADIENT} size="lg" aria-hidden />
      <AmountText value={row.amount} currency={currency} locale={locale} className="ca-category-breakdown__amount" />
    </>
  )
  if (onSelect) {
    return (
      <button
        type="button"
        className="ca-category-breakdown__row"
        key={i}
        aria-label={labelText(row)}
        onClick={() => onSelect(row.category ?? '', row)}
      >
        {inner}
      </button>
    )
  }
  return (
    <div className="ca-category-breakdown__row" key={i}>
      {inner}
    </div>
  )
})}
```

Note: `aria-label` uses `labelText(row)` (the resolved category/label text) so the button has a name even though its visible content is composed primitives. The CategoryPill stays a non-interactive `span`, so no nested button.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @connor-adams/designsystem test -- CategoryBreakdown`
Expected: PASS (whole file green).

- [ ] **Step 5: Commit**

```bash
git add packages/ui/src/finance/CategoryBreakdown.tsx packages/ui/src/finance/CategoryBreakdown.test.tsx
git commit -m "feat(finance): selectable rows on CategoryBreakdown"
```

---

### Task 5: Sidecars, changeset, and full verification

**Files:**
- Create: `packages/ui/src/finance/CategoryBreakdown.prompt.md`
- Create: `packages/ui/src/finance/CategoryBreakdown.card.html`
- Create: `.changeset/category-breakdown.md`

**Interfaces:** none (documentation + release wiring).

- [ ] **Step 1: Write the prompt sidecar**

Create `packages/ui/src/finance/CategoryBreakdown.prompt.md`:

```md
A card that ranks money by category as horizontal bars — the "net spend by category" tile.

```jsx
<CategoryBreakdown
  title="Net spend by category"
  subtitle="This month · transfers excluded"
  trend={[12, 9, 14, 11, 18, 16, 22]}
  rows={[
    { category: 'groceries', amount: -842 },
    { category: 'dining', amount: -586 },
    { category: 'transport', amount: -418 },
  ]}
/>
<CategoryBreakdown rows={rows} onSelect={(category) => filterBy(category)} />
```

Bars scale to the largest absolute amount (override with `max`). Pass `trend` for the header sparkline (`trendTone` defaults to negative). Pass `onSelect` to make each row a button. Amounts infer in/out sign, so it works for income too.
```

- [ ] **Step 2: Write the gallery card (copy a sibling)**

Copy `packages/ui/src/finance/AccountCard.card.html` to `packages/ui/src/finance/CategoryBreakdown.card.html`, then edit:
- First line → `<!-- @dsCard group="Finance" viewport="700x340" name="CategoryBreakdown" subtitle="Ranked category bars — net spend by category" -->`
- Change the mount-global line to `const { CategoryBreakdown } = window.CashflowDesignSystem_2cf89d;`
- Replace the `<Demo>` body with a single full-width instance:

```jsx
function Demo() {
  return (
    <div style={{ maxWidth: 620 }}>
      <CategoryBreakdown
        title="Net spend by category"
        subtitle="This month · transfers excluded"
        trend={[12, 9, 14, 11, 18, 16, 22]}
        rows={[
          { category: 'groceries', amount: -842 },
          { category: 'dining', amount: -586 },
          { category: 'transport', amount: -418 },
          { category: 'subscriptions', amount: -214 },
          { category: 'utilities', amount: -176 },
        ]}
      />
    </div>
  );
}
```

Keep the unpkg `<script>` tags, integrity hashes, `../../styles.css`, and `../../_ds_bundle.js` references **exactly** as copied — do not regenerate them.

- [ ] **Step 3: Write the changeset**

Create `.changeset/category-breakdown.md`:

```md
---
'@connor-adams/designsystem': minor
---

Add CategoryBreakdown component — a card with a ranked horizontal-bar breakdown of money by category, composed from existing primitives.
```

- [ ] **Step 4: Run the full verification suite**

```bash
node scripts/validate.mjs
pnpm --filter @connor-adams/designsystem typecheck
pnpm --filter @connor-adams/designsystem test
pnpm --filter @connor-adams/designsystem build
pnpm typecheck
pnpm exec changeset status
```

Expected: `validate.mjs` exits 0 (barrel + story satisfied; prompt/card coverage reported, non-fatal); typecheck clean (ui + storybook + web); all tests pass; build emits `dist` (grep `dist/index.js` for `CategoryBreakdown`); `changeset status` lists `@connor-adams/designsystem` at `minor` (and `@connor-adams/web` at `patch`, expected). Do not claim done on a partial run.

- [ ] **Step 5: Commit**

```bash
git add packages/ui/src/finance/CategoryBreakdown.prompt.md packages/ui/src/finance/CategoryBreakdown.card.html .changeset/category-breakdown.md
git commit -m "docs(finance): CategoryBreakdown sidecars + changeset"
```

---

## Self-Review

**Spec coverage:**
- Composition (Card/Text/Sparkline/CategoryPill/Progress/AmountText) → Tasks 1, 3. ✅
- Gradient bar via Progress `tone`, 90deg → Task 1 (`BAR_GRADIENT`). ✅
- Props (rows/title/subtitle/trend/trendTone/max/currency/locale/onSelect) → Task 1 interface; behavior in Tasks 2–4. ✅
- Bar scaling + max guard → Task 2. ✅
- Optional sparkline → Task 3. ✅
- Selectable rows as buttons, pill stays span, aria-label → Task 4. ✅
- Empty rows → header only → Task 1 (test + `rows.length > 0` guard). ✅
- DS contract (barrel, story, prompt, card, test, changeset, `.css`) → Tasks 1, 5. ✅
- Accessibility: focus ring (CSS, Task 1), sparkline decorative (`tone`/no role; bars `aria-hidden`), button names (Task 4). ✅

**Placeholder scan:** No TBD/TODO; every code step shows complete code. The `{/* Sparkline added in Task 3 */}` marker in Task 1 is intentionally replaced in Task 3 Step 3.

**Type consistency:** `CategoryBreakdownProps`/`CategoryBreakdownRow`, `denom`/`pct`, `labelText`, `BAR_GRADIENT`, `onSelect(category, row)` signature are consistent across Tasks 1–4 and the barrel export in Task 1 Step 5.
