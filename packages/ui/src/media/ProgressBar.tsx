import * as React from 'react'
import { formatDuration } from './format'
import './ProgressBar.css'

/**
 * Seekable playback scrubber with elapsed / total time labels. Click anywhere
 * on the track to seek; `onSeek` receives the target position in whole
 * seconds. Distinct from `Progress`, which is a non-interactive display bar.
 *
 * The scrub-thumb hover reveal and focus ring live in `ProgressBar.css` — the
 * click-to-seek handler stays in JS because it's behavior, not styling.
 */
export interface ProgressBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  currentTime: number
  duration: number
  onSeek?: (positionSeconds: number) => void
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(function ProgressBar(
  { currentTime, duration, onSeek, className, ...props },
  ref,
): React.JSX.Element {
  const pct = duration > 0 ? Math.max(0, Math.min(100, (currentTime / duration) * 100)) : 0
  const seekable = Boolean(onSeek) && duration > 0

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekable) return
    const rect = e.currentTarget.getBoundingClientRect()
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    onSeek!(Math.floor(fraction * duration))
  }

  return (
    <div
      ref={ref}
      data-slot="progress-bar"
      className={className ? `ca-progress-bar ${className}` : 'ca-progress-bar'}
      {...props}
    >
      <div
        className="ca-progress-bar__track"
        data-seekable={seekable}
        role={seekable ? 'slider' : 'progressbar'}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(currentTime)}
        onClick={handleClick}
      >
        <div className="ca-progress-bar__fill" style={{ width: `${pct}%` }} />
        {seekable && <div className="ca-progress-bar__thumb" style={{ left: `${pct}%` }} />}
      </div>
      <div className="ca-progress-bar__times">
        <span>{formatDuration(currentTime)}</span>
        <span>{formatDuration(duration)}</span>
      </div>
    </div>
  )
})
