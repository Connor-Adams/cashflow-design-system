import React from 'react'

/**
 * Cashflow Radio group. Renders a vertical (or horizontal) set of options;
 * the selected dot fills oxblood --primary. Pass `options` (strings or
 * {value,label}) and control with `value` + `onValueChange`.
 */
export function RadioGroup({ options = [], value, defaultValue, onValueChange, name, orientation = 'vertical', disabled, className, style, ...props }) {
  const [internal, setInternal] = React.useState(defaultValue)
  const isControlled = value !== undefined
  const selected = isControlled ? value : internal
  const groupName = React.useMemo(() => name || `radio-${Math.random().toString(36).slice(2, 8)}`, [name])

  const pick = (v) => {
    if (disabled) return
    if (!isControlled) setInternal(v)
    onValueChange?.(v)
  }

  return (
    <div
      role="radiogroup"
      className={className}
      style={{
        display: 'flex',
        flexDirection: orientation === 'horizontal' ? 'row' : 'column',
        gap: orientation === 'horizontal' ? 20 : 10,
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...props}
    >
      {options.map((o) => {
        const v = typeof o === 'string' ? o : o.value
        const label = typeof o === 'string' ? o : o.label
        const on = selected === v
        return (
          <label
            key={v}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
              fontSize: 'var(--text-body)',
              color: 'var(--foreground)',
            }}
          >
            <button
              type="button"
              role="radio"
              name={groupName}
              aria-checked={on}
              disabled={disabled}
              onClick={() => pick(v)}
              style={{
                width: 18,
                height: 18,
                flex: 'none',
                padding: 0,
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${on ? 'var(--primary)' : 'var(--input)'}`,
                background: 'color-mix(in oklch, var(--background) 70%, transparent)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'border-color 150ms',
              }}
            >
              {on ? <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} /> : null}
            </button>
            {label}
          </label>
        )
      })}
    </div>
  )
}
