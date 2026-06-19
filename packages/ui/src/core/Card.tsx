import * as React from 'react'

/**
 * Cashflow Card and its sub-parts. A raised surface: white --card fill,
 * --border hairline, rounded-lg, light --shadow. The default elevation unit
 * for the whole app — keep it light.
 */

/**
 * Raised surface — the app's default elevation unit. White `--card` fill,
 * `--border` hairline, `rounded-lg`, light `--shadow`. Compose with the
 * sub-parts; keep elevation light (no heavy drop shadows).
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, style, children, ...props }: CardProps): React.JSX.Element {
  return (
    <div
      data-slot="card"
      className={className}
      style={{
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        background: 'var(--card)',
        color: 'var(--card-foreground)',
        boxShadow: 'var(--shadow)',
        padding: 20,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, style, children, ...props }: CardProps): React.JSX.Element {
  return (
    <div
      data-slot="card-header"
      className={className}
      style={{ display: 'grid', gap: 6, marginBottom: 12, ...style }}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({ className, style, children, ...props }: CardProps): React.JSX.Element {
  return (
    <div
      data-slot="card-title"
      className={className}
      style={{
        fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'],
        letterSpacing: '-0.01em',
        fontSize: 'var(--text-headline-sm)',
        color: 'var(--foreground)',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardDescription({ className, style, children, ...props }: CardProps): React.JSX.Element {
  return (
    <div
      data-slot="card-description"
      className={className}
      style={{ fontSize: 'var(--text-body)', color: 'var(--muted-foreground)', lineHeight: 1.5, ...style }}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardContent({ className, style, children, ...props }: CardProps): React.JSX.Element {
  return (
    <div data-slot="card-content" className={className} style={style} {...props}>
      {children}
    </div>
  )
}
