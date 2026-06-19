import React from 'react'

/**
 * Cashflow AmountText. The money value primitive — renders a signed currency
 * amount in the mono face with load-bearing color: --positive (green) for money
 * in, --negative (oxblood) for money out. Sign is inferred from `value` unless
 * you pass `direction`. Set `colored={false}` for a neutral foreground amount.
 */
const SIZES = {
  sm: 'var(--text-body-sm)',
  default: 'var(--text-body)',
  lg: 'var(--text-headline-sm)',
  xl: 'var(--text-display-sm)',
}

function formatAmount(abs, currency, locale, decimals) {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency', currency,
      minimumFractionDigits: decimals, maximumFractionDigits: decimals,
    }).format(abs)
  } catch (e) {
    return `${currency} ${abs.toFixed(decimals)}`
  }
}

export function AmountText({
  value = 0,
  currency = 'CAD',
  locale = 'en-CA',
  direction,
  colored = true,
  showSign = true,
  decimals = 2,
  size = 'default',
  weight = 'bold',
  className,
  style,
  ...props
}) {
  const dir = direction || (value > 0 ? 'in' : value < 0 ? 'out' : 'zero')
  const abs = Math.abs(value)
  const sign = dir === 'in' ? '+' : dir === 'out' ? '−' : ''
  const color = !colored ? 'var(--foreground)' : dir === 'in' ? 'var(--positive)' : dir === 'out' ? 'var(--negative)' : 'var(--muted-foreground)'

  return (
    <span
      data-slot="amount"
      data-direction={dir}
      className={className}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: typeof size === 'number' ? size : (SIZES[size] || SIZES.default),
        fontWeight: `var(--weight-${weight})`,
        fontVariantNumeric: 'tabular-nums',
        color,
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...props}
    >
      {showSign && sign ? sign : ''}{formatAmount(abs, currency, locale, decimals)}
    </span>
  )
}
