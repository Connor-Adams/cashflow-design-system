import * as React from 'react'
import './Card.css'

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

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, style, children, ...props },
  ref,
): React.JSX.Element {
  return (
    <div
      ref={ref}
      data-slot="card"
      className={className ? `ca-card ${className}` : 'ca-card'}
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
})

export const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(function CardHeader(
  { className, style, children, ...props },
  ref,
): React.JSX.Element {
  return (
    <div
      ref={ref}
      data-slot="card-header"
      className={className ? `ca-card-header ${className}` : 'ca-card-header'}
      style={{ display: 'grid', gap: 6, marginBottom: 12, ...style }}
      {...props}
    >
      {children}
    </div>
  )
})

export const CardTitle = React.forwardRef<HTMLDivElement, CardProps>(function CardTitle(
  { className, style, children, ...props },
  ref,
): React.JSX.Element {
  return (
    <div
      ref={ref}
      data-slot="card-title"
      className={className ? `ca-card-title ${className}` : 'ca-card-title'}
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
})

export const CardDescription = React.forwardRef<HTMLDivElement, CardProps>(function CardDescription(
  { className, style, children, ...props },
  ref,
): React.JSX.Element {
  return (
    <div
      ref={ref}
      data-slot="card-description"
      className={className ? `ca-card-description ${className}` : 'ca-card-description'}
      style={{ fontSize: 'var(--text-body)', color: 'var(--muted-foreground)', lineHeight: 1.5, ...style }}
      {...props}
    >
      {children}
    </div>
  )
})

export const CardContent = React.forwardRef<HTMLDivElement, CardProps>(function CardContent(
  { className, style, children, ...props },
  ref,
): React.JSX.Element {
  return (
    <div
      ref={ref}
      data-slot="card-content"
      className={className ? `ca-card-content ${className}` : 'ca-card-content'}
      style={style}
      {...props}
    >
      {children}
    </div>
  )
})
