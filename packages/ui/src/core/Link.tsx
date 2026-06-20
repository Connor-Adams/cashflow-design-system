import * as React from 'react'

/**
 * Cashflow Link. An inline anchor in --text-link with underline-on-hover.
 * `muted` for secondary links; `subtle` removes the color (foreground link
 * that only underlines on hover). Pass `external` to get the ↗ affordance.
 */

/**
 * Inline text link in `--text-link`, underline on hover. `muted` for secondary
 * links, `subtle` for a foreground-colored link, `external` appends a ↗ glyph
 * and sets target/rel.
 */
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  muted?: boolean
  subtle?: boolean
  external?: boolean
}

export function Link({ muted = false, subtle = false, external = false, className, style, children, ...props }: LinkProps): React.JSX.Element {
  const [hover, setHover] = React.useState(false)
  const color = subtle ? 'var(--foreground)' : muted ? 'var(--muted-foreground)' : 'var(--text-link)'
  return (
    <a
      data-slot="link"
      className={className}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer noopener' : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        color,
        fontFamily: 'var(--font-sans)',
        fontWeight: 'var(--weight-medium)' as React.CSSProperties['fontWeight'],
        textDecoration: hover ? 'underline' : 'none',
        textUnderlineOffset: 3,
        textDecorationColor: 'color-mix(in oklch, currentColor 45%, transparent)',
        cursor: 'pointer',
        borderRadius: 2,
        ...style,
      }}
      {...props}
    >
      {children}
      {external && (
        <svg width="0.8em" height="0.8em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 2, verticalAlign: 'baseline' }}><path d="M7 17 17 7M9 7h8v8" /></svg>
      )}
    </a>
  )
}
