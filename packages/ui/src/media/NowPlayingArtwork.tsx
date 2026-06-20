import * as React from 'react'
import './NowPlayingArtwork.css'

/**
 * Square track artwork for the now-playing surface. When `thumbnailUrl` is set
 * and loads, shows the image; otherwise (or on load error) shows a token
 * gradient placeholder with a play glyph. While `isPlaying`, an animated
 * equalizer badge pulses in the corner. The equalizer animation lives in
 * `NowPlayingArtwork.css`; the image-error fallback stays in JS (it's behavior).
 */
export interface NowPlayingArtworkProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  isPlaying: boolean
  thumbnailUrl?: string | null
  alt?: string
}

const BARS = [0, 1, 2, 3]

export const NowPlayingArtwork = React.forwardRef<HTMLDivElement, NowPlayingArtworkProps>(
  function NowPlayingArtwork(
    { isPlaying, thumbnailUrl, alt = '', className, ...props },
    ref,
  ): React.JSX.Element {
    const gradId = React.useId()
    const [imageError, setImageError] = React.useState(false)
    React.useEffect(() => {
      setImageError(false)
    }, [thumbnailUrl])
    const showThumbnail = Boolean(thumbnailUrl) && !imageError

    return (
      <div
        ref={ref}
        data-slot="now-playing-artwork"
        data-playing={isPlaying}
        className={className ? `ca-now-playing-artwork ${className}` : 'ca-now-playing-artwork'}
        {...props}
      >
        {showThumbnail ? (
          <img className="ca-now-playing-artwork__img" src={thumbnailUrl ?? undefined} alt={alt} onError={() => setImageError(true)} />
        ) : (
          <svg className="ca-now-playing-artwork__placeholder" viewBox="0 0 280 280" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="280" y2="280" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--accent)" />
              </linearGradient>
            </defs>
            <rect width="280" height="280" fill={`url(#${gradId})`} />
            <path d="M110 80L190 140L110 200V80Z" fill="var(--primary-foreground)" opacity="0.9" />
          </svg>
        )}
        {isPlaying && (
          <div className="ca-now-playing-artwork__eq">
            {BARS.map((i) => (
              <span key={i} className="ca-now-playing-artwork__bar" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        )}
      </div>
    )
  },
)
