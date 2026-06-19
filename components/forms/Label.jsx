import React from 'react'

/**
 * Cashflow field Label — sits ABOVE its control. Uppercase-ish semibold muted
 * caption. Wrap a control as a child to get the label + field stack.
 */
export function Label({ className, style, children, ...props }) {
  return (
    <label
      data-slot="label"
      className={className}
      style={{
        display: 'grid',
        gap: 4,
        fontSize: '0.82rem',
        fontWeight: 'var(--weight-semibold)',
        color: 'var(--muted-foreground)',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...props}
    >
      {children}
    </label>
  )
}
