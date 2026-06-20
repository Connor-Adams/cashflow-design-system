import * as React from 'react'

/**
 * A budget row: label, spent / limit readout, and a bar that goes green →
 * amber (near `warnAt`, default 0.85) → oxblood (over). Derives tone and the
 * "X left / X over budget" line automatically from `spent` and `limit`.
 */
export interface BudgetMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode
  spent: number
  limit: number
  currency?: string
  locale?: string
  warnAt?: number
}

export function BudgetMeter({ label, spent = 0, limit = 0, currency = 'CAD', locale = 'en-CA', warnAt = 0.85, className, style, ...props }: BudgetMeterProps): React.JSX.Element {
  const ratio = limit > 0 ? spent / limit : 0
  const pct = Math.min(100, Math.max(0, ratio * 100))
  const over = spent > limit
  const near = !over && ratio >= warnAt
  const fill = over ? 'var(--negative)' : near ? 'var(--warning)' : 'var(--positive)'
  const remaining = limit - spent

  const fmt = (n: number): string => {
    try { return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(n) }
    catch (e) { return `${currency} ${Math.round(n)}` }
  }

  return (
    <div data-slot="budget-meter" className={className} style={{ display: 'flex', flexDirection: 'column', gap: 7, width: '100%', fontFamily: 'var(--font-sans)', ...style }} {...props}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'] }}>{label}</span>
        <span style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)' }}>
          <span style={{ color: over ? 'var(--negative)' : 'var(--foreground)', fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'] }}>{fmt(spent)}</span> / {fmt(limit)}
        </span>
      </div>
      <div style={{ position: 'relative', overflow: 'hidden', height: 8, width: '100%', borderRadius: 99, background: 'var(--muted)' }}>
        <span style={{ display: 'block', height: '100%', width: `${pct}%`, borderRadius: 99, background: fill, transition: 'width 300ms ease' }} />
      </div>
      <span style={{ fontSize: 'var(--text-body-sm)', color: over ? 'var(--negative)' : 'var(--muted-foreground)' }}>
        {over ? `${fmt(Math.abs(remaining))} over budget` : `${fmt(remaining)} left`}
      </span>
    </div>
  )
}
