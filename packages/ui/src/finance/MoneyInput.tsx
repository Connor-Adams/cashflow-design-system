import * as React from 'react'
import './MoneyInput.css'

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

export const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(function MoneyInput(
  {
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
  },
  ref,
): React.JSX.Element {
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
      data-size={size}
      data-invalid={invalid ? 'true' : undefined}
      data-disabled={disabled ? 'true' : undefined}
      className="ca-money-input-root"
      style={style}
    >
      {hasToggle && (
        <button
          type="button"
          className="ca-money-input-toggle"
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
        ref={ref}
        inputMode="decimal"
        data-size={size}
        className={className ? `ca-money-input ${className}` : 'ca-money-input'}
        value={display}
        disabled={disabled}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => commit(e.target.value)}
        style={{
          fontSize: size === 'sm' ? 'var(--text-body-sm)' : 'var(--text-body)',
        }}
        {...props}
      />
      <span style={{ display: 'inline-flex', alignItems: 'center', paddingRight: 10, color: 'var(--muted-foreground)', fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)' }}>{currency}</span>
    </div>
  )
})
