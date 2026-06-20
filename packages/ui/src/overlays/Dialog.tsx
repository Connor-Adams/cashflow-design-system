import * as React from 'react'
import './Dialog.css'

/**
 * Modal dialog over a dimmed scrim. Controlled with `open` + `onClose`
 * (fires on scrim click / Escape). `title`, `description`, `footer` build the
 * standard layout; `children` is the body. `size` controls max width.
 *
 * Layout and visuals live in `Dialog.css`, keyed off `data-size`. Open/close
 * behavior (Escape key, scrim click) stays in JS — it is behavior, not styling.
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

/**
 * Cashflow Dialog. A centered --popover card over a dimmed, blurred scrim.
 * Controlled with `open` + `onClose`; closes on scrim click or Escape. Pass
 * `title` / `description` for the header and `footer` for the action row.
 */
export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  { open, onClose, title, description, footer, size = 'default', className, style, children, ...props },
  ref,
): React.JSX.Element | null {
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      data-slot="dialog-scrim"
      className="ca-dialog-scrim"
      onClick={onClose}
    >
      <div
        ref={ref}
        data-slot="dialog-content"
        data-size={size}
        className={className ? `ca-dialog ${className}` : 'ca-dialog'}
        style={style}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        {...props}
      >
        {(title || description) && (
          <div className="ca-dialog-header">
            {title && <h2 className="ca-dialog-title">{title}</h2>}
            {description && <p className="ca-dialog-description">{description}</p>}
          </div>
        )}
        {children && <div className="ca-dialog-body">{children}</div>}
        {footer && <div className="ca-dialog-footer">{footer}</div>}
      </div>
    </div>
  )
})
