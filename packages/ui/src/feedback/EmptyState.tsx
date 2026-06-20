import * as React from 'react'

/** Low-key placeholder for empty data views. Muted surface, title, optional description + actions. */
export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
}

/**
 * Cashflow EmptyState. A muted, low-key placeholder for empty data views —
 * dashed-free, just a soft muted surface with a title, optional description,
 * and an actions row. First-class, not an afterthought.
 */
export function EmptyState({ title, description, actions, className, style, ...props }: EmptyStateProps): React.JSX.Element {
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
      <p style={{ margin: '0 0 4px', fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'], color: 'var(--muted-foreground)' }}>{title}</p>
      {description && <p style={{ margin: 0, lineHeight: 1.5, color: 'var(--muted-foreground)' }}>{description}</p>}
      {actions && <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>{actions}</div>}
    </div>
  )
}
