import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { CategoryPill } from './CategoryPill'

describe('CategoryPill', () => {
  it('applies the ca-category-pill base class', () => {
    render(<CategoryPill category="groceries" data-testid="pill" />)
    expect(screen.getByTestId('pill')).toHaveClass('ca-category-pill')
  })

  it('merges a consumer className with the base class', () => {
    render(<CategoryPill category="groceries" className="mr-1" data-testid="pill" />)
    const el = screen.getByTestId('pill')
    expect(el).toHaveClass('ca-category-pill')
    expect(el).toHaveClass('mr-1')
  })

  it('reflects size as a data attribute', () => {
    render(<CategoryPill category="dining" size="sm" data-testid="pill" />)
    expect(screen.getByTestId('pill')).toHaveAttribute('data-size', 'sm')
  })

  it('renders a span by default and a button when interactive', () => {
    const { rerender } = render(<CategoryPill category="dining" data-testid="pill" />)
    expect(screen.getByTestId('pill').tagName).toBe('SPAN')
    rerender(<CategoryPill category="dining" interactive data-testid="pill" />)
    expect(screen.getByTestId('pill').tagName).toBe('BUTTON')
  })

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<CategoryPill category="dining" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
  })

  it('derives a capitalized label from the category', () => {
    render(<CategoryPill category="dining" />)
    expect(screen.getByText('Dining')).toBeInTheDocument()
  })
})
