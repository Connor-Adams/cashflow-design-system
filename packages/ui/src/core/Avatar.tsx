import * as React from 'react'
import './Avatar.css'

/**
 * Cashflow Avatar. A circular identity image with a graceful initials fallback
 * when `src` is missing or fails to load. Optional `status` dot (online/away/
 * offline) and ring. For categorical (non-person) chips, prefer LetterAvatar.
 */

const SIZE_PX: Record<string, number> = { xs: 22, sm: 28, md: 36, lg: 48, xl: 64 }
const STATUS_COLOR: Record<string, string> = {
  online: 'var(--success)',
  away: 'var(--warning)',
  offline: 'var(--muted-foreground)',
}

function initials(name: string): string {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase()
}

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

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, name = '', size = 'md', status, ring = false, className, style, ...props },
  ref,
): React.JSX.Element {
  const [failed, setFailed] = React.useState(false)
  const px = typeof size === 'number' ? size : (SIZE_PX[size] || SIZE_PX['md']!)
  const showImg = src && !failed

  return (
    <span
      ref={ref}
      data-slot="avatar"
      data-size={typeof size === 'number' ? undefined : size}
      className={className ? `ca-avatar ${className}` : 'ca-avatar'}
      role="img"
      aria-label={name ? `Avatar for ${name}` : 'Avatar'}
      style={{
        width: px,
        height: px,
        boxShadow: ring ? '0 0 0 2px var(--background), 0 0 0 4px var(--primary)' : 'none',
        ...style,
      }}
      {...props}
    >
      {showImg ? (
        <img
          src={src}
          alt=""
          onError={() => setFailed(true)}
          className="ca-avatar__img"
        />
      ) : (
        <span className="ca-avatar__fallback" style={{ fontSize: Math.floor(px * 0.4) }}>{initials(name)}</span>
      )}
      {status && (
        <span
          className="ca-avatar__status"
          style={{
            width: Math.max(8, Math.round(px * 0.28)),
            height: Math.max(8, Math.round(px * 0.28)),
            background: STATUS_COLOR[status] || STATUS_COLOR['offline']!,
          }}
        />
      )}
    </span>
  )
})
