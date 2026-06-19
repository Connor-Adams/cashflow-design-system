import React from 'react'

/**
 * Cashflow Checkbox. 18px square, --input border, fills oxblood --primary with
 * a white check when on. Supports `indeterminate` (dash) for "select all" rows.
 * Controlled (`checked` + `onCheckedChange`) or uncontrolled (`defaultChecked`).
 */
export function Checkbox({ checked, defaultChecked, onCheckedChange, disabled, indeterminate, className, style, ...props }) {
  const [internal, setInternal] = React.useState(defaultChecked || false)
  const isControlled = checked !== undefined
  const on = isControlled ? checked : internal
  const active = on || indeterminate

  const toggle = () => {
    if (disabled) return
    const next = !on
    if (!isControlled) setInternal(next)
    onCheckedChange?.(next)
  }

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : on}
      disabled={disabled}
      onClick={toggle}
      className={className}
      style={{
        width: 18,
        height: 18,
        flex: 'none',
        padding: 0,
        borderRadius: 'var(--radius-sm)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${active ? 'var(--primary)' : 'var(--input)'}`,
        background: active ? 'var(--primary)' : 'color-mix(in oklch, var(--background) 70%, transparent)',
        color: 'var(--primary-foreground)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background-color 150ms, border-color 150ms',
        ...style,
      }}
      {...props}
    >
      {indeterminate ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14" /></svg>
      ) : on ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
      ) : null}
    </button>
  )
}
