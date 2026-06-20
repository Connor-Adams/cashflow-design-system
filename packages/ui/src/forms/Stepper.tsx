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

export function Stepper({ value, defaultValue = 0, onValueChange, min = -Infinity, max = Infinity, step = 1, disabled, size = 'default', format, className, style, ...props }: StepperProps): React.JSX.Element {
  const [internal, setInternal] = React.useState(defaultValue)
  const isControlled = value !== undefined
  const v = isControlled ? value : internal

  const clamp = (n: number) => Math.min(max, Math.max(min, n))
  const set = (n: number) => {
    const next = clamp(n)
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  const h = size === 'sm' ? 30 : 34
  const btn = (label: string, onClick: () => void, disabledBtn: boolean) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || disabledBtn}
      aria-label={label === '−' ? 'Decrease' : 'Increase'}
      style={{
        width: h, height: h, flex: 'none', border: 'none', background: 'transparent',
        color: 'var(--foreground)', fontSize: 18, lineHeight: 1 as React.CSSProperties['lineHeight'], cursor: (disabled || disabledBtn) ? 'not-allowed' : 'pointer',
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
      <span style={{ minWidth: 52, textAlign: 'center', padding: '0 4px', fontSize: size === 'sm' ? 'var(--text-body-sm)' : 'var(--text-body)', fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'], color: 'var(--foreground)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', alignSelf: 'stretch', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        {format ? format(v) : v}
      </span>
      {btn('+', () => set(v + step), v >= max)}
    </div>
  )
}
