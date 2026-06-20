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
        style={{ display: 'inline-block', width: 1, alignSelf: 'stretch', minHeight: '1em', background: 'var(--border)', ...style }}
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
        className={cls}
        style={{ display: 'flex', alignItems: 'center', gap: 12, ...style }}
        {...props}
      >
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap' }}>{label}</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>
    )
  }

  return (
    <hr
      ref={ref as React.Ref<HTMLHRElement>}
      data-slot="separator"
      data-orientation="horizontal"
      className={cls}
      style={{ border: 0, height: 1, width: '100%', background: 'var(--border)', margin: 0, ...style }}
      {...props}
    />
  )
})
