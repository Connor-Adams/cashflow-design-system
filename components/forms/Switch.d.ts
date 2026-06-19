import * as React from 'react'

/**
 * Toggle switch with Cashflow's oxblood fill. Controlled via `checked` +
 * `onCheckedChange`, or uncontrolled via `defaultChecked`. `sm` for dense rows.
 */
export interface SwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  size?: 'default' | 'sm'
  className?: string
  style?: React.CSSProperties
}
export declare function Switch(props: SwitchProps): React.JSX.Element
