import * as React from 'react'

/**
 * Currency amount field: leading symbol, right-aligned mono amount, trailing
 * currency code, and an optional in/out direction toggle. `onValueChange`
 * receives the parsed number (or null) and the raw string. Groups digits on
 * blur. Controlled via `value` or uncontrolled via `defaultValue`.
 */
export interface MoneyInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: number | string
  defaultValue?: number | string
  onValueChange?: (value: number | null, raw: string) => void
  currency?: string
  locale?: string
  direction?: 'in' | 'out'
  onDirectionChange?: (direction: 'in' | 'out') => void
  disabled?: boolean
  invalid?: boolean
  size?: 'sm' | 'default'
  placeholder?: string
}
export declare function MoneyInput(props: MoneyInputProps): React.JSX.Element
