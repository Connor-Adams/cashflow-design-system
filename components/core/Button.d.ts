import * as React from 'react'

export type ButtonVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'danger'
  | 'link'

export type ButtonSize = 'sm' | 'default' | 'lg' | 'icon'

/**
 * Cashflow's primary action control. Solid oxblood `primary` for the main CTA;
 * neutral `secondary`/`outline`/`ghost` for everything else; tinted
 * `destructive` for delete actions. Greyscale by default — oxblood is precious.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual treatment. Default solid oxblood. */
  variant?: ButtonVariant
  /** Control height. `icon` is a 40×40 square. */
  size?: ButtonSize
}

export declare function Button(props: ButtonProps): React.JSX.Element
