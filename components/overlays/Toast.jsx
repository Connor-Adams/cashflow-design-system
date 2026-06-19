import React from 'react'

/**
 * Cashflow Toast. A --popover card with a semantic left accent bar, title,
 * optional body, and a close affordance. Presentational — drive show/hide and
 * stacking from your own state or a Toaster container.
 */
const ACCENT = {
  default: 'var(--primary)',
  success: 'var(--success)',
  error:   'var(--danger)',
  warning: 'var(--warning)',
  info:    'var(--info)',
}

export function Toast({ variant = 'default', title, action, onClose, className, style, children, ...props }) {
  const accent = ACCENT[variant] || ACCENT.default
  return (
    <div
      role="status"
      aria-live="polite"
      className={className}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        width: 340,
        maxWidth: '100%',
        background: 'var(--popover)',
        color: 'var(--popover-foreground)',
        border: '1px solid var(--border)',
        borderLeft: `3px solid ${accent}`,
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow)',
        padding: '12px 14px',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...props}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {title && <p style={{ margin: 0, fontSize: 'var(--text-body)', fontWeight: 'var(--weight-semibold)' }}>{title}</p>}
        {children && <p style={{ margin: 0, fontSize: 'var(--text-body-sm)', color: 'var(--muted-foreground)', lineHeight: 1.45 }}>{children}</p>}
        {action && <div style={{ marginTop: 6 }}>{action}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onClose}
          style={{
            flex: 'none',
            border: 'none',
            background: 'transparent',
            color: 'var(--muted-foreground)',
            cursor: 'pointer',
            padding: 2,
            lineHeight: 0,
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      )}
    </div>
  )
}
