import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { Input } from './Input'

describe('Input', () => {
  it('renders a textbox with the ca-input base class', () => {
    render(<Input aria-label="Name" />)
    expect(screen.getByLabelText('Name')).toHaveClass('ca-input')
  })

  it('merges a consumer className with the base class', () => {
    render(<Input aria-label="Name" className="mt-4" />)
    const el = screen.getByLabelText('Name')
    expect(el).toHaveClass('ca-input')
    expect(el).toHaveClass('mt-4')
  })

  it('reflects invalid as aria-invalid', () => {
    render(<Input aria-label="Name" invalid />)
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true')
  })

  it('carries the input data-slot', () => {
    render(<Input aria-label="Name" />)
    expect(screen.getByLabelText('Name')).toHaveAttribute('data-slot', 'input')
  })

  it('forwards a ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input aria-label="Name" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('spreads value/onChange wiring onto the native control', () => {
    render(<Input aria-label="Name" value="hi" onChange={() => {}} />)
    expect(screen.getByLabelText('Name')).toHaveValue('hi')
  })
})
