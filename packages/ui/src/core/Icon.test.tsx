import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { Icon, iconNames } from './Icon'
import { brandColors } from './brandGlyphs'

describe('Icon', () => {
  it('applies the ca-icon base class', () => {
    const { container } = render(<Icon name="wallet" />)
    expect(container.querySelector('svg')).toHaveClass('ca-icon')
  })

  it('merges a consumer className with the base class', () => {
    const { container } = render(<Icon name="wallet" className="mr-2" />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveClass('ca-icon')
    expect(svg).toHaveClass('mr-2')
  })

  it('reflects the glyph name as a data attribute', () => {
    const { container } = render(<Icon name="search" />)
    expect(container.querySelector('svg')).toHaveAttribute('data-icon', 'search')
  })

  it('defaults to a 20px square', () => {
    const { container } = render(<Icon name="check" />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('width', '20')
    expect(svg).toHaveAttribute('height', '20')
  })

  it('honors a custom size', () => {
    const { container } = render(<Icon name="check" size={32} />)
    expect(container.querySelector('svg')).toHaveAttribute('width', '32')
  })

  it('is decorative (aria-hidden) without a title', () => {
    const { container } = render(<Icon name="bell" />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).not.toHaveAttribute('role')
  })

  it('exposes an accessible image when given a title', () => {
    render(<Icon name="bell" title="Notifications" />)
    const svg = screen.getByRole('img', { name: 'Notifications' })
    expect(svg).not.toHaveAttribute('aria-hidden')
    expect(svg.querySelector('title')).toHaveTextContent('Notifications')
  })

  it('forwards a ref to the underlying svg element', () => {
    const ref = createRef<SVGSVGElement>()
    render(<Icon name="wallet" ref={ref} />)
    expect(ref.current).toBeInstanceOf(SVGSVGElement)
    expect(ref.current).toHaveAttribute('data-icon', 'wallet')
  })

  it('exports the full registry via iconNames', () => {
    expect(iconNames).toContain('wallet')
    expect(iconNames).toContain('chevron-right')
    expect(iconNames.length).toBeGreaterThan(20)
  })

  it('renders a brand glyph as a filled path with currentColor by default', () => {
    const { container } = render(<Icon name="brand:spotify" />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveClass('ca-icon')
    expect(svg).toHaveAttribute('data-icon', 'brand:spotify')
    expect(svg).toHaveAttribute('data-brand', 'spotify')
    expect(svg).toHaveAttribute('fill', 'currentColor')
    expect(svg.querySelector('path')).toBeInTheDocument()
  })

  it('fills a brand glyph with its official color when brand is set', () => {
    const { container } = render(<Icon name="brand:spotify" brand />)
    expect(container.querySelector('svg')).toHaveAttribute('fill', brandColors.spotify)
  })

  it('leaves stroke glyphs unfilled and brand-prop-agnostic', () => {
    const { container } = render(<Icon name="wallet" brand />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('fill', 'none')
    expect(svg).toHaveAttribute('stroke', 'currentColor')
  })

  it('includes brand names in iconNames', () => {
    expect(iconNames).toContain('brand:spotify')
  })
})
