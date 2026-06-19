import * as React from 'react'

/**
 * Tiny inline trend line for KPI tiles and account rows. `data` is a series of
 * numbers, auto-scaled to the box. Tone is inferred from the trend (last vs
 * first) unless `tone` is set. Optional `area` gradient fill and end `dot`.
 */
export interface SparklineProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'data'> {
  data: number[]
  width?: number
  height?: number
  tone?: 'positive' | 'negative' | 'neutral' | 'primary'
  area?: boolean
  dot?: boolean
  strokeWidth?: number
}
export declare function Sparkline(props: SparklineProps): React.JSX.Element
