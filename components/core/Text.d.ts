import * as React from 'react'

export type TextVariant =
  | 'display-lg' | 'display' | 'display-sm'
  | 'headline-lg' | 'headline' | 'headline-sm'
  | 'body-lg' | 'body' | 'body-sm'
  | 'label'

export type TextTone = 'default' | 'muted' | 'primary' | 'positive' | 'negative' | 'inherit' | (string & {})
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold'

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
export declare function Text(props: TextProps): React.JSX.Element
