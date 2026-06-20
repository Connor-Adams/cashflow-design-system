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

/**
 * Cashflow Dialog. A centered --popover card over a dimmed, blurred scrim.
 * Controlled with `open` + `onClose`; closes on scrim click or Escape. Pass
 * `title` / `description` for the header and `footer` for the action row.
 */
export function Dialog({ open, onClose, title, description, footer, size = 'default', className, style, children, ...props }: DialogProps): React.JSX.Element | null {
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  const maxW = size === 'sm' ? 360 : size === 'lg' ? 640 : 480

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        background: 'color-mix(in srgb, var(--foreground) 45%, transparent)',
        backdropFilter: 'blur(2px)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div
        className={className}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: maxW,
          background: 'var(--popover)',
          color: 'var(--popover-foreground)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          ...style,
        }}
        {...props}
      >
        {(title || description) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {title && <h2 style={{ margin: 0, fontSize: 'var(--text-headline-sm)', fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'] }}>{title}</h2>}
            {description && <p style={{ margin: 0, fontSize: 'var(--text-body-sm)', color: 'var(--muted-foreground)' }}>{description}</p>}
          </div>
        )}
        {children && <div style={{ fontSize: 'var(--text-body)', lineHeight: 1.5 }}>{children}</div>}
        {footer && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 2 }}>{footer}</div>}
      </div>
    </div>
  )
}
