import * as React from 'react'
import './Progress.css'

/**
 * Cashflow Progress. A determinate bar over a muted track; the fill tone is
 * semantic (primary by default). Pass `value` 0–100, or set `indeterminate`
 * for an unknown-duration sweep. Optional `label` + value readout above.
 *
 * The static layout and the indeterminate sweep animation live in
 * `Progress.css` (the sweep respects prefers-reduced-motion).
 */

const TONES: Record<string, string> = {
  primary: 'var(--primary)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--destructive)',
}

/**
 * Determinate progress bar (0–100) over a muted track, semantic fill tone.
 * Set `indeterminate` for an unknown-duration sweep. Optional `label` and a
 * `showValue` percentage readout.
 */
export interface ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  value?: number
  tone?: 'primary' | 'success' | 'warning' | 'danger' | (string & {})
  size?: 'sm' | 'default' | 'lg'
  indeterminate?: boolean
  label?: React.ReactNode
  showValue?: boolean
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value = 0, tone = 'primary', size = 'default', indeterminate = false, label, showValue = false, className, style, ...props },
  ref,
): React.JSX.Element {
  const pct = Math.max(0, Math.min(100, value))
  const h = size === 'sm' ? 4 : size === 'lg' ? 12 : 8
  const fill = TONES[tone] || tone

  return (
    <div
      ref={ref}
      data-slot="progress"
      data-size={size}
      className={className ? `ca-progress ${className}` : 'ca-progress'}
      style={style}
      {...props}
    >
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-sans)' }}>
          {label && <span style={{ color: 'var(--muted-foreground)' }}>{label}</span>}
          {showValue && !indeterminate && <span style={{ color: 'var(--foreground)', fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'] }}>{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        className="ca-progress__track"
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ height: h }}
      >
        {indeterminate ? (
          <span className="ca-progress__sweep" style={{ background: fill }} />
        ) : (
          <span style={{ display: 'block', height: '100%', width: `${pct}%`, borderRadius: 99, background: fill, transition: 'width 300ms ease' }} />
        )}
      </div>
    </div>
  )
})
