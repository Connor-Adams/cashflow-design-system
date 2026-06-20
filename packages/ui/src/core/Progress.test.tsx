import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { Progress } from './Progress'

describe('Progress', () => {
  it('renders a progressbar with the clamped value', () => {
    render(<Progress value={42} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '42')
  })

  it('clamps values above 100', () => {
    render(<Progress value={150} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })

  it('omits aria-valuenow when indeterminate', () => {
    render(<Progress indeterminate />)
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow')
  })

  it('applies the ca-progress base class', () => {
    const { container } = render(<Progress value={10} />)
    expect(container.querySelector('[data-slot="progress"]')).toHaveClass('ca-progress')
  })

  it('merges a consumer className with the base class', () => {
    const { container } = render(<Progress value={10} className="w-1/2" />)
    const el = container.querySelector('[data-slot="progress"]')!
    expect(el).toHaveClass('ca-progress')
    expect(el).toHaveClass('w-1/2')
  })

  it('keeps the root free of a static inline style attribute', () => {
    const { container } = render(<Progress value={10} />)
    expect(container.querySelector('[data-slot="progress"]')!.getAttribute('style')).toBeNull()
  })

  it('reflects size as a data attribute', () => {
    const { container } = render(<Progress value={10} size="lg" />)
    expect(container.querySelector('[data-slot="progress"]')).toHaveAttribute('data-size', 'lg')
  })

  it('shows the percentage readout when requested', () => {
    render(<Progress value={75} showValue />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('forwards a ref to the root div', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Progress ref={ref} value={10} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute('data-slot', 'progress')
  })
})
