import * as React from 'react'

export interface BreadcrumbItem {
  label: React.ReactNode
  href?: string
}

/**
 * Path trail with chevron separators. The last item renders as the current
 * page (non-link, emphasised). Items without `href` also render as plain text.
 */
export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
}

/**
 * Cashflow Breadcrumb. A path trail of links with chevron separators; the last
 * item renders as the current page (no link). Pass `items` as
 * { label, href? }; the final item is treated as current.
 */
export function Breadcrumb({ items = [], className, style, ...props }: BreadcrumbProps): React.JSX.Element {
  return (
    <nav data-slot="breadcrumb" aria-label="Breadcrumb" className={className} style={{ fontFamily: 'var(--font-sans)', ...style }} {...(props as React.HTMLAttributes<HTMLElement>)}>
      <ol style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, listStyle: 'none', margin: 0, padding: 0, fontSize: 'var(--text-body)' }}>
        {items.map((it, i) => {
          const last = i === items.length - 1
          return (
            <li key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {last || !it.href ? (
                <span aria-current={last ? 'page' : undefined} style={{ color: last ? 'var(--foreground)' : 'var(--muted-foreground)', fontWeight: (last ? 'var(--weight-semibold)' : 'var(--weight-regular)') as React.CSSProperties['fontWeight'] }}>{it.label}</span>
              ) : (
                <a href={it.href} style={{ color: 'var(--muted-foreground)', textDecoration: 'none' }} onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = 'var(--foreground)' }} onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = 'var(--muted-foreground)' }}>{it.label}</a>
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
