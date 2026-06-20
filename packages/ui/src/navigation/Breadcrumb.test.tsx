import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { Breadcrumb } from './Breadcrumb'

const items = [
  { label: 'Home', href: '/' },
  { label: 'Library', href: '/library' },
  { label: 'Data' },
]

describe('Breadcrumb', () => {
  it('renders the navigation landmark with its items', () => {
    render(<Breadcrumb items={items} />)
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' })
    expect(nav).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Library' })).toHaveAttribute('href', '/library')
  })

  it('applies the ca-breadcrumb base class', () => {
    render(<Breadcrumb items={items} />)
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toHaveClass('ca-breadcrumb')
  })

  it('merges a consumer className with the base class', () => {
    render(<Breadcrumb items={items} className="mt-4" />)
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' })
    expect(nav).toHaveClass('ca-breadcrumb')
    expect(nav).toHaveClass('mt-4')
  })

  it('marks the last item as the current page', () => {
    render(<Breadcrumb items={items} />)
    const current = screen.getByText('Data')
    expect(current).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByRole('link', { name: 'Data' })).toBeNull()
  })

  it('reflects the data-slot attribute', () => {
    render(<Breadcrumb items={items} />)
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toHaveAttribute('data-slot', 'breadcrumb')
  })

  it('forwards a ref to the underlying nav element', () => {
    const ref = createRef<HTMLElement>()
    render(<Breadcrumb ref={ref} items={items} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current?.tagName).toBe('NAV')
  })
})
