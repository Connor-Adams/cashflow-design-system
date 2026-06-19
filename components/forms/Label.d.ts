import * as React from 'react'

/** Field label that sits ABOVE its control. Wrap the control as a child. */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}
export declare function Label(props: LabelProps): React.JSX.Element
