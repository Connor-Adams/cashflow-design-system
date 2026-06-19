import React from 'react'

/**
 * Cashflow Avatar. A circular identity image with a graceful initials fallback
 * when `src` is missing or fails to load. Optional `status` dot (online/away/
 * offline) and ring. For categorical (non-person) chips, prefer LetterAvatar.
 */
const SIZE_PX = { xs: 22, sm: 28, md: 36, lg: 48, xl: 64 }
const STATUS_COLOR = {
  online: 'var(--success)',
  away: 'var(--warning)',
  offline: 'var(--muted-foreground)',
}

function initials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function Avatar({ src, name = '', size = 'md', status, ring = false, className, style, ...props }) {
  const [failed, setFailed] = React.useState(false)
  const px = typeof size === 'number' ? size : (SIZE_PX[size] || SIZE_PX.md)
  const showImg = src && !failed

  return (
    <span
      data-slot="avatar"
      className={className}
      role="img"
      aria-label={name ? `Avatar for ${name}` : 'Avatar'}
      style={{
        position: 'relative',
        display: 'inline-flex',
        width: px,
        height: px,
        flexShrink: 0,
        borderRadius: '50%',
        background: 'var(--muted)',
        color: 'var(--muted-foreground)',
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
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', display: 'block' }}
        />
      ) : (
        <span style={{
          width: '100%', height: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: Math.floor(px * 0.4), fontWeight: 'var(--weight-semibold)', fontFamily: 'var(--font-sans)', lineHeight: 1, userSelect: 'none',
        }}>{initials(name)}</span>
      )}
      {status && (
        <span style={{
          position: 'absolute', right: 0, bottom: 0,
          width: Math.max(8, Math.round(px * 0.28)), height: Math.max(8, Math.round(px * 0.28)),
          borderRadius: '50%', background: STATUS_COLOR[status] || STATUS_COLOR.offline,
          border: '2px solid var(--background)',
        }} />
      )}
    </span>
  )
}
