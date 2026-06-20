import { createRef } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Switch } from './Switch'

describe('Switch', () => {
  it('renders a switch with the ca-switch base class', () => {
    render(<Switch aria-label="Notify" />)
    expect(screen.getByRole('switch', { name: 'Notify' })).toHaveClass('ca-switch')
  })

  it('merges a consumer className with the base class', () => {
    render(<Switch aria-label="Notify" className="mt-4" />)
    const el = screen.getByRole('switch', { name: 'Notify' })
    expect(el).toHaveClass('ca-switch')
    expect(el).toHaveClass('mt-4')
  })

  it('carries the switch data-slot', () => {
    render(<Switch aria-label="Notify" />)
    expect(screen.getByRole('switch', { name: 'Notify' })).toHaveAttribute('data-slot', 'switch')
  })

  it('reflects size as a data attribute', () => {
    render(<Switch aria-label="Notify" size="sm" />)
    expect(screen.getByRole('switch', { name: 'Notify' })).toHaveAttribute('data-size', 'sm')
  })

  it('reflects checked state via aria-checked and data-state', () => {
    render(<Switch aria-label="Notify" checked onCheckedChange={() => {}} />)
    const el = screen.getByRole('switch', { name: 'Notify' })
    expect(el).toHaveAttribute('aria-checked', 'true')
    expect(el).toHaveAttribute('data-state', 'checked')
  })

  it('fires onCheckedChange when toggled (uncontrolled)', () => {
    const onCheckedChange = vi.fn()
    render(<Switch aria-label="Notify" onCheckedChange={onCheckedChange} />)
    fireEvent.click(screen.getByRole('switch', { name: 'Notify' }))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('does not fire when disabled', () => {
    const onCheckedChange = vi.fn()
    render(<Switch aria-label="Notify" disabled onCheckedChange={onCheckedChange} />)
    fireEvent.click(screen.getByRole('switch', { name: 'Notify' }))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it('forwards a ref to the underlying button element', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Switch aria-label="Notify" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
