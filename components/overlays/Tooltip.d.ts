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
export declare function Tooltip(props: TooltipProps): React.JSX.Element
