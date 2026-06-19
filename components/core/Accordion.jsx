import React from 'react'

/**
 * Cashflow Accordion. A stack of disclosure rows over hairline dividers.
 * `type="single"` (default) keeps one panel open; `type="multiple"` allows
 * many. Uncontrolled via `defaultValue`; pass `items` as { value, title, content }.
 */
export function Accordion({ items = [], type = 'single', defaultValue, collapsible = true, className, style, ...props }) {
  const initial = defaultValue != null ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : []
  const [open, setOpen] = React.useState(initial)

  const toggle = (value) => {
    setOpen((cur) => {
      const isOpen = cur.includes(value)
      if (type === 'multiple') return isOpen ? cur.filter((v) => v !== value) : [...cur, value]
      if (isOpen) return collapsible ? [] : cur
      return [value]
    })
  }

  return (
    <div data-slot="accordion" className={className} style={{ borderTop: '1px solid var(--border)', fontFamily: 'var(--font-sans)', ...style }} {...props}>
      {items.map((it) => {
        const isOpen = open.includes(it.value)
        return (
          <div key={it.value} style={{ borderBottom: '1px solid var(--border)' }}>
            <button
              type="button"
              onClick={() => toggle(it.value)}
              aria-expanded={isOpen}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                width: '100%', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer',
                padding: '14px 2px', fontSize: 'var(--text-body-lg)', fontWeight: 'var(--weight-semibold)',
                color: 'var(--foreground)', fontFamily: 'var(--font-sans)',
              }}
            >
              {it.title}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}><path d="m6 9 6 6 6-6" /></svg>
            </button>
            <div style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr', transition: 'grid-template-rows 220ms ease' }}>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ padding: '0 2px 16px', fontSize: 'var(--text-body)', color: 'var(--muted-foreground)', lineHeight: 1.5 }}>{it.content}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
