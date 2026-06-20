import * as React from 'react'
import './Kbd.css'

/**
 * Cashflow Kbd. A small keycap for keyboard shortcuts — mono, bordered, with a
 * subtle bottom edge so it reads as a physical key.
 */

/** A keycap for keyboard shortcuts — mono, bordered, weighted bottom edge. */
export interface KbdProps extends React.HTMLAttributes<HTMLElement> {}

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(function Kbd(
  { className, style, children, ...props },
  ref,
): React.JSX.Element {
  return (
    <kbd
      ref={ref}
      data-slot="kbd"
      className={className ? `ca-kbd ${className}` : 'ca-kbd'}
      style={style}
      {...props}
    >
      {children}
    </kbd>
  )
})
