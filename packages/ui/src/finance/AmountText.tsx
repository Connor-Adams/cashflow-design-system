import * as React from 'react'
import './AmountText.css'

/**
 * Signed currency amount in the mono face, with load-bearing money color:
 * green (`--positive`) in, oxblood (`--negative`) out. Sign is inferred from
 * `value` unless `direction` is given. `colored={false}` renders neutral.
 * Uses Intl.NumberFormat for `currency` + `locale`.
 */
export interface AmountTextProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  value: number
  currency?: string
  locale?: string
  direction?: 'in' | 'out' | 'zero'
  colored?: boolean
  showSign?: boolean
  decimals?: number
  size?: 'sm' | 'default' | 'lg' | 'xl' | number
  weight?: 'regular' | 'medium' | 'semibold' | 'bold'
}

const SIZES: Record<'sm' | 'default' | 'lg' | 'xl', string> = {
  sm: 'var(--text-body-sm)',
  default: 'var(--text-body)',
  lg: 'var(--text-headline-sm)',
  xl: 'var(--text-display-sm)',
}

function formatAmount(abs: number, currency: string, locale: string, decimals: number): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency', currency,
      minimumFractionDigits: decimals, maximumFractionDigits: decimals,
    }).format(abs)
  } catch (e) {
    return `${currency} ${abs.toFixed(decimals)}`
  }
}

export const AmountText = React.forwardRef<HTMLSpanElement, AmountTextProps>(function AmountText(
  {
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
  },
  ref,
): React.JSX.Element {
  const dir = direction || (value > 0 ? 'in' : value < 0 ? 'out' : 'zero')
  const abs = Math.abs(value)
  const sign = dir === 'in' ? '+' : dir === 'out' ? '−' : ''
  const color = !colored ? 'var(--foreground)' : dir === 'in' ? 'var(--positive)' : dir === 'out' ? 'var(--negative)' : 'var(--muted-foreground)'

  return (
    <span
      ref={ref}
      data-slot="amount"
      data-direction={dir}
      className={className ? `ca-amount ${className}` : 'ca-amount'}
      style={{
        fontSize: typeof size === 'number' ? size : (SIZES[size] || SIZES.default),
        fontWeight: `var(--weight-${weight})` as React.CSSProperties['fontWeight'],
        color,
        ...style,
      }}
      {...props}
    >
      {showSign && sign ? sign : ''}{formatAmount(abs, currency, locale, decimals)}
    </span>
  )
})
