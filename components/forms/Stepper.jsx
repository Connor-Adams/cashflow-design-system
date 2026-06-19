import React from 'react'

/**
 * Cashflow Stepper. A compact numeric input with −/+ steppers, sharing Input's
 * border treatment. Controlled (`value` + `onValueChange`) or uncontrolled
 * (`defaultValue`). Respects `min`/`max`/`step`; pass `format` to display units.
 */
export function Stepper({ value, defaultValue = 0, onValueChange, min = -Infinity, max = Infinity, step = 1, disabled, size = 'default', format, className, style, ...props }) {
  const [internal, setInternal] = React.useState(defaultValue)
  const isControlled = value !== undefined
  const v = isControlled ? value : internal

  const clamp = (n) => Math.min(max, Math.max(min, n))
  const set = (n) => {
    const next = clamp(n)
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  const h = size === 'sm' ? 30 : 34
  const btn = (label, onClick, disabledBtn) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || disabledBtn}
      aria-label={label === '−' ? 'Decrease' : 'Increase'}
      style={{
        width: h, height: h, flex: 'none', border: 'none', background: 'transparent',
        color: 'var(--foreground)', fontSize: 18, lineHeight: 1, cursor: (disabled || disabledBtn) ? 'not-allowed' : 'pointer',
        opacity: (disabled || disabledBtn) ? 0.4 : 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}
    >{label}</button>
  )

  return (
    <div
      data-slot="stepper"
      className={className}
      style={{
        display: 'inline-flex', alignItems: 'center', height: h,
        borderRadius: 'var(--radius-md)', border: '1px solid var(--input)',
        background: 'color-mix(in oklch, var(--background) 70%, transparent)',
        opacity: disabled ? 0.6 : 1, fontFamily: 'var(--font-sans)', ...style,
      }}
      {...props}
    >
      {btn('−', () => set(v - step), v <= min)}
      <span style={{ minWidth: 52, textAlign: 'center', padding: '0 4px', fontSize: size === 'sm' ? 'var(--text-body-sm)' : 'var(--text-body)', fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-semibold)', color: 'var(--foreground)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', alignSelf: 'stretch', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        {format ? format(v) : v}
      </span>
      {btn('+', () => set(v + step), v >= max)}
    </div>
  )
}
