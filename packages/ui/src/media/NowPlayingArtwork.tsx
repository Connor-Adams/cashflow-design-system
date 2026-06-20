import * as React from 'react'

/**
 * Square track artwork for the now-playing surface. When `thumbnailUrl` is set
 * and loads, shows the image; otherwise (or on load error) shows a token
 * gradient placeholder with a play glyph. While `isPlaying`, an animated
 * equalizer badge pulses in the corner.
 */
export interface NowPlayingArtworkProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  isPlaying: boolean
  thumbnailUrl?: string | null
  alt?: string
}

const BARS = [0, 1, 2, 3]

export function NowPlayingArtwork({ isPlaying, thumbnailUrl, alt = '', className, style, ...props }: NowPlayingArtworkProps): React.JSX.Element {
  const [imageError, setImageError] = React.useState(false)
  React.useEffect(() => { setImageError(false) }, [thumbnailUrl])
  const showThumbnail = Boolean(thumbnailUrl) && !imageError

  return (
    <div
      data-slot="now-playing-artwork"
      className={className}
      style={{ position: 'relative', width: '100%', maxWidth: 280, aspectRatio: '1 / 1', flexShrink: 0, borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: 'var(--muted)', boxShadow: 'var(--shadow)', ...style }}
      {...props}
    >
      {showThumbnail ? (
        <img src={thumbnailUrl ?? undefined} alt={alt} onError={() => setImageError(true)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <svg viewBox="0 0 280 280" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true">
          <defs>
            <linearGradient id="cf-art-grad" x1="0" y1="0" x2="280" y2="280" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--accent)" />
            </linearGradient>
          </defs>
          <rect width="280" height="280" fill="url(#cf-art-grad)" />
          <path d="M110 80L190 140L110 200V80Z" fill="var(--primary-foreground)" opacity="0.9" />
        </svg>
      )}
      {isPlaying && (
        <div style={{ position: 'absolute', right: 12, bottom: 12, display: 'flex', alignItems: 'flex-end', gap: 3, height: 22, padding: '6px 8px', borderRadius: 'var(--radius-md)', background: 'color-mix(in oklch, var(--background) 55%, transparent)', backdropFilter: 'blur(4px)' }}>
          {BARS.map((i) => (
            <span key={i} style={{ width: 3, height: '100%', borderRadius: 2, background: 'var(--primary)', transformOrigin: 'bottom', animation: `cf-eq 0.9s ease-in-out ${i * 0.15}s infinite` }} />
          ))}
          <style>{'@keyframes cf-eq{0%,100%{transform:scaleY(0.35)}50%{transform:scaleY(1)}}'}</style>
        </div>
      )}
    </div>
  )
}
