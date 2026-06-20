import * as React from 'react'
import './Badge.css'

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
 *
 * Variant styling lives in `Badge.css`, keyed off `data-variant`.
 */

/**
 * Small status / category / count pill. `default` is the oxblood brand fill;
 * `secondary` is the neutral workhorse; `count` is the uppercase counter chip.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'default', className, children, ...props },
  ref,
): React.JSX.Element {
  return (
    <span
      ref={ref}
      data-slot="badge"
      data-variant={variant}
      className={className ? `ca-badge ${className}` : 'ca-badge'}
      {...props}
    >
      {children}
    </span>
  )
})
