import * as React from 'react'

export interface PeriodPreset {
  value: string
  label: string
}

/**
 * Ledger date-range control — preset periods in a popover, with an optional
 * custom from/to range. Controlled via `value` + `onValueChange`. When `value`
 * is "custom", two date inputs appear and `onCustomChange` fires with
 * { from, to } ISO strings.
 */
export interface PeriodSelectorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string
  onValueChange?: (value: string) => void
  custom?: { from?: string; to?: string }
  onCustomChange?: (range: { from?: string; to?: string }) => void
  presets?: PeriodPreset[]
  size?: 'sm' | 'default'
}

const PRESETS: PeriodPreset[] = [
  { value: 'this-month', label: 'This month' },
  { value: 'last-30', label: 'Last 30 days' },
  { value: 'this-quarter', label: 'This quarter' },
  { value: 'ytd', label: 'Year to date' },
  { value: 'this-year', label: 'This year' },
  { value: 'custom', label: 'Custom range' },
]

export function PeriodSelector({ value = 'this-month', onValueChange, custom, onCustomChange, presets = PRESETS, size = 'default', className, style, ...props }: PeriodSelectorProps): React.JSX.Element {
  const [open, setOpen] = React.useState<boolean>(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const current = presets.find((p) => p.value === value) || presets[0]

  React.useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent): void => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent): void => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey) }
  }, [open])

  const h = size === 'sm' ? 32 : 36
  const pick = (v: string): void => { onValueChange?.(v); if (v !== 'custom') setOpen(false) }
  const setCustom = (k: 'from' | 'to', val: string): void => onCustomChange?.({ ...(custom || {}), [k]: val })

  return (
    <div ref={ref} data-slot="period-selector" className={className} style={{ position: 'relative', display: 'inline-block', fontFamily: 'var(--font-sans)', ...style }} {...props}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, height: h, padding: '0 12px',
          borderRadius: 'var(--radius-md)', border: `1px solid ${open ? 'var(--ring)' : 'var(--input)'}`,
          background: 'var(--card)', color: 'var(--foreground)', cursor: 'pointer',
          fontSize: size === 'sm' ? 'var(--text-body-sm)' : 'var(--text-body)', fontWeight: 'var(--weight-medium)' as React.CSSProperties['fontWeight'],
          boxShadow: open ? '0 0 0 3px color-mix(in oklch, var(--ring) 35%, transparent)' : 'none', transition: 'border-color 150ms, box-shadow 150ms',
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
        {current!.label}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && (
        <div role="menu" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 70, minWidth: 200, padding: 4, background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow)' }}>
          {presets.map((p) => {
            const active = p.value === value
            return (
              <button
                key={p.value}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => pick(p.value)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%', textAlign: 'left',
                  border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 9px', cursor: 'pointer',
                  fontSize: 'var(--text-body)', fontFamily: 'var(--font-sans)',
                  background: active ? 'var(--accent)' : 'transparent', color: active ? 'var(--accent-foreground)' : 'var(--foreground)',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { if (!active) e.currentTarget.style.background = 'var(--muted)' }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                {p.label}
                {active && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
              </button>
            )
          })}
          {value === 'custom' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 9px 6px', borderTop: '1px solid var(--border)', marginTop: 4 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 'var(--text-body-sm)', color: 'var(--muted-foreground)' }}>
                From
                <input type="date" value={custom?.from || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustom('from', e.target.value)} style={{ height: 32, borderRadius: 'var(--radius-sm)', border: '1px solid var(--input)', padding: '0 8px', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body-sm)', background: 'var(--background)', color: 'var(--foreground)' }} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 'var(--text-body-sm)', color: 'var(--muted-foreground)' }}>
                To
                <input type="date" value={custom?.to || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustom('to', e.target.value)} style={{ height: 32, borderRadius: 'var(--radius-sm)', border: '1px solid var(--input)', padding: '0 8px', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body-sm)', background: 'var(--background)', color: 'var(--foreground)' }} />
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
