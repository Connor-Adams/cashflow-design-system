import React from 'react'

/**
 * Cashflow AccountCard. A connected-account tile: institution glyph, account
 * name + masked number, current balance (AmountText-style mono), and an
 * optional sync status. `kind` tints the institution chip. Set `selected` for
 * the active account in a list, and pass `onClick` to make it interactive.
 */
const KIND_TINT = {
  chequing: 'var(--chart-steel)',
  savings: 'var(--positive)',
  credit: 'var(--oxblood-400)',
  investment: 'var(--gradient-hero-to)',
  cash: 'var(--amber-w-500)',
  default: 'var(--muted-foreground)',
}

export function AccountCard({
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
}) {
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
      data-slot="account-card"
      onClick={onClick}
      type={interactive ? 'button' : undefined}
      className={className}
      style={{
        display: 'flex', flexDirection: 'column', gap: 14, width: '100%', textAlign: 'left', boxSizing: 'border-box',
        padding: 16, borderRadius: 'var(--radius-xl)',
        border: `1px solid ${selected ? 'var(--ring)' : 'var(--border)'}`,
        background: 'var(--card)', color: 'var(--foreground)',
        boxShadow: selected ? '0 0 0 3px color-mix(in oklch, var(--ring) 30%, transparent), var(--shadow)' : 'var(--shadow)',
        cursor: interactive ? 'pointer' : 'default', fontFamily: 'var(--font-sans)',
        transition: 'border-color 150ms, box-shadow 150ms', ...style,
      }}
      {...props}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 34, height: 34, flex: 'none', borderRadius: 'var(--radius-md)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: `color-mix(in oklch, ${tint} 16%, transparent)`, color: tint }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25, minWidth: 0 }}>
          <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--weight-semibold)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
          <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
            {institution ? institution + ' ' : ''}{mask ? '••' + mask : ''}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 'var(--text-label)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 'var(--weight-semibold)', color: 'var(--muted-foreground)' }}>{kind === 'credit' ? 'Balance owing' : 'Balance'}</span>
          <span style={{ fontSize: 'var(--text-headline-sm)', fontWeight: 'var(--weight-bold)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: negative ? 'var(--negative)' : 'var(--foreground)' }}>
            {negative ? '−' : ''}{formatted}
          </span>
        </div>
        {status && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 'var(--text-body-sm)', color: status === 'error' ? 'var(--destructive)' : 'var(--muted-foreground)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: status === 'synced' ? 'var(--success)' : status === 'error' ? 'var(--destructive)' : 'var(--warning)' }} />
            {status === 'synced' ? 'Synced' : status === 'error' ? 'Sync failed' : 'Syncing…'}
          </span>
        )}
      </div>
    </Tag>
  )
}
