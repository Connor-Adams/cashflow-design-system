import * as React from 'react'

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'count'

/**
 * Cashflow Badge / Tag. A small pill for status and counts. `default` wears
 * the oxblood brand fill; `secondary` is a neutral muted chip; `outline` is a
 * hairline; `count` is the uppercase counter pill.
 */

/**
 * Small status / category / count pill. `default` is the oxblood brand fill;
 * `secondary` is the neutral workhorse; `count` is the uppercase counter chip.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export function Badge({ variant = 'default', className, style, children, ...props }: BadgeProps): React.JSX.Element {
  const variants: Record<BadgeVariant, React.CSSProperties> = {
    default: { background: 'var(--primary)', color: 'var(--primary-foreground)', border: '1px solid transparent' },
    secondary: { background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid transparent' },
    destructive: { background: 'var(--destructive)', color: 'var(--destructive-foreground)', border: '1px solid transparent' },
    outline: { background: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)' },
    success: { background: 'var(--success-bg)', color: 'var(--success-foreground)', border: '1px solid transparent' },
    count: {
      background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--border)',
      textTransform: 'uppercase', fontWeight: 'var(--weight-bold)' as React.CSSProperties['fontWeight'], fontSize: '0.68rem',
      padding: '4px 10px',
    },
  }
  const v = variants[variant] || variants.default
  return (
    <span
      data-slot="badge"
      data-variant={variant}
      className={className}
      style={{
        display: 'inline-flex',
        width: 'fit-content',
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        borderRadius: 'var(--radius-md)',
        padding: '2px 8px',
        fontSize: 'var(--text-body-sm)',
        fontWeight: 'var(--weight-medium)' as React.CSSProperties['fontWeight'],
        fontFamily: 'var(--font-sans)',
        lineHeight: 1.25,
        whiteSpace: 'nowrap',
        ...v,
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  )
}
