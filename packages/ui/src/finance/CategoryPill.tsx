import * as React from 'react'

/**
 * Transaction-category chip — tinted icon + label. Ships icons/tints for the
 * common categories (groceries, income, dining, transport, subscriptions,
 * utilities, fees, housing); override with `icon` and `color`. `interactive`
 * renders a button for filtering/reassigning.
 */
export interface CategoryPillProps extends React.HTMLAttributes<HTMLElement> {
  category?: string
  label?: React.ReactNode
  icon?: React.ReactNode
  color?: string
  interactive?: boolean
  size?: 'sm' | 'default'
}

const ICONS: Record<string, React.JSX.Element> = {
  groceries: <><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></>,
  income: <><path d="M22 7 13.5 15.5l-5-5L2 17" /><path d="M16 7h6v6" /></>,
  dining: <><path d="M3 2v7c0 1.1.9 2 2 2h0a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></>,
  transport: <><path d="M8 6v6" /><path d="M15 6v6" /><path d="M2 12h19.6" /><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" /><circle cx="7" cy="18" r="2" /><circle cx="16" cy="18" r="2" /></>,
  subscriptions: <><path d="m17 2 4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" /></>,
  utilities: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></>,
  fees: <><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>,
  housing: <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>,
  default: <><circle cx="12" cy="12" r="3" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2" /></>,
}

const TINTS: Record<string, string> = {
  groceries: 'var(--gradient-hero-from)',
  income: 'var(--positive)',
  dining: 'var(--oxblood-400)',
  transport: 'var(--chart-steel)',
  subscriptions: 'var(--gradient-hero-to)',
  utilities: 'var(--amber-w-500)',
  fees: 'var(--destructive)',
  housing: 'var(--chart-steel)',
  default: 'var(--muted-foreground)',
}

export function CategoryPill({ category = 'default', label, icon, color, interactive = false, size = 'default', className, style, onClick, ...props }: CategoryPillProps): React.JSX.Element {
  const key = String(category).toLowerCase()
  const tint = color || TINTS[key] || TINTS['default']!
  const glyph = icon !== undefined ? icon : (ICONS[key] || ICONS['default']!)
  const text = label != null ? label : (category.charAt(0).toUpperCase() + category.slice(1))
  const sm = size === 'sm'
  const Tag = interactive ? 'button' : 'span'

  return (
    <Tag
      data-slot="category-pill"
      className={className}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement & HTMLSpanElement>}
      type={interactive ? 'button' : undefined}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: sm ? 5 : 6, width: 'fit-content', flexShrink: 0,
        borderRadius: 'var(--radius-md)', padding: sm ? '2px 8px 2px 6px' : '3px 10px 3px 7px',
        background: `color-mix(in oklch, ${tint} 14%, transparent)`,
        color: `color-mix(in oklch, ${tint} 72%, var(--foreground))`,
        border: '1px solid transparent', cursor: interactive ? 'pointer' : 'default',
        fontFamily: 'var(--font-sans)', fontSize: sm ? 'var(--text-body-sm)' : 'var(--text-body-sm)',
        fontWeight: 'var(--weight-medium)' as React.CSSProperties['fontWeight'], lineHeight: 1.3, whiteSpace: 'nowrap',
        ...style,
      }}
      {...(props as React.HTMLAttributes<HTMLButtonElement & HTMLSpanElement>)}
    >
      <svg width={sm ? 12 : 13} height={sm ? 12 : 13} viewBox="0 0 24 24" fill="none" stroke={tint} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}>{glyph}</svg>
      {text}
    </Tag>
  )
}
