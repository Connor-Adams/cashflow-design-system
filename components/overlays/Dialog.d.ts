import * as React from 'react'

/**
 * Modal dialog over a dimmed scrim. Controlled with `open` + `onClose`
 * (fires on scrim click / Escape). `title`, `description`, `footer` build the
 * standard layout; `children` is the body. `size` controls max width.
 */
export interface DialogProps {
  open: boolean
  onClose?: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'default' | 'lg'
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}
export declare function Dialog(props: DialogProps): React.JSX.Element | null
