import * as React from 'react'
import './Checkbox.css'

/**
 * Square checkbox with oxblood fill + white check. `indeterminate` renders a
 * dash for partial "select all" states. Controlled via `checked` +
 * `onCheckedChange`, or uncontrolled via `defaultChecked`.
 *
 * Interactive states (focus-visible ring, checked fill, disabled) live in
 * `Checkbox.css`, keyed off `data-state`. The ref forwards to the underlying
 * `button[role=checkbox]` for focus management.
 */
export interface CheckboxProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'defaultChecked'> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  indeterminate?: boolean
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { checked, defaultChecked, onCheckedChange, disabled, indeterminate, className, ...props },
  ref,
): React.JSX.Element {
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
      ref={ref}
      type="button"
      role="checkbox"
      data-slot="checkbox"
      data-state={indeterminate ? 'indeterminate' : on ? 'checked' : 'unchecked'}
      aria-checked={indeterminate ? 'mixed' : on}
      disabled={disabled}
      onClick={toggle}
      className={className ? `ca-checkbox ${className}` : 'ca-checkbox'}
      {...props}
    >
      {indeterminate ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14" /></svg>
      ) : active ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
      ) : null}
    </button>
  )
})
