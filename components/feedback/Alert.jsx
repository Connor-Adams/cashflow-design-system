import React from 'react'

/**
 * Cashflow Alert. Four semantic variants — error / warning / info / success —
 * each a color-mix of its semantic color into the background (~10–12%) and
 * border (~42–45%). error gets role="alert" aria-live="assertive"; the rest
 * are polite status messages.
 */
const VARIANT = {
  error:   { c: 'var(--danger)' },
  warning: { c: 'var(--warning)' },
  info:    { c: 'var(--primary)' },
  success: { c: 'var(--success)' },
}

export function Alert({ variant = 'info', title, action, className, style, children, ...props }) {
  const c = (VARIANT[variant] || VARIANT.info).c
  const role = variant === 'error' ? 'alert' : 'status'
  const ariaLive = variant === 'error' ? 'assertive' : 'polite'
  return (
    <div
      data-slot="alert"
      data-variant={variant}
      role={role}
      aria-live={ariaLive}
      aria-atomic="true"
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        borderRadius: 'var(--radius-lg)',
        border: `1px solid color-mix(in srgb, ${c} 44%, var(--border))`,
        background: `color-mix(in srgb, ${c} 11%, transparent)`,
        color: 'var(--foreground)',
        padding: 12,
        fontSize: 'var(--text-body)',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...props}
    >
      {(title || action) && (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          {title && <p data-slot="alert-title" style={{ margin: 0, fontWeight: 'var(--weight-semibold)' }}>{title}</p>}
          {action && <div style={{ flexShrink: 0 }}>{action}</div>}
        </div>
      )}
      {children && <div data-slot="alert-body" style={{ fontSize: 'var(--text-body)', lineHeight: 1.45 }}>{children}</div>}
    </div>
  )
}
