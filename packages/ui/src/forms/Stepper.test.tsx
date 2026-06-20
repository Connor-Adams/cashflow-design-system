import { createRef } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Stepper } from './Stepper'

describe('Stepper', () => {
  it('renders with the ca-stepper base class', () => {
    const { container } = render(<Stepper />)
    expect(container.querySelector('[data-slot="stepper"]')).toHaveClass('ca-stepper')
  })

  it('merges a consumer className with the base class', () => {
    const { container } = render(<Stepper className="mt-4" />)
    const el = container.querySelector('[data-slot="stepper"]')
    expect(el).toHaveClass('ca-stepper')
    expect(el).toHaveClass('mt-4')
  })

  it('reflects size as a data attribute', () => {
    const { container } = render(<Stepper size="sm" />)
    expect(container.querySelector('[data-slot="stepper"]')).toHaveAttribute('data-size', 'sm')
  })

  it('shows the current value, formatted', () => {
    render(<Stepper value={3} format={(v) => `${v} days`} onValueChange={() => {}} />)
    expect(screen.getByText('3 days')).toBeInTheDocument()
  })

  it('increments and decrements (uncontrolled)', () => {
    const onValueChange = vi.fn()
    render(<Stepper defaultValue={5} onValueChange={onValueChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Increase' }))
    expect(onValueChange).toHaveBeenLastCalledWith(6)
    fireEvent.click(screen.getByRole('button', { name: 'Decrease' }))
    expect(onValueChange).toHaveBeenLastCalledWith(5)
  })

  it('clamps to min/max', () => {
    const onValueChange = vi.fn()
    render(<Stepper value={0} min={0} max={2} onValueChange={onValueChange} />)
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeDisabled()
  })

  it('forwards a ref to the underlying container element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Stepper ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute('data-slot', 'stepper')
  })
})
