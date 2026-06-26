import * as React from 'react'
import './CategoryPill.css'
import { GLYPHS, Icon, type IconName } from '../core/Icon'
import { categoryVisual, type CategoryOverrides } from './categoryIcon'

/**
 * Transaction-category chip — tinted icon + label. The icon and tint are
 * inferred from the category/merchant text by keyword (see {@link categoryVisual}),
 * so arbitrary names ("Eating Out", "Spotify", "cc fees") get sensible glyphs
 * instead of falling to a generic default.
 *
 * Precedence for the glyph: `icon` (raw node) › `iconName` (registry name —
 * the seam for a stored "icon per category") › `overrides` map › keyword
 * inference. `color` overrides the tint.
 *
 * `interactive` renders a button for filtering/reassigning.
 */
export interface CategoryPillProps extends React.HTMLAttributes<HTMLElement> {
  category?: string
  label?: React.ReactNode
  /** Raw SVG geometry to render instead of any inferred/registry glyph. */
  icon?: React.ReactNode
  /** A glyph from the icon registry by name — e.g. an app's stored category icon. */
  iconName?: IconName
  /** App-supplied category→icon map; wins over keyword inference. */
  overrides?: CategoryOverrides
  color?: string
  interactive?: boolean
  size?: 'sm' | 'default'
}

export const CategoryPill = React.forwardRef<HTMLElement, CategoryPillProps>(function CategoryPill(
  { category = 'default', label, icon, iconName, overrides, color, interactive = false, size = 'default', className, style, onClick, ...props },
  ref,
): React.JSX.Element {
  const visual = categoryVisual(category, overrides)
  const resolvedIcon = iconName ?? visual.icon
  const tint = color || visual.tint
  // brand: marks are filled logos resolved by Icon; stroke glyphs render inline
  // here so they pick up the category tint as their stroke.
  const isBrand = icon === undefined && resolvedIcon.startsWith('brand:')
  const glyph = icon !== undefined ? icon : GLYPHS[resolvedIcon as keyof typeof GLYPHS]
  const text = label != null ? label : (category.charAt(0).toUpperCase() + category.slice(1))
  const sm = size === 'sm'
  const Tag = interactive ? 'button' : 'span'

  return (
    <Tag
      ref={ref as React.Ref<HTMLButtonElement & HTMLSpanElement>}
      data-slot="category-pill"
      data-size={size}
      className={className ? `ca-category-pill ${className}` : 'ca-category-pill'}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement & HTMLSpanElement>}
      type={interactive ? 'button' : undefined}
      style={{
        background: `color-mix(in oklch, ${tint} 14%, transparent)`,
        color: `color-mix(in oklch, ${tint} 72%, var(--foreground))`,
        ...style,
      }}
      {...(props as React.HTMLAttributes<HTMLButtonElement & HTMLSpanElement>)}
    >
      {isBrand ? (
        <Icon name={resolvedIcon} brand size={sm ? 12 : 13} className="ca-category-pill-icon" />
      ) : (
        <svg data-icon={icon === undefined ? resolvedIcon : undefined} width={sm ? 12 : 13} height={sm ? 12 : 13} viewBox="0 0 24 24" fill="none" stroke={tint} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="ca-category-pill-icon">{glyph}</svg>
      )}
      {text}
    </Tag>
  )
})
