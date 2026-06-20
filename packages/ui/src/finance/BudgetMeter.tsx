import * as React from 'react'
import './BudgetMeter.css'

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

export const BudgetMeter = React.forwardRef<HTMLDivElement, BudgetMeterProps>(function BudgetMeter(
  { label, spent = 0, limit = 0, currency = 'CAD', locale = 'en-CA', warnAt = 0.85, className, style, ...props },
  ref,
): React.JSX.Element {
  const ratio = limit > 0 ? spent / limit : 0
  const pct = Math.min(100, Math.max(0, ratio * 100))
  const over = spent > limit
  const near = !over && ratio >= warnAt
  const tone = over ? 'over' : near ? 'near' : 'under'
  const fill = over ? 'var(--negative)' : near ? 'var(--warning)' : 'var(--positive)'
  const remaining = limit - spent

  const fmt = (n: number): string => {
    try { return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(n) }
    catch (e) { return `${currency} ${Math.round(n)}` }
  }

  return (
    <div ref={ref} data-slot="budget-meter" data-tone={tone} className={className ? `ca-budget-meter ${className}` : 'ca-budget-meter'} style={style} {...props}>
      <div className="ca-budget-meter-head">
        <span className="ca-budget-meter-label">{label}</span>
        <span className="ca-budget-meter-readout">
          <span className="ca-budget-meter-spent">{fmt(spent)}</span> / {fmt(limit)}
        </span>
      </div>
      <div className="ca-budget-meter-track">
        <span data-slot="budget-meter-fill" style={{ width: `${pct}%`, background: fill }} />
      </div>
      <span className="ca-budget-meter-foot">
        {over ? `${fmt(Math.abs(remaining))} over budget` : `${fmt(remaining)} left`}
      </span>
    </div>
  )
})
