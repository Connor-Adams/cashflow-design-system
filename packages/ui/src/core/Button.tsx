import * as React from 'react'

export type ButtonVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'danger'
  | 'link'

export type ButtonSize = 'sm' | 'default' | 'lg' | 'icon'

/**
 * Primary action control. Solid oxblood `primary` for the main CTA; neutral
 * `secondary`/`outline`/`ghost` for everything else; tinted `destructive` for
 * delete actions. Greyscale by default — oxblood is precious. All colors reach
 * through the semantic token layer — no raw hex.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual treatment. Default solid oxblood. */
  variant?: ButtonVariant
  /** Control height. `icon` is a 40×40 square. */
  size?: ButtonSize
}

const SIZES: Record<ButtonSize, React.CSSProperties> = {
  sm: { height: 36, padding: '0 12px', fontSize: 'var(--text-body)' },
  default: { height: 40, padding: '0 16px', fontSize: 'var(--text-body)' },
  lg: { height: 44, padding: '0 32px', fontSize: 'var(--text-body-lg)' },
  icon: { height: 40, width: 40, padding: 0, fontSize: 'var(--text-body)' },
}

function variantStyle(variant: ButtonVariant): React.CSSProperties {
  switch (variant) {
    case 'secondary':
      return { background: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--border)' }
    case 'outline':
      return { background: 'transparent', color: 'var(--foreground)', border: '1px solid var(--input)' }
    case 'ghost':
      return { background: 'transparent', color: 'var(--foreground)', border: '1px solid color-mix(in oklch, var(--border) 60%, transparent)' }
    case 'destructive':
    case 'danger':
      return {
        background: 'color-mix(in oklch, var(--destructive) 12%, transparent)',
        color: 'var(--destructive)',
        border: '1px solid var(--destructive)',
      }
    case 'link':
      return { background: 'transparent', color: 'var(--text-link)', border: '1px solid transparent', textUnderlineOffset: 4 }
    case 'primary':
    case 'default':
    default:
      return { background: 'var(--primary)', color: 'var(--primary-foreground)', border: '1px solid transparent' }
  }
}

function hoverBg(variant: ButtonVariant): string {
  switch (variant) {
    case 'secondary': return 'var(--muted)'
    case 'outline':
    case 'ghost': return 'var(--accent)'
    case 'destructive':
    case 'danger': return 'color-mix(in oklch, var(--destructive) 20%, transparent)'
    case 'link': return 'transparent'
    default: return 'color-mix(in oklch, var(--primary) 88%, black)'
  }
}

export function Button({
  variant = 'default',
  size = 'default',
  disabled = false,
  type = 'button',
  className,
  style,
  children,
  ...props
}: ButtonProps): React.JSX.Element {
  const [hover, setHover] = React.useState(false)
  const sz = SIZES[size] ?? SIZES.default
  const base = variantStyle(variant)
  const merged: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    whiteSpace: 'nowrap',
    borderRadius: 'var(--radius-lg)',
    fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'],
    fontFamily: 'var(--font-sans)',
    lineHeight: 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'background-color 150ms, border-color 150ms, color 150ms',
    height: sz.height,
    width: sz.width,
    padding: sz.padding,
    fontSize: sz.fontSize,
    textDecoration: variant === 'link' && hover ? 'underline' : 'none',
    ...base,
    ...(hover && !disabled ? { background: hoverBg(variant) } : null),
    ...style,
  }
  return (
    <button
      type={type}
      data-slot="button"
      data-variant={variant}
      className={className}
      style={merged}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...props}
    >
      {children}
    </button>
  )
}
