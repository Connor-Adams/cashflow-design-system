import * as React from 'react'

export type RadioOption = string | { value: string; label: string }

/**
 * Radio group — single-choice list with an oxblood selected dot. Pass
 * `options` (strings or {value,label}); control with `value` + `onValueChange`,
 * or uncontrolled via `defaultValue`. `orientation="horizontal"` for inline.
 */
export interface RadioGroupProps {
  options: RadioOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  orientation?: 'vertical' | 'horizontal'
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}
export declare function RadioGroup(props: RadioGroupProps): React.JSX.Element
