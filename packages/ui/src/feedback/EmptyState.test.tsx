import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('applies the ca-empty-state base class', () => {
    const { container } = render(<EmptyState title="Nothing here" />)
    expect(container.querySelector('[data-slot="empty-state"]')).toHaveClass('ca-empty-state')
  })

  it('merges a consumer className with the base class', () => {
    const { container } = render(<EmptyState title="Nothing here" className="mt-4" />)
    const el = container.querySelector('[data-slot="empty-state"]')
    expect(el).toHaveClass('ca-empty-state')
    expect(el).toHaveClass('mt-4')
  })

  it('renders the title', () => {
    render(<EmptyState title="No transactions" />)
    expect(screen.getByText('No transactions')).toBeInTheDocument()
  })

  it('renders an optional description', () => {
    render(<EmptyState title="Empty" description="Add your first item" />)
    expect(screen.getByText('Add your first item')).toBeInTheDocument()
  })

  it('renders optional actions', () => {
    render(<EmptyState title="Empty" actions={<button>Add</button>} />)
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
  })

  it('reflects the data-slot attribute', () => {
    const { container } = render(<EmptyState title="Empty" />)
    expect(container.querySelector('[data-slot="empty-state"]')).toBeInTheDocument()
  })

  it('forwards a ref to the underlying div element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<EmptyState ref={ref} title="Empty" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute('data-slot', 'empty-state')
  })
})
