import React from 'react'

/**
 * Cashflow Combobox. A searchable single-select: a field that filters a
 * dropdown of options as you type. Controlled (`value` + `onValueChange`) or
 * uncontrolled. Options: string | { value, label, hint? }. Closes on select,
 * outside click, or Escape.
 */
export function Combobox({ options = [], value, defaultValue = null, onValueChange, placeholder = 'Search…', emptyText = 'No matches', size = 'default', className, style, ...props }) {
  const norm = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o))
  const [internal, setInternal] = React.useState(defaultValue)
  const isControlled = value !== undefined
  const selected = isControlled ? value : internal

  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const ref = React.useRef(null)

  React.useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setQuery('') } }
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); setQuery('') } }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey) }
  }, [open])

  const selectedLabel = norm.find((o) => o.value === selected)?.label
  const filtered = query ? norm.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())) : norm

  const choose = (v) => {
    if (!isControlled) setInternal(v)
    onValueChange?.(v)
    setOpen(false); setQuery('')
  }

  const h = size === 'sm' ? 30 : 34

  return (
    <div ref={ref} data-slot="combobox" className={className} style={{ position: 'relative', display: 'inline-block', minWidth: 220, fontFamily: 'var(--font-sans)', ...style }} {...props}>
      <div
        onClick={() => { setOpen(true); }}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, height: h, padding: '0 10px',
          borderRadius: 'var(--radius-md)', border: `1px solid ${open ? 'var(--ring)' : 'var(--input)'}`,
          background: 'color-mix(in oklch, var(--background) 70%, transparent)', cursor: 'text',
          boxShadow: open ? '0 0 0 3px color-mix(in oklch, var(--ring) 35%, transparent)' : 'none', transition: 'border-color 150ms, box-shadow 150ms',
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
        <input
          value={open ? query : (selectedLabel || '')}
          placeholder={selectedLabel ? selectedLabel : placeholder}
          onChange={(e) => { setQuery(e.target.value); if (!open) setOpen(true) }}
          onFocus={() => setOpen(true)}
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: size === 'sm' ? 'var(--text-body-sm)' : 'var(--text-body)', fontFamily: 'var(--font-sans)', color: 'var(--foreground)', minWidth: 0 }}
        />
      </div>
      {open && (
        <div role="listbox" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 70, maxHeight: 240, overflowY: 'auto', padding: 4, background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow)' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '10px 9px', fontSize: 'var(--text-body-sm)', color: 'var(--muted-foreground)' }}>{emptyText}</div>
          ) : filtered.map((o) => {
            const active = o.value === selected
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => choose(o.value)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%', textAlign: 'left',
                  border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 9px', cursor: 'pointer',
                  fontSize: 'var(--text-body)', fontFamily: 'var(--font-sans)',
                  background: active ? 'var(--accent)' : 'transparent', color: active ? 'var(--accent-foreground)' : 'var(--foreground)',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--muted)' }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <span>{o.label}</span>
                {o.hint && <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{o.hint}</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
