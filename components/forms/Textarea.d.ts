import * as React from 'react'

/** Multi-line text field. Same treatment as Input, min-height 64px, resizable. */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}
export declare function Textarea(props: TextareaProps): React.JSX.Element
