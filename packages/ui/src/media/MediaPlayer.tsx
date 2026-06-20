import * as React from 'react'
import type { MediaTrack } from './types'
import { NowPlayingArtwork } from './NowPlayingArtwork'
import { TrackInfo } from './TrackInfo'
import { ProgressBar } from './ProgressBar'
import { PlaybackControls } from './PlaybackControls'
import './MediaPlayer.css'

/**
 * Composed now-playing player: artwork + track info + seekable scrubber +
 * transport, in a card. Fully controlled — the caller owns playback state and
 * passes callbacks. With `autoTick`, the displayed position advances locally
 * once per second between parent updates (re-seeded whenever `currentTime` or
 * the track identity changes), giving smooth motion without a network tick.
 *
 * Layout lives in `MediaPlayer.css`; the local clock (autoTick) stays in JS
 * because it's behavior, not styling.
 */
export interface MediaPlayerProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onPlay'> {
  track: MediaTrack
  currentTime: number
  duration: number
  isPaused: boolean
  isLoading?: boolean
  onPlayPause: () => void
  onSkip: () => void
  onPrevious?: () => void
  onSeek?: (positionSeconds: number) => void
  autoTick?: boolean
}

export const MediaPlayer = React.forwardRef<HTMLElement, MediaPlayerProps>(function MediaPlayer(
  { track, currentTime, duration, isPaused, isLoading, onPlayPause, onSkip, onPrevious, onSeek, autoTick = false, className, ...props },
  ref,
): React.JSX.Element {
  const trackKey = `${track.id ?? ''}|${track.title}|${duration}`
  const [ticked, setTicked] = React.useState(currentTime)

  // Re-seed the local clock when the parent position or the track changes.
  React.useEffect(() => {
    setTicked(currentTime)
  }, [currentTime, trackKey])

  // Advance locally once per second while playing (opt-in via autoTick).
  React.useEffect(() => {
    if (!autoTick || isPaused || duration <= 0) return
    const interval = setInterval(() => {
      setTicked((prev) => (prev >= duration ? duration : prev + 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [autoTick, isPaused, duration, trackKey])

  const shown = autoTick ? ticked : currentTime

  return (
    <section
      ref={ref}
      data-slot="media-player"
      className={className ? `ca-media-player ${className}` : 'ca-media-player'}
      {...props}
    >
      <div className="ca-media-player__row">
        <div className="ca-media-player__artwork">
          <NowPlayingArtwork isPlaying={!isPaused} thumbnailUrl={track.thumbnailUrl} alt={track.title} />
        </div>
        <div className="ca-media-player__body">
          <TrackInfo title={track.title} source={track.source} sourceLink={track.sourceLink} />
          <ProgressBar currentTime={shown} duration={duration} onSeek={onSeek} />
          <PlaybackControls isPaused={isPaused} isLoading={isLoading} onPlayPause={onPlayPause} onSkip={onSkip} onPrevious={onPrevious} />
        </div>
      </div>
    </section>
  )
})
