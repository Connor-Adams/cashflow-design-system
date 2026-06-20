import * as React from 'react'
import './Label.css'

/**
 * Field label that sits ABOVE its control. Wrap the control as a child, or
 * associate via `htmlFor`. Styling lives in `Label.css`; the ref forwards to
 * the native `<label>`.
 */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, children, ...props },
  ref,
): React.JSX.Element {
  return (
    <label
      ref={ref}
      data-slot="label"
      className={className ? `ca-label ${className}` : 'ca-label'}
      {...props}
    >
      {children}
    </label>
  )
})
