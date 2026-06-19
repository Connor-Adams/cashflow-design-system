import * as React from 'react'

/**
 * Circular person avatar with initials fallback. `src` is the image; `name`
 * supplies the alt text and fallback initials. Optional `status` dot and a
 * `ring`. For categorical (merchant) chips use LetterAvatar instead.
 */
export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  src?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number
  status?: 'online' | 'away' | 'offline'
  ring?: boolean
}
export declare function Avatar(props: AvatarProps): React.JSX.Element
