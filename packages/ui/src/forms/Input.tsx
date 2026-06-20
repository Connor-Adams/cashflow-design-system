import * as React from 'react'
import './Input.css'

/**
 * Single-line text field. 36px tall, `--input` border, oxblood focus ring.
 * Set `invalid` (or `aria-invalid`) for the destructive error treatment.
 *
 * Interactive states (focus-visible ring, disabled, invalid) live in
 * `Input.css`, not JS — keyboard focus is visible and the ref forwards to the
 * native `<input>` for react-hook-form / `focus()`.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref,
): React.JSX.Element {
  return (
    <input
      ref={ref}
      data-slot="input"
      aria-invalid={invalid || props['aria-invalid'] || undefined}
      className={className ? `ca-input ${className}` : 'ca-input'}
      {...props}
    />
  )
})
