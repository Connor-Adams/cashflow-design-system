import * as React from 'react'

export interface DropdownItem {
  label?: string
  icon?: React.ReactNode
  shortcut?: string
  onSelect?: () => void
  danger?: boolean
  disabled?: boolean
  separator?: boolean
}

/**
 * A trigger that opens a menu of actions. Closes on outside click, Escape, or
 * select. `items` are rows; set `separator: true` for a divider, `danger` for
 * destructive rows. `align` pins the menu to the trigger's start or end edge.
 */
export interface DropdownMenuProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  align?: 'start' | 'end'
  className?: string
  style?: React.CSSProperties
}
export declare function DropdownMenu(props: DropdownMenuProps): React.JSX.Element
