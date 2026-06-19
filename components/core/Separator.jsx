import React from 'react'

/**
 * Cashflow Separator. A hairline divider in --border. Horizontal by default;
 * `orientation="vertical"` for inline dividers. Optional centered `label`.
 */
export function Separator({ orientation = 'horizontal', label, className, style, ...props }) {
  if (orientation === 'vertical') {
    return (
      <span
        data-slot="separator"
        role="separator"
        aria-orientation="vertical"
        className={className}
        style={{ display: 'inline-block', width: 1, alignSelf: 'stretch', minHeight: '1em', background: 'var(--border)', ...style }}
        {...props}
      />
    )
  }

  if (label) {
    return (
      <div
        data-slot="separator"
        role="separator"
        className={className}
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
      data-slot="separator"
      className={className}
      style={{ border: 0, height: 1, width: '100%', background: 'var(--border)', margin: 0, ...style }}
      {...props}
    />
  )
}
