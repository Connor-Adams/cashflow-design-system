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
export declare function BudgetMeter(props: BudgetMeterProps): React.JSX.Element
