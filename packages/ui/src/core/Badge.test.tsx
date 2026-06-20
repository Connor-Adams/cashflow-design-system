import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders its children', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('applies the ca-badge base class', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toHaveClass('ca-badge')
  })

  it('merges a consumer className with the base class', () => {
    render(<Badge className="ml-1">New</Badge>)
    const el = screen.getByText('New')
    expect(el).toHaveClass('ca-badge')
    expect(el).toHaveClass('ml-1')
  })

  it('defaults the variant to "default"', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toHaveAttribute('data-variant', 'default')
  })

  it('reflects the variant as a data attribute', () => {
    render(<Badge variant="success">Done</Badge>)
    expect(screen.getByText('Done')).toHaveAttribute('data-variant', 'success')
  })

  it('forwards a ref to the underlying span', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<Badge ref={ref}>New</Badge>)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    expect(ref.current).toHaveAttribute('data-slot', 'badge')
  })
})
