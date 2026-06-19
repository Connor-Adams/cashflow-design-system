import * as React from 'react'

export interface ToggleItem {
  value: string
  label: React.ReactNode
  icon?: React.ReactNode
}

/**
 * Segmented control. `type="single"` selects one option (active segment lifts
 * to a card surface); `type="multiple"` toggles several. Controlled via `value`
 * + `onValueChange`, or uncontrolled via `defaultValue`. Value is a string for
 * single, string[] for multiple.
 */
export interface ToggleGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  items: ToggleItem[]
  type?: 'single' | 'multiple'
  value?: string | string[] | null
  defaultValue?: string | string[] | null
  onValueChange?: (value: string | string[] | null) => void
  size?: 'sm' | 'default'
}
export declare function ToggleGroup(props: ToggleGroupProps): React.JSX.Element
