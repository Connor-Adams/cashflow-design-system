import { createRef } from 'react'
import { render } from '@testing-library/react'
import { Sparkline } from './Sparkline'

describe('Sparkline', () => {
  it('applies the ca-sparkline base class on the svg', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} />)
    const svg = container.querySelector('[data-slot="sparkline"]')
    expect(svg).toHaveClass('ca-sparkline')
  })

  it('merges a consumer className with the base class', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} className="inline-x" />)
    const svg = container.querySelector('[data-slot="sparkline"]')
    expect(svg).toHaveClass('ca-sparkline')
    expect(svg).toHaveClass('inline-x')
  })

  it('forwards a ref to the underlying svg element', () => {
    const ref = createRef<SVGSVGElement>()
    render(<Sparkline data={[1, 2, 3]} ref={ref} />)
    expect(ref.current).toBeInstanceOf(SVGSVGElement)
  })

  it('renders an svg path for a valid series', () => {
    const { container } = render(<Sparkline data={[1, 5, 2, 8]} />)
    expect(container.querySelector('path')).toBeTruthy()
  })

  it('renders the placeholder (with base class + ref) for an insufficient series', () => {
    const ref = createRef<SVGSVGElement>()
    const { container } = render(<Sparkline data={[1]} className="ph" ref={ref} />)
    const node = container.querySelector('[data-slot="sparkline"]')
    expect(node).toHaveClass('ca-sparkline')
    expect(node).toHaveClass('ph')
    expect(container.querySelector('path')).toBeNull()
  })
})
