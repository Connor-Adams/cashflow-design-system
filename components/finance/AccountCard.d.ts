import * as React from 'react'

/**
 * Connected-account tile — institution glyph, name + masked number, balance,
 * and optional sync status. `kind` tints the chip and relabels credit balances
 * as "owing"; negative balances render in oxblood. Pass `onClick` to make it a
 * selectable button; `selected` shows the active ring.
 */
export interface AccountCardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  name: React.ReactNode
  institution?: string
  mask?: string
  balance?: number
  currency?: string
  locale?: string
  kind?: 'chequing' | 'savings' | 'credit' | 'investment' | 'cash' | 'default'
  status?: 'synced' | 'syncing' | 'error'
  selected?: boolean
  onClick?: () => void
}
export declare function AccountCard(props: AccountCardProps): React.JSX.Element
