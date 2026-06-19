import * as React from 'react'

/**
 * Determinate progress bar (0–100) over a muted track, semantic fill tone.
 * Set `indeterminate` for an unknown-duration sweep. Optional `label` and a
 * `showValue` percentage readout.
 */
export interface ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  value?: number
  tone?: 'primary' | 'success' | 'warning' | 'danger' | (string & {})
  size?: 'sm' | 'default' | 'lg'
  indeterminate?: boolean
  label?: React.ReactNode
  showValue?: boolean
}
export declare function Progress(props: ProgressProps): React.JSX.Element
