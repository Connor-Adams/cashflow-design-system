import * as React from 'react'
import type { MediaTrack } from './types'
import { NowPlayingArtwork } from './NowPlayingArtwork'
import { TrackInfo } from './TrackInfo'
import { ProgressBar } from './ProgressBar'
import { PlaybackControls } from './PlaybackControls'

/**
 * Composed now-playing player: artwork + track info + seekable scrubber +
 * transport, in a card. Fully controlled — the caller owns playback state and
 * passes callbacks. With `autoTick`, the displayed position advances locally
 * once per second between parent updates (re-seeded whenever `currentTime` or
 * the track identity changes), giving smooth motion without a network tick.
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

export function MediaPlayer({ track, currentTime, duration, isPaused, isLoading, onPlayPause, onSkip, onPrevious, onSeek, autoTick = false, className, style, ...props }: MediaPlayerProps): React.JSX.Element {
  const trackKey = `${track.id ?? ''}|${track.title}|${duration}`
  const [ticked, setTicked] = React.useState(currentTime)

  // Re-seed the local clock when the parent position or the track changes.
  React.useEffect(() => { setTicked(currentTime) }, [currentTime, trackKey])

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
      data-slot="media-player"
      className={className}
      style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24, borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--card-foreground)', ...style }}
      {...props}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 auto', width: 'min(240px, 100%)' }}>
          <NowPlayingArtwork isPlaying={!isPaused} thumbnailUrl={track.thumbnailUrl} alt={track.title} />
        </div>
        <div style={{ flex: '1 1 280px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <TrackInfo title={track.title} source={track.source} sourceLink={track.sourceLink} />
          <ProgressBar currentTime={shown} duration={duration} onSeek={onSeek} />
          <PlaybackControls isPaused={isPaused} isLoading={isLoading} onPlayPause={onPlayPause} onSkip={onSkip} onPrevious={onPrevious} />
        </div>
      </div>
    </section>
  )
}
