import * as React from 'react'

/**
 * Cashflow Spinner. A token-colored ring that spins. `size` in px (or a
 * named step); `tone` picks the stroke color. Inherits currentColor by default
 * so it tints to its context (e.g. inside a primary Button).
 */

const SIZES: Record<string, number> = { sm: 14, default: 18, lg: 28 }
const TONES: Record<string, string> = {
  current: 'currentColor',
  primary: 'var(--primary)',
  muted: 'var(--muted-foreground)',
}

/**
 * Indeterminate loading ring. `size` is a named step or a px number; `tone`
 * sets the stroke (`current` inherits, so it tints inside a Button). Always
 * carries an aria-label.
 */
export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'default' | 'lg' | number
  tone?: 'current' | 'primary' | 'muted' | (string & {})
  label?: string
}

export function Spinner({ size = 'default', tone = 'current', label = 'Loading', className, style, ...props }: SpinnerProps): React.JSX.Element {
  const px = typeof size === 'number' ? size : (SIZES[size] || SIZES['default']!)
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
