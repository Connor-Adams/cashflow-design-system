import * as React from 'react'

/** Low-key placeholder for empty data views. Muted surface, title, optional description + actions. */
export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
}
export declare function EmptyState(props: EmptyStateProps): React.JSX.Element
