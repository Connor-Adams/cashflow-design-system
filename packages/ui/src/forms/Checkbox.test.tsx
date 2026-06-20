import { createRef } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('renders a checkbox with the ca-checkbox base class', () => {
    render(<Checkbox aria-label="Agree" />)
    expect(screen.getByRole('checkbox', { name: 'Agree' })).toHaveClass('ca-checkbox')
  })

  it('merges a consumer className with the base class', () => {
    render(<Checkbox aria-label="Agree" className="mt-4" />)
    const el = screen.getByRole('checkbox', { name: 'Agree' })
    expect(el).toHaveClass('ca-checkbox')
    expect(el).toHaveClass('mt-4')
  })

  it('carries the checkbox data-slot', () => {
    render(<Checkbox aria-label="Agree" />)
    expect(screen.getByRole('checkbox', { name: 'Agree' })).toHaveAttribute('data-slot', 'checkbox')
  })

  it('reflects checked state via aria-checked', () => {
    render(<Checkbox aria-label="Agree" checked onCheckedChange={() => {}} />)
    expect(screen.getByRole('checkbox', { name: 'Agree' })).toHaveAttribute('aria-checked', 'true')
  })

  it('reflects indeterminate as aria-checked="mixed"', () => {
    render(<Checkbox aria-label="Agree" indeterminate />)
    expect(screen.getByRole('checkbox', { name: 'Agree' })).toHaveAttribute('aria-checked', 'mixed')
  })

  it('fires onCheckedChange when toggled (uncontrolled)', () => {
    const onCheckedChange = vi.fn()
    render(<Checkbox aria-label="Agree" onCheckedChange={onCheckedChange} />)
    fireEvent.click(screen.getByRole('checkbox', { name: 'Agree' }))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('does not fire when disabled', () => {
    const onCheckedChange = vi.fn()
    render(<Checkbox aria-label="Agree" disabled onCheckedChange={onCheckedChange} />)
    fireEvent.click(screen.getByRole('checkbox', { name: 'Agree' }))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it('forwards a ref to the underlying button element', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Checkbox aria-label="Agree" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
