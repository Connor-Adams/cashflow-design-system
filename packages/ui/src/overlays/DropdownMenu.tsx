import * as React from 'react'

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
export function DropdownMenu({ trigger, items = [], align = 'start', className, style, ...props }: DropdownMenuProps): React.JSX.Element {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey) }
  }, [open])

  return (
    <span ref={ref} className={className} style={{ position: 'relative', display: 'inline-flex', ...style }} {...props}>
      <span onClick={() => setOpen((o) => !o)} style={{ display: 'inline-flex' }}>{trigger}</span>
      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            ...({ [align === 'end' ? 'right' : 'left']: 0 } as React.CSSProperties),
            zIndex: 70,
            minWidth: 180,
            padding: 4,
            background: 'var(--popover)',
            color: 'var(--popover-foreground)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {items.map((it, i) =>
            it.separator ? (
              <div key={`sep-${i}`} style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
            ) : (
              <button
                key={it.label}
                type="button"
                role="menuitem"
                disabled={it.disabled}
                onClick={() => { if (it.disabled) return; setOpen(false); it.onSelect?.() }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: 'transparent',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 9px',
                  fontSize: 'var(--text-body)',
                  fontFamily: 'var(--font-sans)',
                  color: it.danger ? 'var(--destructive)' : 'var(--foreground)',
                  cursor: it.disabled ? 'not-allowed' : 'pointer',
                  opacity: it.disabled ? 0.5 : 1,
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { if (!it.disabled) e.currentTarget.style.background = it.danger ? 'color-mix(in srgb, var(--destructive) 12%, transparent)' : 'var(--muted)' }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = 'transparent' }}
              >
                {it.icon && <span style={{ display: 'inline-flex', flex: 'none' }}>{it.icon}</span>}
                <span style={{ flex: 1 }}>{it.label}</span>
                {it.shortcut && <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{it.shortcut}</span>}
              </button>
            )
          )}
        </div>
      )}
    </span>
  )
}
