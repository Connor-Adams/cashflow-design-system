import * as React from 'react'
import './Toast.css'

/**
 * Toast notification — a popover card with a semantic left accent. Presentational:
 * manage timing/stacking yourself. `onClose` renders a dismiss button.
 *
 * Visuals live in `Toast.css`, keyed off `data-variant`. The dismiss button
 * carries a `:focus-visible` ring for keyboard users.
 */
export interface ToastProps {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info'
  title?: React.ReactNode
  action?: React.ReactNode
  onClose?: () => void
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

/**
 * Cashflow Toast. A --popover card with a semantic left accent bar, title,
 * optional body, and a close affordance. Presentational — drive show/hide and
 * stacking from your own state or a Toaster container.
 */
export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { variant = 'default', title, action, onClose, className, style, children, ...props },
  ref,
): React.JSX.Element {
  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      data-slot="toast"
      data-variant={variant}
      className={className ? `ca-toast ${className}` : 'ca-toast'}
      style={style}
      {...props}
    >
      <div className="ca-toast-content">
        {title && <p className="ca-toast-title">{title}</p>}
        {children && <p className="ca-toast-body">{children}</p>}
        {action && <div className="ca-toast-action">{action}</div>}
      </div>
      {onClose && (
        <button type="button" aria-label="Dismiss" className="ca-toast-close" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      )}
    </div>
  )
})
