import { createRef } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { PlaybackControls } from './PlaybackControls'

const noop = () => {}

describe('PlaybackControls', () => {
  it('renders the transport buttons', () => {
    render(<PlaybackControls isPaused onPlayPause={noop} onSkip={noop} />)
    expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
  })

  it('applies the ca-playback-controls base class', () => {
    const { container } = render(<PlaybackControls isPaused onPlayPause={noop} onSkip={noop} />)
    expect(container.querySelector('[data-slot="playback-controls"]')).toHaveClass('ca-playback-controls')
  })

  it('merges a consumer className with the base class', () => {
    const { container } = render(
      <PlaybackControls className="mt-4" isPaused onPlayPause={noop} onSkip={noop} />,
    )
    const root = container.querySelector('[data-slot="playback-controls"]')
    expect(root).toHaveClass('ca-playback-controls')
    expect(root).toHaveClass('mt-4')
  })

  it('labels the play/pause button by paused state', () => {
    const { rerender } = render(<PlaybackControls isPaused onPlayPause={noop} onSkip={noop} />)
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
    rerender(<PlaybackControls isPaused={false} onPlayPause={noop} onSkip={noop} />)
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument()
  })

  it('fires onPlayPause and onSkip when their buttons are clicked', () => {
    let played = 0
    let skipped = 0
    render(
      <PlaybackControls
        isPaused
        onPlayPause={() => (played += 1)}
        onSkip={() => (skipped += 1)}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Play' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(played).toBe(1)
    expect(skipped).toBe(1)
  })

  it('disables previous when onPrevious is omitted', () => {
    render(<PlaybackControls isPaused onPlayPause={noop} onSkip={noop} />)
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()
  })

  it('disables all buttons while loading', () => {
    render(
      <PlaybackControls isPaused isLoading onPlayPause={noop} onSkip={noop} onPrevious={noop} />,
    )
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Play' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
  })

  it('forwards a ref to the underlying div element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<PlaybackControls ref={ref} isPaused onPlayPause={noop} onSkip={noop} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute('data-slot', 'playback-controls')
  })
})
