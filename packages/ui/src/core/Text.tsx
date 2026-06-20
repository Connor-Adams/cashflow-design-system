import * as React from 'react'
import './Text.css'

/**
 * Cashflow Text. The single typography primitive — every step of the type
 * scale via `variant`, rendered with a sensible default tag you can override
 * with `as`. Colors and sizes reach through the token layer; no raw values.
 */

export type TextVariant =
  | 'display-lg' | 'display' | 'display-sm'
  | 'headline-lg' | 'headline' | 'headline-sm'
  | 'body-lg' | 'body' | 'body-sm'
  | 'label'

export type TextTone = 'default' | 'muted' | 'primary' | 'positive' | 'negative' | 'inherit' | (string & {})
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold'

interface VariantSpec {
  tag: string
  size: string
  lh: string | number
  ls: string
  weight: string
  upper?: boolean
}

const VARIANTS: Record<TextVariant, VariantSpec> = {
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

const TONES: Record<string, string> = {
  default: 'var(--foreground)',
  muted: 'var(--muted-foreground)',
  primary: 'var(--primary)',
  positive: 'var(--positive)',
  negative: 'var(--negative)',
  inherit: 'inherit',
}

/**
 * The typography primitive. `variant` picks a step of the type scale (and a
 * sensible default tag); override the tag with `as`. `tone` maps to semantic
 * text colors, `mono` switches to the mono face, `truncate` ellipsises one line.
 */
export interface TextProps extends Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
  variant?: TextVariant
  as?: keyof JSX.IntrinsicElements
  tone?: TextTone
  weight?: TextWeight
  mono?: boolean
  align?: 'left' | 'center' | 'right'
  truncate?: boolean
}

export const Text = React.forwardRef<HTMLElement, TextProps>(function Text(
  {
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
  },
  ref,
): React.JSX.Element {
  const v = VARIANTS[variant] || VARIANTS['body']!
  const tag = as || v.tag

  const truncStyle: React.CSSProperties | null = truncate
    ? { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
    : null

  const computedStyle: React.CSSProperties = {
    margin: 0,
    fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
    fontSize: v.size,
    lineHeight: v.lh as React.CSSProperties['lineHeight'],
    letterSpacing: v.ls,
    fontWeight: (weight ? `var(--weight-${weight})` : v.weight) as React.CSSProperties['fontWeight'],
    textTransform: v.upper ? 'uppercase' : 'none',
    color: TONES[tone] || tone,
    textAlign: align,
    textWrap: (variant.startsWith('display') || variant.startsWith('headline') ? 'balance' : 'pretty') as React.CSSProperties['textWrap'],
    ...truncStyle,
    ...style,
  }

  return React.createElement(
    tag,
    {
      ref,
      'data-slot': 'text',
      'data-variant': variant,
      className: className ? `ca-text ${className}` : 'ca-text',
      style: computedStyle,
      ...props,
    },
    children,
  )
})
