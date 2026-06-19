import * as React from 'react'

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'count'

/**
 * Small status / category / count pill. `default` is the oxblood brand fill;
 * `secondary` is the neutral workhorse; `count` is the uppercase counter chip.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export declare function Badge(props: BadgeProps): React.JSX.Element
