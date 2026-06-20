import * as React from 'react'
import './AccountCard.css'

/**
 * Cashflow AccountCard. A connected-account tile: institution glyph, account
 * name + masked number, current balance (AmountText-style mono), and an
 * optional sync status. `kind` tints the institution chip. Set `selected` for
 * the active account in a list, and pass `onClick` to make it interactive.
 */
export interface AccountCardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  name: React.ReactNode
  institution?: string
  mask?: string
  balance?: number
  currency?: string
  locale?: string
  kind?: 'chequing' | 'savings' | 'credit' | 'investment' | 'cash' | 'default'
  status?: 'synced' | 'syncing' | 'error'
  selected?: boolean
  onClick?: () => void
}

const KIND_TINT: Record<'chequing' | 'savings' | 'credit' | 'investment' | 'cash' | 'default', string> = {
  chequing: 'var(--chart-steel)',
  savings: 'var(--positive)',
  credit: 'var(--oxblood-400)',
  investment: 'var(--gradient-hero-to)',
  cash: 'var(--amber-w-500)',
  default: 'var(--muted-foreground)',
}

export const AccountCard = React.forwardRef<HTMLElement, AccountCardProps>(function AccountCard(
  {
    name,
    institution,
    mask,
    balance = 0,
    currency = 'CAD',
    locale = 'en-CA',
    kind = 'default',
    status,
    selected = false,
    onClick,
    className,
    style,
    ...props
  },
  ref,
): React.JSX.Element {
  const tint = KIND_TINT[kind] || KIND_TINT.default
  const interactive = typeof onClick === 'function'
  const Tag = interactive ? 'button' : 'div'
  const negative = balance < 0
  const formatted = (() => {
    try { return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(Math.abs(balance)) }
    catch (e) { return `${currency} ${Math.abs(balance).toFixed(2)}` }
  })()

  return (
    <Tag
      ref={ref as React.Ref<HTMLButtonElement & HTMLDivElement>}
      data-slot="account-card"
      data-kind={kind}
      data-selected={selected ? 'true' : undefined}
      data-interactive={interactive ? 'true' : undefined}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement & HTMLDivElement>}
      type={interactive ? 'button' : undefined}
      className={className ? `ca-account-card ${className}` : 'ca-account-card'}
      style={style}
      {...(props as React.HTMLAttributes<HTMLButtonElement & HTMLDivElement>)}
    >
      <div className="ca-account-card-head">
        <span className="ca-account-card-glyph" style={{ background: `color-mix(in oklch, ${tint} 16%, transparent)`, color: tint }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
        </span>
        <div className="ca-account-card-meta">
          <span className="ca-account-card-name">{name}</span>
          <span className="ca-account-card-sub">
            {institution ? institution + ' ' : ''}{mask ? '••' + mask : ''}
          </span>
        </div>
      </div>
      <div className="ca-account-card-foot">
        <div className="ca-account-card-balance">
          <span className="ca-account-card-label">{kind === 'credit' ? 'Balance owing' : 'Balance'}</span>
          <span className="ca-account-card-amount" style={{ color: negative ? 'var(--negative)' : 'var(--foreground)' }}>
            {negative ? '−' : ''}{formatted}
          </span>
        </div>
        {status && (
          <span className="ca-account-card-status" data-status={status}>
            <span className="ca-account-card-dot" style={{ background: status === 'synced' ? 'var(--success)' : status === 'error' ? 'var(--destructive)' : 'var(--warning)' }} />
            {status === 'synced' ? 'Synced' : status === 'error' ? 'Sync failed' : 'Syncing…'}
          </span>
        )}
      </div>
    </Tag>
  )
})
