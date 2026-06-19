import React from 'react'

/**
 * Cashflow Spinner. A token-colored ring that spins. `size` in px (or a
 * named step); `tone` picks the stroke color. Inherits currentColor by default
 * so it tints to its context (e.g. inside a primary Button).
 */
const SIZES = { sm: 14, default: 18, lg: 28 }
const TONES = {
  current: 'currentColor',
  primary: 'var(--primary)',
  muted: 'var(--muted-foreground)',
}

export function Spinner({ size = 'default', tone = 'current', label = 'Loading', className, style, ...props }) {
  const px = typeof size === 'number' ? size : (SIZES[size] || SIZES.default)
  const color = TONES[tone] || tone
  return (
    <span
      data-slot="spinner"
      role="status"
      aria-label={label}
      className={className}
      style={{ display: 'inline-block', width: px, height: px, ...style }}
      {...props}
    >
      <svg width={px} height={px} viewBox="0 0 24 24" fill="none" style={{ display: 'block', animation: 'cf-spin 0.7s linear infinite' }}>
        <circle cx="12" cy="12" r="9" stroke={color} strokeOpacity="0.22" strokeWidth="3" />
        <path d="M12 3 a9 9 0 0 1 9 9" stroke={color} strokeWidth="3" strokeLinecap="round" />
      </svg>
      <style>{'@keyframes cf-spin{to{transform:rotate(360deg)}}'}</style>
    </span>
  )
}
