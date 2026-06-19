import * as React from 'react'

export interface AccordionItem {
  value: string
  title: React.ReactNode
  content: React.ReactNode
}

/**
 * Disclosure stack. `type="single"` keeps one panel open (set `collapsible`
 * to allow closing it); `type="multiple"` allows many. Uncontrolled via
 * `defaultValue` (string, or string[] for multiple).
 */
export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  items: AccordionItem[]
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  collapsible?: boolean
}
export declare function Accordion(props: AccordionProps): React.JSX.Element
