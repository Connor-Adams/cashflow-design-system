import * as React from 'react'
import './CategoryPill.css'
import { GLYPHS } from '../core/Icon'
import { categoryVisual } from './categoryIcon'

/**
 * Transaction-category chip — tinted icon + label. The icon and tint are
 * inferred from the category/merchant text by keyword (see {@link categoryVisual}),
 * so arbitrary names ("Eating Out", "Spotify", "cc fees") get sensible glyphs
 * instead of falling to a generic default. Override with `icon` and `color`.
 * `interactive` renders a button for filtering/reassigning.
 */
export interface CategoryPillProps extends React.HTMLAttributes<HTMLElement> {
  category?: string
  label?: React.ReactNode
  icon?: React.ReactNode
  color?: string
  interactive?: boolean
  size?: 'sm' | 'default'
}

export const CategoryPill = React.forwardRef<HTMLElement, CategoryPillProps>(function CategoryPill(
  { category = 'default', label, icon, color, interactive = false, size = 'default', className, style, onClick, ...props },
  ref,
): React.JSX.Element {
  const visual = categoryVisual(category)
  const tint = color || visual.tint
  const glyph = icon !== undefined ? icon : GLYPHS[visual.icon]
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
      <svg data-icon={icon === undefined ? visual.icon : undefined} width={sm ? 12 : 13} height={sm ? 12 : 13} viewBox="0 0 24 24" fill="none" stroke={tint} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="ca-category-pill-icon">{glyph}</svg>
      {text}
    </Tag>
  )
})
