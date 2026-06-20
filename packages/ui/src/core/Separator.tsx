import * as React from 'react'
import './Separator.css'

/**
 * Cashflow Separator. A hairline divider in --border. Horizontal by default;
 * `orientation="vertical"` for inline dividers. Optional centered `label`.
 */

/**
 * Hairline divider in `--border`. Horizontal by default; `orientation="vertical"`
 * stretches to its flex parent's height. Pass `label` for a centered
 * "text between rules" divider.
 */
export interface SeparatorProps extends React.HTMLAttributes<HTMLElement> {
  orientation?: 'horizontal' | 'vertical'
  label?: React.ReactNode
}

export const Separator = React.forwardRef<HTMLElement, SeparatorProps>(function Separator(
  { orientation = 'horizontal', label, className, style, ...props },
  ref,
): React.JSX.Element {
  const cls = className ? `ca-separator ${className}` : 'ca-separator'

  if (orientation === 'vertical') {
    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        data-slot="separator"
        data-orientation="vertical"
        role="separator"
        aria-orientation="vertical"
        className={cls}
        style={style}
        {...props}
      />
    )
  }

  if (label) {
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        data-slot="separator"
        data-orientation="horizontal"
        role="separator"
        className={`${cls} ca-separator--labeled`}
        style={style}
        {...props}
      >
        <span className="ca-separator__rule" />
        <span className="ca-separator__label">{label}</span>
        <span className="ca-separator__rule" />
      </div>
    )
  }

  return (
    <hr
      ref={ref as React.Ref<HTMLHRElement>}
      data-slot="separator"
      data-orientation="horizontal"
      className={cls}
      style={style}
      {...props}
    />
  )
})
