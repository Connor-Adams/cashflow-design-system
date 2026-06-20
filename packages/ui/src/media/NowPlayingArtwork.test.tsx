import { createRef } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { NowPlayingArtwork } from './NowPlayingArtwork'

describe('NowPlayingArtwork', () => {
  it('applies the ca-now-playing-artwork base class', () => {
    const { container } = render(<NowPlayingArtwork isPlaying={false} />)
    expect(container.querySelector('[data-slot="now-playing-artwork"]')).toHaveClass(
      'ca-now-playing-artwork',
    )
  })

  it('merges a consumer className with the base class', () => {
    const { container } = render(<NowPlayingArtwork className="mt-4" isPlaying={false} />)
    const root = container.querySelector('[data-slot="now-playing-artwork"]')
    expect(root).toHaveClass('ca-now-playing-artwork')
    expect(root).toHaveClass('mt-4')
  })

  it('renders the thumbnail image when a url is provided', () => {
    render(<NowPlayingArtwork isPlaying={false} thumbnailUrl="https://x/y.png" alt="Cover" />)
    expect(screen.getByRole('img', { name: 'Cover' })).toHaveAttribute('src', 'https://x/y.png')
  })

  it('falls back to the placeholder when the image errors', () => {
    render(<NowPlayingArtwork isPlaying={false} thumbnailUrl="https://x/y.png" alt="Cover" />)
    const img = screen.getByRole('img', { name: 'Cover' })
    fireEvent.error(img)
    expect(screen.queryByRole('img', { name: 'Cover' })).not.toBeInTheDocument()
  })

  it('reflects the playing state via data-playing', () => {
    const { container, rerender } = render(<NowPlayingArtwork isPlaying={false} />)
    expect(container.querySelector('[data-slot="now-playing-artwork"]')).toHaveAttribute(
      'data-playing',
      'false',
    )
    rerender(<NowPlayingArtwork isPlaying />)
    expect(container.querySelector('[data-slot="now-playing-artwork"]')).toHaveAttribute(
      'data-playing',
      'true',
    )
  })

  it('forwards a ref to the underlying div element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<NowPlayingArtwork ref={ref} isPlaying={false} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute('data-slot', 'now-playing-artwork')
  })
})
