import * as React from 'react'

/**
 * Cashflow Tabs. A pill tablist: muted track, the active pill lifts to a white
 * --card surface with a soft shadow. Controlled — pass `value` + `onValueChange`
 * and an `items` array of { value, label }.
 */

export interface TabItem {
  value: string
  label: React.ReactNode
}

/** Controlled pill tabs. Active pill lifts to a white card surface. */
export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: TabItem[]
  value: string
  onValueChange?: (value: string) => void
}

export function Tabs({ items, value, onValueChange, className, style, ...props }: TabsProps): React.JSX.Element {
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={className}
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        gap: 4,
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        background: 'color-mix(in oklch, var(--muted) 55%, transparent)',
        padding: 4,
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...props}
    >
      {items.map((item) => {
        const active = item.value === value
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onValueChange?.(item.value)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              padding: '6px 12px',
              fontSize: 'var(--text-body)',
              fontWeight: 'var(--weight-medium)' as React.CSSProperties['fontWeight'],
              fontFamily: 'var(--font-sans)',
              cursor: 'pointer',
              transition: 'color 150ms, background-color 150ms',
              background: active ? 'var(--card)' : 'transparent',
              color: active ? 'var(--foreground)' : 'color-mix(in oklch, var(--muted-foreground) 80%, var(--foreground))',
              boxShadow: active ? 'var(--shadow)' : 'none',
            }}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
