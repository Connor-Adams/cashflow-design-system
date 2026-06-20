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
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 20,
        height: 20,
        padding: '0 5px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border)',
        borderBottomWidth: 2,
        background: 'var(--muted)',
        color: 'var(--muted-foreground)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        lineHeight: 1,
        ...style,
      }}
      {...props}
    >
      {children}
    </kbd>
  )
})
