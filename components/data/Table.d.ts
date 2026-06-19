import * as React from 'react'

/**
 * Bordered, scrollable data table. Compose Table > TableHeader/TableBody >
 * TableRow > TableHead/TableCell. Pass `maxHeight` for a scroll region.
 */
export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  maxHeight?: string
}
export declare function Table(props: TableProps): React.JSX.Element
export declare function TableHeader(props: React.HTMLAttributes<HTMLTableSectionElement>): React.JSX.Element
export declare function TableBody(props: React.HTMLAttributes<HTMLTableSectionElement>): React.JSX.Element
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean
}
export declare function TableRow(props: TableRowProps): React.JSX.Element
export declare function TableHead(props: React.ThHTMLAttributes<HTMLTableCellElement>): React.JSX.Element
export declare function TableCell(props: React.TdHTMLAttributes<HTMLTableCellElement>): React.JSX.Element
