import * as React from 'react'

export type LetterAvatarSize = 'sm' | 'md' | 'lg' | 'xl'

/** Categorical identity chip — first letter on a hashed avatar color. */
export interface LetterAvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string
  size?: LetterAvatarSize
}
export declare function LetterAvatar(props: LetterAvatarProps): React.JSX.Element
