import * as React from 'react'

/**
 * Currency amount field: leading symbol, right-aligned mono amount, trailing
 * currency code, and an optional in/out direction toggle. `onValueChange`
 * receives the parsed number (or null) and the raw string. Groups digits on
 * blur. Controlled via `value` or uncontrolled via `defaultValue`.
 */
export interface MoneyInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: number | string
  defaultValue?: number | string
  onValueChange?: (value: number | null, raw: string) => void
  currency?: string
  locale?: string
  direction?: 'in' | 'out'
  onDirectionChange?: (direction: 'in' | 'out') => void
  disabled?: boolean
  invalid?: boolean
  size?: 'sm' | 'default'
  placeholder?: string
}

const SYMBOLS: Record<string, string> = { CAD: '$', USD: '$', EUR: '€', GBP: '£', AUD: '$', JPY: '¥' }

export function MoneyInput({
  value,
  defaultValue = '',
  onValueChange,
  currency = 'CAD',
  locale = 'en-CA',
  direction,
  onDirectionChange,
  disabled,
  invalid,
  size = 'default',
  placeholder = '0.00',
  className,
  style,
  ...props
}: MoneyInputProps): React.JSX.Element {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<string>(defaultValue === '' ? '' : String(defaultValue))
  const [focused, setFocused] = React.useState<boolean>(false)
  const raw = isControlled ? (value === '' || value == null ? '' : String(value)) : internal

  const h = size === 'sm' ? 32 : 36
  const sym = SYMBOLS[currency] || ''

  const commit = (str: string): void => {
    if (!isControlled) setInternal(str)
    const num = str === '' ? null : Number(str.replace(/[^0-9.\-]/g, ''))
    onValueChange?.(Number.isNaN(num) ? null : num, str)
  }

  const display = (() => {
    if (focused || raw === '') return raw
    const n = Number(raw)
    if (Number.isNaN(n)) return raw
    return n.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  })()

  const hasToggle = direction !== undefined

  return (
    <div
      data-slot="money-input"
      className={className}
      style={{
        display: 'inline-flex', alignItems: 'stretch', height: h, width: 'fit-content',
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${invalid ? 'var(--destructive)' : focused ? 'var(--ring)' : 'var(--input)'}`,
        background: 'color-mix(in oklch, var(--background) 70%, transparent)',
        boxShadow: focused ? `0 0 0 3px color-mix(in oklch, ${invalid ? 'var(--destructive)' : 'var(--ring)'} 35%, transparent)` : 'none',
        opacity: disabled ? 0.6 : 1, transition: 'border-color 150ms, box-shadow 150ms',
        fontFamily: 'var(--font-sans)', overflow: 'hidden', ...style,
      }}
      {...props}
    >
      {hasToggle && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => onDirectionChange?.(direction === 'in' ? 'out' : 'in')}
          aria-label={direction === 'in' ? 'Money in' : 'Money out'}
          style={{
            width: h, flex: 'none', border: 'none', borderRight: '1px solid var(--border)', cursor: disabled ? 'not-allowed' : 'pointer',
            background: direction === 'in' ? 'color-mix(in oklch, var(--positive) 14%, transparent)' : 'color-mix(in oklch, var(--negative) 14%, transparent)',
            color: direction === 'in' ? 'var(--positive)' : 'var(--negative)', fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 'var(--weight-bold)' as React.CSSProperties['fontWeight'],
          }}
        >{direction === 'in' ? '+' : '−'}</button>
      )}
      <span style={{ display: 'inline-flex', alignItems: 'center', paddingLeft: 10, paddingRight: 2, color: 'var(--muted-foreground)', fontSize: size === 'sm' ? 'var(--text-body-sm)' : 'var(--text-body)' }}>{sym}</span>
      <input
        inputMode="decimal"
        value={display}
        disabled={disabled}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => commit(e.target.value)}
        style={{
          width: 96, border: 'none', outline: 'none', background: 'transparent', textAlign: 'right',
          padding: '0 10px 0 2px', fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'],
          fontSize: size === 'sm' ? 'var(--text-body-sm)' : 'var(--text-body)', color: 'var(--foreground)',
          fontVariantNumeric: 'tabular-nums',
        }}
      />
      <span style={{ display: 'inline-flex', alignItems: 'center', paddingRight: 10, color: 'var(--muted-foreground)', fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)' }}>{currency}</span>
    </div>
  )
}
