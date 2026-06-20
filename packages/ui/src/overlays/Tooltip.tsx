import * as React from 'react'

/**
 * Hover/focus tooltip. Wrap any trigger; `content` is the bubble, `side`
 * positions it around the trigger. Bubble is non-interactive (pointer-events
 * none) and appears on both mouse hover and keyboard focus.
 */
export interface TooltipProps {
  content: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

type PlacementEntry = { css: React.CSSProperties; axis: 'x' | 'y' }

/**
 * Cashflow Tooltip. Wraps a trigger; shows a small --popover bubble on hover
 * and keyboard focus. `content` is the bubble text/node; `side` positions it.
 */
export function Tooltip({ content, side = 'top', className, style, children, ...props }: TooltipProps): React.JSX.Element {
  const [show, setShow] = React.useState(false)

  const posMap: Record<'top' | 'bottom' | 'left' | 'right', PlacementEntry> = {
    top:    { css: { bottom: '100%', left: '50%', marginBottom: 8 }, axis: 'x' },
    bottom: { css: { top: '100%', left: '50%', marginTop: 8 }, axis: 'x' },
    left:   { css: { right: '100%', top: '50%', marginRight: 8 }, axis: 'y' },
    right:  { css: { left: '100%', top: '50%', marginLeft: 8 }, axis: 'y' },
  }
  const pos = posMap[side]
  const placement = pos.css
  const bubbleTransform = pos.axis === 'x' ? 'translateX(-50%)' : 'translateY(-50%)'

  return (
    <span
      className={className}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      style={{ position: 'relative', display: 'inline-flex', ...style }}
      {...props}
    >
      {children}
      {show && (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            ...placement,
            transform: bubbleTransform,
            zIndex: 60,
            whiteSpace: 'nowrap',
            background: 'var(--popover)',
            color: 'var(--popover-foreground)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow)',
            padding: '5px 9px',
            fontSize: 'var(--text-body-sm)',
            fontFamily: 'var(--font-sans)',
            pointerEvents: 'none',
          }}
        >
          {content}
        </span>
      )}
    </span>
  )
}
