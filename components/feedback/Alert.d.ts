import * as React from 'react'

export type AlertVariant = 'error' | 'warning' | 'info' | 'success'

/**
 * Inline status message. Four semantic variants, each a tint of its semantic
 * color. `error` is assertive (role=alert); the rest are polite. One of the
 * three first-class data-view states (loading / empty / error).
 */
export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: AlertVariant
  title?: React.ReactNode
  action?: React.ReactNode
}
export declare function Alert(props: AlertProps): React.JSX.Element
