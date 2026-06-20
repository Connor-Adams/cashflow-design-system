import * as React from 'react'
import './Link.css'

/**
 * Cashflow Link. An inline anchor in --text-link with underline-on-hover.
 * `muted` for secondary links; `subtle` removes the color (foreground link
 * that only underlines on hover). Pass `external` to get the ↗ affordance.
 *
 * Hover underline and the focus-visible ring live in `Link.css`, not JS — so
 * keyboard focus is visible and there is no re-render on hover.
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

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { muted = false, subtle = false, external = false, className, children, ...props },
  ref,
): React.JSX.Element {
  const variant = subtle ? 'subtle' : muted ? 'muted' : 'default'
  return (
    <a
      ref={ref}
      data-slot="link"
      data-variant={variant}
      className={className ? `ca-link ${className}` : 'ca-link'}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer noopener' : undefined}
      {...props}
    >
      {children}
      {external && (
        <svg width="0.8em" height="0.8em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 2, verticalAlign: 'baseline' }}><path d="M7 17 17 7M9 7h8v8" /></svg>
      )}
    </a>
  )
})
