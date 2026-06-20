import * as React from 'react'
import './Breadcrumb.css'

export interface BreadcrumbItem {
  label: React.ReactNode
  href?: string
}

/**
 * Path trail with chevron separators. The last item renders as the current
 * page (non-link, emphasised). Items without `href` also render as plain text.
 *
 * Link hover and the keyboard focus-visible ring live in `Breadcrumb.css`, not
 * JS — focus stays visible and consumers can override styling via className.
 */
export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
}

/**
 * Cashflow Breadcrumb. A path trail of links with chevron separators; the last
 * item renders as the current page (no link). Pass `items` as
 * { label, href? }; the final item is treated as current.
 */
export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { items = [], className, ...props },
  ref,
): React.JSX.Element {
  return (
    <nav
      ref={ref}
      data-slot="breadcrumb"
      aria-label="Breadcrumb"
      className={className ? `ca-breadcrumb ${className}` : 'ca-breadcrumb'}
      {...props}
    >
      <ol>
        {items.map((it, i) => {
          const last = i === items.length - 1
          return (
            <li key={i}>
              {last || !it.href ? (
                <span data-slot="breadcrumb-page" aria-current={last ? 'page' : undefined}>
                  {it.label}
                </span>
              ) : (
                <a href={it.href}>{it.label}</a>
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
})
