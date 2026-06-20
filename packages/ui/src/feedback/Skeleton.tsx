import * as React from 'react'
import './Skeleton.css'

/** Loading placeholder with the hero-gradient shimmer sweep. */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  w?: number | string
  h?: number | string
}

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number
}

/**
 * Cashflow Skeleton. A muted block with the 1.6s hero-gradient shimmer sweep,
 * disabled under `prefers-reduced-motion`. Provide width/height via style or
 * the w/h props. SkeletonText renders N lines with the last line at 2/3 width.
 *
 * Shimmer + base styling live in `Skeleton.css` keyed off the `ca-skeleton`
 * base class; the legacy global `skeleton-shimmer` class is kept for back-compat.
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { className, style, w, h = 16, ...props },
  ref,
): React.JSX.Element {
  return (
    <div
      ref={ref}
      data-slot="skeleton"
      className={className ? `ca-skeleton skeleton-shimmer ${className}` : 'ca-skeleton skeleton-shimmer'}
      style={{ width: w || '100%', height: h, ...style }}
      {...props}
    />
  )
})

export const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(function SkeletonText(
  { lines = 3, className, style, ...props },
  ref,
): React.JSX.Element {
  return (
    <div
      ref={ref}
      data-slot="skeleton-text"
      className={className ? `ca-skeleton-text ${className}` : 'ca-skeleton-text'}
      style={style}
      {...props}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} h={12} w={i === lines - 1 ? '66%' : '100%'} />
      ))}
    </div>
  )
})
