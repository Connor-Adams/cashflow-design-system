import * as React from 'react'
import './Tooltip.css'

/**
 * Hover/focus tooltip. Wrap any trigger; `content` is the bubble, `side`
 * positions it around the trigger. Bubble is non-interactive (pointer-events
 * none) and appears on both mouse hover and keyboard focus.
 *
 * Show/hide is behavior, so it stays in JS (mouse + focus events). Positioning
 * and visuals live in `Tooltip.css`, keyed off `data-side`.
 */
export interface TooltipProps {
  content: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

/**
 * Cashflow Tooltip. Wraps a trigger; shows a small --popover bubble on hover
 * and keyboard focus. `content` is the bubble text/node; `side` positions it.
 */
export const Tooltip = React.forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip(
  { content, side = 'top', className, style, children, ...props },
  ref,
): React.JSX.Element {
  const [show, setShow] = React.useState(false)

  return (
    <span
      ref={ref}
      data-slot="tooltip"
      className={className ? `ca-tooltip ${className}` : 'ca-tooltip'}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      style={style}
      {...props}
    >
      {children}
      {show && (
        <span role="tooltip" data-side={side} className="ca-tooltip-bubble">
          {content}
        </span>
      )}
    </span>
  )
})
