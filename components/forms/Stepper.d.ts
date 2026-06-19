import * as React from 'react'

/**
 * Compact numeric stepper with −/+ buttons and a mono readout. Controlled via
 * `value` + `onValueChange`, or uncontrolled via `defaultValue`. Clamps to
 * `min`/`max`; `format` renders units (e.g. days, ×).
 */
export interface StepperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  size?: 'sm' | 'default'
  format?: (value: number) => React.ReactNode
}
export declare function Stepper(props: StepperProps): React.JSX.Element
