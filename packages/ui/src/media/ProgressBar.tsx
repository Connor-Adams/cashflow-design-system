import * as React from 'react'
import { formatDuration } from './format'

/**
 * Seekable playback scrubber with elapsed / total time labels. Click anywhere
 * on the track to seek; `onSeek` receives the target position in whole
 * seconds. Distinct from `Progress`, which is a non-interactive display bar.
 */
export interface ProgressBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  currentTime: number
  duration: number
  onSeek?: (positionSeconds: number) => void
}

export function ProgressBar({ currentTime, duration, onSeek, className, style, ...props }: ProgressBarProps): React.JSX.Element {
  const pct = duration > 0 ? Math.max(0, Math.min(100, (currentTime / duration) * 100)) : 0
  const seekable = Boolean(onSeek) && duration > 0
  const [hover, setHover] = React.useState(false)

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekable) return
    const rect = e.currentTarget.getBoundingClientRect()
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    onSeek!(Math.floor(fraction * duration))
  }

  return (
    <div data-slot="progress-bar" className={className} style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', fontFamily: 'var(--font-sans)', ...style }} {...props}>
      <div
        role={seekable ? 'slider' : 'progressbar'}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(currentTime)}
        onClick={handleClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ position: 'relative', width: '100%', height: 8, borderRadius: 'var(--radius-full)', background: 'var(--muted)', overflow: 'visible', cursor: seekable ? 'pointer' : 'default' }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${pct}%`, borderRadius: 'var(--radius-full)', background: 'var(--primary)', transition: 'width 120ms linear' }} />
        {seekable && (
          <div style={{ position: 'absolute', top: '50%', left: `${pct}%`, width: 14, height: 14, transform: 'translate(-50%, -50%)', borderRadius: 'var(--radius-full)', background: 'var(--foreground)', boxShadow: 'var(--shadow)', opacity: hover ? 1 : 0, transition: 'opacity 160ms ease' }} />
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)' }}>
        <span>{formatDuration(currentTime)}</span>
        <span>{formatDuration(duration)}</span>
      </div>
    </div>
  )
}
