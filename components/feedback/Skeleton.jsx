import React from 'react'

/**
 * Cashflow Skeleton. A muted block with the 1.6s hero-gradient shimmer sweep
 * (the .skeleton-shimmer class ships in the global stylesheet). Provide
 * width/height via style or the w/h props. SkeletonText renders N lines with
 * the last line at 2/3 width.
 */
export function Skeleton({ className, style, w, h = 16, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={`skeleton-shimmer ${className || ''}`}
      style={{ width: w || '100%', height: h, borderRadius: 'var(--radius-md)', ...style }}
      {...props}
    />
  )
}

export function SkeletonText({ lines = 3, style, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} h={12} w={i === lines - 1 ? '66%' : '100%'} />
      ))}
    </div>
  )
}
