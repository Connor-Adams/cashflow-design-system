import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('renders with a default accessible label', () => {
    render(<Spinner />)
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
  })

  it('honors a custom label', () => {
    render(<Spinner label="Saving" />)
    expect(screen.getByRole('status', { name: 'Saving' })).toBeInTheDocument()
  })

  it('applies the ca-spinner base class', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toHaveClass('ca-spinner')
  })

  it('merges a consumer className with the base class', () => {
    render(<Spinner className="ml-2" />)
    const el = screen.getByRole('status')
    expect(el).toHaveClass('ca-spinner')
    expect(el).toHaveClass('ml-2')
  })

  it('forwards a ref to the underlying span', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<Spinner ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    expect(ref.current).toHaveAttribute('data-slot', 'spinner')
  })
})
