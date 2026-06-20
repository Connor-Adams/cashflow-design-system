import * as React from 'react'

/**
 * Previous / play-pause / next transport buttons. The play-pause button is
 * primary-tinted; previous is disabled when `onPrevious` is omitted; all
 * buttons disable while `isLoading`.
 */
export interface PlaybackControlsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onPlay'> {
  isPaused: boolean
  isLoading?: boolean
  onPlayPause: () => void
  onSkip: () => void
  onPrevious?: () => void
}

function iconButton(primary: boolean, disabled: boolean): React.CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: primary ? 56 : 44, height: primary ? 56 : 44,
    border: primary ? 'none' : '1px solid var(--border)',
    borderRadius: 'var(--radius-full)',
    background: primary ? 'var(--primary)' : 'transparent',
    color: primary ? 'var(--primary-foreground)' : 'var(--foreground)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'background 140ms ease, opacity 140ms ease',
  }
}

export function PlaybackControls({ isPaused, isLoading = false, onPlayPause, onSkip, onPrevious, className, style, ...props }: PlaybackControlsProps): React.JSX.Element {
  return (
    <div data-slot="playback-controls" className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, ...style }} {...props}>
      <button type="button" title="Previous" aria-label="Previous" onClick={onPrevious} disabled={!onPrevious || isLoading} style={iconButton(false, !onPrevious || isLoading)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 6h2v12H6zM20 6v12L9 12z" /></svg>
      </button>
      <button type="button" title={isPaused ? 'Play' : 'Pause'} aria-label={isPaused ? 'Play' : 'Pause'} onClick={onPlayPause} disabled={isLoading} style={iconButton(true, isLoading)}>
        {isPaused
          ? <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          : <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>}
      </button>
      <button type="button" title="Next" aria-label="Next" onClick={onSkip} disabled={isLoading} style={iconButton(false, isLoading)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 6h2v12h-2zM4 6l11 6L4 18z" /></svg>
      </button>
    </div>
  )
}
