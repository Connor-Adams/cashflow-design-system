import * as React from 'react'
import './Spinner.css'

/**
 * Cashflow Spinner. A token-colored ring that spins. `size` in px (or a named
 * step); `tone` picks the stroke. Solid tones (`current`/`primary`/`muted`)
 * paint a flat arc; `current` inherits currentColor so it tints to its context
 * (e.g. inside a primary Button). The `gradient-*` tones fade their color to
 * transparent for a comet-trail; `hero` sweeps the warm orange→pink hero
 * gradient. The spin animation respects prefers-reduced-motion.
 */

const SIZES: Record<string, number> = { sm: 14, default: 18, lg: 28 }

// Solid tones → a single flat stroke color.
const SOLID: Record<string, string> = {
  current: 'currentColor',
  primary: 'var(--primary)',
  muted: 'var(--muted-foreground)',
}

// Gradient tones → ordered arc stops [offset, color, opacity], head → tail.
// The head sits at the leading edge of the clockwise spin and the tail fades
// out, giving the comet-trail look. `hero` shows both hero colors before the
// tail dissolves.
type Stop = [string, string, string]
const GRADIENT_STOPS: Record<string, Stop[]> = {
  'gradient-current': [['0%', 'currentColor', '1'], ['100%', 'currentColor', '0']],
  'gradient-primary': [['0%', 'var(--primary)', '1'], ['100%', 'var(--primary)', '0']],
  'gradient-muted': [['0%', 'var(--muted-foreground)', '1'], ['100%', 'var(--muted-foreground)', '0']],
  hero: [
    ['0%', 'var(--gradient-hero-from)', '1'],
    ['60%', 'var(--gradient-hero-to)', '1'],
    ['100%', 'var(--gradient-hero-to)', '0'],
  ],
}

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'default' | 'lg' | number
  tone?:
    | 'current'
    | 'primary'
    | 'muted'
    | 'gradient-current'
    | 'gradient-primary'
    | 'gradient-muted'
    | 'hero'
    | (string & {})
  label?: string
}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'default', tone = 'current', label = 'Loading', className, style, ...props },
  ref,
): React.JSX.Element {
  const px = typeof size === 'number' ? size : (SIZES[size] || SIZES['default']!)
  const gradientId = `ca-spinner-${React.useId()}`
  const stops = GRADIENT_STOPS[tone]
  // Head color drives the faint track ring whether the arc is solid or gradient.
  const headColor = stops ? stops[0]![1] : (SOLID[tone] || tone)
  const arcStroke = stops ? `url(#${gradientId})` : headColor
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
        {stops && (
          <defs>
            <linearGradient id={gradientId} x1="21" y1="12" x2="12" y2="3" gradientUnits="userSpaceOnUse">
              {stops.map(([offset, color, opacity]) => (
                <stop key={offset} offset={offset} stopColor={color} stopOpacity={opacity} />
              ))}
            </linearGradient>
          </defs>
        )}
        <circle cx="12" cy="12" r="9" stroke={headColor} strokeOpacity="0.22" strokeWidth="3" />
        <path d="M12 3 a9 9 0 0 1 9 9" stroke={arcStroke} strokeWidth="3" strokeLinecap="round" />
      </svg>
    </span>
  )
})
