import * as React from 'react'
import './Button.css'

export type ButtonVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'danger'
  | 'link'

export type ButtonSize = 'sm' | 'default' | 'lg' | 'icon'

/**
 * Primary action control. Solid oxblood `primary` for the main CTA; neutral
 * `secondary`/`outline`/`ghost` for everything else; tinted `destructive` for
 * delete actions. Greyscale by default — oxblood is precious. All colors reach
 * through the semantic token layer — no raw hex.
 *
 * Interactive states (hover, focus-visible ring, active, disabled) live in
 * `Button.css`, not JS — keyboard focus is visible and consumers can override
 * styling with their own classes.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual treatment. Default solid oxblood. */
  variant?: ButtonVariant
  /** Control height. `icon` is a 40×40 square. */
  size?: ButtonSize
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'default', size = 'default', type = 'button', className, children, ...props },
  ref,
): React.JSX.Element {
  return (
    <button
      ref={ref}
      type={type}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={className ? `ca-btn ${className}` : 'ca-btn'}
      {...props}
    >
      {children}
    </button>
  )
})
