import * as React from 'react'

/**
 * Square checkbox with oxblood fill + white check. `indeterminate` renders a
 * dash for partial "select all" states. Controlled via `checked` +
 * `onCheckedChange`, or uncontrolled via `defaultChecked`.
 */
export interface CheckboxProps {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  indeterminate?: boolean
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}

export function Checkbox({ checked, defaultChecked, onCheckedChange, disabled, indeterminate, className, style, ...props }: CheckboxProps): React.JSX.Element {
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
