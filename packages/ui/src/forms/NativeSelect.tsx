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

export function NativeSelect({ className, style, size = 'default', options, children, ...props }: NativeSelectProps): React.JSX.Element {
  const [focus, setFocus] = React.useState(false)
  return (
    <select
      data-slot="native-select"
      className={className}
      onFocus={(e) => { setFocus(true); props.onFocus?.(e) }}
      onBlur={(e) => { setFocus(false); props.onBlur?.(e) }}
      style={{
        minHeight: size === 'sm' ? 30 : 34,
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${focus ? 'var(--ring)' : 'var(--input)'}`,
        background: 'color-mix(in oklch, var(--background) 70%, transparent)',
        padding: size === 'sm' ? '0 8px' : '0 12px',
        fontSize: size === 'sm' ? 'var(--text-body-sm)' : 'var(--text-body)',
        fontFamily: 'var(--font-sans)',
        color: 'var(--foreground)',
        outline: 'none',
        boxShadow: focus ? `0 0 0 3px color-mix(in oklch, var(--ring) 35%, transparent)` : 'none',
        transition: 'border-color 150ms, box-shadow 150ms',
        ...style,
      }}
      {...props}
    >
      {options
        ? options.map((o) => {
            const value = typeof o === 'string' ? o : o.value
            const label = typeof o === 'string' ? o : o.label
            return <option key={value} value={value}>{label}</option>
          })
        : children}
    </select>
  )
}
