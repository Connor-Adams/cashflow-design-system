import React from 'react'

/**
 * Cashflow Slider. A single-value range control with an oxblood fill and a
 * --card thumb. Controlled (`value` + `onValueChange`) or uncontrolled
 * (`defaultValue`). Supports `min`/`max`/`step` and an optional value bubble.
 */
export function Slider({ min = 0, max = 100, step = 1, value, defaultValue = 0, onValueChange, disabled, showValue = false, format, className, style, ...props }) {
  const [internal, setInternal] = React.useState(defaultValue)
  const isControlled = value !== undefined
  const v = isControlled ? value : internal
  const pct = ((v - min) / (max - min)) * 100

  const onInput = (e) => {
    const next = Number(e.target.value)
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  return (
    <div data-slot="slider" className={className} style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', opacity: disabled ? 0.5 : 1, ...style }} {...props}>
      {showValue && (
        <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-semibold)', color: 'var(--foreground)', textAlign: 'right' }}>
          {format ? format(v) : v}
        </div>
      )}
      <div style={{ position: 'relative', height: 18, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: 5, borderRadius: 99, background: 'var(--muted)' }} />
        <div style={{ position: 'absolute', left: 0, width: `${pct}%`, height: 5, borderRadius: 99, background: 'var(--primary)' }} />
        <div style={{ position: 'absolute', left: `calc(${pct}% )`, transform: 'translateX(-50%)', width: 16, height: 16, borderRadius: '50%', background: 'var(--card)', border: '2px solid var(--primary)', boxShadow: 'var(--shadow)', pointerEvents: 'none' }} />
        <input
          type="range"
          min={min} max={max} step={step} value={v} disabled={disabled}
          onChange={onInput}
          style={{ position: 'absolute', left: 0, right: 0, width: '100%', height: 18, margin: 0, opacity: 0, cursor: disabled ? 'not-allowed' : 'pointer' }}
        />
      </div>
    </div>
  )
}
