import * as React from 'react'
import './LetterAvatar.css'

/**
 * Cashflow LetterAvatar. A categorical identity chip — the first character on
 * one of the 12 --avatar-* colors, picked by hashing the text so the same
 * counterparty always gets the same color. Text color is precomputed per slot
 * for contrast. Sizes sm 24 · md 32 · lg 48 · xl 64.
 *
 * Sizing lives in `LetterAvatar.css`, keyed off `data-size`; the hashed
 * background/foreground are passed in as CSS custom properties.
 */

export type LetterAvatarSize = 'sm' | 'md' | 'lg' | 'xl'

/** Categorical identity chip — first letter on a hashed avatar color. */
export interface LetterAvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string
  size?: LetterAvatarSize
}

const PALETTE: Array<{ bg: string; fg: string }> = [
  { bg: 'var(--avatar-grad-1)',  fg: 'var(--avatar-on-light)' },
  { bg: 'var(--avatar-grad-2)',  fg: 'var(--avatar-on-light)' },
  { bg: 'var(--avatar-grad-3)',  fg: 'var(--avatar-on-dark)' },
  { bg: 'var(--avatar-grad-4)',  fg: 'var(--avatar-on-dark)' },
  { bg: 'var(--avatar-grad-5)',  fg: 'var(--avatar-on-light)' },
  { bg: 'var(--avatar-grad-6)',  fg: 'var(--avatar-on-dark)' },
  { bg: 'var(--avatar-grad-7)',  fg: 'var(--avatar-on-light)' },
  { bg: 'var(--avatar-grad-8)',  fg: 'var(--avatar-on-dark)' },
  { bg: 'var(--avatar-grad-9)',  fg: 'var(--avatar-on-light)' },
  { bg: 'var(--avatar-grad-10)', fg: 'var(--avatar-on-light)' },
  { bg: 'var(--avatar-grad-11)', fg: 'var(--avatar-on-light)' },
  { bg: 'var(--avatar-grad-12)', fg: 'var(--avatar-on-dark)' },
]

function hashCode(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

export const LetterAvatar = React.forwardRef<HTMLSpanElement, LetterAvatarProps>(function LetterAvatar(
  { text = '?', size = 'md', className, style, ...props },
  ref,
): React.JSX.Element {
  const ch = (String(text).trim().charAt(0) || '?').toUpperCase()
  const entry = PALETTE[hashCode(text || '?') % PALETTE.length]
  const { bg, fg } = entry ?? PALETTE[0]!
  return (
    <span
      ref={ref}
      role="img"
      aria-label={`Avatar for ${text}`}
      data-slot="letter-avatar"
      data-size={size}
      className={className ? `ca-letter-avatar ${className}` : 'ca-letter-avatar'}
      style={{
        ['--ca-avatar-bg' as string]: bg,
        ['--ca-avatar-fg' as string]: fg,
        ...style,
      }}
      {...props}
    >
      {ch}
    </span>
  )
})
