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
      style={style}
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
      style={style}
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
      style={style}
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
      style={style}
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
