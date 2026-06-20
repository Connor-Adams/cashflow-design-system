import * as React from 'react'
import './Switch.css'

/**
 * Toggle switch with Cashflow's oxblood fill. Controlled via `checked` +
 * `onCheckedChange`, or uncontrolled via `defaultChecked`. `sm` for dense rows.
 *
 * Interactive states (focus-visible ring, on/off fill, thumb position) live in
 * `Switch.css`, keyed off `data-state` / `data-size`. The ref forwards to the
 * underlying `button[role=switch]` for focus management.
 */
export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'defaultChecked'> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  size?: 'default' | 'sm'
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { checked, defaultChecked, onCheckedChange, disabled, size = 'default', className, ...props },
  ref,
): React.JSX.Element {
  const [internal, setInternal] = React.useState(defaultChecked || false)
  const isControlled = checked !== undefined
  const on = isControlled ? checked : internal

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
      role="switch"
      data-slot="switch"
      data-size={size}
      data-state={on ? 'checked' : 'unchecked'}
      aria-checked={on}
      disabled={disabled}
      onClick={toggle}
      className={className ? `ca-switch ${className}` : 'ca-switch'}
      {...props}
    >
      <span className="ca-switch-thumb" />
    </button>
  )
})
