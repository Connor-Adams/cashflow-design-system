import { createRef } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MediaPlayer } from './MediaPlayer'
import type { MediaTrack } from './types'

const track: MediaTrack = { id: '1', title: 'Test Track', source: 'Test Source' }
const noop = () => {}

function setup(overrides = {}) {
  return render(
    <MediaPlayer
      track={track}
      currentTime={30}
      duration={180}
      isPaused
      onPlayPause={noop}
      onSkip={noop}
      {...overrides}
    />,
  )
}

describe('MediaPlayer', () => {
  it('renders the track title and source', () => {
    setup()
    expect(screen.getByText('Test Track')).toBeInTheDocument()
    expect(screen.getByText('Test Source')).toBeInTheDocument()
  })

  it('applies the ca-media-player base class', () => {
    const { container } = setup()
    expect(container.querySelector('[data-slot="media-player"]')).toHaveClass('ca-media-player')
  })

  it('merges a consumer className with the base class', () => {
    const { container } = setup({ className: 'mt-4' })
    const root = container.querySelector('[data-slot="media-player"]')
    expect(root).toHaveClass('ca-media-player')
    expect(root).toHaveClass('mt-4')
  })

  it('wires the play button to onPlayPause (behavior preserved)', () => {
    let played = 0
    setup({ onPlayPause: () => (played += 1) })
    fireEvent.click(screen.getByRole('button', { name: 'Play' }))
    expect(played).toBe(1)
  })

  it('renders the transport and progress sub-components', () => {
    const { container } = setup()
    expect(container.querySelector('[data-slot="track-info"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="progress-bar"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="playback-controls"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="now-playing-artwork"]')).toBeInTheDocument()
  })

  it('forwards a ref to the underlying section element', () => {
    const ref = createRef<HTMLElement>()
    render(
      <MediaPlayer
        ref={ref}
        track={track}
        currentTime={0}
        duration={100}
        isPaused
        onPlayPause={noop}
        onSkip={noop}
      />,
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveAttribute('data-slot', 'media-player')
  })
})
