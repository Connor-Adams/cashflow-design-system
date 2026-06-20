import { createRef } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Slider } from './Slider'

describe('Slider', () => {
  it('renders a slider with the ca-slider base class', () => {
    const { container } = render(<Slider aria-label="Vol" />)
    expect(container.querySelector('[data-slot="slider"]')).toHaveClass('ca-slider')
  })

  it('merges a consumer className with the base class', () => {
    const { container } = render(<Slider className="mt-4" />)
    const el = container.querySelector('[data-slot="slider"]')
    expect(el).toHaveClass('ca-slider')
    expect(el).toHaveClass('mt-4')
  })

  it('carries the slider data-slot', () => {
    const { container } = render(<Slider />)
    expect(container.querySelector('[data-slot="slider"]')).toBeInTheDocument()
  })

  it('renders a range input reflecting the value', () => {
    render(<Slider aria-label="Vol" value={42} onValueChange={() => {}} />)
    expect(screen.getByRole('slider')).toHaveValue('42')
  })

  it('shows the formatted value when showValue is set', () => {
    render(<Slider aria-label="Vol" value={50} showValue format={(v) => `$${v}`} onValueChange={() => {}} />)
    expect(screen.getByText('$50')).toBeInTheDocument()
  })

  it('fires onValueChange when the range input changes (uncontrolled)', () => {
    const onValueChange = vi.fn()
    render(<Slider aria-label="Vol" onValueChange={onValueChange} />)
    fireEvent.change(screen.getByRole('slider'), { target: { value: '30' } })
    expect(onValueChange).toHaveBeenCalledWith(30)
  })

  it('forwards a ref to the underlying range input element', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Slider aria-label="Vol" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
    expect(ref.current).toHaveAttribute('type', 'range')
  })
})
