import * as React from 'react'

/**
 * Single-value range slider — oxblood fill, card thumb. Controlled via `value`
 * + `onValueChange`, or uncontrolled via `defaultValue`. `showValue` prints the
 * current value; pass `format` to format it (e.g. as currency).
 */
export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  min?: number
  max?: number
  step?: number
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  disabled?: boolean
  showValue?: boolean
  format?: (value: number) => React.ReactNode
}
export declare function Slider(props: SliderProps): React.JSX.Element
