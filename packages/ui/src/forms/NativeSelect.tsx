import * as React from 'react'
import './NativeSelect.css'

export type SelectOption = string | { value: string; label: string }

/**
 * Native select with Cashflow's input treatment. Pass `options` (strings or
 * {value,label}) or `<option>` children. `sm` for dense filter bars.
 *
 * Interactive states (focus-visible ring, disabled) live in `NativeSelect.css`;
 * the ref forwards to the native `<select>` for react-hook-form / `focus()`.
 */
export interface NativeSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: 'default' | 'sm'
  options?: SelectOption[]
}

export const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  function NativeSelect(
    { className, size = 'default', options, children, ...props },
    ref,
  ): React.JSX.Element {
    return (
      <select
        ref={ref}
        data-slot="native-select"
        data-size={size}
        className={className ? `ca-native-select ${className}` : 'ca-native-select'}
        {...props}
      >
        {options
          ? options.map((o) => {
              const value = typeof o === 'string' ? o : o.value
              const label = typeof o === 'string' ? o : o.label
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              )
            })
          : children}
      </select>
    )
  },
)
