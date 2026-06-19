import React from 'react'

/**
 * Cashflow EmptyState. A muted, low-key placeholder for empty data views —
 * dashed-free, just a soft muted surface with a title, optional description,
 * and an actions row. First-class, not an afterthought.
 */
export function EmptyState({ title, description, actions, className, style, ...props }) {
  return (
    <div
      data-slot="empty-state"
      className={className}
      style={{
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        background: 'color-mix(in oklch, var(--muted) 20%, transparent)',
        padding: 16,
        fontSize: 'var(--text-body)',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...props}
    >
      <p style={{ margin: '0 0 4px', fontWeight: 'var(--weight-semibold)', color: 'var(--muted-foreground)' }}>{title}</p>
      {description && <p style={{ margin: 0, lineHeight: 1.5, color: 'var(--muted-foreground)' }}>{description}</p>}
      {actions && <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>{actions}</div>}
    </div>
  )
}
