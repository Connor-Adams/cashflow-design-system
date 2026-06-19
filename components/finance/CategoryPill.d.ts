import * as React from 'react'

/**
 * Transaction-category chip — tinted icon + label. Ships icons/tints for the
 * common categories (groceries, income, dining, transport, subscriptions,
 * utilities, fees, housing); override with `icon` and `color`. `interactive`
 * renders a button for filtering/reassigning.
 */
export interface CategoryPillProps extends React.HTMLAttributes<HTMLElement> {
  category?: string
  label?: React.ReactNode
  icon?: React.ReactNode
  color?: string
  interactive?: boolean
  size?: 'sm' | 'default'
}
export declare function CategoryPill(props: CategoryPillProps): React.JSX.Element
