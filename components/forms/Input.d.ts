import * as React from 'react'

/**
 * Single-line text field. 36px tall, `--input` border, oxblood focus ring.
 * Set `invalid` (or `aria-invalid`) for the destructive error treatment.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}
export declare function Input(props: InputProps): React.JSX.Element
