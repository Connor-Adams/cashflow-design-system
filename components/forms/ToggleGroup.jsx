import React from 'react'

/**
 * Cashflow ToggleGroup. A segmented control — a bordered track of options where
 * the active segment lifts to a --card surface. `type="single"` (default)
 * selects one; `type="multiple"` toggles many. Items: { value, label, icon? }.
 */
export function ToggleGroup({ items = [], type = 'single', value, defaultValue, onValueChange, size = 'default', className, style, ...props }) {
  const initial = defaultValue != null ? defaultValue : (type === 'multiple' ? [] : null)
  const [internal, setInternal] = React.useState(initial)
  const isControlled = value !== undefined
  const current = isControlled ? value : internal

  const isActive = (v) => (type === 'multiple' ? (current || []).includes(v) : current === v)
  const pick = (v) => {
    let next
    if (type === 'multiple') {
      const arr = current || []
      next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
    } else {
      next = current === v ? null : v
    }
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  const pad = size === 'sm' ? '5px 10px' : '7px 13px'
  const fs = size === 'sm' ? 'var(--text-body-sm)' : 'var(--text-body)'

  return (
    <div role="group" className={className} style={{ display: 'inline-flex', gap: 4, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', background: 'color-mix(in oklch, var(--muted) 55%, transparent)', padding: 4, fontFamily: 'var(--font-sans)', ...style }} {...props}>
      {items.map((it) => {
        const active = isActive(it.value)
        return (
          <button
            key={it.value}
            type="button"
            aria-pressed={active}
            onClick={() => pick(it.value)}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap',
              borderRadius: 'var(--radius-md)', border: 'none', padding: pad, fontSize: fs,
              fontWeight: 'var(--weight-medium)', fontFamily: 'var(--font-sans)', cursor: 'pointer',
              transition: 'color 150ms, background-color 150ms, box-shadow 150ms',
              background: active ? 'var(--card)' : 'transparent',
              color: active ? 'var(--foreground)' : 'color-mix(in oklch, var(--muted-foreground) 80%, var(--foreground))',
              boxShadow: active ? 'var(--shadow)' : 'none',
            }}
          >
            {it.icon && <span style={{ display: 'inline-flex' }}>{it.icon}</span>}
            {it.label}
          </button>
        )
      })}
    </div>
  )
}
