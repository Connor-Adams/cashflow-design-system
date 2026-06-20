import * as React from 'react'

/**
 * Cashflow Progress. A determinate bar over a muted track; the fill tone is
 * semantic (primary by default). Pass `value` 0–100, or set `indeterminate`
 * for an unknown-duration sweep. Optional `label` + value readout above.
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

export function Progress({ value = 0, tone = 'primary', size = 'default', indeterminate = false, label, showValue = false, className, style, ...props }: ProgressProps): React.JSX.Element {
  const pct = Math.max(0, Math.min(100, value))
  const h = size === 'sm' ? 4 : size === 'lg' ? 12 : 8
  const fill = TONES[tone] || tone

  return (
    <div data-slot="progress" className={className} style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', ...style }} {...props}>
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-sans)' }}>
          {label && <span style={{ color: 'var(--muted-foreground)' }}>{label}</span>}
          {showValue && !indeterminate && <span style={{ color: 'var(--foreground)', fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'] }}>{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ position: 'relative', overflow: 'hidden', height: h, width: '100%', borderRadius: 99, background: 'var(--muted)' }}
      >
        {indeterminate ? (
          <span style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '40%', borderRadius: 99, background: fill, animation: 'cf-prog 1.1s ease-in-out infinite' }} />
        ) : (
          <span style={{ display: 'block', height: '100%', width: `${pct}%`, borderRadius: 99, background: fill, transition: 'width 300ms ease' }} />
        )}
      </div>
      <style>{'@keyframes cf-prog{0%{left:-40%}100%{left:100%}}'}</style>
    </div>
  )
}
