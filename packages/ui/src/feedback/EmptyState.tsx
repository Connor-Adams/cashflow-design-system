import * as React from 'react'
import './EmptyState.css'

/** Low-key placeholder for empty data views. Muted surface, title, optional description + actions. */
export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { title, description, actions, className, ...props },
  ref,
): React.JSX.Element {
  return (
    <div
      ref={ref}
      data-slot="empty-state"
      className={className ? `ca-empty-state ${className}` : 'ca-empty-state'}
      {...props}
    >
      <p className="ca-empty-state__title">{title}</p>
      {description && <p className="ca-empty-state__description">{description}</p>}
      {actions && <div className="ca-empty-state__actions">{actions}</div>}
    </div>
  )
})
