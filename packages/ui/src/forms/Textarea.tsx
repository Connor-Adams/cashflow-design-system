import * as React from 'react'
import './Textarea.css'

/**
 * Multi-line text field. Same treatment as Input, min-height 64px, resizable.
 * Interactive states live in `Textarea.css`; the ref forwards to the native
 * `<textarea>` for react-hook-form / `focus()`.
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, ...props },
  ref,
): React.JSX.Element {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      aria-invalid={invalid || props['aria-invalid'] || undefined}
      className={className ? `ca-textarea ${className}` : 'ca-textarea'}
      {...props}
    />
  )
})
