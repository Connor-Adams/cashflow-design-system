import * as React from 'react'

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
export declare function Link(props: LinkProps): React.JSX.Element
