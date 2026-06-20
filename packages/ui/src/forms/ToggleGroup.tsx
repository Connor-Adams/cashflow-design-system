import * as React from 'react'

export interface ToggleItem {
  value: string
  label: React.ReactNode
  icon?: React.ReactNode
}

/**
 * Segmented control. `type="single"` selects one option (active segment lifts
 * to a card surface); `type="multiple"` toggles several. Controlled via `value`
 * + `onValueChange`, or uncontrolled via `defaultValue`. Value is a string for
 * single, string[] for multiple.
 */
export interface ToggleGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  items: ToggleItem[]
  type?: 'single' | 'multiple'
  value?: string | string[] | null
  defaultValue?: string | string[] | null
  onValueChange?: (value: string | string[] | null) => void
  size?: 'sm' | 'default'
}

export function ToggleGroup({ items = [], type = 'single', value, defaultValue, onValueChange, size = 'default', className, style, ...props }: ToggleGroupProps): React.JSX.Element {
  const initial = defaultValue != null ? defaultValue : (type === 'multiple' ? [] : null)
  const [internal, setInternal] = React.useState<string | string[] | null>(initial)
  const isControlled = value !== undefined
  const current = isControlled ? value : internal

  const isActive = (v: string) => (type === 'multiple' ? ((current as string[] | null) || []).includes(v) : current === v)
  const pick = (v: string) => {
    let next: string | string[] | null
    if (type === 'multiple') {
      const arr = (current as string[] | null) || []
      next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
    } else {
      next = current === v ? null : v
    }
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  const pad = size === 'sm' ? '5px 10px' : '7px 13px'
  const fs = size === 'sm' ? 'var(--text-body-sm)' : 'var(--text-body)'

  return (
    <div role="group" className={className} style={{ display: 'inline-flex', gap: 4, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', background: 'color-mix(in oklch, var(--muted) 55%, transparent)', padding: 4, fontFamily: 'var(--font-sans)', ...style }} {...props}>
      {items.map((it) => {
        const active = isActive(it.value)
        return (
          <button
            key={it.value}
            type="button"
            aria-pressed={active}
            onClick={() => pick(it.value)}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap',
              borderRadius: 'var(--radius-md)', border: 'none', padding: pad, fontSize: fs,
              fontWeight: 'var(--weight-medium)' as React.CSSProperties['fontWeight'], fontFamily: 'var(--font-sans)', cursor: 'pointer',
              transition: 'color 150ms, background-color 150ms, box-shadow 150ms',
              background: active ? 'var(--card)' : 'transparent',
              color: active ? 'var(--foreground)' : 'color-mix(in oklch, var(--muted-foreground) 80%, var(--foreground))',
              boxShadow: active ? 'var(--shadow)' : 'none',
            }}
          >
            {it.icon && <span style={{ display: 'inline-flex' }}>{it.icon}</span>}
            {it.label}
          </button>
        )
      })}
    </div>
  )
}
