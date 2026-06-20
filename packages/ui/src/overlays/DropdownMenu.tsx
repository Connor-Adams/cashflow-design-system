import * as React from 'react'
import './DropdownMenu.css'

export interface DropdownItem {
  label?: string
  icon?: React.ReactNode
  shortcut?: string
  onSelect?: () => void
  danger?: boolean
  disabled?: boolean
  separator?: boolean
}

/**
 * A trigger that opens a menu of actions. Closes on outside click, Escape, or
 * select. `items` are rows; set `separator: true` for a divider, `danger` for
 * destructive rows. `align` pins the menu to the trigger's start or end edge.
 *
 * Open/close is behavior and stays in JS (the `open` state, outside-click and
 * Escape listeners). Item hover/focus styling lives in `DropdownMenu.css` —
 * menu items carry a `:focus-visible` ring.
 */
export interface DropdownMenuProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  align?: 'start' | 'end'
  className?: string
  style?: React.CSSProperties
}

/**
 * Cashflow DropdownMenu. A trigger that opens a --popover menu of items.
 * Closes on outside click, Escape, or item select. Pass `trigger` (the clickable
 * node) and `items`: { label, icon?, onSelect?, danger?, disabled?, separator? }.
 */
export const DropdownMenu = React.forwardRef<HTMLSpanElement, DropdownMenuProps>(function DropdownMenu(
  { trigger, items = [], align = 'start', className, style, ...props },
  forwardedRef,
): React.JSX.Element {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLSpanElement>(null)
  React.useImperativeHandle(forwardedRef, () => ref.current as HTMLSpanElement)

  React.useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey) }
  }, [open])

  return (
    <span
      ref={ref}
      data-slot="dropdown-menu"
      className={className ? `ca-dropdown ${className}` : 'ca-dropdown'}
      style={style}
      {...props}
    >
      <span className="ca-dropdown-trigger" onClick={() => setOpen((o) => !o)}>{trigger}</span>
      {open && (
        <div role="menu" data-align={align} className="ca-dropdown-menu">
          {items.map((it, i) =>
            it.separator ? (
              <div key={`sep-${i}`} className="ca-dropdown-separator" />
            ) : (
              <button
                key={it.label}
                type="button"
                role="menuitem"
                data-danger={it.danger ? 'true' : 'false'}
                disabled={it.disabled}
                className="ca-dropdown-item"
                onClick={() => { if (it.disabled) return; setOpen(false); it.onSelect?.() }}
              >
                {it.icon && <span className="ca-dropdown-item-icon">{it.icon}</span>}
                <span className="ca-dropdown-item-label">{it.label}</span>
                {it.shortcut && <span className="ca-dropdown-item-shortcut">{it.shortcut}</span>}
              </button>
            )
          )}
        </div>
      )}
    </span>
  )
})
