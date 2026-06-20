import * as React from 'react'
import './Pagination.css'

/**
 * Prev / numbered / next pager with ellipsis collapse. Controlled: `page` is
 * 1-based, `pageCount` total pages, `onPageChange` fires with the new page.
 * `siblingCount` sets how many numbers flank the current page.
 *
 * Hover, the keyboard focus-visible ring, the active-page treatment, and the
 * disabled state live in `Pagination.css`, not JS — the active page is keyed
 * off `[aria-current='page']` and focus stays visible.
 */
export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  page: number
  pageCount: number
  onPageChange?: (page: number) => void
  siblingCount?: number
}

/**
 * Cashflow Pagination. Prev / numbered / next controls with ellipsis collapse
 * for long ranges. Controlled: pass `page` (1-based), `pageCount`, and
 * `onPageChange`. `siblingCount` controls how many pages flank the current one.
 */
function range(start: number, end: number): number[] {
  const out: number[] = []
  for (let i = start; i <= end; i++) out.push(i)
  return out
}

function pagesFor(page: number, pageCount: number, sibling: number): (number | string)[] {
  const total = sibling * 2 + 5
  if (pageCount <= total) return range(1, pageCount)
  const left = Math.max(page - sibling, 1)
  const right = Math.min(page + sibling, pageCount)
  const showLeftDots = left > 2
  const showRightDots = right < pageCount - 1
  if (!showLeftDots && showRightDots) return [...range(1, sibling * 2 + 3), '…', pageCount]
  if (showLeftDots && !showRightDots) return [1, '…', ...range(pageCount - (sibling * 2 + 2), pageCount)]
  return [1, '…', ...range(left, right), '…', pageCount]
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { page = 1, pageCount = 1, onPageChange, siblingCount = 1, className, ...props },
  ref,
): React.JSX.Element {
  const go = (p: number) => { if (p >= 1 && p <= pageCount && p !== page) onPageChange?.(p) }
  const arrow = (dir: 'next' | 'prev') => (
    <button type="button" onClick={() => go(page + (dir === 'next' ? 1 : -1))} disabled={dir === 'next' ? page >= pageCount : page <= 1}
      aria-label={dir === 'next' ? 'Next page' : 'Previous page'}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{dir === 'next' ? <path d="m9 18 6-6-6-6" /> : <path d="m15 18-6-6 6-6" />}</svg>
    </button>
  )

  return (
    <nav
      ref={ref}
      data-slot="pagination"
      aria-label="Pagination"
      className={className ? `ca-pagination ${className}` : 'ca-pagination'}
      {...props}
    >
      {arrow('prev')}
      {pagesFor(page, pageCount, siblingCount).map((p, i) =>
        p === '…' ? (
          <span key={`d${i}`} data-slot="pagination-ellipsis">…</span>
        ) : (
          <button key={p as number} type="button" onClick={() => go(p as number)} aria-current={p === page ? 'page' : undefined}>{p}</button>
        )
      )}
      {arrow('next')}
    </nav>
  )
})
