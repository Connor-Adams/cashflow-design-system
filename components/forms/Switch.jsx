import React from 'react'

/**
 * Cashflow Switch. A pill track that fills oxblood --primary when on; the
 * --card thumb slides with a soft shadow. Controlled (`checked` +
 * `onCheckedChange`) or uncontrolled (`defaultChecked`).
 */
export function Switch({ checked, defaultChecked, onCheckedChange, disabled, size = 'default', className, style, ...props }) {
  const [internal, setInternal] = React.useState(defaultChecked || false)
  const isControlled = checked !== undefined
  const on = isControlled ? checked : internal

  const W = size === 'sm' ? 32 : 38
  const H = size === 'sm' ? 18 : 22
  const D = H - 4

  const toggle = () => {
    if (disabled) return
    const next = !on
    if (!isControlled) setInternal(next)
    onCheckedChange?.(next)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={toggle}
      className={className}
      style={{
        position: 'relative',
        width: W,
        height: H,
        flex: 'none',
        borderRadius: H,
        border: 'none',
        padding: 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        background: on ? 'var(--primary)' : 'color-mix(in oklch, var(--muted-foreground) 35%, transparent)',
        transition: 'background-color 150ms',
        ...style,
      }}
      {...props}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: 2,
          width: D,
          height: D,
          borderRadius: '50%',
          background: 'var(--card)',
          boxShadow: 'var(--shadow)',
          transform: on ? `translateX(${W - D - 4}px)` : 'translateX(0)',
          transition: 'transform 150ms',
        }}
      />
    </button>
  )
}
