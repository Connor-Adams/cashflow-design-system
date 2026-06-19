import * as React from 'react'

export interface PeriodPreset {
  value: string
  label: string
}

/**
 * Ledger date-range control — preset periods in a popover, with an optional
 * custom from/to range. Controlled via `value` + `onValueChange`. When `value`
 * is "custom", two date inputs appear and `onCustomChange` fires with
 * { from, to } ISO strings.
 */
export interface PeriodSelectorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string
  onValueChange?: (value: string) => void
  custom?: { from?: string; to?: string }
  onCustomChange?: (range: { from?: string; to?: string }) => void
  presets?: PeriodPreset[]
  size?: 'sm' | 'default'
}
export declare function PeriodSelector(props: PeriodSelectorProps): React.JSX.Element
