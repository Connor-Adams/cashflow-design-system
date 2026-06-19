import * as React from 'react'

export type SelectOption = string | { value: string; label: string }

/**
 * Native select with Cashflow's input treatment. Pass `options` (strings or
 * {value,label}) or `<option>` children. `sm` for dense filter bars.
 */
export interface NativeSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: 'default' | 'sm'
  options?: SelectOption[]
}
export declare function NativeSelect(props: NativeSelectProps): React.JSX.Element
