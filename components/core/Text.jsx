import React from 'react'

/**
 * Cashflow Text. The single typography primitive — every step of the type
 * scale via `variant`, rendered with a sensible default tag you can override
 * with `as`. Colors and sizes reach through the token layer; no raw values.
 */

const VARIANTS = {
  'display-lg':  { tag: 'h1', size: 'var(--text-display-lg)', lh: 'var(--text-display-lg-lh)', ls: 'var(--text-display-lg-ls)', weight: 'var(--weight-bold)' },
  'display':     { tag: 'h1', size: 'var(--text-display)',    lh: 'var(--text-display-lh)',    ls: 'var(--text-display-ls)',    weight: 'var(--weight-bold)' },
  'display-sm':  { tag: 'h2', size: 'var(--text-display-sm)', lh: 'var(--text-display-sm-lh)', ls: 'var(--text-display-sm-ls)', weight: 'var(--weight-bold)' },
  'headline-lg': { tag: 'h2', size: 'var(--text-headline-lg)', lh: 'var(--text-headline-lg-lh)', ls: 'var(--text-headline-lg-ls)', weight: 'var(--weight-semibold)' },
  'headline':    { tag: 'h3', size: 'var(--text-headline)',   lh: 'var(--text-headline-lh)',   ls: 'var(--text-headline-ls)',   weight: 'var(--weight-semibold)' },
  'headline-sm': { tag: 'h4', size: 'var(--text-headline-sm)', lh: 'var(--text-headline-sm-lh)', ls: 'var(--text-headline-sm-ls)', weight: 'var(--weight-semibold)' },
  'body-lg':     { tag: 'p', size: 'var(--text-body-lg)', lh: 'var(--text-body-lg-lh)', ls: 'var(--text-body-lg-ls)', weight: 'var(--weight-regular)' },
  'body':        { tag: 'p', size: 'var(--text-body)',    lh: 'var(--text-body-lh)',    ls: 'var(--text-body-ls)',    weight: 'var(--weight-regular)' },
  'body-sm':     { tag: 'p', size: 'var(--text-body-sm)',  lh: 'var(--text-body-sm-lh)',  ls: 'var(--text-body-sm-ls)',  weight: 'var(--weight-regular)' },
  'label':       { tag: 'span', size: 'var(--text-label)', lh: 1.4, ls: '0.06em', weight: 'var(--weight-semibold)', upper: true },
}

const TONES = {
  default: 'var(--foreground)',
  muted: 'var(--muted-foreground)',
  primary: 'var(--primary)',
  positive: 'var(--positive)',
  negative: 'var(--negative)',
  inherit: 'inherit',
}

export function Text({
  variant = 'body',
  as,
  tone = 'default',
  weight,
  mono = false,
  align,
  truncate = false,
  className,
  style,
  children,
  ...props
}) {
  const v = VARIANTS[variant] || VARIANTS.body
  const Tag = as || v.tag

  const truncStyle = truncate
    ? { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
    : null

  return (
    <Tag
      data-slot="text"
      className={className}
      style={{
        margin: 0,
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
        fontSize: v.size,
        lineHeight: v.lh,
        letterSpacing: v.ls,
        fontWeight: weight ? `var(--weight-${weight})` : v.weight,
        textTransform: v.upper ? 'uppercase' : 'none',
        color: TONES[tone] || tone,
        textAlign: align,
        textWrap: variant.startsWith('display') || variant.startsWith('headline') ? 'balance' : 'pretty',
        ...truncStyle,
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  )
}
