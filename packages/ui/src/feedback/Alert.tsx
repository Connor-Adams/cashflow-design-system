import * as React from 'react'
import './Alert.css'

export type AlertVariant = 'error' | 'warning' | 'info' | 'success'

/**
 * Inline status message. Four semantic variants, each a tint of its semantic
 * color. `error` is assertive (role=alert); the rest are polite. One of the
 * three first-class data-view states (loading / empty / error).
 *
 * Variant tints (background ~11%, border ~44% of the semantic color) live in
 * `Alert.css`, keyed off `data-variant` — not inline styles.
 */
export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: AlertVariant
  title?: React.ReactNode
  action?: React.ReactNode
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { variant = 'info', title, action, className, children, ...props },
  ref,
): React.JSX.Element {
  const role = variant === 'error' ? 'alert' : 'status'
  const ariaLive = variant === 'error' ? 'assertive' : 'polite'
  return (
    <div
      ref={ref}
      data-slot="alert"
      data-variant={variant}
      role={role}
      aria-live={ariaLive}
      aria-atomic="true"
      className={className ? `ca-alert ${className}` : 'ca-alert'}
      {...props}
    >
      {(title || action) && (
        <div className="ca-alert__header">
          {title && (
            <p data-slot="alert-title" className="ca-alert__title">
              {title}
            </p>
          )}
          {action && <div className="ca-alert__action">{action}</div>}
        </div>
      )}
      {children && (
        <div data-slot="alert-body" className="ca-alert__body">
          {children}
        </div>
      )}
    </div>
  )
})
