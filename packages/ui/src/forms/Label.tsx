import * as React from 'react'

/** Field label that sits ABOVE its control. Wrap the control as a child. */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className, style, children, ...props }: LabelProps): React.JSX.Element {
  return (
    <label
      data-slot="label"
      className={className}
      style={{
        display: 'grid',
        gap: 4,
        fontSize: '0.82rem',
        fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'],
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
