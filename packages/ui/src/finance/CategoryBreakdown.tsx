import * as React from 'react'
import './CategoryBreakdown.css'
import { Card } from '../core/Card'
import { Text } from '../core/Text'
import { CategoryPill } from './CategoryPill'
import { Progress } from '../core/Progress'
import { AmountText } from './AmountText'
import { Sparkline } from './Sparkline'

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
            {trend && trend.length > 1 && (
              <Sparkline data={trend} tone={trendTone} width={108} height={36} className="ca-category-breakdown__trend" />
            )}
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
