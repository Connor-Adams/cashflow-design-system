import * as React from 'react'

export type MetricKind = 'gain' | 'spend' | 'neutral'

/**
 * KPI tile: uppercase label, large value, optional hint, and a signed delta
 * colored by Cashflow's money semantics. `metricKind` decides whether "up" is
 * good: `gain` (up=green), `spend` (up=red, inverted), `neutral` (always muted).
 */
export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode
  value: React.ReactNode
  hint?: React.ReactNode
  /** Signed string, e.g. "+12%" or "-$340". */
  delta?: React.ReactNode
  metricKind?: MetricKind
}
export declare function StatCard(props: StatCardProps): React.JSX.Element
export declare function resolveDeltaTone(
  sign: 'positive' | 'negative' | 'neutral',
  kind: MetricKind
): 'positive' | 'negative' | 'neutral'
