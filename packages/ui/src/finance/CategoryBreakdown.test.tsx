import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { CategoryBreakdown } from './CategoryBreakdown'

const ROWS = [
  { category: 'groceries', amount: -842 },
  { category: 'dining', amount: -586 },
  { category: 'transport', amount: -418 },
]

describe('CategoryBreakdown', () => {
  it('applies the ca-category-breakdown base class', () => {
    render(<CategoryBreakdown rows={ROWS} data-testid="cb" />)
    expect(screen.getByTestId('cb')).toHaveClass('ca-category-breakdown')
  })

  it('merges a consumer className with the base class', () => {
    render(<CategoryBreakdown rows={ROWS} className="w-full" data-testid="cb" />)
    const el = screen.getByTestId('cb')
    expect(el).toHaveClass('ca-category-breakdown')
    expect(el).toHaveClass('w-full')
  })

  it('sets data-slot="category-breakdown"', () => {
    render(<CategoryBreakdown rows={ROWS} data-testid="cb" />)
    expect(screen.getByTestId('cb')).toHaveAttribute('data-slot', 'category-breakdown')
  })

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<CategoryBreakdown rows={ROWS} ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
  })

  it('renders title and subtitle', () => {
    render(<CategoryBreakdown rows={ROWS} title="Net spend by category" subtitle="This month" />)
    expect(screen.getByText('Net spend by category')).toBeInTheDocument()
    expect(screen.getByText('This month')).toBeInTheDocument()
  })

  it('renders one pill and one amount per row', () => {
    const { container } = render(<CategoryBreakdown rows={ROWS} />)
    expect(screen.getByText('Groceries')).toBeInTheDocument()
    expect(screen.getByText('Dining')).toBeInTheDocument()
    expect(screen.getByText('Transport')).toBeInTheDocument()
    // AmountText slots (mono, signed, oxblood) — one per row. Match on digits,
    // not the exact currency symbol (ICU varies $ vs CA$ by Node build).
    const amounts = container.querySelectorAll('[data-slot="amount"]')
    expect(amounts).toHaveLength(3)
    expect(amounts[0]!.textContent).toMatch(/842/)
  })

  it('renders the header but no rows when rows is empty', () => {
    render(<CategoryBreakdown rows={[]} title="Empty" data-testid="cb" />)
    expect(screen.getByText('Empty')).toBeInTheDocument()
    expect(screen.queryByText('Groceries')).not.toBeInTheDocument()
  })
})
