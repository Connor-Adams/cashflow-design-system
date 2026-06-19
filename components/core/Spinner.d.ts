import * as React from 'react'

/**
 * Indeterminate loading ring. `size` is a named step or a px number; `tone`
 * sets the stroke (`current` inherits, so it tints inside a Button). Always
 * carries an aria-label.
 */
export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'default' | 'lg' | number
  tone?: 'current' | 'primary' | 'muted' | (string & {})
  label?: string
}
export declare function Spinner(props: SpinnerProps): React.JSX.Element
