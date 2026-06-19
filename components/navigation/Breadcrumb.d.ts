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
export declare function Breadcrumb(props: BreadcrumbProps): React.JSX.Element
