import React from 'react'

/**
 * Cashflow Table set. A bordered, scrollable data table. Head cells are
 * uppercase muted micro-labels; rows hover to a faint muted tint; cells are
 * compact (px-3 py-2.5). Compose: Table > TableHeader/TableBody >
 * TableRow > TableHead/TableCell.
 */
export function Table({ className, style, maxHeight, children, ...props }) {
  return (
    <div
      data-slot="table-container"
      style={{
        position: 'relative',
        width: '100%',
        overflow: maxHeight ? 'auto' : 'auto',
        maxHeight,
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        background: 'var(--card)',
      }}
    >
      <table
        data-slot="table"
        className={className}
        style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-body)', fontFamily: 'var(--font-sans)', captionSide: 'bottom', ...style }}
        {...props}
      >
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children, ...props }) {
  return <thead data-slot="table-header" {...props}>{children}</thead>
}

export function TableBody({ children, ...props }) {
  return <tbody data-slot="table-body" {...props}>{children}</tbody>
}

export function TableRow({ className, style, selected, children, ...props }) {
  const [hover, setHover] = React.useState(false)
  return (
    <tr
      data-slot="table-row"
      data-state={selected ? 'selected' : undefined}
      className={className}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderBottom: '1px solid var(--border)',
        background: selected
          ? 'var(--muted)'
          : hover
          ? 'color-mix(in oklch, var(--muted) 45%, transparent)'
          : 'transparent',
        transition: 'background-color 150ms',
        ...style,
      }}
      {...props}
    >
      {children}
    </tr>
  )
}

export function TableHead({ className, style, children, ...props }) {
  return (
    <th
      data-slot="table-head"
      className={className}
      style={{
        height: 40,
        whiteSpace: 'nowrap',
        padding: '0 12px',
        textAlign: 'left',
        verticalAlign: 'middle',
        fontSize: 'var(--text-body-sm)',
        fontWeight: 'var(--weight-semibold)',
        textTransform: 'uppercase',
        letterSpacing: '0.02em',
        color: 'color-mix(in oklch, var(--muted-foreground) 78%, var(--primary))',
        ...style,
      }}
      {...props}
    >
      {children}
    </th>
  )
}

export function TableCell({ className, style, children, ...props }) {
  return (
    <td
      data-slot="table-cell"
      className={className}
      style={{ whiteSpace: 'nowrap', padding: '10px 12px', verticalAlign: 'middle', color: 'var(--foreground)', ...style }}
      {...props}
    >
      {children}
    </td>
  )
}
