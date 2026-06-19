import * as React from 'react'

/**
 * Toast notification — a popover card with a semantic left accent. Presentational:
 * manage timing/stacking yourself. `onClose` renders a dismiss button.
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
export declare function Toast(props: ToastProps): React.JSX.Element
