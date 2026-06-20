import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { TrackInfo } from './TrackInfo'

describe('TrackInfo', () => {
  it('renders the title', () => {
    render(<TrackInfo title="Midnight City" />)
    expect(screen.getByText('Midnight City')).toBeInTheDocument()
  })

  it('applies the ca-track-info base class', () => {
    const { container } = render(<TrackInfo title="Song" />)
    expect(container.querySelector('[data-slot="track-info"]')).toHaveClass('ca-track-info')
  })

  it('merges a consumer className with the base class', () => {
    const { container } = render(<TrackInfo title="Song" className="mt-4" />)
    const root = container.querySelector('[data-slot="track-info"]')
    expect(root).toHaveClass('ca-track-info')
    expect(root).toHaveClass('mt-4')
  })

  it('reflects the data-slot attribute', () => {
    const { container } = render(<TrackInfo title="Song" />)
    expect(container.querySelector('[data-slot="track-info"]')).toBeInTheDocument()
  })

  it('renders the source line when provided', () => {
    render(<TrackInfo title="Song" source="M83" />)
    expect(screen.getByText('M83')).toBeInTheDocument()
  })

  it('renders an external source link when provided', () => {
    render(<TrackInfo title="Song" sourceLink="https://example.com" />)
    const link = screen.getByRole('link', { name: /open in source/i })
    expect(link).toHaveAttribute('href', 'https://example.com')
  })

  it('forwards a ref to the underlying div element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<TrackInfo ref={ref} title="Song" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute('data-slot', 'track-info')
  })
})
