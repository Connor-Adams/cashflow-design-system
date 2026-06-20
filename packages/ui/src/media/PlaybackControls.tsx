import * as React from 'react'
import './PlaybackControls.css'

/**
 * Previous / play-pause / next transport buttons. The play-pause button is
 * primary-tinted; previous is disabled when `onPrevious` is omitted; all
 * buttons disable while `isLoading`. Interactive states (hover, focus-visible
 * ring, disabled) live in `PlaybackControls.css`, not JS.
 */
export interface PlaybackControlsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onPlay'> {
  isPaused: boolean
  isLoading?: boolean
  onPlayPause: () => void
  onSkip: () => void
  onPrevious?: () => void
}

export const PlaybackControls = React.forwardRef<HTMLDivElement, PlaybackControlsProps>(
  function PlaybackControls(
    { isPaused, isLoading = false, onPlayPause, onSkip, onPrevious, className, ...props },
    ref,
  ): React.JSX.Element {
    return (
      <div
        ref={ref}
        data-slot="playback-controls"
        className={className ? `ca-playback-controls ${className}` : 'ca-playback-controls'}
        {...props}
      >
        <button type="button" className="ca-playback-controls__btn" data-variant="secondary" title="Previous" aria-label="Previous" onClick={onPrevious} disabled={!onPrevious || isLoading}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 6h2v12H6zM20 6v12L9 12z" /></svg>
        </button>
        <button type="button" className="ca-playback-controls__btn" data-variant="primary" title={isPaused ? 'Play' : 'Pause'} aria-label={isPaused ? 'Play' : 'Pause'} onClick={onPlayPause} disabled={isLoading}>
          {isPaused
            ? <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            : <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>}
        </button>
        <button type="button" className="ca-playback-controls__btn" data-variant="secondary" title="Next" aria-label="Next" onClick={onSkip} disabled={isLoading}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 6h2v12h-2zM4 6l11 6L4 18z" /></svg>
        </button>
      </div>
    )
  },
)
