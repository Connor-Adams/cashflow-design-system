import * as React from 'react'

/**
 * Signed currency amount in the mono face, with load-bearing money color:
 * green (`--positive`) in, oxblood (`--negative`) out. Sign is inferred from
 * `value` unless `direction` is given. `colored={false}` renders neutral.
 * Uses Intl.NumberFormat for `currency` + `locale`.
 */
export interface AmountTextProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  value: number
  currency?: string
  locale?: string
  direction?: 'in' | 'out' | 'zero'
  colored?: boolean
  showSign?: boolean
  decimals?: number
  size?: 'sm' | 'default' | 'lg' | 'xl' | number
  weight?: 'regular' | 'medium' | 'semibold' | 'bold'
}
export declare function AmountText(props: AmountTextProps): React.JSX.Element
