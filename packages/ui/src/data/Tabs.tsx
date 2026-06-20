import * as React from 'react'
import './Tabs.css'

/**
 * Cashflow Tabs. A pill tablist: muted track, the active pill lifts to a white
 * --card surface with a soft shadow. Controlled — pass `value` + `onValueChange`
 * and an `items` array of { value, label }.
 *
 * Hover and the keyboard focus ring live in `Tabs.css`, keyed off the
 * `data-state` attribute — no `useState`, no `onMouseEnter`.
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

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { items, value, onValueChange, className, ...props },
  ref,
): React.JSX.Element {
  return (
    <div
      ref={ref}
      role="tablist"
      aria-orientation="horizontal"
      data-slot="tabs"
      className={className ? `ca-tabs ${className}` : 'ca-tabs'}
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
            data-slot="tabs-trigger"
            data-state={active ? 'active' : 'inactive'}
            className="ca-tabs-trigger"
            onClick={() => onValueChange?.(item.value)}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
})
