import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { BrandLogo, brandNames, brandColors } from './BrandLogo'

describe('BrandLogo', () => {
  it('applies the ca-brand-logo base class', () => {
    const { container } = render(<BrandLogo name="spotify" />)
    expect(container.querySelector('svg')).toHaveClass('ca-brand-logo')
  })

  it('merges a consumer className', () => {
    const { container } = render(<BrandLogo name="spotify" className="mr-2" />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveClass('ca-brand-logo')
    expect(svg).toHaveClass('mr-2')
  })

  it('reflects the brand name as a data attribute', () => {
    const { container } = render(<BrandLogo name="visa" />)
    expect(container.querySelector('svg')).toHaveAttribute('data-brand', 'visa')
  })

  it('fills with currentColor by default', () => {
    const { container } = render(<BrandLogo name="spotify" />)
    expect(container.querySelector('svg')).toHaveAttribute('fill', 'currentColor')
  })

  it('fills with the official brand color when brand is set', () => {
    const { container } = render(<BrandLogo name="spotify" brand />)
    expect(container.querySelector('svg')).toHaveAttribute('fill', brandColors.spotify)
  })

  it('defaults to a 20px square and honors size', () => {
    const { container } = render(<BrandLogo name="visa" size={40} />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('width', '40')
    expect(svg).toHaveAttribute('height', '40')
  })

  it('is decorative without a title', () => {
    const { container } = render(<BrandLogo name="paypal" />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('exposes an accessible image when given a title', () => {
    render(<BrandLogo name="paypal" title="PayPal" />)
    expect(screen.getByRole('img', { name: 'PayPal' })).toBeInTheDocument()
  })

  it('forwards a ref to the svg element', () => {
    const ref = createRef<SVGSVGElement>()
    render(<BrandLogo name="spotify" ref={ref} />)
    expect(ref.current).toBeInstanceOf(SVGSVGElement)
    expect(ref.current).toHaveAttribute('data-brand', 'spotify')
  })

  it('exports brandNames and brandColors in sync', () => {
    expect(brandNames).toContain('spotify')
    expect(brandNames.length).toBeGreaterThan(20)
    for (const n of brandNames) expect(brandColors[n]).toMatch(/^#[0-9A-Fa-f]{6}$/)
  })
})
