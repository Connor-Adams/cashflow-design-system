import * as React from 'react'
import './Accordion.css'

export interface AccordionItem {
  value: string
  title: React.ReactNode
  content: React.ReactNode
}

/**
 * Cashflow Accordion. A stack of disclosure rows over hairline dividers.
 * `type="single"` (default) keeps one panel open; `type="multiple"` allows
 * many. Uncontrolled via `defaultValue`; pass `items` as { value, title, content }.
 *
 * Trigger focus-visible ring, the chevron rotation and the panel open/close
 * animation live in `Accordion.css`, keyed off `data-state`.
 */

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

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  { items = [], type = 'single', defaultValue, collapsible = true, className, ...props },
  ref,
): React.JSX.Element {
  const initial = defaultValue != null ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : []
  const [open, setOpen] = React.useState<string[]>(initial)

  const toggle = (value: string) => {
    setOpen((cur) => {
      const isOpen = cur.includes(value)
      if (type === 'multiple') return isOpen ? cur.filter((v) => v !== value) : [...cur, value]
      if (isOpen) return collapsible ? [] : cur
      return [value]
    })
  }

  return (
    <div ref={ref} data-slot="accordion" className={className ? `ca-accordion ${className}` : 'ca-accordion'} {...props}>
      {items.map((it) => {
        const isOpen = open.includes(it.value)
        const state = isOpen ? 'open' : 'closed'
        return (
          <div key={it.value} className="ca-accordion__item">
            <button
              type="button"
              className="ca-accordion__trigger"
              data-state={state}
              onClick={() => toggle(it.value)}
              aria-expanded={isOpen}
            >
              {it.title}
              <svg className="ca-accordion__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </button>
            <div className="ca-accordion__panel" data-state={state}>
              <div className="ca-accordion__panel-inner">
                <div className="ca-accordion__content">{it.content}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
})
