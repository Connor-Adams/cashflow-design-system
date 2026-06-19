import * as React from 'react'

export type ComboboxOption = string | { value: string; label: string; hint?: string }

/**
 * Searchable single-select. Type to filter the option list; choose to commit.
 * Controlled via `value` + `onValueChange`, or uncontrolled via `defaultValue`.
 * Options may carry a `hint` (right-aligned mono note). For a short static list
 * use NativeSelect instead.
 */
export interface ComboboxProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  options: ComboboxOption[]
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string) => void
  placeholder?: string
  emptyText?: string
  size?: 'sm' | 'default'
}
export declare function Combobox(props: ComboboxProps): React.JSX.Element
