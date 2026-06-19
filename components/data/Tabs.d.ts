import * as React from 'react'

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
export declare function Tabs(props: TabsProps): React.JSX.Element
