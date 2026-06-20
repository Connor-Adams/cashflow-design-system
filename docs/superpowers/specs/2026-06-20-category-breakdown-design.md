# CategoryBreakdown — design

Date: 2026-06-20
Group: `finance` (`packages/ui/src/finance/`)
Status: approved (pending spec review)

## Purpose

A card that shows a ranked horizontal-bar breakdown of money by transaction
category — the "Net spend by category" tile. Built entirely from existing
design-system primitives plus one new layout CSS file. Reusable for spend or
income (sign is inferred per row), with an optional header trend sparkline and
optional row selection for drill-down.

## Composition

All sub-parts are existing DS primitives. No new bar/chart component.

```
Card
├─ header row
│    ├─ left:  Text (title)  +  Text (muted subtitle)
│    └─ right: Sparkline (optional)
└─ rows[] — each a 3-column grid:
     CategoryPill  │  Progress (gradient bar)  │  AmountText (right-aligned)
```

- **Card** (`core/Card`) — container.
- **Text** (`core/Text`) — title and muted subtitle.
- **Sparkline** (`finance/Sparkline`) — header trend, right-aligned. Rendered
  only when `trend` is provided. Default `tone='negative'` (oxblood line).
- **CategoryPill** (`finance/CategoryPill`) — left column. Non-interactive
  `span` (its built-in icons/tints already cover groceries, dining, transport,
  subscriptions, utilities, income, fees, housing).
- **Progress** (`core/Progress`) — the bar. `value = abs(amount) / max * 100`.
  `tone` is passed straight into `background`, so a CSS gradient string renders
  the warm hero gradient with no new component:
  `linear-gradient(90deg, var(--gradient-hero-from), var(--gradient-hero-to))`.
- **AmountText** (`finance/AmountText`) — right column. Signed, mono, money
  color (out = oxblood). Direction inferred from `amount`.

## Props

```ts
interface CategoryBreakdownRow {
  category?: string          // drives CategoryPill icon + tint + default label
  label?: React.ReactNode    // override pill label
  amount: number             // signed; AmountText infers in/out
  color?: string             // override pill tint
}

interface CategoryBreakdownProps extends React.HTMLAttributes<HTMLDivElement> {
  rows: CategoryBreakdownRow[]
  title?: React.ReactNode
  subtitle?: React.ReactNode
  trend?: number[]                                          // optional → header Sparkline
  trendTone?: 'positive' | 'negative' | 'neutral' | 'primary'  // default 'negative'
  max?: number                                             // bar denominator; default = max abs(amount)
  currency?: string                                        // default 'CAD'
  locale?: string                                          // default 'en-CA'
  onSelect?: (category: string, row: CategoryBreakdownRow) => void
}
```

## Behavior

- **Bar scale.** Denominator = `max` prop, else `Math.max(...rows.map(r => abs(amount)))`.
  Largest row renders full-width; others proportional. Bars always use the
  absolute value (a row's sign only affects the AmountText color/sign).
- **Selectable rows.** When `onSelect` is provided, each row renders as a
  `<button type="button">` spanning the full row: whole-row click fires
  `onSelect(category, row)`, keyboard-focusable, `aria-label` combining the
  resolved label and formatted amount. The CategoryPill stays a non-interactive
  `span` to avoid a nested button. Without `onSelect`, rows render as plain
  `<div>`s.
- **Ordering.** No internal sort — rows render in caller order (screenshot is
  pre-sorted descending). Caller owns sort.
- **`category` resolution.** `row.category ?? ''` is passed to CategoryPill (it
  falls back to its `default` icon/tint when empty/unknown) and to `onSelect`.

## Edge cases

- `rows` empty → render the header (title/subtitle/sparkline) only; no rows
  block. (Caller can choose not to render the component at all.)
- `max <= 0` or all amounts zero → guard division; bars render at 0% width.
- `amount` of 0 → AmountText renders neutral (its `zero` direction); bar at 0%.
- Long labels → pill column has a max-ish width; bar column flexes. Title/
  subtitle truncation is not required (matches screenshot).

## Accessibility

- Selectable rows are real buttons with descriptive `aria-label`
  (e.g. "Groceries, −$842"); focus-visible ring via existing token styles.
- Sparkline is decorative → `aria-hidden`.
- Bars inherit Progress's `role="progressbar"` + aria-value*; acceptable as a
  relative-magnitude readout. The authoritative figure is the adjacent
  AmountText.

## Files (DS contract — per `contributing-a-component`)

- `packages/ui/src/finance/CategoryBreakdown.tsx`
- `packages/ui/src/finance/CategoryBreakdown.css` (the only new CSS — layout grid)
- `packages/ui/src/finance/CategoryBreakdown.test.tsx`
- `packages/ui/src/finance/CategoryBreakdown.card.html` (gallery card)
- `packages/ui/src/finance/CategoryBreakdown.prompt.md`
- Barrel export + Storybook entry; must pass `scripts/validate.mjs`.

## Non-goals (YAGNI)

- No internal sorting, filtering, or paging.
- No tooltips/legends/axis.
- No animation beyond Progress's built-in width transition.
- No per-row custom bar colors (bar is the single hero gradient; only the pill
  tint is overridable via `row.color`).
