import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('renders the navigation landmark with page controls', () => {
    render(<Pagination page={1} pageCount={5} />)
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument()
  })

  it('applies the ca-pagination base class', () => {
    render(<Pagination page={1} pageCount={5} />)
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toHaveClass('ca-pagination')
  })

  it('merges a consumer className with the base class', () => {
    render(<Pagination page={1} pageCount={5} className="mt-4" />)
    const nav = screen.getByRole('navigation', { name: 'Pagination' })
    expect(nav).toHaveClass('ca-pagination')
    expect(nav).toHaveClass('mt-4')
  })

  it('marks the active page with aria-current', () => {
    render(<Pagination page={3} pageCount={5} />)
    expect(screen.getByRole('button', { name: '3' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: '2' })).not.toHaveAttribute('aria-current')
  })

  it('disables prev on the first page and next on the last page', () => {
    const { rerender } = render(<Pagination page={1} pageCount={5} />)
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next page' })).not.toBeDisabled()
    rerender(<Pagination page={5} pageCount={5} />)
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Previous page' })).not.toBeDisabled()
  })

  it('reflects the data-slot attribute', () => {
    render(<Pagination page={1} pageCount={5} />)
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toHaveAttribute('data-slot', 'pagination')
  })

  it('forwards a ref to the underlying nav element', () => {
    const ref = createRef<HTMLElement>()
    render(<Pagination ref={ref} page={1} pageCount={5} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current?.tagName).toBe('NAV')
  })
})
