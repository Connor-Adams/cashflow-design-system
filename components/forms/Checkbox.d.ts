import * as React from 'react'

/**
 * Square checkbox with oxblood fill + white check. `indeterminate` renders a
 * dash for partial "select all" states. Controlled via `checked` +
 * `onCheckedChange`, or uncontrolled via `defaultChecked`.
 */
export interface CheckboxProps {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  indeterminate?: boolean
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}
export declare function Checkbox(props: CheckboxProps): React.JSX.Element
