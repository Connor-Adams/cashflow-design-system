import * as React from 'react'

/**
 * Hairline divider in `--border`. Horizontal by default; `orientation="vertical"`
 * stretches to its flex parent's height. Pass `label` for a centered
 * "text between rules" divider.
 */
export interface SeparatorProps extends React.HTMLAttributes<HTMLElement> {
  orientation?: 'horizontal' | 'vertical'
  label?: React.ReactNode
}
export declare function Separator(props: SeparatorProps): React.JSX.Element
