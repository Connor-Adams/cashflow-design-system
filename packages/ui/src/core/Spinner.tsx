import * as React from 'react'
import './Spinner.css'

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
 * carries an aria-label. The spin animation respects prefers-reduced-motion.
 */
export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'default' | 'lg' | number
  tone?: 'current' | 'primary' | 'muted' | (string & {})
  label?: string
}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'default', tone = 'current', label = 'Loading', className, style, ...props },
  ref,
): React.JSX.Element {
  const px = typeof size === 'number' ? size : (SIZES[size] || SIZES['default']!)
  const color = TONES[tone] || tone
  return (
    <span
      ref={ref}
      data-slot="spinner"
      role="status"
      aria-label={label}
      className={className ? `ca-spinner ${className}` : 'ca-spinner'}
      style={{ width: px, height: px, ...style }}
      {...props}
    >
      <svg width={px} height={px} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={color} strokeOpacity="0.22" strokeWidth="3" />
        <path d="M12 3 a9 9 0 0 1 9 9" stroke={color} strokeWidth="3" strokeLinecap="round" />
      </svg>
    </span>
  )
})
