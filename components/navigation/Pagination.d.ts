import * as React from 'react'

/**
 * Prev / numbered / next pager with ellipsis collapse. Controlled: `page` is
 * 1-based, `pageCount` total pages, `onPageChange` fires with the new page.
 * `siblingCount` sets how many numbers flank the current page.
 */
export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  page: number
  pageCount: number
  onPageChange?: (page: number) => void
  siblingCount?: number
}
export declare function Pagination(props: PaginationProps): React.JSX.Element
