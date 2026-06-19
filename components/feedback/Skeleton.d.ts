import * as React from 'react'

/** Loading placeholder with the hero-gradient shimmer sweep. */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  w?: number | string
  h?: number | string
}
export declare function Skeleton(props: SkeletonProps): React.JSX.Element

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number
}
export declare function SkeletonText(props: SkeletonTextProps): React.JSX.Element
