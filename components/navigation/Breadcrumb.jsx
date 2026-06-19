import React from 'react'

/**
 * Cashflow Breadcrumb. A path trail of links with chevron separators; the last
 * item renders as the current page (no link). Pass `items` as
 * { label, href? }; the final item is treated as current.
 */
export function Breadcrumb({ items = [], className, style, ...props }) {
  return (
    <nav data-slot="breadcrumb" aria-label="Breadcrumb" className={className} style={{ fontFamily: 'var(--font-sans)', ...style }} {...props}>
      <ol style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, listStyle: 'none', margin: 0, padding: 0, fontSize: 'var(--text-body)' }}>
        {items.map((it, i) => {
          const last = i === items.length - 1
          return (
            <li key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {last || !it.href ? (
                <span aria-current={last ? 'page' : undefined} style={{ color: last ? 'var(--foreground)' : 'var(--muted-foreground)', fontWeight: last ? 'var(--weight-semibold)' : 'var(--weight-regular)' }}>{it.label}</span>
              ) : (
                <a href={it.href} style={{ color: 'var(--muted-foreground)', textDecoration: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--foreground)' }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-foreground)' }}>{it.label}</a>
              )}
              {!last && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
